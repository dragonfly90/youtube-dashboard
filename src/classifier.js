/**
 * Interest cluster classifier — mirrors the Python version exactly.
 * First matching cluster wins, so order matters (specific before generic).
 */

export const CLUSTERS = [
  { id: 'ml_ai', label: 'Machine Learning / AI', emoji: '\u{1F916}', color: '#6366f1', keywords: [
    'karpathy', 'stanford online', 'deepmind', 'openai', 'huggingface',
    'transformer', 'llm', 'gpt', 'neural', 'diffusion', 'rlhf',
    'fine-tun', 'fine tun', 'pytorch', 'jax', 'tensorflow', 'cs231',
    'cs224', 'cs25', 'yannic', 'two minute papers', 'ai explained',
    'andrew ng', 'jeremy howard', 'fast.ai', 'tri dao', 'flash attention',
    'mlsys', 'deep learning',
  ]},
  { id: 'scientific_computing', label: 'Scientific Computing & Math', emoji: '\u{1F9EE}', color: '#8b5cf6', keywords: [
    'steve brunton', '3blue1brown', 'numerical', 'scipy', 'sympy',
    'dynamical system', 'kalman', 'fourier', 'linear algebra',
    'differential equation',
  ]},
  { id: 'cpp_systems', label: 'C++ & Systems Programming', emoji: '\u{2699}\uFE0F', color: '#0ea5e9', keywords: [
    'mike shah', 'cppcon', 'c++', 'cpp', 'cmake', 'llvm',
    'compiler explorer', 'godbolt', 'template metaprogramming',
    'modern c++',
  ]},
  { id: 'rust', label: 'Rust', emoji: '\u{1F980}', color: '#f97316', keywords: [
    ' rust ', 'rustlang', 'crust of rust', 'jon gjengset',
  ]},
  { id: 'python_tools', label: 'Python Tooling', emoji: '\u{1F40D}', color: '#eab308', keywords: [
    'real python', 'mcoding', 'arjancodes', 'corey schafer', 'talk python',
  ]},
  { id: 'chinese_pop_music', label: 'Chinese Pop Music', emoji: '\u{1F3B5}', color: '#ec4899', keywords: [
    'zhang bichen', 'jay chou', '\u5468\u6770\u4F26', '\u5F20\u78A7\u6668', '\u9093\u7D2B\u68CB', 'g.e.m',
    'jj lin', '\u6797\u4FCA\u6770', '\u5B59\u71D5\u59FF', 'stefanie sun', 'sun yanzi',
    'hebe tien', '\u7530\u99A5\u751C', 'mayday', '\u4E94\u6708\u5929', 'faye wong', '\u738B\u83F2',
    'eason chan', '\u9648\u5955\u8FC5', 'tanya chua', '\u8521\u5065\u96C5', '\u534E\u8BED', 'topic',
    'official mv', '\u5B98\u65B9mv', 'live\u7248',
  ]},
  { id: 'chinese_variety_tv', label: 'Chinese Variety TV', emoji: '\u{1F4FA}', color: '#f43f5e', keywords: [
    '\u6D59\u6C5F\u536B\u89C6', '\u6E56\u5357\u536B\u89C6', '\u7EFC\u827A', '\u5954\u8DD1\u5427', '\u5411\u5F80\u7684\u751F\u6D3B', '\u4E58\u98CE\u7834\u6D6A',
    '\u4E2D\u56FD\u597D\u58F0\u97F3', '\u58F0\u751F\u4E0D\u606F', '\u62AB\u8346\u65A9\u68D8', '\u5929\u8D50\u7684\u58F0\u97F3',
  ]},
  { id: 'chinese_news_commentary', label: 'Chinese News & Commentary', emoji: '\u{1F4F0}', color: '#14b8a6', keywords: [
    '\u738B\u5FD7\u5B89', '\u7F8E\u6295\u4F83', 'ic\u5B9E\u9A8C\u5BA4', '\u8881\u817E\u98DE', '\u6587\u662D', '\u89C2\u96E8',
    '\u8001\u9AD8\u4E0E\u5C0F\u8309', '\u5C0FLin\u8BF4', '\u5C0F\u6797', '\u65B0\u95FB', '\u65F6\u4E8B', '\u8BC4\u8BBA',
    '\u653F\u7ECF', '\u8D22\u7ECF', '\u770B\u4E2D\u56FD',
  ]},
  { id: 'finance_markets', label: 'Finance & Markets', emoji: '\u{1F4C8}', color: '#22c55e', keywords: [
    'bloomberg', 'cnbc', 'patrick boyle', 'plain bagel', 'ben felix',
    'meet kevin', 'stock', 'options trading', 'federal reserve',
    'yield curve', 'macro', 'recession',
  ]},
  { id: 'kids_family', label: 'Kids / Family', emoji: '\u{1F476}', color: '#a855f7', keywords: [
    'like nastya', 'cocomelon', 'baby shark', 'peppa pig', 'kids',
    'nursery rhyme', 'pinkfong', '\u5C0F\u732A\u4F69\u5947',
  ]},
  { id: 'cooking', label: 'Cooking', emoji: '\u{1F373}', color: '#ef4444', keywords: [
    'babish', 'joshua weissman', 'kenji', 'bon appetit', 'recipe',
    'cooking', 'chef', '\u98DF\u8C31', '\u7F8E\u98DF',
  ]},
  { id: 'fitness_health', label: 'Fitness & Health', emoji: '\u{1F4AA}', color: '#10b981', keywords: [
    'athlean', 'jeff nippard', 'jeremy ethier', 'workout', 'gym',
    'hypertrophy', 'squat', 'deadlift', 'calisthenics', 'yoga',
    'healthy', 'nutrition',
  ]},
  { id: 'photography', label: 'Photography', emoji: '\u{1F4F7}', color: '#64748b', keywords: [
    'peter mckinnon', 'tony northrup', 'dpreview', 'lightroom',
    'photoshop tutorial', 'mirrorless', 'sony a7', 'fujifilm',
  ]},
  { id: 'travel_docs', label: 'Travel / Documentaries', emoji: '\u{2708}\uFE0F', color: '#06b6d4', keywords: [
    'drew binsky', 'yes theory', 'kara and nate', 'travel vlog',
    'documentary', 'national geographic', 'nat geo',
  ]},
];

export const CLUSTER_MAP = Object.fromEntries(CLUSTERS.map(c => [c.id, c]));
CLUSTER_MAP.other = { id: 'other', label: 'Other / Uncategorized', emoji: '\u{1F4E6}', color: '#94a3b8', keywords: [] };

/** Classify a video by title + channel into a cluster id. */
export function classify(title, channel) {
  const text = (title + ' ' + channel).toLowerCase();
  for (const cluster of CLUSTERS) {
    for (const kw of cluster.keywords) {
      if (text.includes(kw)) return cluster.id;
    }
  }
  return 'other';
}

/** Get color for a cluster id */
export function clusterColor(id) {
  return CLUSTER_MAP[id]?.color ?? '#94a3b8';
}

/** Get emoji for a cluster id */
export function clusterEmoji(id) {
  return CLUSTER_MAP[id]?.emoji ?? '\u{1F4E6}';
}

/** Get label for a cluster id */
export function clusterLabel(id) {
  return CLUSTER_MAP[id]?.label ?? id;
}
