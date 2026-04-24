const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-B5T2II_u.js","assets/index-D9HLVbs5.css"])))=>i.map(i=>d[i]);
import{d as U,g as z,o as G,a as H,b as x,s as V,c as W,e as F,f as K,_ as C,h as _}from"./index-B5T2II_u.js";function Y(t,l,o){const s=(t+" "+l).toLowerCase();for(const n of o)for(const c of n.keywords)if(s.includes(c))return n.id;return"other"}function q(t,l){if(t.length===0)throw new Error("No videos to classify");t.sort((e,p)=>e.dt-p.dt);const o=new Date(t[0].dt),s=new Date(t[t.length-1].dt),n=s.getTime()-90*864e5,c=new Set,a={},r={},v={},i={},u={},m={},g={},f={};for(const e of t){const p=new Date(e.dt),d=Y(e.title,e.channel,l),h=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}`;c.add(e.channel),a[h]=(a[h]||0)+1,r[d]=(r[d]||0)+1,i[d]||(i[d]={}),i[d][e.channel]=(i[d][e.channel]||0)+1,u[d]||(u[d]={}),u[d][h]=(u[d][h]||0)+1,m[e.channel]=(m[e.channel]||0)+1,g[e.channel]||(g[e.channel]={}),g[e.channel][d]=(g[e.channel][d]||0)+1,e.dt>=n&&(v[d]=(v[d]||0)+1,f[e.channel]=(f[e.channel]||0)+1)}const y=Object.keys(a).sort(),$=y.map(e=>({month:e,count:a[e]})),D=[...l.map(e=>e.id),...r.other?["other"]:[]],S=new Set,E=D.filter(e=>S.has(e)?!1:(S.add(e),r[e]>0)).sort((e,p)=>(r[p]||0)-(r[e]||0)),w=Object.fromEntries(l.map(e=>[e.id,e]));w.other={id:"other",label:"Other / Uncategorized",emoji:"",color:"#94a3b8",keywords:[]};const R=E.map(e=>({id:e,label:w[e]?.label||e,count:r[e]||0,recent90d:v[e]||0,monthly:y.map(p=>({month:p,count:(u[e]||{})[p]||0}))})),M={};for(const e of E){const p=i[e]||{};M[e]=Object.entries(p).sort((d,h)=>h[1]-d[1]).slice(0,10).map(([d,h])=>({name:d,count:h}))}const A=Object.entries(m).sort((e,p)=>p[1]-e[1]),P=A.slice(0,30).map(([e,p])=>{const d=g[e]||{},h=Object.entries(d).sort((L,k)=>k[1]-L[1])[0];return{name:e,count:p,cluster:h?h[0]:"other"}}),j=A.slice(0,200).map(([e,p])=>{const d=g[e]||{},h=Object.entries(d).sort((L,k)=>k[1]-L[1])[0];return{name:e,count:p,recent90d:f[e]||0,cluster:h?h[0]:"other"}}),T=Math.max(1,Math.round((s-o)/864e5));return{data:{totalVideos:t.length,dateRange:{earliest:o.toISOString().slice(0,10),latest:s.toISOString().slice(0,10)},totalDays:T,avgPerDay:Math.round(t.length/T*10)/10,uniqueChannels:c.size,monthly:$,clusters:R,topChannelsByCluster:M,topChannelsOverall:P,allChannels:j},clusterMeta:w}}function N(t){const l={};for(const a of t)l[a.channel]=(l[a.channel]||0)+1;const o=Object.entries(l).sort((a,r)=>r[1]-a[1]).slice(0,50).map(([a])=>a),s=new Set(o),n={};for(const a of t)s.has(a.channel)&&(n[a.channel]||(n[a.channel]=[]),n[a.channel].push(a));const c=[];for(const a of o){const r=n[a]||[];if(r.length===0)continue;const v=Math.max(1,Math.floor(r.length/4));for(let i=0;i<r.length&&c.length<250&&(c.push(`${r[i].title} | ${r[i].channel}`),!(c.length>=250));i+=v);}return c}async function J(t,l,o){l({stage:"discovering",message:"AI is discovering your interests..."});let s;try{const a=N(t);s=await U(a)}catch(a){return console.warn("LLM Phase 1 failed, falling back to keyword classification:",a),l({stage:"fallback",message:"AI unavailable, using keyword classification..."}),!1}l({stage:"classifying",message:`Classifying ${t.length.toLocaleString()} videos...`});const{data:n,clusterMeta:c}=q(t,s);o({data:n,dataSource:"uploaded-llm",clusterMeta:c}),l({stage:"recommending",message:"Generating personalized recommendations..."});try{const a=n.clusters.filter(i=>i.id!=="other"&&i.count>=20).slice(0,10).map(i=>({...i,emoji:c[i.id]?.emoji||"",topChannels:(n.topChannelsByCluster[i.id]||[]).slice(0,5).map(u=>u.name)})),r=n.topChannelsOverall.slice(0,15).map(i=>i.name),v=await z(a,r);o({llmRecommendations:v})}catch(a){console.warn("LLM Phase 3 (recommendations) failed:",a)}return l({stage:"done",message:"AI analysis complete!"}),!0}let b=!0;function ee(t){t.innerHTML=`
    <div class="section-header">
      <h2>Overview</h2>
      <p>Your YouTube watch history at a glance</p>
    </div>
    <div id="data-source-indicator"></div>
    <div class="card-grid" id="stat-cards"></div>
    <div id="llm-status-area"></div>
    <div class="upload-zone" id="upload-zone">
      <div class="upload-icon">📁</div>
      <div class="upload-title">Upload your own Takeout data</div>
      <div class="upload-hint">
        Drag & drop your <code>watch-history.html</code> or click to browse<br>
        <small>Google Takeout &rarr; YouTube &rarr; History</small>
      </div>
      <input type="file" id="file-input" accept=".html" hidden />
    </div>
    <div class="upload-progress" id="upload-progress">
      <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
      <div class="progress-text" id="progress-text">Parsing...</div>
    </div>
  `,O(),G(O),I(_()),H(I),X()}function I(t){const l=document.getElementById("llm-status-area");l&&(t==="checking"?l.innerHTML=`
      <div class="llm-status llm-checking">
        <span class="llm-spinner"></span>
        <span>Checking for AI availability...</span>
      </div>
    `:t==="available"?(l.innerHTML=`
      <div class="llm-status llm-available">
        <span class="llm-dot available"></span>
        <span>Local AI available (Gemma 4 via Ollama)</span>
        <label class="llm-toggle">
          <input type="checkbox" id="llm-toggle-input" ${b?"checked":""} />
          <span class="llm-toggle-slider"></span>
          <span class="llm-toggle-label">Use AI-powered classification</span>
        </label>
      </div>
    `,document.getElementById("llm-toggle-input")?.addEventListener("change",o=>{b=o.target.checked})):t==="cloud"?(l.innerHTML=`
      <div class="llm-status llm-available">
        <span class="llm-dot available"></span>
        <span>Cloud AI available (Gemma via Google AI Studio)</span>
        <label class="llm-toggle">
          <input type="checkbox" id="llm-toggle-input" ${b?"checked":""} />
          <span class="llm-toggle-slider"></span>
          <span class="llm-toggle-label">Use AI-powered classification</span>
        </label>
      </div>
    `,document.getElementById("llm-toggle-input")?.addEventListener("change",o=>{b=o.target.checked})):t==="unavailable"&&(l.innerHTML=`
      <div class="llm-status llm-unavailable">
        <span class="llm-dot unavailable"></span>
        <span>No AI detected &mdash; using keyword classification</span>
        <div class="gemini-key-input">
          <input type="password" id="gemini-key-field" placeholder="Enter Google AI Studio API key" />
          <button class="btn btn-primary btn-sm" id="gemini-key-save">Save</button>
        </div>
        <small class="gemini-key-hint">Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a></small>
      </div>
    `,document.getElementById("gemini-key-save")?.addEventListener("click",async()=>{const s=document.getElementById("gemini-key-field")?.value.trim();if(!s)return;V(s);const n=W();n&&await F(n.uid,s),await K()})))}function Q(t){const l=document.getElementById("llm-status-area");l&&(l.innerHTML=`
    <div class="llm-status llm-working">
      <span class="llm-spinner"></span>
      <span>${t}</span>
    </div>
  `)}function O(){const t=x().data;if(!t)return;const l=document.getElementById("data-source-indicator");if(!l)return;const o=x().dataSource;let s="📦 Pre-loaded data";o==="uploaded-llm"?s="🤖 Uploaded data (AI-classified)":o==="uploaded"&&(s="📤 Uploaded data"),l.innerHTML=`<span class="data-source">${s}</span>`;const n=document.getElementById("stat-cards");n&&(n.innerHTML=`
    <div class="card stat-card">
      <div class="stat-value">${t.totalVideos.toLocaleString()}</div>
      <div class="stat-label">Total Videos</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.dateRange.earliest}<br><small style="font-size:0.5em;color:var(--text-muted)">to</small><br>${t.dateRange.latest}</div>
      <div class="stat-label">Date Range</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.avgPerDay}</div>
      <div class="stat-label">Avg / Day</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.uniqueChannels.toLocaleString()}</div>
      <div class="stat-label">Unique Channels</div>
    </div>
  `)}function X(){const t=document.getElementById("upload-zone"),l=document.getElementById("file-input"),o=document.getElementById("upload-progress"),s=document.getElementById("progress-fill"),n=document.getElementById("progress-text");t.addEventListener("click",()=>l.click()),t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("dragover")}),t.addEventListener("dragleave",()=>t.classList.remove("dragover")),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("dragover");const r=a.dataTransfer.files[0];r&&c(r)}),l.addEventListener("change",()=>{l.files[0]&&c(l.files[0])});function c(a){const r=_(),v=b&&(r==="available"||r==="cloud");o.classList.add("active"),s.style.width="10%",n.textContent=`Reading ${a.name} (${(a.size/1024/1024).toFixed(1)} MB)...`;const i=new FileReader;i.onprogress=u=>{if(u.lengthComputable){const m=Math.round(u.loaded/u.total*40)+10;s.style.width=m+"%"}},i.onload=()=>{s.style.width="50%",n.textContent="Parsing watch history...";const u=new Worker(new URL("/youtube-dashboard/assets/parser.worker-BDWaLTWM.js",import.meta.url),{type:"module"});u.onmessage=m=>{if(m.data.type==="progress"){const g=50+Math.round(m.data.pct*.45);s.style.width=g+"%",n.textContent=m.data.msg}else m.data.type==="done-raw"&&v?(u.terminate(),s.style.width="95%",n.textContent=`Parsed ${m.data.videos.length.toLocaleString()} videos. Starting AI analysis...`,C(async()=>{const{setState:g}=await import("./index-B5T2II_u.js").then(f=>f.n);return{setState:g}},__vite__mapDeps([0,1])).then(({setState:g})=>{J(m.data.videos,({stage:f,message:y})=>{Q(y),n.textContent=y},g).then(f=>{f?(s.style.width="100%",n.textContent="AI analysis complete!",I("available"),setTimeout(()=>{o.classList.remove("active"),s.style.width="0%"},2e3)):B(i.result,o,s,n)}).catch(()=>{B(i.result,o,s,n)})})):m.data.type==="done"?(s.style.width="100%",n.textContent=`Done! Parsed ${m.data.result.totalVideos.toLocaleString()} videos.`,u.terminate(),C(async()=>{const{setState:g}=await import("./index-B5T2II_u.js").then(f=>f.n);return{setState:g}},__vite__mapDeps([0,1])).then(({setState:g})=>{g({data:m.data.result,dataSource:"uploaded",clusterMeta:null,llmRecommendations:null})}),setTimeout(()=>{o.classList.remove("active"),s.style.width="0%"},2e3)):m.data.type==="error"&&(n.textContent="Error: "+m.data.msg,s.style.width="0%",u.terminate())},u.postMessage({html:i.result,mode:v?"parse-only":"full"})},i.readAsText(a)}}function B(t,l,o,s){s.textContent="AI unavailable, using keyword classification...";const n=new Worker(new URL("/youtube-dashboard/assets/parser.worker-BDWaLTWM.js",import.meta.url),{type:"module"});n.onmessage=c=>{c.data.type==="progress"?s.textContent=c.data.msg:c.data.type==="done"?(o.style.width="100%",s.textContent=`Done! Parsed ${c.data.result.totalVideos.toLocaleString()} videos.`,n.terminate(),C(async()=>{const{setState:a}=await import("./index-B5T2II_u.js").then(r=>r.n);return{setState:a}},__vite__mapDeps([0,1])).then(({setState:a})=>{a({data:c.data.result,dataSource:"uploaded",clusterMeta:null,llmRecommendations:null})}),setTimeout(()=>{l.classList.remove("active"),o.style.width="0%"},2e3)):c.data.type==="error"&&(s.textContent="Error: "+c.data.msg,n.terminate())},n.postMessage({html:t,mode:"full"})}export{ee as renderOverview};
