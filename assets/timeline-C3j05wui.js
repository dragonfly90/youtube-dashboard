import{o as l,c as d,g as m}from"./index-DgBvK83Z.js";function h(a){a.innerHTML=`
    <div class="section-header">
      <h2>Timeline</h2>
      <p>Monthly watch volume over time</p>
    </div>
    <div class="chart-container" style="height:400px">
      <canvas id="timeline-chart"></canvas>
    </div>
    <div id="yearly-summary" style="margin-top:1rem"></div>
  `,i(),l(i)}function i(){const a=m().data;if(!a?.monthly)return;const c=document.getElementById("timeline-chart"),s=a.monthly.map(t=>t.month),o=a.monthly.map(t=>t.count);d(c,s,o,{color:"#6366f1",label:"Videos watched"});const n={};a.monthly.forEach(t=>{const e=t.month.slice(0,4);n[e]=(n[e]||0)+t.count});const r=document.getElementById("yearly-summary");r.innerHTML=`
    <div class="card-grid">
      ${Object.entries(n).map(([t,e])=>`
        <div class="card stat-card">
          <div class="stat-value">${e.toLocaleString()}</div>
          <div class="stat-label">${t}</div>
        </div>
      `).join("")}
    </div>
  `}export{h as renderTimeline};
