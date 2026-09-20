const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const IMG_PROFILE = 'https://image.tmdb.org/t/p/w185';

// ===== STORAGE KEYS =====
const HISTORY_KEY = 'mobiflix_watch_history';
const THEME_KEY = 'mobiflix_theme';
const NOTIF_KEY = 'mobiflix_notifications';
const NOTIF_ENABLED_KEY = 'mobiflix_notif_enabled';
const CONTINUE_KEY = 'mobiflix_continue_watching';
const EPISODE_PROGRESS_KEY = 'mobiflix_episode_progress';
const MAX_HISTORY = 30;
const MAX_CONTINUE = 10;

// ===== KOREAN ONLY CONFIG =====
const KOREAN_COUNTRY = 'KR';
const KOREAN_LANG = 'ko';

// EXCLUDED: Reality, Talk, News, Soap, Documentary, Music, Animation, TV Movie
const EXCLUDED_GENRES = '10764,10767,10763,10766,99,10402,16,10770';

// ===== CUSTOM GENRE DEFINITIONS (11 lang) =====
const CUSTOM_GENRES = [
  { key: 'thriller',     name: 'Thriller',     icon: '😱', type: 'single', id: 53,     media: 'both' },
  { key: 'crime',        name: 'Crime',        icon: '🕵️', type: 'single', id: 80,     media: 'both' },
  { key: 'mystery',      name: 'Mystery',      icon: '🔍', type: 'single', id: 9648,   media: 'both' },
  { key: 'drama',        name: 'Drama',        icon: '🎭', type: 'single', id: 18,     media: 'both' },
  { key: 'melodrama',    name: 'Melodrama',    icon: '💧', type: 'and',    ids: [18, 10749], media: 'both' },
  { key: 'romcom',       name: 'Rom-Com',      icon: '💕', type: 'and',    ids: [35, 10749], media: 'both' },
  { key: 'action',       name: 'Action',       icon: '💥', type: 'single', idMovie: 28, idTv: 10759, media: 'both' },
  { key: 'noir',         name: 'Noir',         icon: '🌑', type: 'and',    ids: [80, 53],    media: 'both' },
  { key: 'horror',       name: 'Horror',       icon: '👻', type: 'single', id: 27,     media: 'both' },
  { key: 'supernatural', name: 'Supernatural', icon: '✨', type: 'and',    ids: [14, 9648],  media: 'both' },
  { key: 'history',      name: 'History',      icon: '📜', type: 'single', id: 36,     media: 'both' }
];

// ===== STREAMING PROVIDERS (3 lang) =====
const STREAMING_PROVIDERS = [
  { name: 'Netflix',  id: 8,   type: 'provider', color: '#e50914' },
  { name: 'Disney+',  id: 337, type: 'provider', color: '#113ccf' },
  { name: 'Viu',      id: 158, type: 'provider', color: '#f7c948' }
];

const PROVIDER_LOGOS = {
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'Viu':     'https://upload.wikimedia.org/wikipedia/commons/6/6b/Viu_logo.svg'
};

let currentItem;
let bannerItem;
let currentTvId = null;
let currentTrailerKey = null;

// ============================================================
// GENRE HELPERS
// ============================================================

function buildGenreQuery(genre, mediaType) {
  if (genre.type === 'single') {
    let gid = genre.id;
    if (genre.key === 'action') {
      gid = (mediaType === 'movie') ? genre.idMovie : genre.idTv;
    }
    return ['with_genres=' + gid];
  }
  return genre.ids.map(function(id) { return 'with_genres=' + id; });
}

// ============================================================
// HISTORY / LAYER MANAGEMENT
// ============================================================

let layerStack = [];

function pushLayer(type, data) {
  layerStack.push({ type: type, data: data || null });
  history.pushState({ mobiflixLayer: layerStack.length, type: type }, '');
}

function popLayer() {
  if (layerStack.length === 0) return null;
  const layer = layerStack.pop();
  closeLayerByType(layer.type, layer.data);
  return layer;
}

function closeLayerByType(type, data) {
  switch (type) {
    case 'view-all': closeAllPagesOnly(); setActiveNav('home'); break;
    case 'genre': closeAllPagesOnly(); setActiveNav('more'); break;
    case 'provider': closeAllPagesOnly(); setActiveNav('home'); break;
    case 'my-list': closeAllPagesOnly(); setActiveNav('home'); break;
    case 'more': closeAllPagesOnly(); setActiveNav('home'); break;
    case 'search': closeAllPagesOnly(); setActiveNav('home'); break;
    case 'profile': closeAllPagesOnly(); setActiveNav('home'); break;
    default: closeAllPagesOnly(); setActiveNav('home');
  }
}

history.replaceState({ mobiflixHome: true }, '', '#home');
history.pushState({ mobiflixTrap: false }, '', '#home');
history.pushState({ mobiflixHome: true }, '', '#home');

let exitConfirmActive = false;

window.addEventListener('popstate', function(e) {
  if (layerStack.length > 0) {
    const layer = layerStack.pop();
    closeLayerByType(layer.type, layer.data);
    return;
  }
  if (exitConfirmActive) return;
  exitConfirmActive = true;
  const wantExit = confirm('Do you want to exit?');
  if (wantExit) {
    exitConfirmActive = false;
    history.back();
  } else {
    history.pushState({ mobiflixHome: true }, '', '#home');
    exitConfirmActive = false;
  }
});

// ============================================================
// PAGE STATES
// ============================================================

let viewAllState = { key: null, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set(), filters: {} };
let providerPageState = { providerId: null, providerName: '', providerType: 'provider', page: 1, batchCount: 0, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set(), filters: {} };
let genrePageState = {};

// ============================================================
// SNOW EFFECT
// ============================================================

function createSnow() {
  var existing = document.getElementById('snow-container');
  if (existing) existing.parentNode.removeChild(existing);

  var container = document.createElement('div');
  container.id = 'snow-container';
  document.body.appendChild(container);

  var snowChars = ['❄', '❅', '❆', '•', '*', '❄', '❅'];
  var maxSnowflakes = 60;

  function createSnowflake() {
    if (container.children.length >= maxSnowflakes) return;
    var snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = snowChars[Math.floor(Math.random() * snowChars.length)];
    snowflake.style.left = (Math.random() * 100) + '%';
    var size = Math.random() * 12 + 8;
    snowflake.style.fontSize = size + 'px';
    var duration = Math.random() * 10 + 8;
    snowflake.style.animationDuration = duration + 's';
    var delay = Math.random() * 8;
    snowflake.style.animationDelay = delay + 's';
    snowflake.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
    container.appendChild(snowflake);
    setTimeout(function() {
      if (snowflake.parentNode) snowflake.parentNode.removeChild(snowflake);
    }, (duration + delay) * 1000 + 500);
  }

  function startSnow() {
    createSnowflake();
    var nextDelay = Math.random() * 600 + 300;
    setTimeout(startSnow, nextDelay);
  }

  startSnow();
}

// ============================================================
// RELEASE FILTER
// ============================================================

function filterReleased(results) {
  const today = new Date().toISOString().split('T')[0];
  return (results || []).filter(function(item) {
    const date = item.release_date || item.first_air_date;
    if (!date) return false;
    return date <= today;
  });
}

function sortByNewest(results) {
  return (results || []).slice().sort(function(a, b) {
    const dateA = a.release_date || a.first_air_date || '';
    const dateB = b.release_date || b.first_air_date || '';
    return dateB.localeCompare(dateA);
  });
}

function filterOutExcluded(results) {
  return (results || []).filter(function(item) {
    const genres = item.genre_ids || [];
    const excluded = EXCLUDED_GENRES.split(',').map(Number);
    const hasExcluded = genres.some(function(g) { return excluded.includes(g); });
    return !hasExcluded;
  });
}

// ============================================================
// KOREAN FETCH FUNCTIONS
// ============================================================

async function fetchTrendingKoreanSeries10() {
  const url = `${BASE_URL}/trending/tv/day?api_key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = (data.results || []).filter(function(item) {
    return (item.origin_country || []).includes(KOREAN_COUNTRY) ||
           item.original_language === KOREAN_LANG;
  });
  results = filterReleased(results);
  results = filterOutExcluded(results);
  results.forEach(function(item) { item.media_type = 'tv'; });
  return results.slice(0, 10);
}

async function fetchTopRatedKoreanSeries(page) {
  const today = new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}` +
    `&with_origin_country=${KOREAN_COUNTRY}` +
    `&with_original_language=${KOREAN_LANG}` +
    `&without_genres=${EXCLUDED_GENRES}` +
    `&sort_by=vote_average.desc` +
    `&vote_count.gte=100` +
    `&first_air_date.lte=${today}` +
    `&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = filterReleased(data.results);
  results = filterOutExcluded(results);
  results.forEach(function(item) { item.media_type = 'tv'; });
  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchNewestKoreanSeries(page) {
  const today = new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}` +
    `&with_origin_country=${KOREAN_COUNTRY}` +
    `&with_original_language=${KOREAN_LANG}` +
    `&without_genres=${EXCLUDED_GENRES}` +
    `&sort_by=first_air_date.desc` +
    `&vote_count.gte=1` +
    `&first_air_date.lte=${today}` +
    `&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = filterReleased(data.results);
  results = filterOutExcluded(results);
  results = sortByNewest(results);
  results.forEach(function(item) { item.media_type = 'tv'; });
  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchNewestKoreanMovies(page) {
  const today = new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
    `&with_origin_country=${KOREAN_COUNTRY}` +
    `&with_original_language=${KOREAN_LANG}` +
    `&without_genres=${EXCLUDED_GENRES}` +
    `&sort_by=primary_release_date.desc` +
    `&vote_count.gte=1` +
    `&primary_release_date.lte=${today}` +
    `&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = filterReleased(data.results);
  results = filterOutExcluded(results);
  results = sortByNewest(results);
  results.forEach(function(item) { item.media_type = 'movie'; });
  return { results: results, total_pages: data.total_pages || 1 };
}

// ============================================================
// WATCH HISTORY
// ============================================================

function getWatchHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch (e) { return []; }
}

function saveWatchHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function addToHistory(item) {
  if (!item || !item.id) return;
  const list = getWatchHistory();
  const filtered = list.filter(function(x) { return x.id !== item.id; });
  filtered.unshift({
    id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path,
    media_type: item.media_type || (item.title ? 'movie' : 'tv'),
    vote_average: item.vote_average,
    release_date: item.release_date || item.first_air_date,
    watchedAt: Date.now()
  });
  if (filtered.length > MAX_HISTORY) filtered.length = MAX_HISTORY;
  saveWatchHistory(filtered);
}

function clearHistory() {
  if (confirm('Clear your watch history?')) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
}

function renderHistory() {
  const list = getWatchHistory();
  const grid = document.getElementById('history-grid');
  const empty = document.getElementById('history-empty');
  const clearBtn = document.getElementById('clear-history-btn');
  if (!grid) return;
  grid.innerHTML = '';
  if (list.length === 0) {
    empty.style.display = 'block';
    clearBtn.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  clearBtn.style.display = 'inline-flex';
  list.forEach(function(item) {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    img.onclick = function() {
      closeUserProfile();
      showDetails(item);
    };
    grid.appendChild(img);
  });
}

// ============================================================
// CONTINUE WATCHING
// ============================================================

function getContinueWatching() {
  try { return JSON.parse(localStorage.getItem(CONTINUE_KEY)) || []; }
  catch (e) { return []; }
}

function saveContinueWatching(list) {
  localStorage.setItem(CONTINUE_KEY, JSON.stringify(list));
}

function addToContinueWatching(item) {
  if (!item || !item.id) return;
  const list = getContinueWatching();
  const filtered = list.filter(function(x) { return x.id !== item.id; });
  filtered.unshift({
    id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    media_type: item.media_type || (item.title ? 'movie' : 'tv'),
    vote_average: item.vote_average,
    release_date: item.release_date || item.first_air_date,
    progress: Math.floor(Math.random() * 70) + 15,
    watchedAt: Date.now()
  });
  if (filtered.length > MAX_CONTINUE) filtered.length = MAX_CONTINUE;
  saveContinueWatching(filtered);
}

function renderContinueWatching() {
  const list = getContinueWatching();
  const container = document.getElementById('continue-watching-list');
  const row = document.getElementById('continue-watching-row');
  if (!container || !row) return;
  if (list.length === 0) { row.style.display = 'none'; return; }
  row.style.display = 'block';
  container.innerHTML = '';
  list.forEach(function(item) {
    const card = document.createElement('div');
    card.className = 'continue-card';
    card.onclick = function() { showDetails(item); };
    const img = document.createElement('img');
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    if (item.backdrop_path) img.src = `${IMG_W500}${item.backdrop_path}`;
    else if (item.poster_path) img.src = `${IMG_W500}${item.poster_path}`;
    else img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 124" fill="%23222"><rect width="220" height="124"/></svg>';
    const progress = document.createElement('div');
    progress.className = 'continue-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'continue-progress-bar';
    progressBar.style.width = item.progress + '%';
    progress.appendChild(progressBar);
    const title = document.createElement('div');
    title.className = 'continue-title';
    title.textContent = item.title || item.name;
    const subtitle = document.createElement('div');
    subtitle.className = 'continue-subtitle';
    subtitle.textContent = item.progress + '% watched';
    card.appendChild(img);
    card.appendChild(progress);
    card.appendChild(title);
    card.appendChild(subtitle);
    container.appendChild(card);
  });
}

// ============================================================
// THEMES
// ============================================================

function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || 'default';
  applyTheme(theme);
}

function applyTheme(theme) {
  document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-light');
  if (theme === 'light') document.body.classList.add('theme-light');
  else if (theme === 'dark-blue') document.body.classList.add('theme-blue');
  else if (theme === 'dark-purple') document.body.classList.add('theme-purple');
  else if (theme === 'dark-green') document.body.classList.add('theme-green');
  document.querySelectorAll('.theme-option').forEach(function(el) {
    el.classList.remove('active');
    if (el.dataset.theme === theme) el.classList.add('active');
  });
  updateThemeIcon();
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'default';
  setTheme((current === 'light') ? 'default' : 'light');
}

function updateThemeIcon() {
  const theme = localStorage.getItem(THEME_KEY) || 'default';
  const icon = document.getElementById('theme-toggle-icon');
  if (!icon) return;
  icon.className = theme === 'light' ? 'fa fa-sun' : 'fa fa-moon';
}

// ============================================================
// NOTIFICATIONS
// ============================================================

function getNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
  catch (e) { return []; }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  updateNotifBadge();
}

function isNotifEnabled() {
  return localStorage.getItem(NOTIF_ENABLED_KEY) !== 'false';
}

function toggleNotifications() {
  const toggle = document.getElementById('notif-toggle');
  localStorage.setItem(NOTIF_ENABLED_KEY, toggle.checked ? 'true' : 'false');
  updateNotifBadge();
}

function updateNotifBadge() {
  const list = getNotifications();
  const unread = list.filter(function(n) { return !n.read; });
  const badge = document.getElementById('notif-badge');
  if (!badge) return;
  if (unread.length > 0 && isNotifEnabled()) {
    badge.textContent = unread.length > 9 ? '9+' : unread.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

async function generateNotifications() {
  if (!isNotifEnabled()) return;
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [newTVRes, ongoingRes] = await Promise.all([
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&first_air_date.gte=${weekAgo}&first_air_date.lte=${today}&vote_count.gte=1&without_genres=${EXCLUDED_GENRES}&with_origin_country=${KOREAN_COUNTRY}&with_original_language=${KOREAN_LANG}`),
      fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&first_air_date.lte=${today}&vote_count.gte=20&with_status=0|1&without_genres=${EXCLUDED_GENRES}&with_origin_country=${KOREAN_COUNTRY}&with_original_language=${KOREAN_LANG}&page=1`)
    ]);

    const newTV = await newTVRes.json();
    const ongoing = await ongoingRes.json();
    const notifications = [];

    filterOutExcluded(newTV.results || []).slice(0, 8).forEach(function(item) {
      if (!item.poster_path) return;
      notifications.push({
        id: item.id, media_type: 'tv', title: item.name, poster_path: item.poster_path,
        type: 'new_release', message: 'New Korean Series released!', createdAt: Date.now(), read: false
      });
    });

    filterOutExcluded(ongoing.results || []).slice(0, 8).forEach(function(item) {
      if (!item.poster_path) return;
      notifications.push({
        id: item.id, media_type: 'tv', title: item.name, poster_path: item.poster_path,
        type: 'new_episode', message: 'New episode available!', createdAt: Date.now(), read: false
      });
    });

    saveNotifications(notifications);
  } catch (err) { console.error('[Notifications]', err); }
}

function openNotifications() {
  const panel = document.getElementById('notif-panel');
  if (panel.classList.contains('open')) { closeNotifications(); return; }
  panel.classList.add('open');
  renderNotifications();
  const list = getNotifications();
  list.forEach(function(n) { n.read = true; });
  saveNotifications(list);
  updateNotifBadge();
}

function closeNotifications() {
  document.getElementById('notif-panel').classList.remove('open');
}

document.addEventListener('click', function(e) {
  const panel = document.getElementById('notif-panel');
  const notifBtn = e.target.closest('button[aria-label="Notifications"]');
  if (!panel) return;
  if (!panel.classList.contains('open')) return;
  if (panel.contains(e.target)) return;
  if (notifBtn) return;
  closeNotifications();
});

function renderNotifications() {
  const list = getNotifications();
  const container = document.getElementById('notif-list');
  const empty = document.getElementById('notif-empty');
  if (!container) return;
  container.innerHTML = '';
  if (list.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(function(notif) {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.onclick = function() { closeNotifications(); showDetails(notif); };
    const img = document.createElement('img');
    img.className = 'notif-item-img';
    img.alt = notif.title;
    img.loading = 'lazy';
    if (notif.poster_path) img.src = `${IMG_W500}${notif.poster_path}`;
    else img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 75" fill="%23333"><rect width="50" height="75"/></svg>';
    const info = document.createElement('div');
    info.className = 'notif-item-info';
    const title = document.createElement('div');
    title.className = 'notif-item-title';
    title.textContent = notif.title;
    const meta = document.createElement('div');
    meta.className = 'notif-item-meta';
    const icon = notif.type === 'new_episode' ? 'fa-tv' : 'fa-fire';
    meta.innerHTML = '<i class="fa ' + icon + '"></i> ' + notif.message;
    info.appendChild(title);
    info.appendChild(meta);
    item.appendChild(img);
    item.appendChild(info);
    container.appendChild(item);
  });
}

// ============================================================
// USER PROFILE
// ============================================================

function openUserProfile() {
  closeAllPagesOnly();
  const page = document.getElementById('user-profile-page');
  page.classList.add('open');
  page.scrollTop = 0;
  let username = 'User';
  try {
    const session = JSON.parse(localStorage.getItem('mobiflix_auth_session') || '{}');
    if (session.username) username = session.username;
  } catch (e) {}
  document.getElementById('profile-username').textContent = username;
  const notifToggle = document.getElementById('notif-toggle');
  if (notifToggle) notifToggle.checked = isNotifEnabled();
  renderHistory();
  loadTheme();
  setActiveNav('profile');
  pushLayer('profile');
}

function closeUserProfile() {
  document.getElementById('user-profile-page').classList.remove('open');
  setActiveNav('home');
}

// ============================================================
// DISPLAY
// ============================================================

function displayBanner(item) {
  bannerItem = item;
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path || item.poster_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
  const rating = Math.round((item.vote_average || 0) / 2);
  const ratingEl = document.getElementById('banner-rating');
  if (ratingEl) ratingEl.innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const yearEl = document.getElementById('banner-year');
  if (yearEl) {
    const year = (item.release_date || item.first_air_date || '').slice(0, 4);
    yearEl.textContent = year || '';
  }
  const typeEl = document.getElementById('banner-type');
  if (typeEl) {
    const type = item.media_type === 'movie' ? 'Movie' : 'Korean Series';
    typeEl.textContent = type;
  }
  const descEl = document.getElementById('banner-description');
  if (descEl) descEl.textContent = item.overview || 'No description available.';
}

function playBanner() { if (bannerItem) showDetails(bannerItem); }
function showBannerDetails() { if (bannerItem) showDetails(bannerItem); }

function appendToList(items, containerId, mediaType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(function(item) {
    if (!item.poster_path) return;
    const existing = container.querySelector(`img[data-id="${item.id}"]`);
    if (existing) return;
    if (mediaType) item.media_type = mediaType;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    img.dataset.id = item.id;
    img.onclick = function() { showDetails(item); };
    container.appendChild(img);
  });
}

function renderTop10(items, containerId, mediaType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const released = filterReleased(items);
  released.slice(0, 10).forEach(function(item, index) {
    if (!item.poster_path) return;
    if (mediaType) item.media_type = mediaType;
    else if (!item.media_type) item.media_type = item.title ? 'movie' : 'tv';
    const wrapper = document.createElement('div');
    wrapper.className = 'top10-item';
    wrapper.onclick = function() { showDetails(item); };
    const number = document.createElement('div');
    number.className = 'top10-number';
    number.textContent = index + 1;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    wrapper.appendChild(number);
    wrapper.appendChild(img);
    container.appendChild(wrapper);
  });
}

function renderProviders() {
  const container = document.getElementById('providers-list');
  if (!container) return;
  container.innerHTML = '';
  STREAMING_PROVIDERS.forEach(function(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card';
    card.title = provider.name;
    card.style.background = provider.color;
    card.style.borderColor = provider.color;
    card.style.color = provider.color;
    const img = document.createElement('img');
    img.alt = provider.name;
    img.src = PROVIDER_LOGOS[provider.name];
    img.onerror = function() {
      this.style.display = 'none';
      if (!card.querySelector('span')) {
        const span = document.createElement('span');
        span.textContent = provider.name;
        card.appendChild(span);
      }
    };
    card.appendChild(img);
    card.onclick = function() { openProviderPage(provider.id, provider.name, provider.type); };
    container.appendChild(card);
  });
}

function renderGenresInMore() {
  const container = document.getElementById('more-genres-list');
  if (!container) return;
  container.innerHTML = '';
  CUSTOM_GENRES.forEach(function(genre) {
    const link = document.createElement('a');
    link.textContent = `${genre.icon} ${genre.name}`;
    link.onclick = function() { openGenrePage(genre); };
    container.appendChild(link);
  });
}

// ============================================================
// FILTERS
// ============================================================

const FILTER_PANEL_MAP = {
  'view-all': 'view-all-filter-panel',
  'provider': 'provider-filter-panel',
  'genre': 'genre-filter-panel'
};

const FILTER_PREFIX_MAP = {
  'view-all': 'filter-',
  'provider': 'provider-filter-',
  'genre': 'genre-filter-'
};

function toggleFilters(pageKey) {
  const panelId = FILTER_PANEL_MAP[pageKey];
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) panel.style.display = 'block';
  else panel.style.display = 'none';
}

function getFilterValues(pageKey) {
  const prefix = FILTER_PREFIX_MAP[pageKey] || 'filter-';
  return {
    year: (document.getElementById(prefix + 'year') || {}).value || '',
    rating: (document.getElementById(prefix + 'rating') || {}).value || '',
    genre: (document.getElementById(prefix + 'genre') || {}).value || '',
    sort: (document.getElementById(prefix + 'sort') || {}).value || 'popularity.desc'
  };
}

function applyFilters(pageKey) {
  const filters = getFilterValues(pageKey);
  if (pageKey === 'view-all') {
    viewAllState.filters = filters;
    viewAllState.page = 1;
    viewAllState.hasMore = true;
    viewAllState.seenIds = new Set();
    document.getElementById('view-all-grid').innerHTML = '';
    document.getElementById('view-all-end').style.display = 'none';
    loadViewAllBatch();
  } else if (pageKey === 'provider') {
    providerPageState.filters = filters;
    providerPageState.page = 1;
    providerPageState.batchCount = 0;
    providerPageState.hasMore = true;
    providerPageState.seenIds = new Set();
    document.getElementById('provider-page-grid').innerHTML = '';
    document.getElementById('provider-page-end').style.display = 'none';
    loadProviderBatch();
  } else if (pageKey === 'genre') {
    genrePageState.filters = filters;
    genrePageState.page = 1;
    genrePageState.hasMore = true;
    genrePageState.seenIds = new Set();
    document.getElementById('genre-page-grid').innerHTML = '';
    document.getElementById('genre-page-end').style.display = 'none';
    loadGenrePageBatch();
  }
  const panelId = FILTER_PANEL_MAP[pageKey];
  if (panelId) document.getElementById(panelId).style.display = 'none';
}

function clearFilters(pageKey) {
  const prefix = FILTER_PREFIX_MAP[pageKey] || 'filter-';
  ['year', 'rating', 'genre'].forEach(function(k) {
    const el = document.getElementById(prefix + k);
    if (el) el.value = '';
  });
  const sortEl = document.getElementById(prefix + 'sort');
  if (sortEl) sortEl.value = 'first_air_date.desc';
  if (pageKey === 'view-all') {
    viewAllState.filters = {}; viewAllState.page = 1; viewAllState.hasMore = true; viewAllState.seenIds = new Set();
    document.getElementById('view-all-grid').innerHTML = '';
    document.getElementById('view-all-end').style.display = 'none';
    loadViewAllBatch();
  } else if (pageKey === 'provider') {
    providerPageState.filters = {}; providerPageState.page = 1; providerPageState.batchCount = 0; providerPageState.hasMore = true; providerPageState.seenIds = new Set();
    document.getElementById('provider-page-grid').innerHTML = '';
    document.getElementById('provider-page-end').style.display = 'none';
    loadProviderBatch();
  } else if (pageKey === 'genre') {
    genrePageState.filters = {}; genrePageState.page = 1; genrePageState.hasMore = true; genrePageState.seenIds = new Set();
    document.getElementById('genre-page-grid').innerHTML = '';
    document.getElementById('genre-page-end').style.display = 'none';
    loadGenrePageBatch();
  }
  const panelId = FILTER_PANEL_MAP[pageKey];
  if (panelId) document.getElementById(panelId).style.display = 'none';
}

// ============================================================
// CLOSE FUNCTIONS
// ============================================================

function closeAllPagesOnly() {
  ['view-all-page', 'provider-page', 'my-list-page', 'more-page', 'search-modal',
   'genre-page', 'user-profile-page'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); el.scrollTop = 0; }
  });
  document.body.style.overflow = '';
}

function closeViewAll() { closeAllPagesOnly(); setActiveNav('home'); }
function closeGenrePage() { closeAllPagesOnly(); setActiveNav('more'); }
function closeProviderPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeMyListPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeMorePage() { closeAllPagesOnly(); setActiveNav('home'); }
function openMoviesPage() { openViewAll('movies'); }
function openSeriesPage() { openViewAll('tv'); }
function closeMoviesPage() { closeViewAll(); }
function closeSeriesPage() { closeViewAll(); }
function closeSearchModal() { closeAllPagesOnly(); document.body.style.overflow = ''; setActiveNav('home'); }

// ============================================================
// GENRE PAGE
// ============================================================

function openGenrePage(genre) {
  closeAllPagesOnly();
  const page = document.getElementById('genre-page');
  page.classList.add('open');
  page.scrollTop = 0;
  genrePageState = { genre: genre, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: true, seenIds: new Set(), filters: {} };
  document.getElementById('genre-page-title').textContent = `${genre.icon} ${genre.name}`;
  document.getElementById('genre-page-grid').innerHTML = '';
  document.getElementById('genre-page-end').style.display = 'none';
  document.getElementById('genre-page-loading').style.display = 'none';
  page.removeEventListener('scroll', genrePageScrollHandler);
  page.addEventListener('scroll', genrePageScrollHandler, { passive: true });
  setActiveNav('more');
  loadGenrePageBatch();
  pushLayer('genre');
}

function genrePageScrollHandler() {
  if (!genrePageState.initialized || genrePageState.loading || !genrePageState.hasMore) return;
  const page = document.getElementById('genre-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) loadGenrePageBatch();
}

async function loadGenrePageBatch() {
  if (genrePageState.loading || !genrePageState.hasMore) return;
  genrePageState.loading = true;
  document.getElementById('genre-page-loading').style.display = 'block';
  try {
    const genre = genrePageState.genre;
    const filters = genrePageState.filters || {};
    const sortBy = filters.sort || 'first_air_date.desc';
    const mediaType = (genrePageState.page % 2 === 1) ? 'tv' : 'movie';
    const apiPage = Math.floor((genrePageState.page - 1) / 2) + 1;
    const genreQueries = buildGenreQuery(genre, mediaType);
    let url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}` +
      `&${genreQueries.join('&')}` +
      `&with_origin_country=${KOREAN_COUNTRY}` +
      `&with_original_language=${KOREAN_LANG}` +
      `&without_genres=${EXCLUDED_GENRES}` +
      `&sort_by=${sortBy}` +
      `&page=${apiPage}`;
    if (filters.year) {
      if (mediaType === 'movie') url += `&primary_release_year=${filters.year}`;
      else url += `&first_air_date_year=${filters.year}`;
    }
    if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      if (genrePageState.page % 2 === 1) {
        genrePageState.page += 1;
        genrePageState.loading = false;
        document.getElementById('genre-page-loading').style.display = 'none';
        return loadGenrePageBatch();
      }
      genrePageState.hasMore = false;
      document.getElementById('genre-page-end').style.display = 'block';
      return;
    }
    genrePageState.maxPages = data.total_pages || 1;
    genrePageState.page += 1;
    const grid = document.getElementById('genre-page-grid');
    let filtered = filterReleased(data.results);
    filtered = filterOutExcluded(filtered);
    filtered.forEach(function(item) {
      if (!item.poster_path) return;
      if (genrePageState.seenIds.has(item.id)) return;
      genrePageState.seenIds.add(item.id);
      item.media_type = mediaType;
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });
    if (apiPage >= genrePageState.maxPages && genrePageState.page % 2 === 0) {
      genrePageState.hasMore = false;
      document.getElementById('genre-page-end').style.display = 'block';
    }
  } catch (err) { console.error(err); }
  finally {
    genrePageState.loading = false;
    document.getElementById('genre-page-loading').style.display = 'none';
  }
}

// ============================================================
// PROVIDER
// ============================================================

function openProviderPage(providerId, providerName, providerType) {
  closeAllPagesOnly();
  const page = document.getElementById('provider-page');
  page.classList.add('open');
  page.scrollTop = 0;
  providerPageState = {
    providerId: providerId, providerName: providerName, providerType: providerType || 'provider',
    page: 1, batchCount: 0, maxPages: 500, loading: false, hasMore: true, initialized: true, seenIds: new Set(), filters: {}
  };
  document.getElementById('provider-page-title').textContent = '📡 ' + providerName;
  document.getElementById('provider-page-grid').innerHTML = '';
  document.getElementById('provider-page-end').style.display = 'none';
  document.getElementById('provider-page-loading').style.display = 'none';
  page.removeEventListener('scroll', providerPageScrollHandler);
  page.addEventListener('scroll', providerPageScrollHandler, { passive: true });
  loadProviderBatch();
  pushLayer('provider');
}

function providerPageScrollHandler() {
  if (!providerPageState.initialized || providerPageState.loading || !providerPageState.hasMore) return;
  const page = document.getElementById('provider-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) loadProviderBatch();
}

async function loadProviderBatch() {
  if (providerPageState.loading || !providerPageState.hasMore) return;
  providerPageState.loading = true;
  document.getElementById('provider-page-loading').style.display = 'block';
  try {
    const filters = providerPageState.filters || {};
    const sortBy = filters.sort || 'popularity.desc';
    if (typeof providerPageState.batchCount === 'undefined') providerPageState.batchCount = 0;
    const mediaType = (providerPageState.batchCount % 2 === 0) ? 'movie' : 'tv';
    const apiPage = Math.floor(providerPageState.batchCount / 2) + 1;
    let url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}` +
      `&with_watch_providers=${providerPageState.providerId}` +
      `&watch_region=KR` +
      `&with_origin_country=${KOREAN_COUNTRY}` +
      `&with_original_language=${KOREAN_LANG}` +
      `&without_genres=${EXCLUDED_GENRES}` +
      `&page=${apiPage}` +
      `&sort_by=${sortBy}`;
    if (filters.year) {
      if (mediaType === 'movie') url += `&primary_release_year=${filters.year}`;
      else url += `&first_air_date_year=${filters.year}`;
    }
    if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
    if (filters.genre) {
      const g = CUSTOM_GENRES.find(function(x) { return String(x.id) === String(filters.genre) || x.key === filters.genre; });
      if (g) url += '&' + buildGenreQuery(g, mediaType).join('&');
    }
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      providerPageState.hasMore = false;
      document.getElementById('provider-page-end').style.display = 'block';
      return;
    }
    providerPageState.maxPages = data.total_pages || 1;
    providerPageState.batchCount += 1;
    const grid = document.getElementById('provider-page-grid');
    let filtered = filterReleased(data.results);
    filtered = filterOutExcluded(filtered);
    filtered.forEach(function(item) {
      if (!item.poster_path) return;
      if (providerPageState.seenIds.has(item.id)) return;
      providerPageState.seenIds.add(item.id);
      item.media_type = mediaType;
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });
    if (apiPage >= providerPageState.maxPages) {
      providerPageState.hasMore = false;
      document.getElementById('provider-page-end').style.display = 'block';
    }
  } catch (err) { console.error(err); }
  finally {
    providerPageState.loading = false;
    document.getElementById('provider-page-loading').style.display = 'none';
  }
}

// ============================================================
// SHOW DETAILS
// ============================================================

function showDetails(item) {
  if (!item || !item.id) return;
  if (!item.media_type) {
    item.media_type = (item.first_air_date || (!item.title && item.name)) ? 'tv' : 'movie';
  }
  window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
}

// ============================================================
// MY LIST
// ============================================================

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('mobiflix_watchlist')) || []; }
  catch (e) { return []; }
}

function openMyListPage() {
  closeAllPagesOnly();
  const page = document.getElementById('my-list-page');
  page.classList.add('open');
  page.scrollTop = 0;
  renderMyList();
  setActiveNav('home');
  pushLayer('my-list');
}

function renderMyList() {
  const list = getWatchlist();
  const grid = document.getElementById('my-list-grid');
  const empty = document.getElementById('my-list-empty');
  grid.innerHTML = '';
  if (list.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(function(item) {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    img.dataset.id = item.id;
    img.onclick = function() { showDetails(item); };
    grid.appendChild(img);
  });
}

// ============================================================
// SEARCH
// ============================================================

function openSearchModal() {
  closeAllPagesOnly();
  const modal = document.getElementById('search-modal');
  modal.classList.add('open');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  setActiveNav('home');
  setTimeout(function() { document.getElementById('search-input').focus(); }, 200);
  pushLayer('search');
}

let searchTimeout;
async function searchTMDB() {
  clearTimeout(searchTimeout);
  const query = document.getElementById('search-input').value;
  if (!query.trim()) { document.getElementById('search-results').innerHTML = ''; return; }

  searchTimeout = setTimeout(async () => {
    try {
      const [movieRes, tvRes] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=true&language=ko-KR&region=KR`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=true&language=ko-KR`)
      ]);
      const movieData = await movieRes.json();
      const tvData = await tvRes.json();

      const movies = (movieData.results || []).map(function(m) { m.media_type = 'movie'; return m; });
      const tvs = (tvData.results || []).map(function(t) { t.media_type = 'tv'; return t; });

      const combined = [...movies, ...tvs]
        .filter(function(item) {
          const isKorean = (item.origin_country || []).includes(KOREAN_COUNTRY) ||
                           item.original_language === KOREAN_LANG;
          return item.poster_path && isKorean;
        })
        .filter(function(item) {
          const date = item.release_date || item.first_air_date;
          if (!date) return false;
          return date <= new Date().toISOString().split('T')[0];
        })
        .filter(function(item) {
          const genres = item.genre_ids || [];
          const excluded = EXCLUDED_GENRES.split(',').map(Number);
          const hasExcluded = genres.some(function(g) { return excluded.includes(g); });
          return !hasExcluded;
        })
        .sort(function(a, b) { return (b.popularity || 0) - (a.popularity || 0); });

      const container = document.getElementById('search-results');
      container.innerHTML = '';

      if (combined.length === 0) {
        container.innerHTML = '<div style="color:#666;padding:40px 20px;text-align:center;grid-column:1/-1;">No Korean results found.</div>';
        return;
      }

      combined.forEach(function(item) {
        const img = document.createElement('img');
        img.src = `${IMG_W500}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = function() { closeSearchModal(); showDetails(item); };
        container.appendChild(img);
      });
    } catch (err) { console.error('[Search]', err); }
  }, 300);
}

// ============================================================
// BOTTOM NAV
// ============================================================

function setActiveNav(name) {
  document.querySelectorAll('.bottom-nav-item').forEach(function(el) { el.classList.remove('active'); });
  const items = document.querySelectorAll('.bottom-nav-item');
  const map = { home: 0, movies: 1, series: 2, more: 3, profile: 4 };
  if (items[map[name]]) items[map[name]].classList.add('active');
}

function goHome() {
  layerStack = [];
  ['view-all-page', 'provider-page', 'my-list-page', 'more-page', 'search-modal',
   'genre-page', 'user-profile-page'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); el.scrollTop = 0; }
  });
  document.body.style.overflow = '';
  setActiveNav('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({ mobiflixTrap: false }, '', '#home');
  history.pushState({ mobiflixHome: true }, '', '#home');
}

// ============================================================
// MORE PAGE
// ============================================================

function openMorePage() {
  closeAllPagesOnly();
  const page = document.getElementById('more-page');
  page.classList.add('open');
  page.scrollTop = 0;
  renderGenresInMore();
  setActiveNav('more');
  pushLayer('more');
}

// ============================================================
// VIEW ALL PAGE
// ============================================================

function openViewAll(key) {
  closeAllPagesOnly();
  const configs = {
    movies: { name: 'Korean Movies',            icon: '🎬', media: 'movie', type: 'newest_movies' },
    tv:     { name: 'Korean Series',            icon: '📺', media: 'tv',    type: 'newest_tv' },
    top:    { name: 'Top Rated Korean Series',  icon: '⭐', media: 'tv',    type: 'top_rated' },
    newest: { name: 'Newest Korean Series',     icon: '🆕', media: 'tv',    type: 'newest' }
  };
  const config = configs[key];
  if (!config) return;

  viewAllState = { key: key, config: config, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: true, seenIds: new Set(), filters: {} };

  document.getElementById('view-all-title').textContent = config.icon + ' ' + config.name;

  const grid = document.getElementById('view-all-grid');
  grid.innerHTML = '';
  document.getElementById('view-all-end').style.display = 'none';
  document.getElementById('view-all-loading').style.display = 'none';

  const page = document.getElementById('view-all-page');
  page.classList.add('open');
  page.scrollTop = 0;

  page.removeEventListener('scroll', viewAllScrollHandler);
  page.addEventListener('scroll', viewAllScrollHandler, { passive: true });

  if (key === 'movies') setActiveNav('movies');
  else if (key === 'tv') setActiveNav('series');
  else setActiveNav('home');

  loadViewAllBatch();
  pushLayer('view-all');
}

async function loadViewAllBatch() {
  if (viewAllState.loading || !viewAllState.hasMore) return;
  viewAllState.loading = true;
  document.getElementById('view-all-loading').style.display = 'block';

  const config = viewAllState.config;
  const grid = document.getElementById('view-all-grid');

  try {
    let data;
    const filters = viewAllState.filters || {};
    const hasFilters = filters.year || filters.rating || filters.genre;

    if (hasFilters) {
      const mediaType = config.media;
      const genreQueries = [];
      if (filters.genre) {
        const g = CUSTOM_GENRES.find(function(x) { return String(x.id) === String(filters.genre) || x.key === filters.genre; });
        if (g) genreQueries.push.apply(genreQueries, buildGenreQuery(g, mediaType));
      }
      let url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}` +
        `&with_origin_country=${KOREAN_COUNTRY}` +
        `&with_original_language=${KOREAN_LANG}` +
        `&without_genres=${EXCLUDED_GENRES}` +
        `&page=${viewAllState.page}`;
      if (genreQueries.length > 0) url += '&' + genreQueries.join('&');
      if (filters.year) {
        if (mediaType === 'movie') url += `&primary_release_year=${filters.year}`;
        else url += `&first_air_date_year=${filters.year}`;
      }
      if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
      url += `&sort_by=${filters.sort || (mediaType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc')}`;
      const res = await fetch(url);
      data = await res.json();
      data.results = filterReleased(data.results);
      data.results = filterOutExcluded(data.results);
      data.results = sortByNewest(data.results);
    } else {
      if (config.type === 'newest_movies') data = await fetchNewestKoreanMovies(viewAllState.page);
      else if (config.type === 'newest_tv') data = await fetchNewestKoreanSeries(viewAllState.page);
      else if (config.type === 'top_rated') data = await fetchTopRatedKoreanSeries(viewAllState.page);
      else if (config.type === 'newest') data = await fetchNewestKoreanSeries(viewAllState.page);
    }

    if (!data.results || data.results.length === 0) {
      viewAllState.hasMore = false;
      document.getElementById('view-all-end').style.display = 'block';
      return;
    }

    viewAllState.maxPages = data.total_pages || 1;
    viewAllState.page += 1;

    data.results.forEach(function(item) {
      if (!item.poster_path) return;
      if (viewAllState.seenIds.has(item.id)) return;
      viewAllState.seenIds.add(item.id);
      item.media_type = config.media;
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });

    if (viewAllState.page > viewAllState.maxPages) {
      viewAllState.hasMore = false;
      document.getElementById('view-all-end').style.display = 'block';
    }
  } catch (err) { console.error(err); }
  finally {
    viewAllState.loading = false;
    document.getElementById('view-all-loading').style.display = 'none';
  }
}

let viewAllScrollTimer = null;

function viewAllScrollHandler() {
  if (!viewAllState.initialized || viewAllState.loading || !viewAllState.hasMore) return;
  const page = document.getElementById('view-all-page');
  if (!page) return;
  clearTimeout(viewAllScrollTimer);
  viewAllScrollTimer = setTimeout(function() {
    if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) loadViewAllBatch();
  }, 150);
}

// ============================================================
// INIT
// ============================================================

async function init() {
  try {
    createSnow();
    loadTheme();
    renderProviders();
    renderContinueWatching();
    updateNotifBadge();

    const notifToggle = document.getElementById('notif-toggle');
    if (notifToggle) notifToggle.checked = isNotifEnabled();

    const [trendingData, topRatedData, newestData, newestMoviesData] = await Promise.all([
      fetchTrendingKoreanSeries10(),
      fetchTopRatedKoreanSeries(1),
      fetchNewestKoreanSeries(1),
      fetchNewestKoreanMovies(1)
    ]);

    if (trendingData.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.length));
      displayBanner(trendingData[randomIndex]);
    }

    renderTop10(trendingData, 'top20-kdrama-today', 'tv');
    renderTop10(topRatedData.results, 'top-rated-list', 'tv');
    renderTop10(newestData.results, 'newest-kdrama-list', 'tv');
    appendToList(newestMoviesData.results, 'korean-movies-list', 'movie');

    generateNotifications().catch(function(err) { console.error('[MobiFlix] Notif error:', err); });

  } catch (err) { console.error('[MobiFlix] Init error:', err); }
}

function startSnowWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { if (!document.getElementById('snow-container')) createSnow(); }, 500);
    });
  } else {
    setTimeout(function() { if (!document.getElementById('snow-container')) createSnow(); }, 500);
  }
}

startSnowWhenReady();
init();

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAllPagesOnly();
    layerStack = [];
  }
});

function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    logout();
    showLoginScreen();
  }
}