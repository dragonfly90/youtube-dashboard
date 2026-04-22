import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmSODiVh-0RysgNA2GaiYrm8Yrir37BbA",
  authDomain: "agentcontentrec.firebaseapp.com",
  projectId: "agentcontentrec",
  storageBucket: "agentcontentrec.firebasestorage.app",
  messagingSenderId: "800010180680",
  appId: "1:800010180680:web:bc62e326c9557c5190607d",
};

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.error('Firebase init failed:', e);
}

/**
 * Wait for the first auth state resolution.
 * Returns the current user (or null).
 * Also wires up the auth-screen UI if no user is signed in.
 */
export function initAuth() {
  return new Promise((resolve) => {
    if (!auth) {
      showAuthScreen('Firebase initialization failed. Please check the console for errors.');
      resolve(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        showApp(user);
      } else {
        showAuthScreen();
      }
      resolve(user);
    });
  });
}

/**
 * Listen for future auth state changes (login/logout after initial load).
 */
export function onAuthChange(callback) {
  if (!auth) return;
  onAuthStateChanged(auth, callback);
}

export function getApp() { return app; }

export function getCurrentUser() {
  return auth?.currentUser ?? null;
}

export async function signOut() {
  if (!auth) return;
  await firebaseSignOut(auth);
  hideApp();
  showAuthScreen();
}

// ── UI helpers ──────────────────────────────────────────────

function showApp(user) {
  const authScreen = document.getElementById('auth-screen');
  const nav = document.getElementById('main-nav');
  const app = document.getElementById('app');
  const userEmail = document.getElementById('user-email');

  if (authScreen) authScreen.style.display = 'none';
  if (nav) nav.style.display = 'flex';
  if (app) app.style.display = 'block';
  if (userEmail) userEmail.textContent = user.email;
}

function hideApp() {
  const nav = document.getElementById('main-nav');
  const app = document.getElementById('app');
  if (nav) nav.style.display = 'none';
  if (app) app.style.display = 'none';
}

function showAuthScreen(configError) {
  const authScreen = document.getElementById('auth-screen');
  if (!authScreen) return;

  hideApp();
  authScreen.style.display = 'flex';

  if (configError) {
    authScreen.innerHTML = `
      <div class="auth-card">
        <h2 class="auth-title">Configuration Required</h2>
        <p class="auth-error" style="display:block">${configError}</p>
      </div>`;
    return;
  }

  renderAuthForm(authScreen);
}

function renderAuthForm(container) {
  container.innerHTML = `
    <div class="auth-card">
      <h2 class="auth-title">YouTube Interest Dashboard</h2>
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Sign In</button>
        <button class="auth-tab" data-tab="register">Register</button>
      </div>
      <form id="auth-form" autocomplete="on">
        <input id="auth-email" class="auth-input" type="email" placeholder="Email" required autocomplete="email" />
        <input id="auth-password" class="auth-input" type="password" placeholder="Password" required autocomplete="current-password" />
        <p id="auth-error" class="auth-error"></p>
        <button type="submit" class="btn btn-primary auth-btn" id="auth-submit">Sign In</button>
      </form>
    </div>`;

  let mode = 'login';

  container.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      mode = tab.dataset.tab;
      container.querySelectorAll('.auth-tab').forEach((t) => t.classList.toggle('active', t === tab));
      const submitBtn = container.querySelector('#auth-submit');
      submitBtn.textContent = mode === 'login' ? 'Sign In' : 'Register';
      const pwInput = container.querySelector('#auth-password');
      pwInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
      container.querySelector('#auth-error').textContent = '';
    });
  });

  container.querySelector('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#auth-email').value.trim();
    const password = container.querySelector('#auth-password').value;
    const errorEl = container.querySelector('#auth-error');
    const submitBtn = container.querySelector('#auth-submit');

    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'login' ? 'Signing in...' : 'Registering...';

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in main.js will handle showing the app
    } catch (err) {
      const msg = friendlyError(err.code);
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'login' ? 'Sign In' : 'Register';
    }
  });
}

function friendlyError(code) {
  const map = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return map[code] || 'Authentication failed. Please try again.';
}
