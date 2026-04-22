import{o as h,i as f,b as g}from"./index-BdwZ79a6.js";import{C as $}from"./classifier-tAIPdZbh.js";function c(n){return g().clusterMeta?.[n]||$[n]||{id:n,label:n,emoji:"",color:"#94a3b8"}}function L(n){n.innerHTML=`
    <div class="section-header">
      <h2>Trends</h2>
      <p>Rising and fading interests based on last 90 days vs. all-time share</p>
    </div>
    <div class="trend-grid" id="trend-grid"></div>
  `,m(),h(m)}function m(){const n=g().data;if(!n?.clusters)return;const i=n.totalVideos,d=n.clusters.reduce((t,e)=>t+e.recent90d,0),p=document.getElementById("trend-grid"),l=n.clusters.filter(t=>t.id!=="other");p.innerHTML=l.map(t=>{const e=c(t.id),o=i>0?t.count/i:0,s=d>0?t.recent90d/d:0;let a="stable",r="Stable";s>o*1.3&&t.recent90d>=5?(a="rising",r="Rising"):s<o*.7&&t.count>=20&&(a="fading",r="Fading"),(t.monthly||[]).slice(-6).map(v=>v.count);const u=`sparkline-${t.id}`;return`
      <div class="card trend-card">
        <span class="trend-badge ${a}">${r}</span>
        <div class="trend-header">
          <span class="trend-emoji">${e.emoji||""}</span>
          <span class="trend-label">${t.label}</span>
        </div>
        <div class="trend-stats">
          <span>All-time: <strong>${t.count.toLocaleString()}</strong> (${(o*100).toFixed(1)}%)</span>
          <span>Last 90d: <strong>${t.recent90d.toLocaleString()}</strong> (${(s*100).toFixed(1)}%)</span>
        </div>
        <div class="sparkline-container">
          <canvas id="${u}"></canvas>
        </div>
      </div>
    `}).join(""),requestAnimationFrame(()=>{l.forEach(t=>{const e=document.getElementById(`sparkline-${t.id}`);if(!e)return;const s=(t.monthly||[]).slice(-6).map(r=>r.count),a=c(t.id).color;f(e,s,a)})})}export{L as renderTrends};
