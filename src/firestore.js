import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getApp } from './auth.js';

let db;

export function initFirestore() {
  const app = getApp();
  if (!app) {
    console.warn('Firestore: Firebase app not available');
    return;
  }
  db = getFirestore(app, 'youtubewatchhistory');
}

/**
 * Load saved analysis for a user.
 * Returns { data, dataSource, clusterMeta, llmRecommendations } or null.
 */
export async function loadUserData(uid) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'analysis', 'current'));
    if (!snap.exists()) return null;
    const d = snap.data();
    console.log('Firestore: loaded user analysis');
    return {
      data: d.data ?? null,
      dataSource: d.dataSource ?? 'uploaded',
      clusterMeta: d.clusterMeta ?? null,
      llmRecommendations: d.llmRecommendations ?? null,
    };
  } catch (err) {
    console.error('Firestore: load failed', err);
    return null;
  }
}

// ── Debounced save ──────────────────────────────────────────
let saveTimer = null;
const DEBOUNCE_MS = 2000;

/**
 * Save user analysis to Firestore (debounced).
 * Skips if dataSource is 'preloaded'.
 */
export function saveUserData(uid, fields) {
  if (!db) return;
  if (fields.dataSource === 'preloaded') return;

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const payload = {
        data: fields.data,
        dataSource: fields.dataSource,
        clusterMeta: fields.clusterMeta ?? null,
        llmRecommendations: fields.llmRecommendations ?? null,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', uid, 'analysis', 'current'), payload);
      console.log('Firestore: saved user analysis');
    } catch (err) {
      console.error('Firestore: save failed', err);
    }
  }, DEBOUNCE_MS);
}

export function cancelPendingSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
}

// ── Gemini API key persistence ──────────────────────────────

export async function loadGeminiApiKey(uid) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'settings', 'current'));
    return snap.exists() ? (snap.data().geminiApiKey ?? null) : null;
  } catch (err) {
    console.error('Firestore: failed to load Gemini API key', err);
    return null;
  }
}

export async function saveGeminiApiKey(uid, key) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'users', uid, 'settings', 'current'), { geminiApiKey: key }, { merge: true });
    console.log('Firestore: saved Gemini API key');
  } catch (err) {
    console.error('Firestore: failed to save Gemini API key', err);
  }
}
