/**
 * Ollama LLM integration — health check, cluster discovery (Phase 1),
 * and recommendation generation (Phase 3).
 *
 * Uses POST /api/ollama/api/generate (proxied by Vite to localhost:11434).
 * All calls use stream: false and low temperature for deterministic JSON output.
 */

const OLLAMA_BASE = '/api/ollama';
const MODEL = 'gemma4:latest';
const TIMEOUT_MS = 300_000; // 5 min per LLM call (local 8B model can be slow)

// Fixed color palette — don't trust LLM color picks
const COLOR_PALETTE = [
  '#6366f1', '#8b5cf6', '#0ea5e9', '#f97316', '#eab308',
  '#ec4899', '#f43f5e', '#14b8a6', '#22c55e', '#a855f7',
  '#ef4444', '#10b981', '#64748b', '#06b6d4', '#d946ef',
  '#84cc16', '#fb923c', '#38bdf8', '#e879f9', '#fbbf24',
];

// ============================================================
// Health check
// ============================================================

let _llmStatus = 'checking'; // 'checking' | 'available' | 'unavailable'
let _statusListeners = [];

export function getLlmStatus() { return _llmStatus; }

export function onLlmStatusChange(fn) {
  _statusListeners.push(fn);
  return () => { _statusListeners = _statusListeners.filter(f => f !== fn); };
}

function setLlmStatus(s) {
  _llmStatus = s;
  _statusListeners.forEach(fn => fn(s));
}

export async function checkOllamaAvailable() {
  setLlmStatus('checking');
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const hasModel = data.models?.some(m => m.name === MODEL || m.name.startsWith('gemma4'));
      setLlmStatus(hasModel ? 'available' : 'unavailable');
    } else {
      setLlmStatus('unavailable');
    }
  } catch {
    setLlmStatus('unavailable');
  }
  return _llmStatus;
}

// ============================================================
// LLM call helper
// ============================================================

async function ollamaGenerate(prompt) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.3 },
    }),
    signal: ctrl.signal,
  });

  clearTimeout(timer);
  if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
  const data = await res.json();
  return data.response || '';
}

/** Try to parse JSON from LLM response, stripping markdown fences if present. */
function parseJsonResponse(text) {
  // Strip markdown code fences
  let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();

  // Try direct parse
  try { return JSON.parse(cleaned); } catch { /* fall through */ }

  // Try extracting JSON array or object via regex
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]); } catch { /* fall through */ }
  }
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
  }

  throw new Error('Failed to parse LLM JSON response');
}

// ============================================================
// Phase 1: Discover clusters from sample titles
// ============================================================

export async function discoverClusters(sampleLines) {
  const prompt = `You are analyzing a user's YouTube watch history to discover their interest clusters.

Below are ~${sampleLines.length} sample video titles with their channels (format: "title | channel"):

${sampleLines.join('\n')}

Analyze these titles and discover 10-15 distinct interest clusters that describe this user's viewing habits.

For each cluster, provide:
- id: a short snake_case identifier (e.g., "web_dev", "cooking", "gaming")
- label: a human-readable label (e.g., "Web Development", "Cooking & Recipes")
- emoji: a single emoji that represents this cluster
- keywords: an array of 10-30 lowercase keywords/phrases that would match videos in this cluster. Include channel names, topic words, and distinctive phrases. Be thorough — these keywords will be used to classify ALL videos.

Return ONLY a JSON array, no other text. Example format:
[
  {"id": "web_dev", "label": "Web Development", "emoji": "🌐", "keywords": ["react", "javascript", "css", "frontend", "node.js", "web dev"]},
  {"id": "cooking", "label": "Cooking & Recipes", "emoji": "🍳", "keywords": ["recipe", "cooking", "chef", "baking", "kitchen"]}
]

Important:
- Make clusters specific enough to be meaningful but broad enough to capture related content
- Include both English and non-English keywords if you see multilingual content
- Channel names are powerful classifiers — include notable channel names in keywords
- Return ONLY the JSON array, nothing else`;

  const raw = await ollamaGenerate(prompt);
  let clusters = parseJsonResponse(raw);

  // Validate and fix
  if (!Array.isArray(clusters)) throw new Error('Phase 1: expected array');
  clusters = clusters.filter(c => c.id && c.label && Array.isArray(c.keywords) && c.keywords.length > 0);
  if (clusters.length < 3) throw new Error('Phase 1: too few clusters discovered');

  // Assign colors from palette (don't trust LLM colors)
  clusters = clusters.map((c, i) => ({
    id: c.id,
    label: c.label,
    emoji: c.emoji || '',
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    keywords: c.keywords.map(k => k.toLowerCase()),
  }));

  return clusters;
}

// ============================================================
// Phase 3: Generate personalized recommendations
// ============================================================

export async function generateRecommendations(clusterSummaries, topChannels) {
  const prompt = `Based on a user's YouTube watch history analysis, generate personalized content recommendations.

Here are their interest clusters (sorted by watch count):
${clusterSummaries.map(c => `- ${c.emoji} ${c.label}: ${c.count} videos (${c.recent90d} in last 90 days). Top channels: ${c.topChannels.join(', ')}`).join('\n')}

Their overall top channels: ${topChannels.join(', ')}

Generate cross-platform recommendations. For each cluster that has significant activity (>20 videos), suggest:

1. YouTube channels/topics they might not know about
2. Bilibili creators (if the cluster relates to Chinese-language content)
3. Reddit subreddits
4. Podcasts (English and Chinese where relevant)

Return ONLY a JSON object with this exact structure:
{
  "youtube": {
    "cluster_id": [{"topic": "Topic name", "channels": "Channel1, Channel2"}]
  },
  "bilibili": {
    "cluster_id": {
      "crossover": [{"name": "Creator", "tagline": "Description", "search": "search term"}],
      "native": [{"name": "Creator", "tagline": "Description", "search": "search term"}]
    }
  },
  "reddit": {
    "cluster_id": [{"sub": "r/subreddit", "tagline": "Description"}]
  },
  "podcasts_en": {
    "cluster_id": [{"name": "Podcast", "host": "Host name", "tagline": "Description"}]
  },
  "podcasts_zh": {
    "cluster_id": [{"name": "Podcast", "host": "Host name", "tagline": "Description"}]
  }
}

Important:
- Only include clusters that have significant watch history
- Recommend content they're likely NOT already watching
- For Chinese-language interests, include Bilibili and Chinese podcast recommendations
- Keep descriptions concise (under 80 chars)
- Return ONLY the JSON object, nothing else`;

  const raw = await ollamaGenerate(prompt);
  const recs = parseJsonResponse(raw);

  if (!recs || typeof recs !== 'object') throw new Error('Phase 3: expected object');

  return {
    youtube: recs.youtube || {},
    bilibili: recs.bilibili || {},
    reddit: recs.reddit || {},
    podcasts_en: recs.podcasts_en || {},
    podcasts_zh: recs.podcasts_zh || {},
  };
}
