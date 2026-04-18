/**
 * LLM upload pipeline orchestrator.
 *
 * Flow: parse-only → sample → Phase 1 (discover clusters) → classify all →
 *       aggregate → setState → Phase 3 (generate recs) → setState
 *
 * Falls back to standard keyword classification if LLM calls fail.
 */

import { discoverClusters, generateRecommendations } from './llm.js';
import { classifyAndAggregate } from './llm-classifier.js';

// Module-level storage for raw videos (not in global state)
let _rawVideos = null;

/**
 * Build sample lines for the LLM: top 50 channels × 4 titles each ≈ 200 samples.
 */
function buildSampleLines(videos) {
  // Count channels
  const channelCounts = {};
  for (const v of videos) {
    channelCounts[v.channel] = (channelCounts[v.channel] || 0) + 1;
  }

  // Top 50 channels
  const topChannels = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([name]) => name);

  const topSet = new Set(topChannels);

  // Group videos by channel
  const byChannel = {};
  for (const v of videos) {
    if (!topSet.has(v.channel)) continue;
    if (!byChannel[v.channel]) byChannel[v.channel] = [];
    byChannel[v.channel].push(v);
  }

  // Pick up to 4 diverse titles per channel (spread across time)
  const lines = [];
  for (const ch of topChannels) {
    const vids = byChannel[ch] || [];
    if (vids.length === 0) continue;
    const step = Math.max(1, Math.floor(vids.length / 4));
    for (let i = 0; i < vids.length && lines.length < 250; i += step) {
      lines.push(`${vids[i].title} | ${vids[i].channel}`);
      if (lines.length >= 250) break;
    }
  }

  return lines;
}

/**
 * Run the full LLM pipeline on parsed videos.
 *
 * @param {Array<{dt: number, title: string, channel: string}>} videos
 * @param {function} onProgress - called with {stage, message} updates
 * @param {function} setState - from main.js
 * @returns {Promise<boolean>} true if LLM path succeeded, false if fell back
 */
export async function runLlmPipeline(videos, onProgress, setState) {
  _rawVideos = videos;

  // Phase 1: Discover clusters
  onProgress({ stage: 'discovering', message: 'AI is discovering your interests...' });

  let clusters;
  try {
    const sampleLines = buildSampleLines(videos);
    clusters = await discoverClusters(sampleLines);
  } catch (err) {
    console.warn('LLM Phase 1 failed, falling back to keyword classification:', err);
    onProgress({ stage: 'fallback', message: 'AI unavailable, using keyword classification...' });
    return false;
  }

  // Classify all videos with LLM-discovered clusters
  onProgress({ stage: 'classifying', message: `Classifying ${videos.length.toLocaleString()} videos...` });

  const { data, clusterMeta } = classifyAndAggregate(videos, clusters);

  // Update state with classified data
  setState({
    data,
    dataSource: 'uploaded-llm',
    clusterMeta,
  });

  onProgress({ stage: 'recommending', message: 'Generating personalized recommendations...' });

  // Phase 3: Generate recommendations
  try {
    const clusterSummaries = data.clusters
      .filter(c => c.id !== 'other' && c.count >= 20)
      .slice(0, 10)
      .map(c => ({
        ...c,
        emoji: clusterMeta[c.id]?.emoji || '',
        topChannels: (data.topChannelsByCluster[c.id] || []).slice(0, 5).map(ch => ch.name),
      }));

    const topChannels = data.topChannelsOverall.slice(0, 15).map(ch => ch.name);
    const llmRecs = await generateRecommendations(clusterSummaries, topChannels);

    setState({ llmRecommendations: llmRecs });
  } catch (err) {
    console.warn('LLM Phase 3 (recommendations) failed:', err);
    // Not critical — clusters still work, just no LLM recs
  }

  onProgress({ stage: 'done', message: 'AI analysis complete!' });
  return true;
}
