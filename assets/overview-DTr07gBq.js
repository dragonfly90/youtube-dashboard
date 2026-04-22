const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Df6xpGmw.js","assets/index-CHuSwRLo.css"])))=>i.map(i=>d[i]);
import{d as z,g as U,o as V,a as H,b as A,_ as L,c as R}from"./index-Df6xpGmw.js";function W(e,s,i){const l=(e+" "+s).toLowerCase();for(const n of i)for(const c of n.keywords)if(l.includes(c))return n.id;return"other"}function F(e,s){if(e.length===0)throw new Error("No videos to classify");e.sort((t,m)=>t.dt-m.dt);const i=new Date(e[0].dt),l=new Date(e[e.length-1].dt),n=l.getTime()-90*864e5,c=new Set,a={},r={},h={},o={},u={},g={},v={},f={};for(const t of e){const m=new Date(t.dt),d=W(t.title,t.channel,s),p=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}`;c.add(t.channel),a[p]=(a[p]||0)+1,r[d]=(r[d]||0)+1,o[d]||(o[d]={}),o[d][t.channel]=(o[d][t.channel]||0)+1,u[d]||(u[d]={}),u[d][p]=(u[d][p]||0)+1,g[t.channel]=(g[t.channel]||0)+1,v[t.channel]||(v[t.channel]={}),v[t.channel][d]=(v[t.channel][d]||0)+1,t.dt>=n&&(h[d]=(h[d]||0)+1,f[t.channel]=(f[t.channel]||0)+1)}const k=Object.keys(a).sort(),_=k.map(t=>({month:t,count:a[t]})),$=[...s.map(t=>t.id),...r.other?["other"]:[]],I=new Set,M=$.filter(t=>I.has(t)?!1:(I.add(t),r[t]>0)).sort((t,m)=>(r[m]||0)-(r[t]||0)),y=Object.fromEntries(s.map(t=>[t.id,t]));y.other={id:"other",label:"Other / Uncategorized",emoji:"",color:"#94a3b8",keywords:[]};const B=M.map(t=>({id:t,label:y[t]?.label||t,count:r[t]||0,recent90d:h[t]||0,monthly:k.map(m=>({month:m,count:(u[t]||{})[m]||0}))})),E={};for(const t of M){const m=o[t]||{};E[t]=Object.entries(m).sort((d,p)=>p[1]-d[1]).slice(0,10).map(([d,p])=>({name:d,count:p}))}const T=Object.entries(g).sort((t,m)=>m[1]-t[1]),j=T.slice(0,30).map(([t,m])=>{const d=v[t]||{},p=Object.entries(d).sort((w,b)=>b[1]-w[1])[0];return{name:t,count:m,cluster:p?p[0]:"other"}}),P=T.slice(0,200).map(([t,m])=>{const d=v[t]||{},p=Object.entries(d).sort((w,b)=>b[1]-w[1])[0];return{name:t,count:m,recent90d:f[t]||0,cluster:p?p[0]:"other"}}),x=Math.max(1,Math.round((l-i)/864e5));return{data:{totalVideos:e.length,dateRange:{earliest:i.toISOString().slice(0,10),latest:l.toISOString().slice(0,10)},totalDays:x,avgPerDay:Math.round(e.length/x*10)/10,uniqueChannels:c.size,monthly:_,clusters:B,topChannelsByCluster:E,topChannelsOverall:j,allChannels:P},clusterMeta:y}}function Y(e){const s={};for(const a of e)s[a.channel]=(s[a.channel]||0)+1;const i=Object.entries(s).sort((a,r)=>r[1]-a[1]).slice(0,50).map(([a])=>a),l=new Set(i),n={};for(const a of e)l.has(a.channel)&&(n[a.channel]||(n[a.channel]=[]),n[a.channel].push(a));const c=[];for(const a of i){const r=n[a]||[];if(r.length===0)continue;const h=Math.max(1,Math.floor(r.length/4));for(let o=0;o<r.length&&c.length<250&&(c.push(`${r[o].title} | ${r[o].channel}`),!(c.length>=250));o+=h);}return c}async function q(e,s,i){s({stage:"discovering",message:"AI is discovering your interests..."});let l;try{const a=Y(e);l=await z(a)}catch(a){return console.warn("LLM Phase 1 failed, falling back to keyword classification:",a),s({stage:"fallback",message:"AI unavailable, using keyword classification..."}),!1}s({stage:"classifying",message:`Classifying ${e.length.toLocaleString()} videos...`});const{data:n,clusterMeta:c}=F(e,l);i({data:n,dataSource:"uploaded-llm",clusterMeta:c}),s({stage:"recommending",message:"Generating personalized recommendations..."});try{const a=n.clusters.filter(o=>o.id!=="other"&&o.count>=20).slice(0,10).map(o=>({...o,emoji:c[o.id]?.emoji||"",topChannels:(n.topChannelsByCluster[o.id]||[]).slice(0,5).map(u=>u.name)})),r=n.topChannelsOverall.slice(0,15).map(o=>o.name),h=await U(a,r);i({llmRecommendations:h})}catch(a){console.warn("LLM Phase 3 (recommendations) failed:",a)}return s({stage:"done",message:"AI analysis complete!"}),!0}let C=!0;function J(e){e.innerHTML=`
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
  `,O(),V(O),S(R()),H(S),K()}function S(e){const s=document.getElementById("llm-status-area");s&&(e==="checking"?s.innerHTML=`
      <div class="llm-status llm-checking">
        <span class="llm-spinner"></span>
        <span>Checking for local AI (Ollama)...</span>
      </div>
    `:e==="available"?(s.innerHTML=`
      <div class="llm-status llm-available">
        <span class="llm-dot available"></span>
        <span>Local AI available (Gemma 4)</span>
        <label class="llm-toggle">
          <input type="checkbox" id="llm-toggle-input" ${C?"checked":""} />
          <span class="llm-toggle-slider"></span>
          <span class="llm-toggle-label">Use AI-powered classification</span>
        </label>
      </div>
    `,document.getElementById("llm-toggle-input")?.addEventListener("change",i=>{C=i.target.checked})):e==="unavailable"&&(s.innerHTML=`
      <div class="llm-status llm-unavailable">
        <span class="llm-dot unavailable"></span>
        <span>Local AI not detected &mdash; using keyword classification</span>
      </div>
    `))}function G(e){const s=document.getElementById("llm-status-area");s&&(s.innerHTML=`
    <div class="llm-status llm-working">
      <span class="llm-spinner"></span>
      <span>${e}</span>
    </div>
  `)}function O(){const e=A().data;if(!e)return;const s=document.getElementById("data-source-indicator");if(!s)return;const i=A().dataSource;let l="📦 Pre-loaded data";i==="uploaded-llm"?l="🤖 Uploaded data (AI-classified)":i==="uploaded"&&(l="📤 Uploaded data"),s.innerHTML=`<span class="data-source">${l}</span>`;const n=document.getElementById("stat-cards");n&&(n.innerHTML=`
    <div class="card stat-card">
      <div class="stat-value">${e.totalVideos.toLocaleString()}</div>
      <div class="stat-label">Total Videos</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${e.dateRange.earliest}<br><small style="font-size:0.5em;color:var(--text-muted)">to</small><br>${e.dateRange.latest}</div>
      <div class="stat-label">Date Range</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${e.avgPerDay}</div>
      <div class="stat-label">Avg / Day</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${e.uniqueChannels.toLocaleString()}</div>
      <div class="stat-label">Unique Channels</div>
    </div>
  `)}function K(){const e=document.getElementById("upload-zone"),s=document.getElementById("file-input"),i=document.getElementById("upload-progress"),l=document.getElementById("progress-fill"),n=document.getElementById("progress-text");e.addEventListener("click",()=>s.click()),e.addEventListener("dragover",a=>{a.preventDefault(),e.classList.add("dragover")}),e.addEventListener("dragleave",()=>e.classList.remove("dragover")),e.addEventListener("drop",a=>{a.preventDefault(),e.classList.remove("dragover");const r=a.dataTransfer.files[0];r&&c(r)}),s.addEventListener("change",()=>{s.files[0]&&c(s.files[0])});function c(a){const r=C&&R()==="available";i.classList.add("active"),l.style.width="10%",n.textContent=`Reading ${a.name} (${(a.size/1024/1024).toFixed(1)} MB)...`;const h=new FileReader;h.onprogress=o=>{if(o.lengthComputable){const u=Math.round(o.loaded/o.total*40)+10;l.style.width=u+"%"}},h.onload=()=>{l.style.width="50%",n.textContent="Parsing watch history...";const o=new Worker(new URL("/youtube-dashboard/assets/parser.worker-BDWaLTWM.js",import.meta.url),{type:"module"});o.onmessage=u=>{if(u.data.type==="progress"){const g=50+Math.round(u.data.pct*.45);l.style.width=g+"%",n.textContent=u.data.msg}else u.data.type==="done-raw"&&r?(o.terminate(),l.style.width="95%",n.textContent=`Parsed ${u.data.videos.length.toLocaleString()} videos. Starting AI analysis...`,L(async()=>{const{setState:g}=await import("./index-Df6xpGmw.js").then(v=>v.m);return{setState:g}},__vite__mapDeps([0,1])).then(({setState:g})=>{q(u.data.videos,({stage:v,message:f})=>{G(f),n.textContent=f},g).then(v=>{v?(l.style.width="100%",n.textContent="AI analysis complete!",S("available"),setTimeout(()=>{i.classList.remove("active"),l.style.width="0%"},2e3)):D(h.result,i,l,n)}).catch(()=>{D(h.result,i,l,n)})})):u.data.type==="done"?(l.style.width="100%",n.textContent=`Done! Parsed ${u.data.result.totalVideos.toLocaleString()} videos.`,o.terminate(),L(async()=>{const{setState:g}=await import("./index-Df6xpGmw.js").then(v=>v.m);return{setState:g}},__vite__mapDeps([0,1])).then(({setState:g})=>{g({data:u.data.result,dataSource:"uploaded",clusterMeta:null,llmRecommendations:null})}),setTimeout(()=>{i.classList.remove("active"),l.style.width="0%"},2e3)):u.data.type==="error"&&(n.textContent="Error: "+u.data.msg,l.style.width="0%",o.terminate())},o.postMessage({html:h.result,mode:r?"parse-only":"full"})},h.readAsText(a)}}function D(e,s,i,l){l.textContent="AI unavailable, using keyword classification...";const n=new Worker(new URL("/youtube-dashboard/assets/parser.worker-BDWaLTWM.js",import.meta.url),{type:"module"});n.onmessage=c=>{c.data.type==="progress"?l.textContent=c.data.msg:c.data.type==="done"?(i.style.width="100%",l.textContent=`Done! Parsed ${c.data.result.totalVideos.toLocaleString()} videos.`,n.terminate(),L(async()=>{const{setState:a}=await import("./index-Df6xpGmw.js").then(r=>r.m);return{setState:a}},__vite__mapDeps([0,1])).then(({setState:a})=>{a({data:c.data.result,dataSource:"uploaded",clusterMeta:null,llmRecommendations:null})}),setTimeout(()=>{s.classList.remove("active"),i.style.width="0%"},2e3)):c.data.type==="error"&&(l.textContent="Error: "+c.data.msg,n.terminate())},n.postMessage({html:e,mode:"full"})}export{J as renderOverview};
