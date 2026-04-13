import{o as v,d as h,g as f}from"./index-DgBvK83Z.js";import{C as c}from"./classifier-tAIPdZbh.js";function b(n){n.innerHTML=`
    <div class="section-header">
      <h2>Trends</h2>
      <p>Rising and fading interests based on last 90 days vs. all-time share</p>
    </div>
    <div class="trend-grid" id="trend-grid"></div>
  `,m(),v(m)}function m(){const n=f().data;if(!n?.clusters)return;const i=n.totalVideos,o=n.clusters.reduce((t,e)=>t+e.recent90d,0),g=document.getElementById("trend-grid"),l=n.clusters.filter(t=>t.id!=="other");g.innerHTML=l.map(t=>{const e=c[t.id]||{},d=i>0?t.count/i:0,s=o>0?t.recent90d/o:0;let a="stable",r="Stable";s>d*1.3&&t.recent90d>=5?(a="rising",r="Rising"):s<d*.7&&t.count>=20&&(a="fading",r="Fading"),(t.monthly||[]).slice(-6).map(u=>u.count);const p=`sparkline-${t.id}`;return`
      <div class="card trend-card">
        <span class="trend-badge ${a}">${r}</span>
        <div class="trend-header">
          <span class="trend-emoji">${e.emoji||""}</span>
          <span class="trend-label">${t.label}</span>
        </div>
        <div class="trend-stats">
          <span>All-time: <strong>${t.count.toLocaleString()}</strong> (${(d*100).toFixed(1)}%)</span>
          <span>Last 90d: <strong>${t.recent90d.toLocaleString()}</strong> (${(s*100).toFixed(1)}%)</span>
        </div>
        <div class="sparkline-container">
          <canvas id="${p}"></canvas>
        </div>
      </div>
    `}).join(""),requestAnimationFrame(()=>{l.forEach(t=>{const e=document.getElementById(`sparkline-${t.id}`);if(!e)return;const s=(t.monthly||[]).slice(-6).map(r=>r.count),a=c[t.id]?.color||"#94a3b8";h(e,s,a)})})}export{b as renderTrends};
