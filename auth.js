// ============================================
//   MOBIFLIX LOGIN SYSTEM
//   Palitan mo lang yung USERS array para
//   magdagdag / magpalit ng username & password
// ============================================

// 👇 DITO MO ILALAGAY YUNG MGA USERNAME AT PASSWORD
const USERS = [
  { username: 'admin', password: 'mobiflix2026' }
];

// Ilang araw bago ma-expire yung login session
const SESSION_DAYS = 30;

// ============================================
//   HUWAG NANG GALAWIN ANG NASA IBABA
// ============================================

const AUTH_KEY = 'mobiflix_auth_session';
const AUTH_TIME_KEY = 'mobiflix_auth_time';

function isLoggedIn() {
  const session = localStorage.getItem(AUTH_KEY);
  const time = localStorage.getItem(AUTH_TIME_KEY);
  if (!session || !time) return false;

  const now = Date.now();
  const elapsed = now - parseInt(time, 10);
  const maxAge = SESSION_DAYS * 24 * 60 * 60 * 1000;

  if (elapsed > maxAge) {
    logout();
    return false;
  }
  return true;
}

function login(username, password) {
  const user = USERS.find(function(u) {
    return u.username === username && u.password === password;
  });

  if (!user) return false;

  localStorage.setItem(AUTH_KEY, JSON.stringify({
    username: user.username,
    loginAt: Date.now()
  }));
  localStorage.setItem(AUTH_TIME_KEY, Date.now().toString());
  return true;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_TIME_KEY);
}

function showLoginScreen() {
  const screen = document.getElementById('login-screen');
  if (screen) screen.style.display = 'flex';
  document.body.classList.add('locked');
  const app = document.getElementById('app-content');
  if (app) app.style.display = 'none';
}

function hideLoginScreen() {
  const screen = document.getElementById('login-screen');
  if (screen) screen.style.display = 'none';
  document.body.classList.remove('locked');
  const app = document.getElementById('app-content');
  if (app) app.style.display = '';
}

function handleLogout() {
  if (confirm('Sigurado ka bang gusto mong mag-log out?')) {
    logout();
    showLoginScreen();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (isLoggedIn()) {
    hideLoginScreen();
  } else {
    showLoginScreen();
  }

  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');

      if (!username || !password) {
        errorEl.textContent = 'Ilagay ang username at password.';
        errorEl.style.display = 'block';
        return;
      }

      if (login(username, password)) {
        errorEl.style.display = 'none';
        hideLoginScreen();
      } else {
        errorEl.textContent = 'Mali ang username o password. Subukan muli.';
        errorEl.style.display = 'block';
        document.getElementById('login-password').value = '';
      }
    });
  }
});