import{o as v,b as y,j as u,i as h,l as f}from"./index-B8b2BWxl.js";const g={like:"#E1306C",story_like:"#F77737",story_view:"#FCAF45",thread_view:"#833AB4",comment:"#405DE6",reel:"#C13584",your_post:"#5B51D8",post_view:"#FD1D1D",video_watch:"#F56040"};function E(t){t.innerHTML=`
    <div class="section-header">
      <h2>Instagram</h2>
      <p>Analyze your Instagram data export</p>
    </div>
    <div id="ig-stats" class="card-grid" style="margin-bottom:1rem"></div>
    <div id="ig-upload-area">
      <div class="upload-zone ig-upload-zone" id="ig-upload-zone">
        <div class="upload-icon">📷</div>
        <div class="upload-title">Upload Instagram data export</div>
        <div class="upload-hint">
          Drag & drop your Instagram HTML files or click to browse<br>
          <small>Meta Account Center &rarr; Download your information &rarr; HTML format</small>
        </div>
        <input type="file" id="ig-file-input" accept=".html" multiple hidden />
      </div>
      <div class="upload-progress" id="ig-upload-progress">
        <div class="progress-bar"><div class="progress-fill" id="ig-progress-fill"></div></div>
        <div class="progress-text" id="ig-progress-text">Parsing...</div>
      </div>
    </div>
    <div id="ig-charts" style="display:none">
      <div class="chart-row" style="margin-top:1rem">
        <div class="chart-container" style="height:300px">
          <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Interaction Types</h3>
          <canvas id="ig-type-chart"></canvas>
        </div>
        <div class="chart-container" style="height:300px">
          <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Monthly Timeline</h3>
          <canvas id="ig-timeline-chart"></canvas>
        </div>
      </div>
      <div style="margin-top:1rem">
        <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Top Accounts (Anonymized)</h3>
        <div class="table-wrap" id="ig-accounts-table"></div>
      </div>
    </div>
  `,p(),v(p),b()}function p(){const t=y().instagramData,i=document.getElementById("ig-stats"),d=document.getElementById("ig-charts"),s=document.getElementById("ig-upload-area");if(i){if(!t){i.innerHTML="",d&&(d.style.display="none"),s&&(s.style.display="block");return}if(s&&(s.style.display="block"),i.innerHTML=`
    <div class="card stat-card">
      <div class="stat-value">${t.totalInteractions.toLocaleString()}</div>
      <div class="stat-label">Total Interactions</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.dateRange.earliest}<br><small style="font-size:0.5em;color:var(--text-muted)">to</small><br>${t.dateRange.latest}</div>
      <div class="stat-label">Date Range</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.uniqueAccounts.toLocaleString()}</div>
      <div class="stat-label">Unique Accounts</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${t.followers||0} / ${t.following||0}</div>
      <div class="stat-label">Followers / Following</div>
    </div>
  `,d){if(d.style.display="block",t.byType&&t.byType.length>0){const n=document.getElementById("ig-type-chart"),r=t.byType.map(a=>a.label),e=t.byType.map(a=>a.count),l=t.byType.map(a=>g[a.type]||"#888");u(n,r,e,l)}if(t.monthly&&t.monthly.length>0){const n=document.getElementById("ig-timeline-chart"),r=t.monthly.map(l=>l.month),e=t.monthly.map(l=>l.count);h(n,r,e,{color:"#E1306C",label:"Interactions"})}if(t.topAccounts&&t.topAccounts.length>0){const n=document.getElementById("ig-accounts-table"),r=[...new Set(t.topAccounts.flatMap(e=>Object.keys(e.types)))];n.innerHTML=`
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Account</th>
              <th>Total</th>
              ${r.map(e=>`<th><span class="ig-type-badge" style="background:${g[e]||"#888"}22;color:${g[e]||"#888"}">${e.replace(/_/g," ")}</span></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${t.topAccounts.map((e,l)=>`
              <tr>
                <td>${l+1}</td>
                <td>${e.name}</td>
                <td><strong>${e.count}</strong></td>
                ${r.map(a=>`<td>${e.types[a]||0}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}}}}function b(){const t=document.getElementById("ig-upload-zone"),i=document.getElementById("ig-file-input"),d=document.getElementById("ig-upload-progress"),s=document.getElementById("ig-progress-fill"),n=document.getElementById("ig-progress-text");if(!t||!i)return;t.addEventListener("click",()=>i.click()),t.addEventListener("dragover",e=>{e.preventDefault(),t.classList.add("dragover")}),t.addEventListener("dragleave",()=>t.classList.remove("dragover")),t.addEventListener("drop",e=>{e.preventDefault(),t.classList.remove("dragover"),e.dataTransfer.files.length>0&&r(Array.from(e.dataTransfer.files))}),i.addEventListener("change",()=>{i.files.length>0&&r(Array.from(i.files))});function r(e){d.classList.add("active"),s.style.width="5%",n.textContent=`Reading ${e.length} file(s)...`;const l=e.map(a=>new Promise((c,o)=>{const m=new FileReader;m.onload=()=>c({name:a.name,html:m.result}),m.onerror=()=>o(new Error(`Failed to read ${a.name}`)),m.readAsText(a)}));Promise.all(l).then(a=>{s.style.width="30%",n.textContent="Parsing Instagram data...";const c=new Worker(new URL("/youtube-dashboard/assets/instagram-parser.worker-dtXu4zBe.js",import.meta.url),{type:"module"});c.onmessage=o=>{if(o.data.type==="progress"){const m=30+Math.round(o.data.pct*.65);s.style.width=m+"%",n.textContent=o.data.msg}else o.data.type==="done"?(s.style.width="100%",n.textContent=`Done! ${o.data.result.totalInteractions} interactions found.`,c.terminate(),f({instagramData:o.data.result}),setTimeout(()=>{d.classList.remove("active"),s.style.width="0%"},2e3)):o.data.type==="error"&&(n.textContent="Error: "+o.data.msg,s.style.width="0%",c.terminate())},c.postMessage({files:a})}).catch(a=>{n.textContent="Error reading files: "+a.message,s.style.width="0%"})}}export{E as renderInstagram};
