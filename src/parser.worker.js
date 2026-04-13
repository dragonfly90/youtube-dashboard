/**
 * Web Worker: parses Google Takeout YouTube watch history HTML and
 * produces the same JSON shape as preloaded.json.
 *
 * Posts progress messages during parsing.
 */

// Inline the classifier to avoid import issues in worker context
const CLUSTERS = [
  { id: 'ml_ai', keywords: ['karpathy','stanford online','deepmind','openai','huggingface','transformer','llm','gpt','neural','diffusion','rlhf','fine-tun','fine tun','pytorch','jax','tensorflow','cs231','cs224','cs25','yannic','two minute papers','ai explained','andrew ng','jeremy howard','fast.ai','tri dao','flash attention','mlsys','deep learning'] },
  { id: 'scientific_computing', keywords: ['steve brunton','3blue1brown','numerical','scipy','sympy','dynamical system','kalman','fourier','linear algebra','differential equation'] },
  { id: 'cpp_systems', keywords: ['mike shah','cppcon','c++','cpp','cmake','llvm','compiler explorer','godbolt','template metaprogramming','modern c++'] },
  { id: 'rust', keywords: [' rust ','rustlang','crust of rust','jon gjengset'] },
  { id: 'python_tools', keywords: ['real python','mcoding','arjancodes','corey schafer','talk python'] },
  { id: 'chinese_pop_music', keywords: ['zhang bichen','jay chou','\u5468\u6770\u4F26','\u5F20\u78A7\u6668','\u9093\u7D2B\u68CB','g.e.m','jj lin','\u6797\u4FCA\u6770','\u5B59\u71D5\u59FF','stefanie sun','sun yanzi','hebe tien','\u7530\u99A5\u751C','mayday','\u4E94\u6708\u5929','faye wong','\u738B\u83F2','eason chan','\u9648\u5955\u8FC5','tanya chua','\u8521\u5065\u96C5','\u534E\u8BED','topic','official mv','\u5B98\u65B9mv','live\u7248'] },
  { id: 'chinese_variety_tv', keywords: ['\u6D59\u6C5F\u536B\u89C6','\u6E56\u5357\u536B\u89C6','\u7EFC\u827A','\u5954\u8DD1\u5427','\u5411\u5F80\u7684\u751F\u6D3B','\u4E58\u98CE\u7834\u6D6A','\u4E2D\u56FD\u597D\u58F0\u97F3','\u58F0\u751F\u4E0D\u606F','\u62AB\u8346\u65A9\u68D8','\u5929\u8D50\u7684\u58F0\u97F3'] },
  { id: 'chinese_news_commentary', keywords: ['\u738B\u5FD7\u5B89','\u7F8E\u6295\u4F83','ic\u5B9E\u9A8C\u5BA4','\u8881\u817E\u98DE','\u6587\u662D','\u89C2\u96E8','\u8001\u9AD8\u4E0E\u5C0F\u8309','\u5C0FLin\u8BF4','\u5C0F\u6797','\u65B0\u95FB','\u65F6\u4E8B','\u8BC4\u8BBA','\u653F\u7ECF','\u8D22\u7ECF','\u770B\u4E2D\u56FD'] },
  { id: 'finance_markets', keywords: ['bloomberg','cnbc','patrick boyle','plain bagel','ben felix','meet kevin','stock','options trading','federal reserve','yield curve','macro','recession'] },
  { id: 'kids_family', keywords: ['like nastya','cocomelon','baby shark','peppa pig','kids','nursery rhyme','pinkfong','\u5C0F\u732A\u4F69\u5947'] },
  { id: 'cooking', keywords: ['babish','joshua weissman','kenji','bon appetit','recipe','cooking','chef','\u98DF\u8C31','\u7F8E\u98DF'] },
  { id: 'fitness_health', keywords: ['athlean','jeff nippard','jeremy ethier','workout','gym','hypertrophy','squat','deadlift','calisthenics','yoga','healthy','nutrition'] },
  { id: 'photography', keywords: ['peter mckinnon','tony northrup','dpreview','lightroom','photoshop tutorial','mirrorless','sony a7','fujifilm'] },
  { id: 'travel_docs', keywords: ['drew binsky','yes theory','kara and nate','travel vlog','documentary','national geographic','nat geo'] },
];

const CLUSTER_LABELS = {
  ml_ai: 'Machine Learning / AI',
  scientific_computing: 'Scientific Computing & Math',
  cpp_systems: 'C++ & Systems Programming',
  rust: 'Rust',
  python_tools: 'Python Tooling',
  chinese_pop_music: 'Chinese Pop Music',
  chinese_variety_tv: 'Chinese Variety TV',
  chinese_news_commentary: 'Chinese News & Commentary',
  finance_markets: 'Finance & Markets',
  kids_family: 'Kids / Family',
  cooking: 'Cooking',
  fitness_health: 'Fitness & Health',
  photography: 'Photography',
  travel_docs: 'Travel / Documentaries',
  other: 'Other / Uncategorized',
};

function classify(title, channel) {
  const text = (title + ' ' + channel).toLowerCase();
  for (const c of CLUSTERS) {
    for (const kw of c.keywords) {
      if (text.includes(kw)) return c.id;
    }
  }
  return 'other';
}

function cleanHtml(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '').trim();
}

// Date regexes: Chinese format and English format
const DATE_ZH_RE = /(\d{4})\u5E74(\d{1,2})\u6708(\d{1,2})\u65E5[\s\u00a0]+(\d{1,2}):(\d{2}):(\d{2})/;
const DATE_EN_RE = /(\w{3})\s+(\d{1,2}),\s+(\d{4}),?\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i;
const MONTH_MAP = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

function parseDate(dateStr) {
  let m = DATE_ZH_RE.exec(dateStr);
  if (m) {
    return new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +m[6]);
  }
  m = DATE_EN_RE.exec(dateStr);
  if (m) {
    let h = +m[4];
    if (m[7]) {
      const ampm = m[7].toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    return new Date(+m[3], MONTH_MAP[m[1]] ?? 0, +m[2], h, +m[5], +m[6]);
  }
  return null;
}

self.onmessage = function(e) {
  try {
    const html = e.data.html;
    self.postMessage({ type: 'progress', pct: 0, msg: 'Splitting HTML blocks...' });

    // Extract outer-cell blocks
    const blockRe = /<div class="outer-cell.*?<\/div><\/div><\/div>/gs;
    const blocks = html.match(blockRe) || [];
    self.postMessage({ type: 'progress', pct: 10, msg: `Found ${blocks.length} blocks...` });

    const bodyRe = /mdl-typography--body-1">(.*?)<\/div>/s;
    const watchedWithChannelRe = /Watched[\s\u00a0]+<a href="(https?:\/\/(?:www\.|music\.)?youtube\.com\/[^"]+)">(.*?)<\/a><br><a href="https?:\/\/www\.youtube\.com\/channel\/[^"]+">(.*?)<\/a><br>(.*?)<br>/s;
    const watchedNoChannelRe = /Watched[\s\u00a0]+<a href="(https?:\/\/(?:www\.|music\.)?youtube\.com\/[^"]+)">(.*?)<\/a><br>(.*?)<br>/s;

    const videos = [];
    const step = Math.max(1, Math.floor(blocks.length / 20));

    for (let i = 0; i < blocks.length; i++) {
      if (i % step === 0) {
        self.postMessage({
          type: 'progress',
          pct: 10 + Math.round((i / blocks.length) * 80),
          msg: `Parsing entry ${i + 1} of ${blocks.length}...`
        });
      }

      const bodyMatch = bodyRe.exec(blocks[i]);
      if (!bodyMatch) continue;
      const body = bodyMatch[1].trim();
      if (!body.startsWith('Watched')) continue;

      let url, title, channel, dateStr;
      const m1 = watchedWithChannelRe.exec(body);
      if (m1) {
        [, url, title, channel, dateStr] = m1;
      } else {
        const m2 = watchedNoChannelRe.exec(body);
        if (!m2) continue;
        [, url, title, dateStr] = m2;
        channel = '(no channel)';
      }

      const dt = parseDate(dateStr);
      if (!dt) continue;

      videos.push({
        dt: dt.getTime(),
        title: cleanHtml(title),
        channel: cleanHtml(channel),
      });
    }

    self.postMessage({ type: 'progress', pct: 92, msg: 'Aggregating statistics...' });

    // Aggregate same structure as preloaded.json
    if (videos.length === 0) {
      self.postMessage({ type: 'error', msg: 'No watch entries found in the HTML file.' });
      return;
    }

    videos.sort((a, b) => a.dt - b.dt);
    const earliest = new Date(videos[0].dt);
    const latest = new Date(videos[videos.length - 1].dt);
    const ninety = latest.getTime() - 90 * 86400000;

    const channels = new Set();
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
      const cid = classify(v.title, v.channel);
      const monthKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;

      channels.add(v.channel);
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

    // Clusters sorted by count desc
    const clusterIds = Object.keys(clusterCounts).sort((a, b) => clusterCounts[b] - clusterCounts[a]);
    const clustersArr = clusterIds.map(cid => ({
      id: cid,
      label: CLUSTER_LABELS[cid] || cid,
      count: clusterCounts[cid],
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
    const allChannels = sortedChannels.slice(0, 200).map(([name, count]) => {
      const votes = channelClusterVotes[name] || {};
      const topCluster = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
      return { name, count, recent90d: channelRecent[name] || 0, cluster: topCluster ? topCluster[0] : 'other' };
    });

    const totalDays = Math.max(1, Math.round((latest - earliest) / 86400000));

    const result = {
      totalVideos: videos.length,
      dateRange: {
        earliest: earliest.toISOString().slice(0, 10),
        latest: latest.toISOString().slice(0, 10),
      },
      totalDays,
      avgPerDay: Math.round(videos.length / totalDays * 10) / 10,
      uniqueChannels: channels.size,
      monthly: monthlyArr,
      clusters: clustersArr,
      topChannelsByCluster: topByCluster,
      topChannelsOverall: topOverall,
      allChannels,
    };

    self.postMessage({ type: 'done', result });
  } catch (err) {
    self.postMessage({ type: 'error', msg: err.message });
  }
};
