import{o as h,s as p,g as i}from"./index-DgBvK83Z.js";import{a as m,C as b}from"./classifier-tAIPdZbh.js";let o="count",c=-1;function E(t){t.innerHTML=`
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
  `,f(),v(),u(),h(u)}function f(){const t=document.getElementById("channel-cluster-filter");m.forEach(l=>{const r=document.createElement("option");r.value=l.id,r.textContent=l.emoji+" "+l.label,t.appendChild(r)});const e=document.createElement("option");e.value="other",e.textContent="📦 Other / Uncategorized",t.appendChild(e),t.addEventListener("change",()=>{p({activeCluster:t.value||null})}),h(()=>{t.value=i().activeCluster||""})}function v(){document.querySelectorAll("#channels-table th[data-sort]").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.sort;e!=="rank"&&(o===e?c*=-1:(o=e,c=-1),u())})})}function u(){const t=i().data;if(!t?.allChannels)return;let e=[...t.allChannels];const l=i().activeCluster;l&&(e=e.filter(a=>a.cluster===l)),e.sort((a,d)=>{let n=a[o],s=d[o];return typeof n=="string"?c*n.localeCompare(s):c*(n-s)});const r=document.getElementById("channels-body");r.innerHTML=e.slice(0,100).map((a,d)=>{const n=b[a.cluster],s=n?.color||"#94a3b8";return`
      <tr>
        <td>${d+1}</td>
        <td>${C(a.name)}</td>
        <td><span class="cluster-badge" style="background:${s}22;color:${s}">${n?.emoji||""} ${n?.label||a.cluster}</span></td>
        <td>${a.count.toLocaleString()}</td>
        <td>${a.recent90d.toLocaleString()}</td>
      </tr>
    `}).join("")}function C(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}export{E as renderChannels};
