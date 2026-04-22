import{o as y,b as m}from"./index-BdwZ79a6.js";import{C as A}from"./classifier-tAIPdZbh.js";const C={ml_ai:[{topic:"LLM inference & systems",channels:"GPU MODE, vLLM talks, Horace He, Tri Dao"},{topic:"RL for LLMs",channels:"Sergey Levine, Pieter Abbeel, Nathan Lambert (Interconnects)"},{topic:"ML research explained",channels:"Yannic Kilcher, AI Coffee Break, Gabriel Mongaras"},{topic:"MLSys seminars",channels:"Stanford MLSys, MLSys Conference, Chip Huyen talks"}],scientific_computing:[{topic:"Numerical methods deep dives",channels:"Nick Trefethen lectures, Gilbert Strang (MIT OCW)"},{topic:"Applied math visualization",channels:"Grant Sanderson advanced playlists, Welch Labs"}],cpp_systems:[{topic:"Rust for C++ devs",channels:"Jon Gjengset, Let's Get Rusty, No Boilerplate"},{topic:"Performance engineering",channels:"ChandlerC talks, Emery Berger, Denis Bakhvalov"},{topic:"Systems / OS internals",channels:"Brendan Gregg, Bryan Cantrill (Oxide), George Hotz streams"}],rust:[{topic:"Rust async & systems",channels:"fasterthanlime, Ryan Levick, Logan Smith"}],chinese_pop_music:[{topic:"Japanese city pop (natural crossover)",channels:"Mariya Takeuchi, Tatsuro Yamashita, Anri topic channels"},{topic:"Chinese indie / alt",channels:"草东没有派对, 告五人, 椅子乐团, 万能青年旅店"},{topic:"Music theory / analysis",channels:"Adam Neely, 12tone, David Bennett Piano"},{topic:"Live acoustic sessions",channels:"Mahogany Sessions, COLORS, NPR Tiny Desk"}],chinese_variety_tv:[{topic:"Music competition alternatives",channels:"蒙面唱将, 我是歌手 archives, 中国梦之声"}],chinese_news_commentary:[{topic:"English-language China analysis",channels:"ChinaTalk (Jordan Schneider), SupChina, Sinica Podcast"},{topic:"Macro & geopolitics",channels:"Perun, Peter Zeihan clips, Wendover Productions"}],finance_markets:[{topic:"Quant & markets",channels:"Ernie Chan, Quantopian archives, Dimitri Bianco"}],kids_family:[{topic:"Educational kids content",channels:"Ms Rachel, Blippi, SciShow Kids, 小小优趣"}]},E={ml_ai:{crossover:[{name:"跟李沐学AI",tagline:"Mu Li's paper-reading series — foundational LLM papers explained in Mandarin.",search:"跟李沐学AI"}],native:[{name:"同济子豪兄",tagline:"Accessible ML & deep learning tutorials, Tongji Univ.",search:"同济子豪兄"},{name:"王木头学科学",tagline:"ML fundamentals with clean visual explanations.",search:"王木头学科学"},{name:"鲁鹏-计算机视觉",tagline:"CV lectures, good complement to Stanford Online.",search:"鲁鹏 计算机视觉"},{name:"3Blue1Brown的官方频道",tagline:"Official Bilibili mirror (Chinese subs).",search:"3Blue1Brown"}],searchHints:["大模型微调","LLM训练","RLHF","DeepSeek论文解读","vLLM 原理","Transformer 原理"]},scientific_computing:{crossover:[],native:[{name:"妈咪说MommyTalk",tagline:"Physics + applied math explainers, very popular.",search:"妈咪说MommyTalk"},{name:"马同学图解数学",tagline:"Linear algebra / calculus with visual intuition.",search:"马同学图解数学"},{name:"数之道",tagline:"Data visualization of historical + economic datasets.",search:"数之道"},{name:"李永乐老师官方",tagline:"Physics/math explainers at popular-science level.",search:"李永乐老师"}],searchHints:["线性代数的本质","傅里叶变换","微分方程"]},cpp_systems:{crossover:[],native:[{name:"侯捷",tagline:"The legend of Chinese C++ education — STL source analysis, memory management.",search:"侯捷 C++"},{name:"码农高天",tagline:"Programming deep-dives, C++/Python internals.",search:"码农高天"},{name:"mq白",tagline:"Systems-level C/C++ content.",search:"mq白"},{name:"程序员鱼皮",tagline:"Lighter backend/systems content, good for breadth.",search:"程序员鱼皮"}],searchHints:["C++ 模板元编程","Linux内核源码","协程原理","内存分配器"]},rust:{crossover:[],native:[{name:"软件老王",tagline:"Rust tutorials in Mandarin, project-oriented.",search:"软件老王 Rust"},{name:"杨旭_官方",tagline:"Rust from scratch, beginner-friendly.",search:"杨旭 Rust"}],searchHints:["Rust 入门","Rust 异步","Rust 源码解析"]},chinese_pop_music:{crossover:[{name:"周杰伦 / Jay Chou 官方及粉丝频道",tagline:"Jay Chou live versions and MV re-uploads.",search:"周杰伦 演唱会"},{name:"张碧晨 / 邓紫棋 / 林俊杰 fan channels",tagline:"Fan-curated channels with rare live clips.",search:"张碧晨 live"}],native:[{name:"闻人听書_",tagline:"Top Bilibili cover singer, great mandopop covers.",search:"闻人听書"},{name:"音乐巅峰会",tagline:"Curated live-version compilations, great for discovery.",search:"音乐巅峰会"},{name:"Kurt Hugo Schneider 中文搬运",tagline:"Cover-of-cover channels bringing international acts.",search:"KHS 中文"}],searchHints:["华语金曲","演唱会现场","Live 版","翻唱","华语流行乐史","mandopop analysis"]},chinese_variety_tv:{crossover:[{name:"浙江卫视 / 湖南卫视 官方",tagline:"Both post full-episode clips on Bilibili with faster updates than YouTube.",search:"浙江卫视 官方"}],native:[{name:"声生不息 官方账号",tagline:"Full show + behind-the-scenes.",search:"声生不息"},{name:"天赐的声音 官方",tagline:"Full episode archive.",search:"天赐的声音"}],searchHints:["综艺剪辑","乘风破浪","披荆斩棘","歌手"]},chinese_news_commentary:{crossover:[{name:"IC实验室",tagline:"Bilibili-native brand — full catalogue lives here, not on YouTube.",search:"IC实验室"},{name:"小Lin说",tagline:"Finance/macro commentary, also Bilibili-first.",search:"小Lin说"}],native:[{name:"半佛仙人",tagline:"Bilibili's most-watched commentator — fintech, business, social issues.",search:"半佛仙人"},{name:"所长林超",tagline:"Career and industry deep-dives.",search:"所长林超"},{name:"温义飞的急救财经",tagline:"Fast, accessible macroeconomics commentary.",search:"温义飞"},{name:"沈奕斐老师",tagline:"Sociology-flavored current affairs.",search:"沈奕斐"}],searchHints:["宏观经济","地缘政治","产业分析"]},finance_markets:{crossover:[{name:"小Lin说",tagline:"Bilibili-first, English finance viewers love her.",search:"小Lin说"}],native:[{name:"巫师财经",tagline:"Early Bilibili finance-commentator star, still influential.",search:"巫师财经"},{name:"半佛仙人 财经专题",tagline:"Half-Buddha's finance playlists.",search:"半佛仙人 金融"},{name:"老蒋巨靠谱",tagline:"Practical investing content.",search:"老蒋巨靠谱"}],searchHints:["美股分析","宏观","基金","港股"]},kids_family:{crossover:[{name:"宝宝巴士",tagline:"BabyBus has a huge official Bilibili presence in Mandarin.",search:"宝宝巴士"}],native:[{name:"小猪佩奇官方频道",tagline:"Peppa Pig in Mandarin.",search:"小猪佩奇"}],searchHints:["儿歌","动画片","少儿"]},cooking:{crossover:[{name:"美食作家王刚",tagline:"Wang Gang (the Sichuan chef YouTube loves) — original content started on Bilibili.",search:"美食作家王刚"}],native:[{name:"日食记",tagline:"Cozy, aesthetic cooking vlogs with a cat.",search:"日食记"},{name:"绵羊料理",tagline:"Home-cook explorations of world cuisines.",search:"绵羊料理"},{name:"曼食慢语",tagline:"Beautifully shot recipes.",search:"曼食慢语"},{name:"滇西小哥",tagline:"Yunnan rural life + food, gorgeous cinematography.",search:"滇西小哥"}],searchHints:["家常菜","川菜教程","烘焙"]},photography:{crossover:[],native:[{name:"影视飓风",tagline:"Bilibili's biggest videography channel. Gear reviews, cinematography tutorials.",search:"影视飓风"},{name:"Thomas看看世界",tagline:"Landscape photography + post-processing tutorials.",search:"Thomas看看世界"},{name:"影像狗",tagline:"Camera and lens reviews.",search:"影像狗"}],searchHints:["摄影教程","后期调色","相机评测"]},travel_docs:{crossover:[],native:[{name:"意公子",tagline:"Chinese classical culture + travel essays.",search:"意公子"},{name:"滇西小哥",tagline:"Rural Yunnan slow life, also fits cooking.",search:"滇西小哥"},{name:"侣行",tagline:"Long-form travel documentary series.",search:"侣行"}],searchHints:["纪录片","国家地理","旅行vlog"]}},F={ml_ai:[{sub:"r/MachineLearning",tagline:"The main ML research sub. Paper discussions, SOTA tracking."},{sub:"r/LocalLLaMA",tagline:"Local LLM deployment, fine-tuning, GGUF quantization. Practitioner-focused."},{sub:"r/reinforcementlearning",tagline:"RL research and practice."},{sub:"r/LanguageTechnology",tagline:"NLP-specific discussions, more academic flavor."},{sub:"r/singularity",tagline:"Broader AI-news firehose (noisier, useful for signal scan)."}],scientific_computing:[{sub:"r/math",tagline:"General math community, from olympiad to research."},{sub:"r/compsci",tagline:"CS theory and algorithms."},{sub:"r/AskPhysics",tagline:"Good for intuition-building Q&A."}],cpp_systems:[{sub:"r/cpp",tagline:"The main C++ sub. Proposals, toolchains, idioms."},{sub:"r/C_Programming",tagline:"C-focused counterpart."},{sub:"r/programming",tagline:"General programming firehose."},{sub:"r/compilers",tagline:"LLVM, MLIR, codegen discussions."},{sub:"r/osdev",tagline:"OS kernels and hobby OSes."}],rust:[{sub:"r/rust",tagline:"Very high-quality sub, maintainers are active."},{sub:"r/learnrust",tagline:"Beginner questions, friendly."}],chinese_pop_music:[{sub:"r/cpop",tagline:"Chinese pop music sub. Small but active."},{sub:"r/mandopop",tagline:"Mandopop-specific, overlaps with r/cpop."},{sub:"r/kpop",tagline:"Adjacent market, very active — good for genre crossover discovery."},{sub:"r/LetsTalkMusic",tagline:"Thoughtful music discussion across genres."}],chinese_variety_tv:[{sub:"r/CDrama",tagline:"Chinese drama/variety discussion."},{sub:"r/asianmovies",tagline:"Adjacent, wider Asian entertainment."}],chinese_news_commentary:[{sub:"r/geopolitics",tagline:"Serious geopolitics discussion, often China-focused."},{sub:"r/China_irl",tagline:"Discussion about China (expats, learners, curious observers)."},{sub:"r/ChineseLanguage",tagline:"Adjacent — language + culture."},{sub:"r/Economics",tagline:"Non-ideological macro discussion with paper links."}],finance_markets:[{sub:"r/investing",tagline:"Mainstream long-term investing."},{sub:"r/stocks",tagline:"Stock discussion, individual names."},{sub:"r/SecurityAnalysis",tagline:"Higher-quality, value-investing leaning."},{sub:"r/algotrading",tagline:"Quant/systematic trading."},{sub:"r/Bogleheads",tagline:"Index investing community."}],cooking:[{sub:"r/Cooking",tagline:"General cooking community."},{sub:"r/AskCulinary",tagline:"Moderated Q&A with chefs."},{sub:"r/ChineseFood",tagline:"Regional Chinese cooking, authentic recipes."},{sub:"r/seriouseats",tagline:"Paired with the Serious Eats site."}],photography:[{sub:"r/photography",tagline:"General photography; reviews, critiques."},{sub:"r/AskPhotography",tagline:"Beginner-friendly Q&A."},{sub:"r/photocritique",tagline:"Post work for feedback."},{sub:"r/Cinematography",tagline:"Video-side, matches travel adjacency."}],travel_docs:[{sub:"r/travel",tagline:"General travel."},{sub:"r/solotravel",tagline:"Solo-travel focused, high-quality posts."},{sub:"r/ChineseHistory",tagline:"Pairs with Chinese culture interests."}]},B={ml_ai:[{name:"Dwarkesh Podcast",host:"Dwarkesh Patel",tagline:"Long, technical interviews with ML researchers. Highest S/N."},{name:"Latent Space",host:"swyx & Alessio Fanelli",tagline:"Developer-focused AI, weekly; LLM infra and agents."},{name:"Machine Learning Street Talk",host:"Tim Scarfe",tagline:"Deep, technical, long-form. Papers and theory."},{name:"The Gradient Podcast",host:"Daniel Bashir",tagline:"Researcher interviews, academic side."},{name:"No Priors",host:"Sarah Guo & Elad Gil",tagline:"AI + startups, frontier-lab access."},{name:"Interconnects",host:"Nathan Lambert",tagline:"RLHF/post-training focus — highest match to RL work."}],scientific_computing:[{name:"Sean Carroll's Mindscape",host:"Sean Carroll",tagline:"Physics, math, philosophy. Rigorous but accessible."},{name:"The Numberphile Podcast",host:"Brady Haran",tagline:"Interviews with mathematicians. Less formal than Mindscape."}],cpp_systems:[{name:"CppCast",host:"Timur Doumler & Phil Nash",tagline:"The C++ podcast. Weekly, committee members + library authors."},{name:"ADSP: The Podcast",host:"Bryce Adelstein Lelbach & Conor Hoekstra",tagline:"Algorithms + data structures + parallelism."},{name:"CoRecursive",host:"Adam Gordon Bell",tagline:"Engineering war stories; databases, compilers, infra."},{name:"Oxide and Friends",host:"Bryan Cantrill & Adam Leventhal",tagline:"Weekly live show on systems, hardware, open source."}],rust:[{name:"Rustacean Station",host:"Community",tagline:"Episodic interviews with Rust library authors."},{name:"Oxide and Friends",host:"Bryan Cantrill",tagline:"Heavy Rust content since Oxide is a Rust-first shop."}],chinese_pop_music:[{name:"Switched on Pop",host:"Nate Sloan & Charlie Harding",tagline:"Music theory and analysis of pop hits."},{name:"Song Exploder",host:"Hrishikesh Hirway",tagline:"Songwriters deconstruct a single song per episode."}],chinese_news_commentary:[{name:"ChinaTalk",host:"Jordan Schneider",tagline:"THE podcast for this cluster. Tech + policy + geopolitics, China-focused."},{name:"The Sinica Podcast",host:"Kaiser Kuo",tagline:"Long-running China analysis, more cultural/historical."},{name:"Little Red Podcast",host:"Louisa Lim & Graeme Smith",tagline:"Academic-flavor China podcast from Australia."},{name:"Odd Lots",host:"Joe Weisenthal & Tracy Alloway",tagline:"Macro/markets, heavy China coverage when warranted."}],finance_markets:[{name:"Odd Lots",host:"Joe Weisenthal & Tracy Alloway (Bloomberg)",tagline:"Best macro podcast running."},{name:"Money Stuff",host:"Matt Levine (Bloomberg)",tagline:"Podcast version of the famous newsletter — wry finance commentary."},{name:"Macro Voices",host:"Erik Townsend",tagline:"Weekly macro guest interviews, technical."},{name:"Invest Like the Best",host:"Patrick O'Shaughnessy",tagline:"Long interviews with investors and operators."}],cooking:[{name:"The Splendid Table",host:"Francis Lam (NPR)",tagline:"Weekly food culture + technique show."},{name:"Home Cooking",host:"Samin Nosrat & Hrishikesh Hirway",tagline:"Casual, technique-forward."},{name:"Proof",host:"America's Test Kitchen",tagline:"Food history and science."}],photography:[{name:"B&H Photography Podcast",host:"B&H",tagline:"Long-running, wide range of photographic genres."},{name:"The Candid Frame",host:"Ibarionex Perello",tagline:"Photographer interviews, very human."},{name:"PetaPixel Photography Podcast",host:"PetaPixel",tagline:"Weekly news + gear discussion."}],travel_docs:[{name:"Amateur Traveler",host:"Chris Christensen",tagline:"Destination-per-episode format."}]},b={ml_ai:[{name:"OnBoard!",host:"Monica & GN",tagline:"硅谷华人视角，覆盖 AI 创业、产品、技术。"},{name:"硅谷101",host:"陈茩",tagline:"硅谷科技深度报道，AI 专题很多。"}],cpp_systems:[{name:"捕蛇者说",host:"Chinese Python devs",tagline:"Python/底层工程实践，偶尔涉及系统编程。"}],chinese_pop_music:[{name:"大内密谈",host:"相征 and friends",tagline:"华语乐坛老牌播客，音乐文化闲聊。"},{name:"时差 in-betweenness",host:"several academic hosts",tagline:"跨文化研究视角下的流行文化/音乐。"}],chinese_variety_tv:[{name:"日谈公园",host:"李叔 & 冯老板",tagline:"娱乐/综艺/文化闲聊，国民级播客。"}],chinese_news_commentary:[{name:"忽左忽右",host:"程衍樑 & 杨一",tagline:"时事+历史+人物访谈，中文播客里制作最精良之一。"},{name:"不合时宜",host:"王磬 & friends",tagline:"跨国视角的时事与社会议题。"},{name:"声东击西",host:"ETW Studio",tagline:"商业/科技/政策，硅谷华人视角。"},{name:"随机波动 StochasticVolatility",host:"three female journalists",tagline:"文化、性别、社会议题，知识分子气质。"},{name:"故事FM",host:"爱哲",tagline:"真实故事口述，覆盖广泛社会议题。"}],finance_markets:[{name:"声东击西",host:"ETW Studio",tagline:"覆盖市场话题。"},{name:"硅谷101",host:"陈茩",tagline:"Tech + finance crossover."}],travel_docs:[{name:"文化土豆",host:"郭小寒",tagline:"文化+旅行+音乐场景，气氛轻松。"}]},D=new Set(["rust","photography","cooking","fitness_health","travel_docs"]);let d="youtube";function h(t){return m().clusterMeta?.[t]||A[t]||{id:t,label:t,emoji:"",color:"#94a3b8"}}function v(){return!!m().llmRecommendations}function j(t){t.innerHTML=`
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h2>Recommendations</h2>
        <p>Cross-platform content suggestions based on your interests</p>
      </div>
      <button class="btn" id="export-recs-btn">Export as Markdown</button>
    </div>
    <div id="llm-recs-badge"></div>
    <div class="platform-tabs" id="platform-tabs">
      <button class="platform-tab active" data-platform="youtube">YouTube</button>
      <button class="platform-tab" data-platform="bilibili">Bilibili</button>
      <button class="platform-tab" data-platform="reddit">Reddit</button>
      <button class="platform-tab" data-platform="podcasts">Podcasts</button>
    </div>
    <div id="recs-content"></div>
  `,document.querySelectorAll(".platform-tab").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".platform-tab").forEach(e=>e.classList.remove("active")),a.classList.add("active"),d=a.dataset.platform,p()})}),document.getElementById("export-recs-btn").addEventListener("click",T),p(),y(p)}function f(){const t=m().data;if(!t?.clusters)return[];const a=t.totalVideos,e=m().activeCluster;return t.clusters.filter(s=>s.id==="other"||e&&s.id!==e?!1:s.count>=20||s.count/a>=.005)}function $(){if(v())return[];if(!m().data?.clusters)return[];const a=new Set(f().map(e=>e.id));return[...D].filter(e=>!a.has(e))}function p(){const t=document.getElementById("recs-content"),a=f(),e=document.getElementById("llm-recs-badge");e&&(e.innerHTML=v()?'<span class="ai-generated-badge">AI-generated personalized recommendations</span>':"");let s="";if(v())s=L(a);else{d==="youtube"?s=S(a):d==="bilibili"?s=w(a):d==="reddit"?s=k(a):d==="podcasts"&&(s=_(a));const c=$();c.length>0&&(s+=P(c))}t.innerHTML=s}function L(t){const a=m().llmRecommendations;return a?d==="youtube"?t.map(e=>{const s=a.youtube?.[e.id];return s?.length?`
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${h(e.id).emoji||""} ${e.label} <small style="color:var(--text-muted);font-weight:400">(${e.count.toLocaleString()} videos)</small></div>
          <div class="rec-grid">
            ${s.map(o=>`
              <div class="card rec-card">
                <div class="rec-name">${n(o.topic||o.name||"")}</div>
                <div class="rec-tagline">${n(o.channels||o.tagline||"")}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}).join(""):d==="bilibili"?t.map(e=>{const s=a.bilibili?.[e.id];if(!s)return"";const c=h(e.id),o=s.crossover||[],u=s.native||[];return!o.length&&!u.length?"":`
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${c.emoji||""} ${e.label}</div>
          <div class="rec-grid">
            ${o.map(i=>`
              <div class="card rec-card">
                <span class="crossover-badge">Crossover</span>
                <div class="rec-name">${n(i.name)}</div>
                <div class="rec-tagline">${n(i.tagline)}</div>
                ${i.search?`<div class="rec-meta">Search: ${n(i.search)}</div>`:""}
              </div>
            `).join("")}
            ${u.map(i=>`
              <div class="card rec-card">
                <div class="rec-name">${n(i.name)}</div>
                <div class="rec-tagline">${n(i.tagline)}</div>
                ${i.search?`<div class="rec-meta">Search: ${n(i.search)}</div>`:""}
              </div>
            `).join("")}
          </div>
        </div>
      `}).join(""):d==="reddit"?t.map(e=>{const s=a.reddit?.[e.id];return s?.length?`
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${h(e.id).emoji||""} ${e.label}</div>
          <div class="rec-grid">
            ${s.map(o=>`
              <div class="card rec-card">
                <div class="rec-name">${n(o.sub)}</div>
                <div class="rec-tagline">${n(o.tagline)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `:""}).join(""):d==="podcasts"?t.map(e=>{const s=a.podcasts_en?.[e.id]||[],c=a.podcasts_zh?.[e.id]||[];return!s.length&&!c.length?"":`
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${h(e.id).emoji||""} ${e.label}</div>
          <div class="rec-grid">
            ${s.map(u=>`
              <div class="card rec-card">
                <div class="rec-name">${n(u.name)}</div>
                <div class="rec-meta">${n(u.host)}</div>
                <div class="rec-tagline">${n(u.tagline)}</div>
              </div>
            `).join("")}
            ${c.map(u=>`
              <div class="card rec-card">
                <span class="crossover-badge" style="background:rgba(236,72,153,0.15);color:#ec4899">中文</span>
                <div class="rec-name">${n(u.name)}</div>
                <div class="rec-meta">${n(u.host)}</div>
                <div class="rec-tagline">${n(u.tagline)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `}).join(""):"":""}function S(t){return t.map(a=>{const e=C[a.id];return e?.length?`
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${h(a.id).emoji||""} ${a.label} <small style="color:var(--text-muted);font-weight:400">(${a.count.toLocaleString()} videos)</small></div>
        <div class="rec-grid">
          ${e.map(c=>`
            <div class="card rec-card">
              <div class="rec-name">${n(c.topic)}</div>
              <div class="rec-tagline">${n(c.channels)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}).join("")}function w(t){return t.map(a=>{const e=E[a.id];if(!e)return"";const s=h(a.id),c=e.crossover||[],o=e.native||[],u=e.searchHints||[];return!c.length&&!o.length?"":`
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${s.emoji||""} ${a.label}</div>
        <div class="rec-grid">
          ${c.map(i=>`
            <div class="card rec-card">
              <span class="crossover-badge">Crossover</span>
              <div class="rec-name">${n(i.name)}</div>
              <div class="rec-tagline">${n(i.tagline)}</div>
              <div class="rec-meta">Search: ${n(i.search)}</div>
            </div>
          `).join("")}
          ${o.map(i=>`
            <div class="card rec-card">
              <div class="rec-name">${n(i.name)}</div>
              <div class="rec-tagline">${n(i.tagline)}</div>
              <div class="rec-meta">Search: ${n(i.search)}</div>
            </div>
          `).join("")}
        </div>
        ${u.length?`
          <div class="search-hints">
            ${u.map(i=>`<span class="search-hint">${n(i)}</span>`).join("")}
          </div>
        `:""}
      </div>
    `}).join("")}function k(t){return t.map(a=>{const e=F[a.id];return e?.length?`
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${h(a.id).emoji||""} ${a.label}</div>
        <div class="rec-grid">
          ${e.map(c=>`
            <div class="card rec-card">
              <div class="rec-name">${n(c.sub)}</div>
              <div class="rec-tagline">${n(c.tagline)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}).join("")}function _(t){return t.map(a=>{const e=B[a.id]||[],s=b[a.id]||[];return!e.length&&!s.length?"":`
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${h(a.id).emoji||""} ${a.label}</div>
        <div class="rec-grid">
          ${e.map(o=>`
            <div class="card rec-card">
              <div class="rec-name">${n(o.name)}</div>
              <div class="rec-meta">${n(o.host)}</div>
              <div class="rec-tagline">${n(o.tagline)}</div>
            </div>
          `).join("")}
          ${s.map(o=>`
            <div class="card rec-card">
              <span class="crossover-badge" style="background:rgba(236,72,153,0.15);color:#ec4899">中文</span>
              <div class="rec-name">${n(o.name)}</div>
              <div class="rec-meta">${n(o.host)}</div>
              <div class="rec-tagline">${n(o.tagline)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}).join("")}function P(t){const e={youtube:C,bilibili:E,reddit:F,podcasts:{...B}}[d],s=t.map(c=>{const o=h(c),u=e[c];if(!u)return"";let i="";return d==="bilibili"?i=[...u.crossover||[],...u.native||[]].map(r=>`<div class="card rec-card"><div class="rec-name">${n(r.name)}</div><div class="rec-tagline">${n(r.tagline)}</div></div>`).join(""):d==="reddit"?i=u.map(r=>`<div class="card rec-card"><div class="rec-name">${n(r.sub)}</div><div class="rec-tagline">${n(r.tagline)}</div></div>`).join(""):d==="podcasts"?i=u.map(r=>`<div class="card rec-card"><div class="rec-name">${n(r.name)}</div><div class="rec-meta">${n(r.host)}</div><div class="rec-tagline">${n(r.tagline)}</div></div>`).join(""):i=u.map(r=>`<div class="card rec-card"><div class="rec-name">${n(r.topic)}</div><div class="rec-tagline">${n(r.channels)}</div></div>`).join(""),i?`
      <div class="rec-cluster-group">
        <div class="rec-cluster-title" style="color:var(--text-muted)">${o.emoji||""} ${o.label||c} <small>(fresh direction)</small></div>
        <div class="rec-grid">${i}</div>
      </div>
    `:""}).join("");return s?`
    <div class="gap-section">
      <div class="gap-title">Fresh Directions (clusters with little history)</div>
      ${s}
    </div>
  `:""}function T(){const t=m().data;if(!t)return;const a=f();let e=`# YouTube Interest Dashboard - Recommendations

`;if(e+=`Total videos: ${t.totalVideos.toLocaleString()}
`,e+=`Date range: ${t.dateRange.earliest} to ${t.dateRange.latest}

`,v()){e+=`> AI-generated personalized recommendations

`;const u=m().llmRecommendations;e+=`## YouTube Channels

`,a.forEach(i=>{const r=u.youtube?.[i.id];r?.length&&(e+=`### ${i.label}
`,r.forEach(l=>{e+=`- **${l.topic||l.name||""}**: ${l.channels||l.tagline||""}
`}),e+=`
`)}),e+=`## Reddit Subreddits

`,a.forEach(i=>{const r=u.reddit?.[i.id];r?.length&&(e+=`### ${i.label}
`,r.forEach(l=>{e+=`- **${l.sub}**: ${l.tagline}
`}),e+=`
`)}),e+=`## Podcasts

`,a.forEach(i=>{const r=u.podcasts_en?.[i.id]||[],l=u.podcasts_zh?.[i.id]||[];!r.length&&!l.length||(e+=`### ${i.label}
`,r.forEach(g=>{e+=`- **${g.name}** (${g.host}): ${g.tagline}
`}),l.forEach(g=>{e+=`- **${g.name}** (${g.host}): ${g.tagline}
`}),e+=`
`)})}else e+=`## YouTube Channels

`,a.forEach(u=>{const i=C[u.id];i?.length&&(e+=`### ${u.label}
`,i.forEach(r=>{e+=`- **${r.topic}**: ${r.channels}
`}),e+=`
`)}),e+=`## Bilibili UP主

`,a.forEach(u=>{const i=E[u.id];i&&(e+=`### ${u.label}
`,[...i.crossover||[],...i.native||[]].forEach(r=>{e+=`- **${r.name}**: ${r.tagline} (search: ${r.search})
`}),e+=`
`)}),e+=`## Reddit Subreddits

`,a.forEach(u=>{const i=F[u.id];i?.length&&(e+=`### ${u.label}
`,i.forEach(r=>{e+=`- **${r.sub}**: ${r.tagline}
`}),e+=`
`)}),e+=`## Podcasts

`,a.forEach(u=>{const i=B[u.id]||[],r=b[u.id]||[];!i.length&&!r.length||(e+=`### ${u.label}
`,i.forEach(l=>{e+=`- **${l.name}** (${l.host}): ${l.tagline}
`}),r.forEach(l=>{e+=`- **${l.name}** (${l.host}): ${l.tagline}
`}),e+=`
`)});const s=new Blob([e],{type:"text/markdown"}),c=URL.createObjectURL(s),o=document.createElement("a");o.href=c,o.download="youtube-recommendations.md",o.click(),URL.revokeObjectURL(c)}function n(t){if(!t)return"";const a=document.createElement("div");return a.textContent=t,a.innerHTML}export{j as renderRecs};
