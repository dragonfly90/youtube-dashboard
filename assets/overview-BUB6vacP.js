const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DgBvK83Z.js","assets/index-E2TdRE6p.css"])))=>i.map(i=>d[i]);
import{o as g,_ as m,g as v}from"./index-DgBvK83Z.js";function f(t){t.innerHTML=`
    <div class="section-header">
      <h2>Overview</h2>
      <p>Your YouTube watch history at a glance</p>
    </div>
    <div id="data-source-indicator"></div>
    <div class="card-grid" id="stat-cards"></div>
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
  `,u(),g(u),h()}function u(){const t=v().data;if(!t)return;const r=document.getElementById("data-source-indicator"),n=v().dataSource;r.innerHTML=`<span class="data-source">${n==="preloaded"?"📦 Pre-loaded data":"📤 Uploaded data"}</span>`;const a=document.getElementById("stat-cards");a.innerHTML=`
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
  `}function h(){const t=document.getElementById("upload-zone"),r=document.getElementById("file-input"),n=document.getElementById("upload-progress"),a=document.getElementById("progress-fill"),i=document.getElementById("progress-text");t.addEventListener("click",()=>r.click()),t.addEventListener("dragover",s=>{s.preventDefault(),t.classList.add("dragover")}),t.addEventListener("dragleave",()=>t.classList.remove("dragover")),t.addEventListener("drop",s=>{s.preventDefault(),t.classList.remove("dragover");const o=s.dataTransfer.files[0];o&&c(o)}),r.addEventListener("change",()=>{r.files[0]&&c(r.files[0])});function c(s){n.classList.add("active"),a.style.width="10%",i.textContent=`Reading ${s.name} (${(s.size/1024/1024).toFixed(1)} MB)...`;const o=new FileReader;o.onprogress=d=>{if(d.lengthComputable){const e=Math.round(d.loaded/d.total*40)+10;a.style.width=e+"%"}},o.onload=()=>{a.style.width="50%",i.textContent="Classifying videos...";const d=new Worker(new URL("/youtube-dashboard/assets/parser.worker-Dp1kmwAY.js",import.meta.url),{type:"module"});d.onmessage=e=>{if(e.data.type==="progress"){const l=50+Math.round(e.data.pct*.45);a.style.width=l+"%",i.textContent=e.data.msg}else e.data.type==="done"?(a.style.width="100%",i.textContent=`Done! Parsed ${e.data.result.totalVideos.toLocaleString()} videos.`,d.terminate(),m(async()=>{const{setState:l}=await import("./index-DgBvK83Z.js").then(p=>p.m);return{setState:l}},__vite__mapDeps([0,1])).then(({setState:l})=>{l({data:e.data.result,dataSource:"uploaded"})}),setTimeout(()=>{n.classList.remove("active"),a.style.width="0%"},2e3)):e.data.type==="error"&&(i.textContent="Error: "+e.data.msg,a.style.width="0%",d.terminate())},d.postMessage({html:o.result})},o.readAsText(s)}}export{f as renderOverview};
