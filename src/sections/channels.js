import { getState, setState, onStateChange } from '../main.js';
import { CLUSTER_MAP, CLUSTERS } from '../classifier.js';

let sortKey = 'count';
let sortDir = -1; // -1 = descending

export function renderChannels(container) {
  container.innerHTML = `
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
  `;

  setupFilter();
  setupSorting();
  draw();
  onStateChange(draw);
}

function setupFilter() {
  const select = document.getElementById('channel-cluster-filter');
  CLUSTERS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.emoji + ' ' + c.label;
    select.appendChild(opt);
  });
  // Add "other"
  const opt = document.createElement('option');
  opt.value = 'other';
  opt.textContent = '\u{1F4E6} Other / Uncategorized';
  select.appendChild(opt);

  select.addEventListener('change', () => {
    setState({ activeCluster: select.value || null });
  });

  // Sync with global cluster filter
  onStateChange(() => {
    select.value = getState().activeCluster || '';
  });
}

function setupSorting() {
  document.querySelectorAll('#channels-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (key === 'rank') return;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = -1; }
      draw();
    });
  });
}

function draw() {
  const data = getState().data;
  if (!data?.allChannels) return;

  let channels = [...data.allChannels];
  const filter = getState().activeCluster;
  if (filter) {
    channels = channels.filter(c => c.cluster === filter);
  }

  // Sort
  channels.sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') return sortDir * av.localeCompare(bv);
    return sortDir * (av - bv);
  });

  const body = document.getElementById('channels-body');
  body.innerHTML = channels.slice(0, 100).map((ch, i) => {
    const meta = CLUSTER_MAP[ch.cluster];
    const color = meta?.color || '#94a3b8';
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(ch.name)}</td>
        <td><span class="cluster-badge" style="background:${color}22;color:${color}">${meta?.emoji || ''} ${meta?.label || ch.cluster}</span></td>
        <td>${ch.count.toLocaleString()}</td>
        <td>${ch.recent90d.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
