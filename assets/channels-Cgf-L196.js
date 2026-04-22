import{o as h,s as m,b as o}from"./index-Df6xpGmw.js";import{a as b,C as f}from"./classifier-tAIPdZbh.js";let i="count",d=-1;function p(t){return o().clusterMeta?.[t]||f[t]||{id:t,label:t,emoji:"",color:"#94a3b8"}}function v(){const t=o().clusterMeta;return t?Object.values(t).filter(e=>e.id!=="other"):b}function M(t){t.innerHTML=`
    <div class="section-header">
      <h2>Top Channels</h2>
      <p>Most-watched channels, filterable by cluster</p>
    </div>
    <div class="filter-bar">
      <label>Cluster:</label>
      <select id="channel-cluster-filter">
        <option value="">All clusters</option>
      </select>
    </div>
    <div class="table-wrap">
      <table id="channels-table">
        <thead>
          <tr>
            <th data-sort="rank">#</th>
            <th data-sort="name">Channel <span class="sort-arrow"></span></th>
            <th data-sort="cluster">Cluster <span class="sort-arrow"></span></th>
            <th data-sort="count">Total <span class="sort-arrow"></span></th>
            <th data-sort="recent90d">Last 90d <span class="sort-arrow"></span></th>
          </tr>
        </thead>
        <tbody id="channels-body"></tbody>
      </table>
    </div>
  `,C(),y(),u(),h(u)}function C(){const t=document.getElementById("channel-cluster-filter");v().forEach(n=>{const a=document.createElement("option");a.value=n.id,a.textContent=(n.emoji||"")+" "+n.label,t.appendChild(a)});const l=document.createElement("option");l.value="other";const c=p("other");l.textContent=(c.emoji||"📦")+" "+c.label,t.appendChild(l),t.addEventListener("change",()=>{m({activeCluster:t.value||null})}),h(()=>{t.value=o().activeCluster||""})}function y(){document.querySelectorAll("#channels-table th[data-sort]").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.sort;e!=="rank"&&(i===e?d*=-1:(i=e,d=-1),u())})})}function u(){const t=o().data;if(!t?.allChannels)return;let e=[...t.allChannels];const l=o().activeCluster;l&&(e=e.filter(n=>n.cluster===l)),e.sort((n,a)=>{let r=n[i],s=a[i];return typeof r=="string"?d*r.localeCompare(s):d*(r-s)});const c=document.getElementById("channels-body");c.innerHTML=e.slice(0,100).map((n,a)=>{const r=p(n.cluster),s=r.color;return`
      <tr>
        <td>${a+1}</td>
        <td>${g(n.name)}</td>
        <td><span class="cluster-badge" style="background:${s}22;color:${s}">${r.emoji||""} ${r.label||n.cluster}</span></td>
        <td>${n.count.toLocaleString()}</td>
        <td>${n.recent90d.toLocaleString()}</td>
      </tr>
    `}).join("")}function g(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}export{M as renderChannels};
