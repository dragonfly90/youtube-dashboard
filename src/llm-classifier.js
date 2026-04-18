/**
 * Classify videos using dynamic LLM-generated clusters (keyword matching)
 * and aggregate into the same data shape as preloaded.json.
 */

/**
 * Classify a single video into a cluster using dynamic keyword lists.
 * @param {string} title
 * @param {string} channel
 * @param {Array<{id: string, keywords: string[]}>} clusters
 * @returns {string} cluster id
 */
function classifyOne(title, channel, clusters) {
  const text = (title + ' ' + channel).toLowerCase();
  for (const c of clusters) {
    for (const kw of c.keywords) {
      if (text.includes(kw)) return c.id;
    }
  }
  return 'other';
}

/**
 * Classify all videos and aggregate into the same shape as preloaded.json.
 * @param {Array<{dt: number, title: string, channel: string}>} videos - raw parsed videos
 * @param {Array<{id, label, emoji, color, keywords}>} clusters - LLM-discovered clusters
 * @returns {object} same shape as preloaded.json
 */
export function classifyAndAggregate(videos, clusters) {
  if (videos.length === 0) throw new Error('No videos to classify');

  // Sort by date ascending
  videos.sort((a, b) => a.dt - b.dt);

  const earliest = new Date(videos[0].dt);
  const latest = new Date(videos[videos.length - 1].dt);
  const ninety = latest.getTime() - 90 * 86400000;

  const channelsSet = new Set();
  const monthly = {};
  const clusterCounts = {};
  const clusterRecent = {};
  const clusterChannels = {};
  const clusterMonthly = {};
  const overallChannels = {};
  const channelClusterVotes = {};
  const channelRecent = {};

  for (const v of videos) {
    const dt = new Date(v.dt);
    const cid = classifyOne(v.title, v.channel, clusters);
    const monthKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;

    channelsSet.add(v.channel);
    monthly[monthKey] = (monthly[monthKey] || 0) + 1;
    clusterCounts[cid] = (clusterCounts[cid] || 0) + 1;

    if (!clusterChannels[cid]) clusterChannels[cid] = {};
    clusterChannels[cid][v.channel] = (clusterChannels[cid][v.channel] || 0) + 1;

    if (!clusterMonthly[cid]) clusterMonthly[cid] = {};
    clusterMonthly[cid][monthKey] = (clusterMonthly[cid][monthKey] || 0) + 1;

    overallChannels[v.channel] = (overallChannels[v.channel] || 0) + 1;

    if (!channelClusterVotes[v.channel]) channelClusterVotes[v.channel] = {};
    channelClusterVotes[v.channel][cid] = (channelClusterVotes[v.channel][cid] || 0) + 1;

    if (v.dt >= ninety) {
      clusterRecent[cid] = (clusterRecent[cid] || 0) + 1;
      channelRecent[v.channel] = (channelRecent[v.channel] || 0) + 1;
    }
  }

  const allMonths = Object.keys(monthly).sort();
  const monthlyArr = allMonths.map(m => ({ month: m, count: monthly[m] }));

  // Build cluster list: LLM clusters + "other", sorted by count desc
  const allClusterIds = [
    ...clusters.map(c => c.id),
    ...(clusterCounts.other ? ['other'] : []),
  ];

  // Deduplicate and sort by count
  const seen = new Set();
  const clusterIds = allClusterIds.filter(id => {
    if (seen.has(id)) return false;
    seen.add(id);
    return clusterCounts[id] > 0;
  }).sort((a, b) => (clusterCounts[b] || 0) - (clusterCounts[a] || 0));

  // Build cluster metadata map (including "other")
  const clusterMeta = Object.fromEntries(clusters.map(c => [c.id, c]));
  clusterMeta.other = { id: 'other', label: 'Other / Uncategorized', emoji: '', color: '#94a3b8', keywords: [] };

  const clustersArr = clusterIds.map(cid => ({
    id: cid,
    label: clusterMeta[cid]?.label || cid,
    count: clusterCounts[cid] || 0,
    recent90d: clusterRecent[cid] || 0,
    monthly: allMonths.map(m => ({ month: m, count: (clusterMonthly[cid] || {})[m] || 0 })),
  }));

  // Top channels by cluster
  const topByCluster = {};
  for (const cid of clusterIds) {
    const chs = clusterChannels[cid] || {};
    topByCluster[cid] = Object.entries(chs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }

  // Top channels overall
  const sortedChannels = Object.entries(overallChannels).sort((a, b) => b[1] - a[1]);
  const topOverall = sortedChannels.slice(0, 30).map(([name, count]) => {
    const votes = channelClusterVotes[name] || {};
    const topCluster = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    return { name, count, cluster: topCluster ? topCluster[0] : 'other' };
  });

  // All channels (top 200)
  const allChannelsList = sortedChannels.slice(0, 200).map(([name, count]) => {
    const votes = channelClusterVotes[name] || {};
    const topCluster = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    return { name, count, recent90d: channelRecent[name] || 0, cluster: topCluster ? topCluster[0] : 'other' };
  });

  const totalDays = Math.max(1, Math.round((latest - earliest) / 86400000));

  return {
    data: {
      totalVideos: videos.length,
      dateRange: {
        earliest: earliest.toISOString().slice(0, 10),
        latest: latest.toISOString().slice(0, 10),
      },
      totalDays,
      avgPerDay: Math.round(videos.length / totalDays * 10) / 10,
      uniqueChannels: channelsSet.size,
      monthly: monthlyArr,
      clusters: clustersArr,
      topChannelsByCluster: topByCluster,
      topChannelsOverall: topOverall,
      allChannels: allChannelsList,
    },
    clusterMeta,
  };
}
