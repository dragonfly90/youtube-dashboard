import { getState, onStateChange } from '../main.js';
import { getLlmStatus, onLlmStatusChange, setGeminiApiKey, checkLlmAvailable } from '../llm.js';
import { saveGeminiApiKey } from '../firestore.js';
import { getCurrentUser } from '../auth.js';
import { runLlmPipeline } from '../llm-pipeline.js';

let llmEnabled = true; // user toggle, default on

export function renderOverview(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2>Overview</h2>
      <p>Your YouTube watch history at a glance</p>
    </div>
    <div id="data-source-indicator"></div>
    <div class="card-grid" id="stat-cards"></div>
    <div id="llm-status-area"></div>
    <div class="upload-zone" id="upload-zone">
      <div class="upload-icon">📁</div>
      <div class="upload-title">Upload your own Takeout data</div>
      <div class="upload-hint">
        Drag & drop your <code>watch-history.html</code> or click to browse<br>
        <small>Google Takeout &rarr; YouTube &rarr; History</small>
      </div>
      <input type="file" id="file-input" accept=".html" hidden />
    </div>
    <div class="upload-progress" id="upload-progress">
      <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
      <div class="progress-text" id="progress-text">Parsing...</div>
    </div>
  `;

  updateStats();
  onStateChange(updateStats);
  updateLlmStatus(getLlmStatus());
  onLlmStatusChange(updateLlmStatus);
  setupUpload();
}

function updateLlmStatus(status) {
  const area = document.getElementById('llm-status-area');
  if (!area) return;

  if (status === 'checking') {
    area.innerHTML = `
      <div class="llm-status llm-checking">
        <span class="llm-spinner"></span>
        <span>Checking for AI availability...</span>
      </div>
    `;
  } else if (status === 'available') {
    area.innerHTML = `
      <div class="llm-status llm-available">
        <span class="llm-dot available"></span>
        <span>Local AI available (Gemma 4 via Ollama)</span>
        <label class="llm-toggle">
          <input type="checkbox" id="llm-toggle-input" ${llmEnabled ? 'checked' : ''} />
          <span class="llm-toggle-slider"></span>
          <span class="llm-toggle-label">Use AI-powered classification</span>
        </label>
      </div>
    `;
    document.getElementById('llm-toggle-input')?.addEventListener('change', (e) => {
      llmEnabled = e.target.checked;
    });
  } else if (status === 'cloud') {
    area.innerHTML = `
      <div class="llm-status llm-available">
        <span class="llm-dot available"></span>
        <span>Cloud AI available (Gemma via Google AI Studio)</span>
        <label class="llm-toggle">
          <input type="checkbox" id="llm-toggle-input" ${llmEnabled ? 'checked' : ''} />
          <span class="llm-toggle-slider"></span>
          <span class="llm-toggle-label">Use AI-powered classification</span>
        </label>
      </div>
    `;
    document.getElementById('llm-toggle-input')?.addEventListener('change', (e) => {
      llmEnabled = e.target.checked;
    });
  } else if (status === 'unavailable') {
    area.innerHTML = `
      <div class="llm-status llm-unavailable">
        <span class="llm-dot unavailable"></span>
        <span>No AI detected &mdash; using keyword classification</span>
        <div class="gemini-key-input">
          <input type="password" id="gemini-key-field" placeholder="Enter Google AI Studio API key" />
          <button class="btn btn-primary btn-sm" id="gemini-key-save">Save</button>
        </div>
        <small class="gemini-key-hint">Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a></small>
      </div>
    `;
    document.getElementById('gemini-key-save')?.addEventListener('click', async () => {
      const input = document.getElementById('gemini-key-field');
      const key = input?.value.trim();
      if (!key) return;
      setGeminiApiKey(key);
      const user = getCurrentUser();
      if (user) await saveGeminiApiKey(user.uid, key);
      await checkLlmAvailable();
    });
  }
}

function showLlmProgress(msg) {
  const area = document.getElementById('llm-status-area');
  if (!area) return;
  area.innerHTML = `
    <div class="llm-status llm-working">
      <span class="llm-spinner"></span>
      <span>${msg}</span>
    </div>
  `;
}

function updateStats() {
  const data = getState().data;
  if (!data) return;

  const indicator = document.getElementById('data-source-indicator');
  if (!indicator) return;
  const source = getState().dataSource;
  let sourceLabel = '📦 Pre-loaded data';
  if (source === 'uploaded-llm') sourceLabel = '🤖 Uploaded data (AI-classified)';
  else if (source === 'uploaded') sourceLabel = '📤 Uploaded data';
  indicator.innerHTML = `<span class="data-source">${sourceLabel}</span>`;

  const cards = document.getElementById('stat-cards');
  if (!cards) return;
  cards.innerHTML = `
    <div class="card stat-card">
      <div class="stat-value">${data.totalVideos.toLocaleString()}</div>
      <div class="stat-label">Total Videos</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.dateRange.earliest}<br><small style="font-size:0.5em;color:var(--text-muted)">to</small><br>${data.dateRange.latest}</div>
      <div class="stat-label">Date Range</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.avgPerDay}</div>
      <div class="stat-label">Avg / Day</div>
    </div>
    <div class="card stat-card">
      <div class="stat-value">${data.uniqueChannels.toLocaleString()}</div>
      <div class="stat-label">Unique Channels</div>
    </div>
  `;
}

function setupUpload() {
  const zone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const progressWrap = document.getElementById('upload-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    const status = getLlmStatus();
    const useLlm = llmEnabled && (status === 'available' || status === 'cloud');

    progressWrap.classList.add('active');
    progressFill.style.width = '10%';
    progressText.textContent = `Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)...`;

    const reader = new FileReader();
    reader.onprogress = e => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 40) + 10;
        progressFill.style.width = pct + '%';
      }
    };
    reader.onload = () => {
      progressFill.style.width = '50%';
      progressText.textContent = 'Parsing watch history...';

      const worker = new Worker(
        new URL('../parser.worker.js', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = e => {
        if (e.data.type === 'progress') {
          const pct = 50 + Math.round(e.data.pct * 0.45);
          progressFill.style.width = pct + '%';
          progressText.textContent = e.data.msg;
        } else if (e.data.type === 'done-raw' && useLlm) {
          // LLM path: got raw videos, run pipeline
          worker.terminate();
          progressFill.style.width = '95%';
          progressText.textContent = `Parsed ${e.data.videos.length.toLocaleString()} videos. Starting AI analysis...`;

          import('../main.js').then(({ setState }) => {
            runLlmPipeline(
              e.data.videos,
              ({ stage, message }) => {
                showLlmProgress(message);
                progressText.textContent = message;
              },
              setState
            ).then(success => {
              if (!success) {
                // LLM failed, fall back to full worker parse
                fallbackToKeywordClassification(reader.result, progressWrap, progressFill, progressText);
              } else {
                progressFill.style.width = '100%';
                progressText.textContent = 'AI analysis complete!';
                updateLlmStatus('available');
                setTimeout(() => {
                  progressWrap.classList.remove('active');
                  progressFill.style.width = '0%';
                }, 2000);
              }
            }).catch(() => {
              fallbackToKeywordClassification(reader.result, progressWrap, progressFill, progressText);
            });
          });
        } else if (e.data.type === 'done') {
          // Standard keyword classification path
          progressFill.style.width = '100%';
          progressText.textContent = `Done! Parsed ${e.data.result.totalVideos.toLocaleString()} videos.`;
          worker.terminate();

          import('../main.js').then(({ setState }) => {
            setState({ data: e.data.result, dataSource: 'uploaded', clusterMeta: null, llmRecommendations: null });
          });

          setTimeout(() => {
            progressWrap.classList.remove('active');
            progressFill.style.width = '0%';
          }, 2000);
        } else if (e.data.type === 'error') {
          progressText.textContent = 'Error: ' + e.data.msg;
          progressFill.style.width = '0%';
          worker.terminate();
        }
      };

      // Send to worker: parse-only if LLM, full otherwise
      worker.postMessage({ html: reader.result, mode: useLlm ? 'parse-only' : 'full' });
    };
    reader.readAsText(file);
  }
}

function fallbackToKeywordClassification(html, progressWrap, progressFill, progressText) {
  progressText.textContent = 'AI unavailable, using keyword classification...';
  const worker = new Worker(
    new URL('../parser.worker.js', import.meta.url),
    { type: 'module' }
  );
  worker.onmessage = e => {
    if (e.data.type === 'progress') {
      progressText.textContent = e.data.msg;
    } else if (e.data.type === 'done') {
      progressFill.style.width = '100%';
      progressText.textContent = `Done! Parsed ${e.data.result.totalVideos.toLocaleString()} videos.`;
      worker.terminate();
      import('../main.js').then(({ setState }) => {
        setState({ data: e.data.result, dataSource: 'uploaded', clusterMeta: null, llmRecommendations: null });
      });
      setTimeout(() => {
        progressWrap.classList.remove('active');
        progressFill.style.width = '0%';
      }, 2000);
    } else if (e.data.type === 'error') {
      progressText.textContent = 'Error: ' + e.data.msg;
      worker.terminate();
    }
  };
  worker.postMessage({ html, mode: 'full' });
}
