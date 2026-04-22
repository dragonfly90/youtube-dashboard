import './style.css';
import preloadedData from './data/preloaded.json';
import { refreshChartTheme } from './utils/charts.js';
import { checkOllamaAvailable } from './llm.js';
import { initAuth, signOut, onAuthChange, getCurrentUser } from './auth.js';
import { initFirestore, loadUserData, saveUserData, cancelPendingSave } from './firestore.js';

// ============================================================
// State management
// ============================================================
const state = {
  data: preloadedData,
  dataSource: 'preloaded',       // 'preloaded' | 'uploaded' | 'uploaded-llm'
  activeCluster: null,
  currentSection: 'overview',
  clusterMeta: null,             // {id: {id, label, emoji, color}} — null for preloaded
  llmRecommendations: null,      // {youtube, bilibili, reddit, ...} — null for preloaded
};

// Listeners are keyed by section name so we can clean them up on re-render
const globalListeners = [];
const sectionListeners = new Map(); // section -> [fn, ...]

export function getState() { return state; }

const PERSIST_KEYS = ['data', 'dataSource', 'clusterMeta', 'llmRecommendations'];

export function setState(patch) {
  const dataChanged = 'data' in patch && patch.data !== state.data;
  Object.assign(state, patch);

  if (dataChanged) {
    // Full re-render: clear all sections and listeners
    sectionListeners.clear();
    sectionRendered.clear();
    sectionNames.forEach(s => {
      document.getElementById(`section-${s}`).innerHTML = '';
    });
    showSection(state.currentSection);
  } else {
    // Notify section listeners (for activeCluster changes, etc.)
    for (const [, fns] of sectionListeners) {
      fns.forEach(fn => fn(state));
    }
  }

  // Persist to Firestore if any persistable key changed
  if (PERSIST_KEYS.some(k => k in patch)) {
    const user = getCurrentUser();
    if (user) {
      saveUserData(user.uid, {
        data: state.data,
        dataSource: state.dataSource,
        clusterMeta: state.clusterMeta,
        llmRecommendations: state.llmRecommendations,
      });
    }
  }
}

/**
 * Register a listener for the current section being rendered.
 * Listeners are auto-cleaned when the section re-renders.
 */
export function onStateChange(fn) {
  const section = state.currentSection;
  if (!sectionListeners.has(section)) sectionListeners.set(section, []);
  sectionListeners.get(section).push(fn);
}

// ============================================================
// Section lazy-loading & rendering
// ============================================================
const sectionModules = {};
const sectionRendered = new Set();

async function loadSection(name) {
  if (!sectionModules[name]) {
    const mod = await ({
      overview: () => import('./sections/overview.js'),
      timeline: () => import('./sections/timeline.js'),
      clusters: () => import('./sections/clusters.js'),
      channels: () => import('./sections/channels.js'),
      trends:   () => import('./sections/trends.js'),
      recs:     () => import('./sections/recs.js'),
    }[name]?.());
    sectionModules[name] = mod;
  }
  return sectionModules[name];
}

const sectionNames = ['overview', 'timeline', 'clusters', 'channels', 'trends', 'recs'];
const renderFnMap = {
  overview: 'renderOverview',
  timeline: 'renderTimeline',
  clusters: 'renderClusters',
  channels: 'renderChannels',
  trends:   'renderTrends',
  recs:     'renderRecs',
};

async function showSection(name) {
  if (!sectionNames.includes(name)) name = 'overview';
  state.currentSection = name;

  // Toggle active class on sections
  sectionNames.forEach(s => {
    const el = document.getElementById(`section-${s}`);
    el.classList.toggle('active', s === name);
  });

  // Toggle active nav link
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.section === name);
  });

  // Lazy-render on first visit
  if (!sectionRendered.has(name)) {
    // Clean old listeners for this section
    sectionListeners.delete(name);

    const mod = await loadSection(name);
    const container = document.getElementById(`section-${name}`);
    const fn = mod[renderFnMap[name]];
    if (fn) fn(container);
    sectionRendered.add(name);
  }

  // Close mobile nav
  document.querySelector('.nav-links')?.classList.remove('open');
}

// ============================================================
// Hash-based routing
// ============================================================
function handleHash() {
  const hash = location.hash.replace('#', '') || 'overview';
  showSection(hash);
}

window.addEventListener('hashchange', handleHash);

// ============================================================
// Nav toggle (mobile)
// ============================================================
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ============================================================
// Theme toggle
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const stored = localStorage.getItem('theme');
if (stored) document.documentElement.dataset.theme = stored;

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  setTimeout(() => refreshChartTheme(), 50);
});

// ============================================================
// Auth-gated init
// ============================================================
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut();
});

// Listen for auth state changes after initial load (e.g. login from auth screen)
onAuthChange(async (user) => {
  if (user) {
    document.getElementById('main-nav').style.display = 'flex';
    document.getElementById('app').style.display = 'block';
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('user-email').textContent = user.email;

    // Load persisted data for this user
    const saved = await loadUserData(user.uid);
    if (saved && saved.data) {
      // Apply directly to avoid save-back loop
      Object.assign(state, saved);
      // Clear rendered sections for full re-render
      sectionListeners.clear();
      sectionRendered.clear();
      sectionNames.forEach(s => {
        document.getElementById(`section-${s}`).innerHTML = '';
      });
    }

    handleHash();
    checkOllamaAvailable();
  } else {
    // Sign-out: cancel pending saves and reset to preloaded
    cancelPendingSave();
    Object.assign(state, {
      data: preloadedData,
      dataSource: 'preloaded',
      clusterMeta: null,
      llmRecommendations: null,
      activeCluster: null,
    });
    sectionListeners.clear();
    sectionRendered.clear();
    sectionNames.forEach(s => {
      document.getElementById(`section-${s}`).innerHTML = '';
    });
  }
});

(async () => {
  const user = await initAuth();
  initFirestore();
  if (user) {
    const saved = await loadUserData(user.uid);
    if (saved && saved.data) {
      Object.assign(state, saved);
      sectionListeners.clear();
      sectionRendered.clear();
      sectionNames.forEach(s => {
        document.getElementById(`section-${s}`).innerHTML = '';
      });
    }
    handleHash();
    checkOllamaAvailable();
  }
})();
