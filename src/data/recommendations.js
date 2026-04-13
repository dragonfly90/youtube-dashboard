/**
 * Cross-platform recommendations keyed by cluster ID.
 * Ported from the three Python suggestion scripts.
 */

export const YOUTUBE_RECS = {
  ml_ai: [
    { topic: 'LLM inference & systems', channels: 'GPU MODE, vLLM talks, Horace He, Tri Dao' },
    { topic: 'RL for LLMs', channels: 'Sergey Levine, Pieter Abbeel, Nathan Lambert (Interconnects)' },
    { topic: 'ML research explained', channels: 'Yannic Kilcher, AI Coffee Break, Gabriel Mongaras' },
    { topic: 'MLSys seminars', channels: 'Stanford MLSys, MLSys Conference, Chip Huyen talks' },
  ],
  scientific_computing: [
    { topic: 'Numerical methods deep dives', channels: 'Nick Trefethen lectures, Gilbert Strang (MIT OCW)' },
    { topic: 'Applied math visualization', channels: 'Grant Sanderson advanced playlists, Welch Labs' },
  ],
  cpp_systems: [
    { topic: 'Rust for C++ devs', channels: 'Jon Gjengset, Let\'s Get Rusty, No Boilerplate' },
    { topic: 'Performance engineering', channels: 'ChandlerC talks, Emery Berger, Denis Bakhvalov' },
    { topic: 'Systems / OS internals', channels: 'Brendan Gregg, Bryan Cantrill (Oxide), George Hotz streams' },
  ],
  rust: [
    { topic: 'Rust async & systems', channels: 'fasterthanlime, Ryan Levick, Logan Smith' },
  ],
  chinese_pop_music: [
    { topic: 'Japanese city pop (natural crossover)', channels: 'Mariya Takeuchi, Tatsuro Yamashita, Anri topic channels' },
    { topic: 'Chinese indie / alt', channels: '\u8349\u4E1C\u6CA1\u6709\u6D3E\u5BF9, \u544A\u4E94\u4EBA, \u6905\u5B50\u4E50\u56E2, \u4E07\u80FD\u9752\u5E74\u65C5\u5E97' },
    { topic: 'Music theory / analysis', channels: 'Adam Neely, 12tone, David Bennett Piano' },
    { topic: 'Live acoustic sessions', channels: 'Mahogany Sessions, COLORS, NPR Tiny Desk' },
  ],
  chinese_variety_tv: [
    { topic: 'Music competition alternatives', channels: '\u8499\u9762\u5531\u5C06, \u6211\u662F\u6B4C\u624B archives, \u4E2D\u56FD\u68A6\u4E4B\u58F0' },
  ],
  chinese_news_commentary: [
    { topic: 'English-language China analysis', channels: 'ChinaTalk (Jordan Schneider), SupChina, Sinica Podcast' },
    { topic: 'Macro & geopolitics', channels: 'Perun, Peter Zeihan clips, Wendover Productions' },
  ],
  finance_markets: [
    { topic: 'Quant & markets', channels: 'Ernie Chan, Quantopian archives, Dimitri Bianco' },
  ],
  kids_family: [
    { topic: 'Educational kids content', channels: 'Ms Rachel, Blippi, SciShow Kids, \u5C0F\u5C0F\u4F18\u8DA3' },
  ],
};

export const BILIBILI_RECS = {
  ml_ai: {
    crossover: [
      { name: '\u8DDF\u674E\u6C90\u5B66AI', tagline: 'Mu Li\'s paper-reading series \u2014 foundational LLM papers explained in Mandarin.', search: '\u8DDF\u674E\u6C90\u5B66AI' },
    ],
    native: [
      { name: '\u540C\u6D4E\u5B50\u8C6A\u5144', tagline: 'Accessible ML & deep learning tutorials, Tongji Univ.', search: '\u540C\u6D4E\u5B50\u8C6A\u5144' },
      { name: '\u738B\u6728\u5934\u5B66\u79D1\u5B66', tagline: 'ML fundamentals with clean visual explanations.', search: '\u738B\u6728\u5934\u5B66\u79D1\u5B66' },
      { name: '\u9C81\u9E4F-\u8BA1\u7B97\u673A\u89C6\u89C9', tagline: 'CV lectures, good complement to Stanford Online.', search: '\u9C81\u9E4F \u8BA1\u7B97\u673A\u89C6\u89C9' },
      { name: '3Blue1Brown\u7684\u5B98\u65B9\u9891\u9053', tagline: 'Official Bilibili mirror (Chinese subs).', search: '3Blue1Brown' },
    ],
    searchHints: ['\u5927\u6A21\u578B\u5FAE\u8C03', 'LLM\u8BAD\u7EC3', 'RLHF', 'DeepSeek\u8BBA\u6587\u89E3\u8BFB', 'vLLM \u539F\u7406', 'Transformer \u539F\u7406'],
  },
  scientific_computing: {
    crossover: [],
    native: [
      { name: '\u5988\u54AA\u8BF4MommyTalk', tagline: 'Physics + applied math explainers, very popular.', search: '\u5988\u54AA\u8BF4MommyTalk' },
      { name: '\u9A6C\u540C\u5B66\u56FE\u89E3\u6570\u5B66', tagline: 'Linear algebra / calculus with visual intuition.', search: '\u9A6C\u540C\u5B66\u56FE\u89E3\u6570\u5B66' },
      { name: '\u6570\u4E4B\u9053', tagline: 'Data visualization of historical + economic datasets.', search: '\u6570\u4E4B\u9053' },
      { name: '\u674E\u6C38\u4E50\u8001\u5E08\u5B98\u65B9', tagline: 'Physics/math explainers at popular-science level.', search: '\u674E\u6C38\u4E50\u8001\u5E08' },
    ],
    searchHints: ['\u7EBF\u6027\u4EE3\u6570\u7684\u672C\u8D28', '\u5085\u91CC\u53F6\u53D8\u6362', '\u5FAE\u5206\u65B9\u7A0B'],
  },
  cpp_systems: {
    crossover: [],
    native: [
      { name: '\u4FAF\u6377', tagline: 'The legend of Chinese C++ education \u2014 STL source analysis, memory management.', search: '\u4FAF\u6377 C++' },
      { name: '\u7801\u519C\u9AD8\u5929', tagline: 'Programming deep-dives, C++/Python internals.', search: '\u7801\u519C\u9AD8\u5929' },
      { name: 'mq\u767D', tagline: 'Systems-level C/C++ content.', search: 'mq\u767D' },
      { name: '\u7A0B\u5E8F\u5458\u9C7C\u76AE', tagline: 'Lighter backend/systems content, good for breadth.', search: '\u7A0B\u5E8F\u5458\u9C7C\u76AE' },
    ],
    searchHints: ['C++ \u6A21\u677F\u5143\u7F16\u7A0B', 'Linux\u5185\u6838\u6E90\u7801', '\u534F\u7A0B\u539F\u7406', '\u5185\u5B58\u5206\u914D\u5668'],
  },
  rust: {
    crossover: [],
    native: [
      { name: '\u8F6F\u4EF6\u8001\u738B', tagline: 'Rust tutorials in Mandarin, project-oriented.', search: '\u8F6F\u4EF6\u8001\u738B Rust' },
      { name: '\u6768\u65ED_\u5B98\u65B9', tagline: 'Rust from scratch, beginner-friendly.', search: '\u6768\u65ED Rust' },
    ],
    searchHints: ['Rust \u5165\u95E8', 'Rust \u5F02\u6B65', 'Rust \u6E90\u7801\u89E3\u6790'],
  },
  chinese_pop_music: {
    crossover: [
      { name: '\u5468\u6770\u4F26 / Jay Chou \u5B98\u65B9\u53CA\u7C89\u4E1D\u9891\u9053', tagline: 'Jay Chou live versions and MV re-uploads.', search: '\u5468\u6770\u4F26 \u6F14\u5531\u4F1A' },
      { name: '\u5F20\u78A7\u6668 / \u9093\u7D2B\u68CB / \u6797\u4FCA\u6770 fan channels', tagline: 'Fan-curated channels with rare live clips.', search: '\u5F20\u78A7\u6668 live' },
    ],
    native: [
      { name: '\u95FB\u4EBA\u542C\u66F8_', tagline: 'Top Bilibili cover singer, great mandopop covers.', search: '\u95FB\u4EBA\u542C\u66F8' },
      { name: '\u97F3\u4E50\u5DC5\u5CF0\u4F1A', tagline: 'Curated live-version compilations, great for discovery.', search: '\u97F3\u4E50\u5DC5\u5CF0\u4F1A' },
      { name: 'Kurt Hugo Schneider \u4E2D\u6587\u642C\u8FD0', tagline: 'Cover-of-cover channels bringing international acts.', search: 'KHS \u4E2D\u6587' },
    ],
    searchHints: ['\u534E\u8BED\u91D1\u66F2', '\u6F14\u5531\u4F1A\u73B0\u573A', 'Live \u7248', '\u7FFB\u5531', '\u534E\u8BED\u6D41\u884C\u4E50\u53F2', 'mandopop analysis'],
  },
  chinese_variety_tv: {
    crossover: [
      { name: '\u6D59\u6C5F\u536B\u89C6 / \u6E56\u5357\u536B\u89C6 \u5B98\u65B9', tagline: 'Both post full-episode clips on Bilibili with faster updates than YouTube.', search: '\u6D59\u6C5F\u536B\u89C6 \u5B98\u65B9' },
    ],
    native: [
      { name: '\u58F0\u751F\u4E0D\u606F \u5B98\u65B9\u8D26\u53F7', tagline: 'Full show + behind-the-scenes.', search: '\u58F0\u751F\u4E0D\u606F' },
      { name: '\u5929\u8D50\u7684\u58F0\u97F3 \u5B98\u65B9', tagline: 'Full episode archive.', search: '\u5929\u8D50\u7684\u58F0\u97F3' },
    ],
    searchHints: ['\u7EFC\u827A\u526A\u8F91', '\u4E58\u98CE\u7834\u6D6A', '\u62AB\u8346\u65A9\u68D8', '\u6B4C\u624B'],
  },
  chinese_news_commentary: {
    crossover: [
      { name: 'IC\u5B9E\u9A8C\u5BA4', tagline: 'Bilibili-native brand \u2014 full catalogue lives here, not on YouTube.', search: 'IC\u5B9E\u9A8C\u5BA4' },
      { name: '\u5C0FLin\u8BF4', tagline: 'Finance/macro commentary, also Bilibili-first.', search: '\u5C0FLin\u8BF4' },
    ],
    native: [
      { name: '\u534A\u4F5B\u4ED9\u4EBA', tagline: 'Bilibili\'s most-watched commentator \u2014 fintech, business, social issues.', search: '\u534A\u4F5B\u4ED9\u4EBA' },
      { name: '\u6240\u957F\u6797\u8D85', tagline: 'Career and industry deep-dives.', search: '\u6240\u957F\u6797\u8D85' },
      { name: '\u6E29\u4E49\u98DE\u7684\u6025\u6551\u8D22\u7ECF', tagline: 'Fast, accessible macroeconomics commentary.', search: '\u6E29\u4E49\u98DE' },
      { name: '\u6C88\u5955\u6590\u8001\u5E08', tagline: 'Sociology-flavored current affairs.', search: '\u6C88\u5955\u6590' },
    ],
    searchHints: ['\u5B8F\u89C2\u7ECF\u6D4E', '\u5730\u7F18\u653F\u6CBB', '\u4EA7\u4E1A\u5206\u6790'],
  },
  finance_markets: {
    crossover: [
      { name: '\u5C0FLin\u8BF4', tagline: 'Bilibili-first, English finance viewers love her.', search: '\u5C0FLin\u8BF4' },
    ],
    native: [
      { name: '\u5DEB\u5E08\u8D22\u7ECF', tagline: 'Early Bilibili finance-commentator star, still influential.', search: '\u5DEB\u5E08\u8D22\u7ECF' },
      { name: '\u534A\u4F5B\u4ED9\u4EBA \u8D22\u7ECF\u4E13\u9898', tagline: 'Half-Buddha\'s finance playlists.', search: '\u534A\u4F5B\u4ED9\u4EBA \u91D1\u878D' },
      { name: '\u8001\u848B\u5DE8\u9760\u8C31', tagline: 'Practical investing content.', search: '\u8001\u848B\u5DE8\u9760\u8C31' },
    ],
    searchHints: ['\u7F8E\u80A1\u5206\u6790', '\u5B8F\u89C2', '\u57FA\u91D1', '\u6E2F\u80A1'],
  },
  kids_family: {
    crossover: [
      { name: '\u5B9D\u5B9D\u5DF4\u58EB', tagline: 'BabyBus has a huge official Bilibili presence in Mandarin.', search: '\u5B9D\u5B9D\u5DF4\u58EB' },
    ],
    native: [
      { name: '\u5C0F\u732A\u4F69\u5947\u5B98\u65B9\u9891\u9053', tagline: 'Peppa Pig in Mandarin.', search: '\u5C0F\u732A\u4F69\u5947' },
    ],
    searchHints: ['\u513F\u6B4C', '\u52A8\u753B\u7247', '\u5C11\u513F'],
  },
  cooking: {
    crossover: [
      { name: '\u7F8E\u98DF\u4F5C\u5BB6\u738B\u521A', tagline: 'Wang Gang (the Sichuan chef YouTube loves) \u2014 original content started on Bilibili.', search: '\u7F8E\u98DF\u4F5C\u5BB6\u738B\u521A' },
    ],
    native: [
      { name: '\u65E5\u98DF\u8BB0', tagline: 'Cozy, aesthetic cooking vlogs with a cat.', search: '\u65E5\u98DF\u8BB0' },
      { name: '\u7EF5\u7F8A\u6599\u7406', tagline: 'Home-cook explorations of world cuisines.', search: '\u7EF5\u7F8A\u6599\u7406' },
      { name: '\u66FC\u98DF\u6162\u8BED', tagline: 'Beautifully shot recipes.', search: '\u66FC\u98DF\u6162\u8BED' },
      { name: '\u6EC7\u897F\u5C0F\u54E5', tagline: 'Yunnan rural life + food, gorgeous cinematography.', search: '\u6EC7\u897F\u5C0F\u54E5' },
    ],
    searchHints: ['\u5BB6\u5E38\u83DC', '\u5DDD\u83DC\u6559\u7A0B', '\u70D8\u7119'],
  },
  photography: {
    crossover: [],
    native: [
      { name: '\u5F71\u89C6\u98D3\u98CE', tagline: 'Bilibili\'s biggest videography channel. Gear reviews, cinematography tutorials.', search: '\u5F71\u89C6\u98D3\u98CE' },
      { name: 'Thomas\u770B\u770B\u4E16\u754C', tagline: 'Landscape photography + post-processing tutorials.', search: 'Thomas\u770B\u770B\u4E16\u754C' },
      { name: '\u5F71\u50CF\u72D7', tagline: 'Camera and lens reviews.', search: '\u5F71\u50CF\u72D7' },
    ],
    searchHints: ['\u6444\u5F71\u6559\u7A0B', '\u540E\u671F\u8C03\u8272', '\u76F8\u673A\u8BC4\u6D4B'],
  },
  travel_docs: {
    crossover: [],
    native: [
      { name: '\u610F\u516C\u5B50', tagline: 'Chinese classical culture + travel essays.', search: '\u610F\u516C\u5B50' },
      { name: '\u6EC7\u897F\u5C0F\u54E5', tagline: 'Rural Yunnan slow life, also fits cooking.', search: '\u6EC7\u897F\u5C0F\u54E5' },
      { name: '\u4FA3\u884C', tagline: 'Long-form travel documentary series.', search: '\u4FA3\u884C' },
    ],
    searchHints: ['\u7EAA\u5F55\u7247', '\u56FD\u5BB6\u5730\u7406', '\u65C5\u884Cvlog'],
  },
};

export const REDDIT_RECS = {
  ml_ai: [
    { sub: 'r/MachineLearning', tagline: 'The main ML research sub. Paper discussions, SOTA tracking.' },
    { sub: 'r/LocalLLaMA', tagline: 'Local LLM deployment, fine-tuning, GGUF quantization. Practitioner-focused.' },
    { sub: 'r/reinforcementlearning', tagline: 'RL research and practice.' },
    { sub: 'r/LanguageTechnology', tagline: 'NLP-specific discussions, more academic flavor.' },
    { sub: 'r/singularity', tagline: 'Broader AI-news firehose (noisier, useful for signal scan).' },
  ],
  scientific_computing: [
    { sub: 'r/math', tagline: 'General math community, from olympiad to research.' },
    { sub: 'r/compsci', tagline: 'CS theory and algorithms.' },
    { sub: 'r/AskPhysics', tagline: 'Good for intuition-building Q&A.' },
  ],
  cpp_systems: [
    { sub: 'r/cpp', tagline: 'The main C++ sub. Proposals, toolchains, idioms.' },
    { sub: 'r/C_Programming', tagline: 'C-focused counterpart.' },
    { sub: 'r/programming', tagline: 'General programming firehose.' },
    { sub: 'r/compilers', tagline: 'LLVM, MLIR, codegen discussions.' },
    { sub: 'r/osdev', tagline: 'OS kernels and hobby OSes.' },
  ],
  rust: [
    { sub: 'r/rust', tagline: 'Very high-quality sub, maintainers are active.' },
    { sub: 'r/learnrust', tagline: 'Beginner questions, friendly.' },
  ],
  chinese_pop_music: [
    { sub: 'r/cpop', tagline: 'Chinese pop music sub. Small but active.' },
    { sub: 'r/mandopop', tagline: 'Mandopop-specific, overlaps with r/cpop.' },
    { sub: 'r/kpop', tagline: 'Adjacent market, very active \u2014 good for genre crossover discovery.' },
    { sub: 'r/LetsTalkMusic', tagline: 'Thoughtful music discussion across genres.' },
  ],
  chinese_variety_tv: [
    { sub: 'r/CDrama', tagline: 'Chinese drama/variety discussion.' },
    { sub: 'r/asianmovies', tagline: 'Adjacent, wider Asian entertainment.' },
  ],
  chinese_news_commentary: [
    { sub: 'r/geopolitics', tagline: 'Serious geopolitics discussion, often China-focused.' },
    { sub: 'r/China_irl', tagline: 'Discussion about China (expats, learners, curious observers).' },
    { sub: 'r/ChineseLanguage', tagline: 'Adjacent \u2014 language + culture.' },
    { sub: 'r/Economics', tagline: 'Non-ideological macro discussion with paper links.' },
  ],
  finance_markets: [
    { sub: 'r/investing', tagline: 'Mainstream long-term investing.' },
    { sub: 'r/stocks', tagline: 'Stock discussion, individual names.' },
    { sub: 'r/SecurityAnalysis', tagline: 'Higher-quality, value-investing leaning.' },
    { sub: 'r/algotrading', tagline: 'Quant/systematic trading.' },
    { sub: 'r/Bogleheads', tagline: 'Index investing community.' },
  ],
  cooking: [
    { sub: 'r/Cooking', tagline: 'General cooking community.' },
    { sub: 'r/AskCulinary', tagline: 'Moderated Q&A with chefs.' },
    { sub: 'r/ChineseFood', tagline: 'Regional Chinese cooking, authentic recipes.' },
    { sub: 'r/seriouseats', tagline: 'Paired with the Serious Eats site.' },
  ],
  photography: [
    { sub: 'r/photography', tagline: 'General photography; reviews, critiques.' },
    { sub: 'r/AskPhotography', tagline: 'Beginner-friendly Q&A.' },
    { sub: 'r/photocritique', tagline: 'Post work for feedback.' },
    { sub: 'r/Cinematography', tagline: 'Video-side, matches travel adjacency.' },
  ],
  travel_docs: [
    { sub: 'r/travel', tagline: 'General travel.' },
    { sub: 'r/solotravel', tagline: 'Solo-travel focused, high-quality posts.' },
    { sub: 'r/ChineseHistory', tagline: 'Pairs with Chinese culture interests.' },
  ],
};

export const PODCAST_EN_RECS = {
  ml_ai: [
    { name: 'Dwarkesh Podcast', host: 'Dwarkesh Patel', tagline: 'Long, technical interviews with ML researchers. Highest S/N.' },
    { name: 'Latent Space', host: 'swyx & Alessio Fanelli', tagline: 'Developer-focused AI, weekly; LLM infra and agents.' },
    { name: 'Machine Learning Street Talk', host: 'Tim Scarfe', tagline: 'Deep, technical, long-form. Papers and theory.' },
    { name: 'The Gradient Podcast', host: 'Daniel Bashir', tagline: 'Researcher interviews, academic side.' },
    { name: 'No Priors', host: 'Sarah Guo & Elad Gil', tagline: 'AI + startups, frontier-lab access.' },
    { name: 'Interconnects', host: 'Nathan Lambert', tagline: 'RLHF/post-training focus \u2014 highest match to RL work.' },
  ],
  scientific_computing: [
    { name: 'Sean Carroll\'s Mindscape', host: 'Sean Carroll', tagline: 'Physics, math, philosophy. Rigorous but accessible.' },
    { name: 'The Numberphile Podcast', host: 'Brady Haran', tagline: 'Interviews with mathematicians. Less formal than Mindscape.' },
  ],
  cpp_systems: [
    { name: 'CppCast', host: 'Timur Doumler & Phil Nash', tagline: 'The C++ podcast. Weekly, committee members + library authors.' },
    { name: 'ADSP: The Podcast', host: 'Bryce Adelstein Lelbach & Conor Hoekstra', tagline: 'Algorithms + data structures + parallelism.' },
    { name: 'CoRecursive', host: 'Adam Gordon Bell', tagline: 'Engineering war stories; databases, compilers, infra.' },
    { name: 'Oxide and Friends', host: 'Bryan Cantrill & Adam Leventhal', tagline: 'Weekly live show on systems, hardware, open source.' },
  ],
  rust: [
    { name: 'Rustacean Station', host: 'Community', tagline: 'Episodic interviews with Rust library authors.' },
    { name: 'Oxide and Friends', host: 'Bryan Cantrill', tagline: 'Heavy Rust content since Oxide is a Rust-first shop.' },
  ],
  chinese_pop_music: [
    { name: 'Switched on Pop', host: 'Nate Sloan & Charlie Harding', tagline: 'Music theory and analysis of pop hits.' },
    { name: 'Song Exploder', host: 'Hrishikesh Hirway', tagline: 'Songwriters deconstruct a single song per episode.' },
  ],
  chinese_news_commentary: [
    { name: 'ChinaTalk', host: 'Jordan Schneider', tagline: 'THE podcast for this cluster. Tech + policy + geopolitics, China-focused.' },
    { name: 'The Sinica Podcast', host: 'Kaiser Kuo', tagline: 'Long-running China analysis, more cultural/historical.' },
    { name: 'Little Red Podcast', host: 'Louisa Lim & Graeme Smith', tagline: 'Academic-flavor China podcast from Australia.' },
    { name: 'Odd Lots', host: 'Joe Weisenthal & Tracy Alloway', tagline: 'Macro/markets, heavy China coverage when warranted.' },
  ],
  finance_markets: [
    { name: 'Odd Lots', host: 'Joe Weisenthal & Tracy Alloway (Bloomberg)', tagline: 'Best macro podcast running.' },
    { name: 'Money Stuff', host: 'Matt Levine (Bloomberg)', tagline: 'Podcast version of the famous newsletter \u2014 wry finance commentary.' },
    { name: 'Macro Voices', host: 'Erik Townsend', tagline: 'Weekly macro guest interviews, technical.' },
    { name: 'Invest Like the Best', host: 'Patrick O\'Shaughnessy', tagline: 'Long interviews with investors and operators.' },
  ],
  cooking: [
    { name: 'The Splendid Table', host: 'Francis Lam (NPR)', tagline: 'Weekly food culture + technique show.' },
    { name: 'Home Cooking', host: 'Samin Nosrat & Hrishikesh Hirway', tagline: 'Casual, technique-forward.' },
    { name: 'Proof', host: 'America\'s Test Kitchen', tagline: 'Food history and science.' },
  ],
  photography: [
    { name: 'B&H Photography Podcast', host: 'B&H', tagline: 'Long-running, wide range of photographic genres.' },
    { name: 'The Candid Frame', host: 'Ibarionex Perello', tagline: 'Photographer interviews, very human.' },
    { name: 'PetaPixel Photography Podcast', host: 'PetaPixel', tagline: 'Weekly news + gear discussion.' },
  ],
  travel_docs: [
    { name: 'Amateur Traveler', host: 'Chris Christensen', tagline: 'Destination-per-episode format.' },
  ],
};

export const PODCAST_ZH_RECS = {
  ml_ai: [
    { name: 'OnBoard!', host: 'Monica & GN', tagline: '\u7845\u8C37\u534E\u4EBA\u89C6\u89D2\uFF0C\u8986\u76D6 AI \u521B\u4E1A\u3001\u4EA7\u54C1\u3001\u6280\u672F\u3002' },
    { name: '\u7845\u8C37101', host: '\u9648\u8329', tagline: '\u7845\u8C37\u79D1\u6280\u6DF1\u5EA6\u62A5\u9053\uFF0CAI \u4E13\u9898\u5F88\u591A\u3002' },
  ],
  cpp_systems: [
    { name: '\u6355\u86C7\u8005\u8BF4', host: 'Chinese Python devs', tagline: 'Python/\u5E95\u5C42\u5DE5\u7A0B\u5B9E\u8DF5\uFF0C\u5076\u5C14\u6D89\u53CA\u7CFB\u7EDF\u7F16\u7A0B\u3002' },
  ],
  chinese_pop_music: [
    { name: '\u5927\u5185\u5BC6\u8C08', host: '\u76F8\u5F81 and friends', tagline: '\u534E\u8BED\u4E50\u575B\u8001\u724C\u64AD\u5BA2\uFF0C\u97F3\u4E50\u6587\u5316\u95F2\u804A\u3002' },
    { name: '\u65F6\u5DEE in-betweenness', host: 'several academic hosts', tagline: '\u8DE8\u6587\u5316\u7814\u7A76\u89C6\u89D2\u4E0B\u7684\u6D41\u884C\u6587\u5316/\u97F3\u4E50\u3002' },
  ],
  chinese_variety_tv: [
    { name: '\u65E5\u8C08\u516C\u56ED', host: '\u674E\u53D4 & \u51AF\u8001\u677F', tagline: '\u5A31\u4E50/\u7EFC\u827A/\u6587\u5316\u95F2\u804A\uFF0C\u56FD\u6C11\u7EA7\u64AD\u5BA2\u3002' },
  ],
  chinese_news_commentary: [
    { name: '\u5FFD\u5DE6\u5FFD\u53F3', host: '\u7A0B\u884D\u6A11 & \u6768\u4E00', tagline: '\u65F6\u4E8B+\u5386\u53F2+\u4EBA\u7269\u8BBF\u8C08\uFF0C\u4E2D\u6587\u64AD\u5BA2\u91CC\u5236\u4F5C\u6700\u7CBE\u826F\u4E4B\u4E00\u3002' },
    { name: '\u4E0D\u5408\u65F6\u5B9C', host: '\u738B\u78EC & friends', tagline: '\u8DE8\u56FD\u89C6\u89D2\u7684\u65F6\u4E8B\u4E0E\u793E\u4F1A\u8BAE\u9898\u3002' },
    { name: '\u58F0\u4E1C\u51FB\u897F', host: 'ETW Studio', tagline: '\u5546\u4E1A/\u79D1\u6280/\u653F\u7B56\uFF0C\u7845\u8C37\u534E\u4EBA\u89C6\u89D2\u3002' },
    { name: '\u968F\u673A\u6CE2\u52A8 StochasticVolatility', host: 'three female journalists', tagline: '\u6587\u5316\u3001\u6027\u522B\u3001\u793E\u4F1A\u8BAE\u9898\uFF0C\u77E5\u8BC6\u5206\u5B50\u6C14\u8D28\u3002' },
    { name: '\u6545\u4E8BFM', host: '\u7231\u54F2', tagline: '\u771F\u5B9E\u6545\u4E8B\u53E3\u8FF0\uFF0C\u8986\u76D6\u5E7F\u6CDB\u793E\u4F1A\u8BAE\u9898\u3002' },
  ],
  finance_markets: [
    { name: '\u58F0\u4E1C\u51FB\u897F', host: 'ETW Studio', tagline: '\u8986\u76D6\u5E02\u573A\u8BDD\u9898\u3002' },
    { name: '\u7845\u8C37101', host: '\u9648\u8329', tagline: 'Tech + finance crossover.' },
  ],
  travel_docs: [
    { name: '\u6587\u5316\u571F\u8C46', host: '\u90ED\u5C0F\u5BD2', tagline: '\u6587\u5316+\u65C5\u884C+\u97F3\u4E50\u573A\u666F\uFF0C\u6C14\u6C1B\u8F7B\u677E\u3002' },
  ],
};

/** Gap clusters worth highlighting even with little history */
export const GAP_CLUSTERS = new Set(['rust', 'photography', 'cooking', 'fitness_health', 'travel_docs']);
