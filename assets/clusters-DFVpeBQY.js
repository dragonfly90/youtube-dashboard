import{o as g,a as C,b as y,g as n,s as c}from"./index-DgBvK83Z.js";import{C as i}from"./classifier-tAIPdZbh.js";function E(e){e.innerHTML=`
    <div class="section-header">
      <h2>Interest Clusters</h2>
      <p>How your watch history breaks down by topic. Click a cluster to filter.</p>
    </div>
    <div id="cluster-filter-info" style="margin-bottom:1rem"></div>
    <div class="chart-row">
      <div class="chart-container" style="height:420px">
        <canvas id="cluster-doughnut"></canvas>
      </div>
      <div class="chart-container" style="height:420px">
        <canvas id="cluster-bar"></canvas>
      </div>
    </div>
  `,h(),g(h)}function h(){const e=n().data;if(!e?.clusters)return;const s=e.clusters,l=s.map(t=>(i[t.id]?.emoji||"")+" "+t.label),o=s.map(t=>t.count),u=s.map(t=>i[t.id]?.color||"#94a3b8"),d=(t,a)=>{if(!a.length){c({activeCluster:null});return}const f=a[0].index,v=s[f].id,p=n().activeCluster;c({activeCluster:p===v?null:v})};C(document.getElementById("cluster-doughnut"),l,o,u,{onClick:d}),y(document.getElementById("cluster-bar"),l,o,u,{onClick:d});const m=document.getElementById("cluster-filter-info"),r=n().activeCluster;if(r){const t=i[r];m.innerHTML=`
      <span class="data-source" style="cursor:pointer" id="clear-cluster-filter">
        Filtered: ${t?.emoji||""} ${t?.label||r}
        <span style="margin-left:0.5rem">&times;</span>
      </span>
    `,document.getElementById("clear-cluster-filter").addEventListener("click",()=>{c({activeCluster:null})})}else m.innerHTML=""}export{E as renderClusters};
