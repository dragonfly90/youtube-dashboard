import { getState, setState, onStateChange } from '../main.js';
import { CLUSTER_MAP } from '../classifier.js';
import { createDoughnut, createHorizontalBar } from '../utils/charts.js';

/** Resolve cluster metadata: prefer dynamic LLM meta, fall back to hardcoded */
function getMeta(id) {
  return getState().clusterMeta?.[id] || CLUSTER_MAP[id] || { id, label: id, emoji: '', color: '#94a3b8' };
}

export function renderClusters(container) {
  container.innerHTML = `
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
  `;

  draw();
  onStateChange(draw);
}

function draw() {
  const data = getState().data;
  if (!data?.clusters) return;

  const clusters = data.clusters;
  const labels = clusters.map(c => {
    const meta = getMeta(c.id);
    return (meta.emoji || '') + ' ' + c.label;
  });
  const values = clusters.map(c => c.count);
  const colors = clusters.map(c => getMeta(c.id).color);

  const handleClick = (_evt, elements) => {
    if (!elements.length) {
      setState({ activeCluster: null });
      return;
    }
    const idx = elements[0].index;
    const cid = clusters[idx].id;
    const current = getState().activeCluster;
    setState({ activeCluster: current === cid ? null : cid });
  };

  createDoughnut(
    document.getElementById('cluster-doughnut'),
    labels, values, colors,
    { onClick: handleClick }
  );

  createHorizontalBar(
    document.getElementById('cluster-bar'),
    labels, values, colors,
    { onClick: handleClick }
  );

  // Filter info
  const info = document.getElementById('cluster-filter-info');
  const active = getState().activeCluster;
  if (active) {
    const meta = getMeta(active);
    info.innerHTML = `
      <span class="data-source" style="cursor:pointer" id="clear-cluster-filter">
        Filtered: ${meta.emoji || ''} ${meta.label || active}
        <span style="margin-left:0.5rem">&times;</span>
      </span>
    `;
    document.getElementById('clear-cluster-filter').addEventListener('click', () => {
      setState({ activeCluster: null });
    });
  } else {
    info.innerHTML = '';
  }
}
