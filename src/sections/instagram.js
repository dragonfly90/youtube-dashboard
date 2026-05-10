import { getState, setState, onStateChange } from '../main.js';
import { createDoughnut, createBarChart } from '../utils/charts.js';

const TYPE_COLORS = {
  like:        '#E1306C',
  story_like:  '#F77737',
  story_view:  '#FCAF45',
  thread_view: '#833AB4',
  comment:     '#405DE6',
  reel:        '#C13584',
  your_post:   '#5B51D8',
  post_view:   '#FD1D1D',
  video_watch: '#F56040',
};

export function renderInstagram(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2>Instagram</h2>
      <p>Analyze your Instagram data export</p>
    </div>
    <div id="ig-stats" class="card-grid" style="margin-bottom:1rem"></div>
    <div id="ig-upload-area">
      <div class="upload-zone ig-upload-zone" id="ig-upload-zone">
        <div class="upload-icon">📷</div>
        <div class="upload-title">Upload Instagram data export</div>
        <div class="upload-hint">
          Drag & drop your Instagram HTML files or click to browse<br>
          <small>Meta Account Center &rarr; Download your information &rarr; HTML format</small>
        </div>
        <input type="file" id="ig-file-input" accept=".html" multiple hidden />
      </div>
      <div class="upload-progress" id="ig-upload-progress">
        <div class="progress-bar"><div class="progress-fill" id="ig-progress-fill"></div></div>
        <div class="progress-text" id="ig-progress-text">Parsing...</div>
      </div>
    </div>
    <div id="ig-charts" style="display:none">
      <div class="chart-row" style="margin-top:1rem">
        <div class="chart-container" style="height:300px">
          <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Interaction Types</h3>
          <canvas id="ig-type-chart"></canvas>
        </div>
        <div class="chart-container" style="height:300px">
          <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Monthly Timeline</h3>
          <canvas id="ig-timeline-chart"></canvas>
        </div>
      </div>
      <div style="margin-top:1rem">
        <h3 style="font-size:0.95rem;margin-bottom:0.5rem">Top Accounts (Anonymized)</h3>
        <div class="table-wrap" id="ig-accounts-table"></div>
      </div>
    </div>
  `;

  draw();
  onStateChange(draw);
  setupUpload();
}

function draw() {
  const data = getState().instagramData;
  const statsEl = document.getElementById('ig-stats');
  const chartsEl = document.getElementById('ig-charts');
  const uploadArea = document.getElementById('ig-upload-area');
  if (!statsEl) return;

  if (!data) {
    statsEl.innerHTML = '';
    if (chartsEl) chartsEl.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    return;
  }

  // Show upload area even when data exists (for re-upload)
  if (uploadArea) uploadArea.style.display = 'block';

  // Stats cards
  statsEl.innerHTML = `
    <div class="card stat-card">
      <div class="stat-value">${data.totalInteractions.toLocaleString()}</div>
      <div class="stat-label">Total Interactions</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.dateRange.earliest}<br><small style="font-size:0.5em;color:var(--text-muted)">to</small><br>${data.dateRange.latest}</div>
      <div class="stat-label">Date Range</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.uniqueAccounts.toLocaleString()}</div>
      <div class="stat-label">Unique Accounts</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.followers || 0} / ${data.following || 0}</div>
      <div class="stat-label">Followers / Following</div>
    </div>
  `;

  // Charts
  if (chartsEl) {
    chartsEl.style.display = 'block';

    // Interaction type doughnut
    if (data.byType && data.byType.length > 0) {
      const typeCanvas = document.getElementById('ig-type-chart');
      const labels = data.byType.map(t => t.label);
      const counts = data.byType.map(t => t.count);
      const colors = data.byType.map(t => TYPE_COLORS[t.type] || '#888');
      createDoughnut(typeCanvas, labels, counts, colors);
    }

    // Monthly timeline bar chart
    if (data.monthly && data.monthly.length > 0) {
      const timeCanvas = document.getElementById('ig-timeline-chart');
      const labels = data.monthly.map(m => m.month);
      const counts = data.monthly.map(m => m.count);
      createBarChart(timeCanvas, labels, counts, { color: '#E1306C', label: 'Interactions' });
    }

    // Top accounts table
    if (data.topAccounts && data.topAccounts.length > 0) {
      const tableEl = document.getElementById('ig-accounts-table');
      const typeKeys = [...new Set(data.topAccounts.flatMap(a => Object.keys(a.types)))];
      tableEl.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Account</th>
              <th>Total</th>
              ${typeKeys.map(k => `<th><span class="ig-type-badge" style="background:${(TYPE_COLORS[k] || '#888')}22;color:${TYPE_COLORS[k] || '#888'}">${k.replace(/_/g, ' ')}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.topAccounts.map((a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${a.name}</td>
                <td><strong>${a.count}</strong></td>
                ${typeKeys.map(k => `<td>${a.types[k] || 0}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }
}

function setupUpload() {
  const zone = document.getElementById('ig-upload-zone');
  const fileInput = document.getElementById('ig-file-input');
  const progressWrap = document.getElementById('ig-upload-progress');
  const progressFill = document.getElementById('ig-progress-fill');
  const progressText = document.getElementById('ig-progress-text');
  if (!zone || !fileInput) return;

  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFiles(Array.from(e.dataTransfer.files));
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFiles(Array.from(fileInput.files));
  });

  function handleFiles(fileList) {
    progressWrap.classList.add('active');
    progressFill.style.width = '5%';
    progressText.textContent = `Reading ${fileList.length} file(s)...`;

    const readers = fileList.map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, html: reader.result });
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsText(file);
      })
    );

    Promise.all(readers).then(files => {
      progressFill.style.width = '30%';
      progressText.textContent = 'Parsing Instagram data...';

      const worker = new Worker(
        new URL('../instagram-parser.worker.js', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = ev => {
        if (ev.data.type === 'progress') {
          const pct = 30 + Math.round(ev.data.pct * 0.65);
          progressFill.style.width = pct + '%';
          progressText.textContent = ev.data.msg;
        } else if (ev.data.type === 'done') {
          progressFill.style.width = '100%';
          progressText.textContent = `Done! ${ev.data.result.totalInteractions} interactions found.`;
          worker.terminate();

          setState({ instagramData: ev.data.result });

          setTimeout(() => {
            progressWrap.classList.remove('active');
            progressFill.style.width = '0%';
          }, 2000);
        } else if (ev.data.type === 'error') {
          progressText.textContent = 'Error: ' + ev.data.msg;
          progressFill.style.width = '0%';
          worker.terminate();
        }
      };

      worker.postMessage({ files });
    }).catch(err => {
      progressText.textContent = 'Error reading files: ' + err.message;
      progressFill.style.width = '0%';
    });
  }
}
