import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/** Default dark/light aware colors */
function getGridColor() {
  return document.documentElement.dataset.theme === 'light'
    ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
}
function getTextColor() {
  return document.documentElement.dataset.theme === 'light'
    ? '#374151' : '#9ca3af';
}

/** Destroy existing chart on a canvas before re-creating */
function clearCanvas(canvas) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
}

/** Create a vertical bar chart (e.g. monthly timeline) */
export function createBarChart(canvas, labels, data, { color = '#6366f1', label = 'Videos', onClick } = {}) {
  clearCanvas(canvas);
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: color + 'cc',
        borderColor: color,
        borderWidth: 1,
        borderRadius: 3,
        maxBarThickness: 40,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: onClick || undefined,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 8,
          cornerRadius: 6,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: getTextColor(), font: { size: 11 }, maxRotation: 45 },
        },
        y: {
          grid: { color: getGridColor() },
          ticks: { color: getTextColor(), font: { size: 11 } },
          beginAtZero: true,
        },
      },
    },
  });
}

/** Create a horizontal bar chart (e.g. cluster counts) */
export function createHorizontalBar(canvas, labels, data, colors, { onClick } = {}) {
  clearCanvas(canvas);
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 3,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      onClick: onClick || undefined,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: getGridColor() },
          ticks: { color: getTextColor(), font: { size: 11 } },
          beginAtZero: true,
        },
        y: {
          grid: { display: false },
          ticks: { color: getTextColor(), font: { size: 11 } },
        },
      },
    },
  });
}

/** Create a doughnut chart */
export function createDoughnut(canvas, labels, data, colors, { onClick } = {}) {
  clearCanvas(canvas);
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: onClick || undefined,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getTextColor(),
            font: { size: 11 },
            padding: 12,
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 8,
          cornerRadius: 6,
          callbacks: {
            label(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/** Tiny sparkline (used in trend cards) - draws on a small canvas */
export function drawSparkline(canvas, data, color = '#6366f1') {
  clearCanvas(canvas);
  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false, beginAtZero: true },
      },
    },
  });
}

/** Force all charts to update colors (after theme toggle) */
export function refreshChartTheme() {
  for (const id of Object.keys(Chart.instances)) {
    const chart = Chart.instances[id];
    if (!chart?.options?.scales) continue;
    const { x, y } = chart.options.scales;
    if (x) {
      if (x.grid) x.grid.color = getGridColor();
      if (x.ticks) x.ticks.color = getTextColor();
    }
    if (y) {
      if (y.grid) y.grid.color = getGridColor();
      if (y.ticks) y.ticks.color = getTextColor();
    }
    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = getTextColor();
    }
    chart.update('none');
  }
}
