import{o as g,b as r,j as C,k as y,l as c}from"./index-B5T2II_u.js";import{C as b}from"./classifier-tAIPdZbh.js";function l(e){return r().clusterMeta?.[e]||b[e]||{id:e,label:e,emoji:"",color:"#94a3b8"}}function M(e){e.innerHTML=`
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
  `,h(),g(h)}function h(){const e=r().data;if(!e?.clusters)return;const s=e.clusters,i=s.map(t=>(l(t.id).emoji||"")+" "+t.label),o=s.map(t=>t.count),u=s.map(t=>l(t.id).color),d=(t,a)=>{if(!a.length){c({activeCluster:null});return}const f=a[0].index,v=s[f].id,p=r().activeCluster;c({activeCluster:p===v?null:v})};C(document.getElementById("cluster-doughnut"),i,o,u,{onClick:d}),y(document.getElementById("cluster-bar"),i,o,u,{onClick:d});const m=document.getElementById("cluster-filter-info"),n=r().activeCluster;if(n){const t=l(n);m.innerHTML=`
      <span class="data-source" style="cursor:pointer" id="clear-cluster-filter">
        Filtered: ${t.emoji||""} ${t.label||n}
        <span style="margin-left:0.5rem">&times;</span>
      </span>
    `,document.getElementById("clear-cluster-filter").addEventListener("click",()=>{c({activeCluster:null})})}else m.innerHTML=""}export{M as renderClusters};
