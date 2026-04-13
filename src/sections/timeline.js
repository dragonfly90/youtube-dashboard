import { getState, onStateChange } from '../main.js';
import { createBarChart } from '../utils/charts.js';

let chart = null;

export function renderTimeline(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2>Timeline</h2>
      <p>Monthly watch volume over time</p>
    </div>
    <div class="chart-container" style="height:400px">
      <canvas id="timeline-chart"></canvas>
    </div>
    <div id="yearly-summary" style="margin-top:1rem"></div>
  `;

  draw();
  onStateChange(draw);
}

function draw() {
  const data = getState().data;
  if (!data?.monthly) return;

  const canvas = document.getElementById('timeline-chart');
  const labels = data.monthly.map(m => m.month);
  const values = data.monthly.map(m => m.count);

  chart = createBarChart(canvas, labels, values, { color: '#6366f1', label: 'Videos watched' });

  // Yearly summary
  const yearly = {};
  data.monthly.forEach(m => {
    const year = m.month.slice(0, 4);
    yearly[year] = (yearly[year] || 0) + m.count;
  });

  const summary = document.getElementById('yearly-summary');
  summary.innerHTML = `
    <div class="card-grid">
      ${Object.entries(yearly).map(([year, count]) => `
        <div class="card stat-card">
          <div class="stat-value">${count.toLocaleString()}</div>
          <div class="stat-label">${year}</div>
        </div>
      `).join('')}
    </div>
  `;
}
