import { getState, onStateChange } from '../main.js';
import { CLUSTER_MAP } from '../classifier.js';
import { drawSparkline } from '../utils/charts.js';

export function renderTrends(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2>Trends</h2>
      <p>Rising and fading interests based on last 90 days vs. all-time share</p>
    </div>
    <div class="trend-grid" id="trend-grid"></div>
  `;

  draw();
  onStateChange(draw);
}

function draw() {
  const data = getState().data;
  if (!data?.clusters) return;

  const total = data.totalVideos;
  const totalRecent = data.clusters.reduce((s, c) => s + c.recent90d, 0);
  const grid = document.getElementById('trend-grid');

  // Skip "other" cluster for trends
  const clusters = data.clusters.filter(c => c.id !== 'other');

  grid.innerHTML = clusters.map(c => {
    const meta = CLUSTER_MAP[c.id] || {};
    const allTimeShare = total > 0 ? (c.count / total) : 0;
    const recentShare = totalRecent > 0 ? (c.recent90d / totalRecent) : 0;

    // Determine trend
    let trend = 'stable';
    let trendLabel = 'Stable';
    if (recentShare > allTimeShare * 1.3 && c.recent90d >= 5) {
      trend = 'rising';
      trendLabel = 'Rising';
    } else if (recentShare < allTimeShare * 0.7 && c.count >= 20) {
      trend = 'fading';
      trendLabel = 'Fading';
    }

    // Get last 6 months of sparkline data
    const monthly = c.monthly || [];
    const last6 = monthly.slice(-6).map(m => m.count);

    const canvasId = `sparkline-${c.id}`;

    return `
      <div class="card trend-card">
        <span class="trend-badge ${trend}">${trendLabel}</span>
        <div class="trend-header">
          <span class="trend-emoji">${meta.emoji || ''}</span>
          <span class="trend-label">${c.label}</span>
        </div>
        <div class="trend-stats">
          <span>All-time: <strong>${c.count.toLocaleString()}</strong> (${(allTimeShare * 100).toFixed(1)}%)</span>
          <span>Last 90d: <strong>${c.recent90d.toLocaleString()}</strong> (${(recentShare * 100).toFixed(1)}%)</span>
        </div>
        <div class="sparkline-container">
          <canvas id="${canvasId}"></canvas>
        </div>
      </div>
    `;
  }).join('');

  // Draw sparklines after DOM is set
  requestAnimationFrame(() => {
    clusters.forEach(c => {
      const canvas = document.getElementById(`sparkline-${c.id}`);
      if (!canvas) return;
      const monthly = c.monthly || [];
      const last6 = monthly.slice(-6).map(m => m.count);
      const color = CLUSTER_MAP[c.id]?.color || '#94a3b8';
      drawSparkline(canvas, last6, color);
    });
  });
}
