const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const IMG_PROFILE = 'https://image.tmdb.org/t/p/w185';

// ===== VIVAMAX COMPANY ID =====
const VIVAMAX_COMPANY_ID = '149142';

// ===== STORAGE KEYS =====
const HISTORY_KEY = 'mobiflix_watch_history';
const THEME_KEY = 'mobiflix_theme';
const NOTIF_KEY = 'mobiflix_notifications';
const NOTIF_ENABLED_KEY = 'mobiflix_notif_enabled';
const CONTINUE_KEY = 'mobiflix_continue_watching';
const EPISODE_PROGRESS_KEY = 'mobiflix_episode_progress';
const FAMILY_MODE_KEY = 'mobiflix_family_mode';
const LAST_UPDATE_KEY = 'mobiflix_last_update';
const MAX_HISTORY = 30;
const MAX_CONTINUE = 10;

const INDIAN_LANGS = ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'pa', 'gu', 'or', 'as', 'ur', 'sa', 'ne', 'si'];

// ===== EXCLUDED GENRES =====
const EXCLUDED_GENRES_TV = [10764, 10767, 10766, 10763, 10768];
const EXCLUDED_GENRES_MOVIE = [99, 10402, 10770];
const EXCLUDED_GENRES_ALL = [10764, 10767, 10766, 10763, 10768, 99, 10402, 10770];
const KOREAN_EXCLUDE_GENRES = [10764, 10767, 10763, 10766, 16, 10762, 99, 10402, 10770, 10768];

// ===== BL (BOYS' LOVE) KEYWORDS — para sa Korean Series =====
// Mga karaniwang salita sa BL title o overview
const BL_KEYWORDS = [
  'boys love', "boys' love", 'boy love', 'bl ', ' bl', 'bl-',
  'bromance', 'homoromance', 'homoerotic',
  'gay love', 'gay romance', 'gay couple', 'gay relationship',
  'same-sex', 'same sex', 'queer romance', 'lgbtq', 'lgbt',
  'yaoi', 'shounen ai', 'shonen ai',
  'seme', 'uke',
  'coming out', 'coming-out',
  'male couple', 'two men', 'men in love',
  'boys love story', 'boyfriend', 'boyfriends'
];

// Mga BL Korean series titles (para sa mas accurate na filter)
const BL_TITLE_PATTERNS = [
  'semantic error', 'to my star', 'where your eyes linger', 'light on me',
  'cherry blossoms after winter', 'our dating sim', 'the eighth sense',
  'love class', 'roommates of poongduck 304', 'oh my assistant',
  'my sweet dear', 'you make me dance', 'nobleman ryu', 'wish you',
  'the tasty florida', 'mr. heart', 'because of you', 'peach of time',
  'first love again', 'unintentional love story', 'a shoulder to cry on',
  'our winter', 'sing my crush', 'the new employee', 'happy merry ending',
  'love tractor', 'the lover', 'jun and jun', 'bump up business',
  'a breeze of love', 'eccentric romance', 'love for love\'s sake',
  'love in the big city', 'let free the curse of taekwondo',
  'the time of fever', 'fragile', 'the perfect prince', 'mermaid prince',
  'the boy next door', 'love is like a cat', 'the director who buys me dinner'
];

// ===== STREAMING PROVIDERS =====
const STREAMING_PROVIDERS = [
  { name: 'Netflix', id: 8, type: 'provider', color: '#e50914' },
  { name: 'Disney+', id: 337, type: 'provider', color: '#113ccf' },
  { name: 'Amazon Prime Video', id: 9, type: 'provider', color: '#00a8e1' },
  { name: 'HBO Max', id: 1899, type: 'provider', color: '#5822b4' },
  { name: 'Apple TV+', id: 350, type: 'provider', color: '#1c1c1e' },
  { name: 'AMC+', id: 526, type: 'provider', color: '#f5c518' },
  { name: 'Peacock', id: 386, type: 'provider', color: '#000000' },
  { name: 'Hulu', id: 15, type: 'provider', color: '#1ce783' }
];

const PROVIDER_LOGOS = {
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'Amazon Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo_%282022%29.svg',
  'HBO Max': 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
  'Apple TV+': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
  'AMC+': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/AMC%2B_logo.svg',
  'Peacock': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
  'Hulu': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg'
};

const HOME_ROWS = {
  movies:  { name: 'Movies',     icon: '🔥', media: 'movie', type: 'trending' },
  tv:      { name: 'TV Series',  icon: '📺', media: 'tv',    type: 'trending' },
  kdrama:  { name: 'Korean Series', icon: '🇰🇷', media: 'tv', type: 'kdrama' }
};

const GENRE_LIST = [
  { id: 28,    name: 'Action',           icon: '💥', media: 'movie' },
  { id: 12,    name: 'Adventure',        icon: '🗺️', media: 'movie' },
  { id: 16,    name: 'Animation',        icon: '🎨', media: 'movie' },
  { id: 35,    name: 'Comedy',           icon: '😂', media: 'movie' },
  { id: 80,    name: 'Crime',            icon: '🕵️', media: 'movie' },
  { id: 18,    name: 'Drama',            icon: '🎭', media: 'movie' },
  { id: 10751, name: 'Family',           icon: '👨‍👩‍👧', media: 'movie' },
  { id: 14,    name: 'Fantasy',          icon: '🧙', media: 'movie' },
  { id: 36,    name: 'History',          icon: '📜', media: 'movie' },
  { id: 27,    name: 'Horror',           icon: '👻', media: 'movie' },
  { id: 9648,  name: 'Mystery',          icon: '🔍', media: 'movie' },
  { id: 10749, name: 'Romance',          icon: '💕', media: 'movie' },
  { id: 878,   name: 'Sci-Fi',           icon: '🚀', media: 'movie' },
  { id: 53,    name: 'Thriller',         icon: '😱', media: 'movie' },
  { id: 10752, name: 'War',              icon: '⚔️', media: 'movie' },
  { id: 37,    name: 'Western',          icon: '🤠', media: 'movie' },
  { id: 10759, name: 'Action & Adventure', icon: '💥', media: 'tv' },
  { id: 10765, name: 'Sci-Fi & Fantasy', icon: '✨', media: 'tv' }
];

const COUNTRY_LIST = [
  { code: '',    name: 'All Countries' },
  { code: 'US',  name: 'United States' },
  { code: 'GB',  name: 'United Kingdom' },
  { code: 'CA',  name: 'Canada' },
  { code: 'AU',  name: 'Australia' },
  { code: 'PH',  name: 'Philippines' },
  { code: 'JP',  name: 'Japan' },
  { code: 'KR',  name: 'South Korea' },
  { code: 'CN',  name: 'China' },
  { code: 'HK',  name: 'Hong Kong' },
  { code: 'TW',  name: 'Taiwan' },
  { code: 'TH',  name: 'Thailand' },
  { code: 'ID',  name: 'Indonesia' },
  { code: 'MY',  name: 'Malaysia' },
  { code: 'SG',  name: 'Singapore' },
  { code: 'VN',  name: 'Vietnam' },
  { code: 'IN',  name: 'India' },
  { code: 'FR',  name: 'France' },
  { code: 'DE',  name: 'Germany' },
  { code: 'IT',  name: 'Italy' },
  { code: 'ES',  name: 'Spain' },
  { code: 'MX',  name: 'Mexico' },
  { code: 'BR',  name: 'Brazil' },
  { code: 'AR',  name: 'Argentina' },
  { code: 'RU',  name: 'Russia' },
  { code: 'TR',  name: 'Turkey' },
  { code: 'SA',  name: 'Saudi Arabia' },
  { code: 'AE',  name: 'United Arab Emirates' },
  { code: 'EG',  name: 'Egypt' },
  { code: 'ZA',  name: 'South Africa' },
  { code: 'NG',  name: 'Nigeria' },
  { code: 'NZ',  name: 'New Zealand' },
  { code: 'IE',  name: 'Ireland' },
  { code: 'SE',  name: 'Sweden' },
  { code: 'NO',  name: 'Norway' },
  { code: 'DK',  name: 'Denmark' },
  { code: 'FI',  name: 'Finland' },
  { code: 'NL',  name: 'Netherlands' },
  { code: 'BE',  name: 'Belgium' },
  { code: 'CH',  name: 'Switzerland' },
  { code: 'AT',  name: 'Austria' },
  { code: 'PL',  name: 'Poland' },
  { code: 'PT',  name: 'Portugal' },
  { code: 'GR',  name: 'Greece' },
  { code: 'IL',  name: 'Israel' },
  { code: 'PK',  name: 'Pakistan' },
  { code: 'BD',  name: 'Bangladesh' },
  { code: 'LK',  name: 'Sri Lanka' }
];

let currentItem;
let bannerItem;
let currentTvId = null;
let currentTrailerKey = null;

// ============================================================
// FAMILY MODE
// ============================================================

function isFamilyModeOn() {
  return localStorage.getItem(FAMILY_MODE_KEY) === 'true';
}

function toggleFamilyMode() {
  const toggle = document.getElementById('family-mode-toggle');
  const newState = toggle.checked;
  localStorage.setItem(FAMILY_MODE_KEY, newState ? 'true' : 'false');
  if (newState) {
    alert('Family Mode ON — Adult content (Vivamax) hidden from homepage and search.');
  } else {
    alert('Family Mode OFF — Adult content visible again.');
  }
  window.location.reload();
}

// ============================================================
// HISTORY MANAGEMENT
// ============================================================

let layerStack = [];

function pushLayer(type, data) {
  layerStack.push({ type: type, data: data || null });
  history.pushState({ mobiflixLayer: layerStack.length, type: type }, '');
}

function closeLayerByType(type, data) {
  switch (type) {
    case 'view-all':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'vivamax':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'genre':
      closeAllPagesOnly();
      setActiveNav('more');
      break;
    case 'ongoing':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'completed':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'provider':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'my-list':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'more':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'search':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    case 'profile':
      closeAllPagesOnly();
      setActiveNav('home');
      break;
    default:
      closeAllPagesOnly();
      setActiveNav('home');
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

let viewAllState = { key: null, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set(), filters: {} };
let vivamaxPageState = { page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set(), filters: {} };
let providerPageState = { providerId: null, providerName: '', providerType: 'provider', page: 1, batchCount: 0, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set(), filters: {} };
let genrePageState = {};
let ongoingPageState = {};
let completedPageState = {};

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
      if (snowflake.parentNode) {
        snowflake.parentNode.removeChild(snowflake);
      }
    }, (duration + delay) * 1000 + 500);
  }

  function startSnow() {
    createSnowflake();
    var nextDelay = Math.random() * 600 + 300;
    setTimeout(startSnow, nextDelay);
  }

  startSnow();
  console.log('[MobiFlix] Snow started ❄️');
}

// ============================================================
// POPULATE COUNTRY DROPDOWNS
// ============================================================

function populateCountryDropdowns() {
  const prefixes = [
    'filter-',
    'provider-filter-',
    'genre-filter-',
    'vivamax-filter-'
  ];

  prefixes.forEach(function(prefix) {
    const select = document.getElementById(prefix + 'country');
    if (!select) return;

    select.innerHTML = '';

    COUNTRY_LIST.forEach(function(country) {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      select.appendChild(option);
    });
  });

  populateGenreDropdowns();

  console.log('[MobiFlix] Country & Genre dropdowns populated ✅');
}

function populateGenreDropdowns() {
  const genreSelects = [
    'filter-genre',
    'provider-filter-genre',
    'vivamax-filter-genre'
  ];

  genreSelects.forEach(function(id) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = '<option value="">All Genres</option>';

    GENRE_LIST.forEach(function(genre) {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  });
}

// ============================================================
// FILTER HELPERS
// ============================================================

function filterNonIndian(results) {
  return (results || []).filter(function(item) {
    return !INDIAN_LANGS.includes(item.original_language);
  });
}

function filterReleased(results) {
  const today = new Date().toISOString().split('T')[0];
  return (results || []).filter(function(item) {
    const date = item.release_date || item.first_air_date;
    if (!date) return true;
    return date <= today;
  });
}

function filterMinRating(results, minRating) {
  const min = minRating || 5.0;
  return (results || []).filter(function(item) {
    return (item.vote_average || 0) >= min;
  });
}

function filterExcludedGenres(results, mediaType) {
  let excluded = EXCLUDED_GENRES_ALL;
  if (mediaType === 'tv') {
    excluded = EXCLUDED_GENRES_TV.concat([99, 10402, 10770]);
  } else if (mediaType === 'movie') {
    excluded = EXCLUDED_GENRES_MOVIE.concat([10764, 10767, 10766, 10763, 10768]);
  }

  return (results || []).filter(function(item) {
    const genres = item.genre_ids || [];
    if (genres.length === 0) return true;
    return !genres.some(function(g) { return excluded.includes(g); });
  });
}

function applyAllFilters(results, mediaType) {
  let filtered = filterNonIndian(results);
  filtered = filterReleased(filtered);
  filtered = filterMinRating(filtered, 5.0);
  filtered = filterExcludedGenres(filtered, mediaType);
  return filtered;
}

// ============================================================
// KOREAN SERIES FILTER (may BL filter na)
// ============================================================

function isKoreanSeries(item) {
  const isKorean = (item.origin_country || []).includes('KR') || item.original_language === 'ko';
  if (!isKorean) return false;

  const genres = item.genre_ids || [];
  if (genres.length === 0) return true;

  const hasExcluded = genres.some(function(g) {
    return KOREAN_EXCLUDE_GENRES.includes(g);
  });
  if (hasExcluded) return false;

  return true;
}

// BL detection — para tanggalin sa Korean Series
function isBLSeries(item) {
  if (!item) return false;

  const title = (item.name || item.title || '').toLowerCase();
  const overview = (item.overview || '').toLowerCase();
  const combined = title + ' ' + overview;

  // Check title patterns (mas accurate)
  for (let i = 0; i < BL_TITLE_PATTERNS.length; i++) {
    if (title.indexOf(BL_TITLE_PATTERNS[i]) !== -1) {
      return true;
    }
  }

  // Check BL keywords sa title o overview
  for (let i = 0; i < BL_KEYWORDS.length; i++) {
    if (combined.indexOf(BL_KEYWORDS[i]) !== -1) {
      return true;
    }
  }

  return false;
}

function filterKoreanSeries(results) {
  return (results || []).filter(function(item) {
    if (isBLSeries(item)) return false;
    return isKoreanSeries(item);
  });
}

// Korean series na may minimum 5 stars at walang BL
function filterKoreanSeriesWithRating(results) {
  let filtered = filterKoreanSeries(results);
  filtered = filterMinRating(filtered, 5.0);
  return filtered;
}

// ============================================================
// AUTO-UPDATE CHECK
// ============================================================

function checkDailyUpdate() {
  const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
  const today = new Date().toISOString().split('T')[0];

  if (lastUpdate !== today) {
    localStorage.setItem(LAST_UPDATE_KEY, today);
    console.log('[MobiFlix] Daily auto-update triggered:', today);
    localStorage.removeItem(NOTIF_KEY);
  }
}

// ============================================================
// FETCH FUNCTIONS
// ============================================================

async function fetchTrendingUS(type, page) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}&region=US`);
  const data = await res.json();
  let results = applyAllFilters(data.results, type);
  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchMostWatched(mediaType, page) {
  const today = new Date().toISOString().split('T')[0];
  let url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}` +
    `&sort_by=popularity.desc` +
    `&vote_count.gte=10` +
    `&vote_average.gte=5` +
    `&page=${page}` +
    `&without_original_language=${INDIAN_LANGS.join('|')}`;

  if (mediaType === 'movie') {
    url += `&primary_release_date.lte=${today}`;
    url += `&without_genres=${EXCLUDED_GENRES_ALL.join(',')}`;
  } else {
    url += `&first_air_date.lte=${today}`;
    url += `&without_genres=${EXCLUDED_GENRES_TV.concat([99, 10402, 10770]).join(',')}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  let results = applyAllFilters(data.results, mediaType);

  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchKoreanSeriesNewest(page) {
  const today = new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}` +
    `&with_origin_country=KR` +
    `&sort_by=first_air_date.desc` +
    `&first_air_date.lte=${today}` +
    `&vote_average.gte=5` +
    `&page=${page}` +
    `&without_original_language=${INDIAN_LANGS.join('|')}`;

  const res = await fetch(url);
  const data = await res.json();
  let results = filterKoreanSeriesWithRating(data.results);
  results = filterReleased(results);
  results.forEach(function(item) { item.media_type = 'tv'; });

  results.sort(function(a, b) {
    const dateA = a.first_air_date || '';
    const dateB = b.first_air_date || '';
    return dateB.localeCompare(dateA);
  });

  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchOngoingTV(page) {
  const today = new Date().toISOString().split('T')[0];
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&first_air_date.lte=${today}&vote_count.gte=50&vote_average.gte=5&with_status=0|1&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_TV.concat([99, 10402, 10770]).join(',')}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = applyAllFilters(data.results, 'tv');
  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchCompletedTV(page) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&with_status=3|4&vote_count.gte=100&vote_average.gte=5&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_TV.concat([99, 10402, 10770]).join(',')}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = applyAllFilters(data.results, 'tv');
  return { results: results, total_pages: data.total_pages || 1 };
}

async function fetchVivamaxMovies(page) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
    `&with_companies=${VIVAMAX_COMPANY_ID}` +
    `&sort_by=primary_release_date.desc` +
    `&include_adult=true` +
    `&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  let results = data.results || [];
  results.forEach(function(item) { item.media_type = 'movie'; });
  return { results: results, total_pages: data.total_pages || 1 };
}

// ============================================================
// TRAILER
// ============================================================

async function fetchTrailer(mediaType, id) {
  try {
    const type = mediaType === 'tv' ? 'tv' : 'movie';
    const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const videos = data.results || [];
    const trailer = videos.find(function(v) {
      return v.type === 'Trailer' && v.site === 'YouTube';
    }) || videos.find(function(v) {
      return v.site === 'YouTube';
    });
    return trailer ? trailer.key : null;
  } catch (err) {
    console.error('[Trailer]', err);
    return null;
  }
}

function playTrailer() {
  if (!currentTrailerKey) return;
  const url = `https://www.youtube.com/watch?v=${currentTrailerKey}`;
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(function() {});
  }
  window.open(url, '_blank');
}

// ============================================================
// EPISODE PROGRESS
// ============================================================

function getEpisodeProgress() {
  try { return JSON.parse(localStorage.getItem(EPISODE_PROGRESS_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveEpisodeProgress(progress) {
  localStorage.setItem(EPISODE_PROGRESS_KEY, JSON.stringify(progress));
}

function markEpisodeWatched(tvId, seasonNumber, episodeNumber) {
  const progress = getEpisodeProgress();
  const key = `${tvId}_s${seasonNumber}e${episodeNumber}`;
  progress[key] = Date.now();
  saveEpisodeProgress(progress);
}

function isEpisodeWatched(tvId, seasonNumber, episodeNumber) {
  const progress = getEpisodeProgress();
  const key = `${tvId}_s${seasonNumber}e${episodeNumber}`;
  return !!progress[key];
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
    img.dataset.id = item.id;
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

  if (list.length === 0) {
    row.style.display = 'none';
    return;
  }

  row.style.display = 'block';
  container.innerHTML = '';

  list.forEach(function(item) {
    const card = document.createElement('div');
    card.className = 'continue-card';
    card.onclick = function() { showDetails(item); };

    const img = document.createElement('img');
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    if (item.backdrop_path) {
      img.src = `${IMG_W500}${item.backdrop_path}`;
    } else if (item.poster_path) {
      img.src = `${IMG_W500}${item.poster_path}`;
    } else {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 124" fill="%23222"><rect width="220" height="124"/></svg>';
    }

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
  const newTheme = (current === 'light') ? 'default' : 'light';
  setTheme(newTheme);
}

function updateThemeIcon() {
  const theme = localStorage.getItem(THEME_KEY) || 'default';
  const icon = document.getElementById('theme-toggle-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa fa-sun';
  } else {
    icon.className = 'fa fa-moon';
  }
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
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateStr = weekAgo.toISOString().split('T')[0];

    const newMoviesRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=primary_release_date.desc&primary_release_date.gte=${dateStr}&primary_release_date.lte=${todayStr}&vote_count.gte=20&vote_average.gte=5&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_ALL.join(',')}`);
    const newMovies = await newMoviesRes.json();

    const newTVRes = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&first_air_date.gte=${dateStr}&first_air_date.lte=${todayStr}&vote_count.gte=20&vote_average.gte=5&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_TV.concat([99, 10402, 10770]).join(',')}`);
    const newTV = await newTVRes.json();

    const ongoingRes = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&first_air_date.lte=${todayStr}&vote_count.gte=50&vote_average.gte=5&with_status=0|1&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_TV.concat([99, 10402, 10770]).join(',')}&page=1`);
    const ongoing = await ongoingRes.json();

    const notifications = [];

    (newMovies.results || []).slice(0, 5).forEach(function(item) {
      notifications.push({
        id: item.id, media_type: 'movie', title: item.title, poster_path: item.poster_path,
        type: 'new_release', message: 'New movie released!', createdAt: Date.now(), read: false
      });
    });

    (newTV.results || []).slice(0, 5).forEach(function(item) {
      notifications.push({
        id: item.id, media_type: 'tv', title: item.name, poster_path: item.poster_path,
        type: 'new_release', message: 'New TV series released!', createdAt: Date.now(), read: false
      });
    });

    (ongoing.results || []).slice(0, 8).forEach(function(item) {
      if (!item.poster_path) return;
      const isKdrama = (item.origin_country || []).includes('KR');
      let typeLabel = 'TV Series';
      if (isKdrama) typeLabel = 'Korean Series';

      notifications.push({
        id: item.id, media_type: 'tv', title: item.name, poster_path: item.poster_path,
        type: 'new_episode', message: 'New episode available! (' + typeLabel + ')',
        createdAt: Date.now(), read: false
      });
    });

    saveNotifications(notifications);
  } catch (err) {
    console.error('[Notifications]', err);
  }
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

  if (list.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  list.forEach(function(notif) {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.onclick = function() {
      closeNotifications();
      showDetails(notif);
    };

    const img = document.createElement('img');
    img.className = 'notif-item-img';
    img.alt = notif.title;
    img.loading = 'lazy';
    if (notif.poster_path) {
      img.src = `${IMG_W500}${notif.poster_path}`;
    } else {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 75" fill="%23333"><rect width="50" height="75"/></svg>';
    }

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

  const familyToggle = document.getElementById('family-mode-toggle');
  if (familyToggle) familyToggle.checked = isFamilyModeOn();

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
// DISPLAY FUNCTIONS
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
    const type = item.media_type === 'movie' ? 'Movie' : (item.media_type === 'tv' ? 'TV Series' : 'Movie');
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
  container.innerHTML = '';
  items.forEach(item => {
    if (!item.poster_path) return;
    if (mediaType) item.media_type = mediaType;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    img.dataset.id = item.id;
    img.onclick = () => showDetails(item);
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
    card.onclick = function() {
      openProviderPage(provider.id, provider.name, provider.type);
    };
    container.appendChild(card);
  });
}

function renderGenresInMore() {
  const container = document.getElementById('more-genres-list');
  if (!container) return;
  container.innerHTML = '';

  GENRE_LIST.forEach(function(genre) {
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
  'genre': 'genre-filter-panel',
  'vivamax': 'vivamax-filter-panel'
};

const FILTER_PREFIX_MAP = {
  'view-all': 'filter-',
  'provider': 'provider-filter-',
  'genre': 'genre-filter-',
  'vivamax': 'vivamax-filter-'
};

function toggleFilters(pageKey) {
  const panelId = FILTER_PANEL_MAP[pageKey];
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;

  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

function getFilterValues(pageKey) {
  const prefix = FILTER_PREFIX_MAP[pageKey] || 'filter-';
  const yearEl = document.getElementById(prefix + 'year');
  const genreEl = document.getElementById(prefix + 'genre');
  const countryEl = document.getElementById(prefix + 'country');
  const sortEl = document.getElementById(prefix + 'sort');

  return {
    year: yearEl ? yearEl.value : '',
    genre: genreEl ? genreEl.value : '',
    country: countryEl ? countryEl.value : '',
    sort: sortEl ? sortEl.value : 'popularity.desc'
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
  } else if (pageKey === 'vivamax') {
    vivamaxPageState.filters = filters;
    vivamaxPageState.page = 1;
    vivamaxPageState.hasMore = true;
    vivamaxPageState.seenIds = new Set();
    document.getElementById('vivamax-page-grid').innerHTML = '';
    document.getElementById('vivamax-page-end').style.display = 'none';
    loadVivamaxBatch();
  }

  const panelId = FILTER_PANEL_MAP[pageKey];
  if (panelId) document.getElementById(panelId).style.display = 'none';
}

function clearFilters(pageKey) {
  const prefix = FILTER_PREFIX_MAP[pageKey] || 'filter-';
  const yearEl = document.getElementById(prefix + 'year');
  const genreEl = document.getElementById(prefix + 'genre');
  const countryEl = document.getElementById(prefix + 'country');
  const sortEl = document.getElementById(prefix + 'sort');

  if (yearEl) yearEl.value = '';
  if (genreEl) genreEl.value = '';
  if (countryEl) countryEl.value = '';
  if (sortEl) sortEl.value = 'popularity.desc';

  applyFilters(pageKey);
}

function buildFilterParams(filters, mediaType) {
  let params = '';
  if (filters.year) {
    if (mediaType === 'movie') params += `&primary_release_year=${filters.year}`;
    else params += `&first_air_date_year=${filters.year}`;
  }
  if (filters.genre) params += `&with_genres=${filters.genre}`;
  if (filters.country) params += `&with_origin_country=${filters.country}`;
  return params;
}

// ============================================================
// CLOSE FUNCTIONS
// ============================================================

function closeAllPagesOnly() {
  const pagesToClose = [
    'view-all-page', 'provider-page', 'my-list-page', 'more-page',
    'search-modal', 'genre-page', 'ongoing-page', 'completed-page',
    'vivamax-page', 'user-profile-page'
  ];
  pagesToClose.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      el.scrollTop = 0;
    }
  });
  document.body.style.overflow = '';
}

function closeViewAll() { closeAllPagesOnly(); setActiveNav('home'); }
function closeVivamaxPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeGenrePage() { closeAllPagesOnly(); setActiveNav('more'); }
function closeOngoingPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeCompletedPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeProviderPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeMyListPage() { closeAllPagesOnly(); setActiveNav('home'); }
function closeMorePage() { closeAllPagesOnly(); setActiveNav('home'); }

function openMoviesPage() { openViewAll('movies'); }
function openSeriesPage() { openViewAll('tv'); }
function closeMoviesPage() { closeViewAll(); }
function closeSeriesPage() { closeViewAll(); }

function closeSearchModal() {
  closeAllPagesOnly();
  document.body.style.overflow = '';
  setActiveNav('home');
}

// ============================================================
// PAGE OPENERS
// ============================================================

function openVivamaxPage() {
  closeAllPagesOnly();
  const page = document.getElementById('vivamax-page');
  page.classList.add('open');
  page.scrollTop = 0;

  vivamaxPageState = { page: 1, maxPages: 500, loading: false, hasMore: true, initialized: true, seenIds: new Set(), filters: {} };

  document.getElementById('vivamax-page-grid').innerHTML = '';
  document.getElementById('vivamax-page-end').style.display = 'none';
  document.getElementById('vivamax-page-loading').style.display = 'none';

  page.removeEventListener('scroll', vivamaxPageScrollHandler);
  page.addEventListener('scroll', vivamaxPageScrollHandler, { passive: true });

  setActiveNav('home');
  loadVivamaxBatch();
  pushLayer('vivamax');
}

function vivamaxPageScrollHandler() {
  if (!vivamaxPageState.initialized || vivamaxPageState.loading || !vivamaxPageState.hasMore) return;
  const page = document.getElementById('vivamax-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) loadVivamaxBatch();
}

async function loadVivamaxBatch() {
  if (vivamaxPageState.loading || !vivamaxPageState.hasMore) return;
  vivamaxPageState.loading = true;
  document.getElementById('vivamax-page-loading').style.display = 'block';

  try {
    const filters = vivamaxPageState.filters || {};
    const sortBy = filters.sort || 'primary_release_date.desc';

    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
      `&with_companies=${VIVAMAX_COMPANY_ID}` +
      `&sort_by=${sortBy}` +
      `&include_adult=true` +
      `&page=${vivamaxPageState.page}`;

    if (filters.year) url += `&primary_release_year=${filters.year}`;
    if (filters.genre) url += `&with_genres=${filters.genre}`;
    if (filters.country) url += `&with_origin_country=${filters.country}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      vivamaxPageState.hasMore = false;
      document.getElementById('vivamax-page-end').style.display = 'block';
      return;
    }

    vivamaxPageState.maxPages = data.total_pages || 1;
    vivamaxPageState.page += 1;

    const grid = document.getElementById('vivamax-page-grid');
    data.results.forEach(function(item) {
      if (!item.poster_path) return;
      if (vivamaxPageState.seenIds.has(item.id)) return;
      vivamaxPageState.seenIds.add(item.id);
      item.media_type = 'movie';
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });

    if (vivamaxPageState.page > vivamaxPageState.maxPages) {
      vivamaxPageState.hasMore = false;
      document.getElementById('vivamax-page-end').style.display = 'block';
    }
  } catch (err) { console.error(err); }
  finally {
    vivamaxPageState.loading = false;
    document.getElementById('vivamax-page-loading').style.display = 'none';
  }
}

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
    const sortBy = filters.sort || 'popularity.desc';

    let url = `${BASE_URL}/discover/${genre.media}?api_key=${API_KEY}` +
      `&with_genres=${genre.id}` +
      `&sort_by=${sortBy}` +
      `&vote_average.gte=5` +
      `&page=${genrePageState.page}` +
      `&without_original_language=${INDIAN_LANGS.join('|')}` +
      `&without_genres=${EXCLUDED_GENRES_ALL.join(',')}`;

    if (filters.year) {
      if (genre.media === 'movie') url += `&primary_release_year=${filters.year}`;
      else url += `&first_air_date_year=${filters.year}`;
    }
    if (filters.country) url += `&with_origin_country=${filters.country}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      genrePageState.hasMore = false;
      document.getElementById('genre-page-end').style.display = 'block';
      return;
    }

    genrePageState.maxPages = data.total_pages || 1;
    genrePageState.page += 1;

    const grid = document.getElementById('genre-page-grid');
    applyAllFilters(data.results, genre.media).forEach(function(item) {
      if (!item.poster_path) return;
      if (genrePageState.seenIds.has(item.id)) return;
      genrePageState.seenIds.add(item.id);
      item.media_type = genre.media;
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });

    if (genrePageState.page > genrePageState.maxPages) {
      genrePageState.hasMore = false;
      document.getElementById('genre-page-end').style.display = 'block';
    }
  } catch (err) { console.error(err); }
  finally {
    genrePageState.loading = false;
    document.getElementById('genre-page-loading').style.display = 'none';
  }
}

function openProviderPage(providerId, providerName, providerType) {
  closeAllPagesOnly();
  const page = document.getElementById('provider-page');
  page.classList.add('open');
  page.scrollTop = 0;

  providerPageState = {
    providerId: providerId, providerName: providerName, providerType: providerType || 'provider',
    page: 1, batchCount: 0, maxPages: 500, loading: false, hasMore: true,
    initialized: true, seenIds: new Set(), filters: {}
  };

  document.getElementById('provider-page-title').textContent = '📡 ' + providerName;
  document.getElementById('provider-page-grid').innerHTML = '';
  document.getElementById('provider-page-end').style.display = 'none';
  document.getElementById('provider-page-loading').style.display = 'none';

  const sortEl = document.getElementById('provider-filter-sort');
  if (sortEl) sortEl.value = 'popularity.desc';

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
      `&watch_region=US` +
      `&page=${apiPage}` +
      `&sort_by=${sortBy}` +
      `&vote_average.gte=5` +
      `&without_original_language=${INDIAN_LANGS.join('|')}` +
      `&without_genres=${EXCLUDED_GENRES_ALL.join(',')}`;

    if (filters.year) {
      if (mediaType === 'movie') url += `&primary_release_year=${filters.year}`;
      else url += `&first_air_date_year=${filters.year}`;
    }
    if (filters.genre) url += `&with_genres=${filters.genre}`;
    if (filters.country) url += `&with_origin_country=${filters.country}`;

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
    applyAllFilters(data.results, mediaType).forEach(function(item) {
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
// WATCHLIST
// ============================================================

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('mobiflix_watchlist')) || []; }
  catch (e) { return []; }
}

function saveWatchlist(list) {
  localStorage.setItem('mobiflix_watchlist', JSON.stringify(list));
}

// ============================================================
// PLAY NOW
// ============================================================

function playNow() {
  if (!currentItem) return;
  const isMovie = currentItem.media_type === 'movie' || (!currentItem.media_type && currentItem.title);
  const title = currentItem.title || currentItem.name || 'MobiFlix';
  const year = (currentItem.release_date || currentItem.first_air_date || '').slice(0, 4);

  let url;
  if (isMovie) {
    url = `player.html?type=movie&id=${currentItem.id}&title=${encodeURIComponent(title)}&year=${year}`;
  } else {
    url = `player.html?type=tv&id=${currentItem.id}&title=${encodeURIComponent(title)}`;
  }

  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(function() {});
  }
  window.location.href = url;
}

// ============================================================
// MY LIST PAGE
// ============================================================

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

  if (list.length === 0) {
    empty.style.display = 'block';
    return;
  }

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
// SEARCH (may BL filter sa Korean series)
// ============================================================

function openSearchModal() {
  closeAllPagesOnly();
  const modal = document.getElementById('search-modal');
  modal.classList.add('open');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  setActiveNav('home');
  setTimeout(function() {
    document.getElementById('search-input').focus();
  }, 200);
  pushLayer('search');
}

let searchTimeout;
async function searchTMDB() {
  clearTimeout(searchTimeout);
  const query = document.getElementById('search-input').value;
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const familyMode = isFamilyModeOn();
      const includeAdult = !familyMode;

      const [movieRes, tvRes, krRes] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=${includeAdult}&region=PH&language=en-US`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=en-US`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=ko-KR`)
      ]);

      const movieData = await movieRes.json();
      const tvData = await tvRes.json();
      const krData = await krRes.json();

      let movies = (movieData.results || []).map(function(m) {
        m.media_type = 'movie';
        return m;
      });
      let tvs = (tvData.results || []).map(function(t) {
        t.media_type = 'tv';
        return t;
      });

      if (familyMode) {
        movies = movies.filter(function(m) { return !m.adult; });
        tvs = tvs.filter(function(t) { return !t.adult; });
      }

      // Korean series — may rating filter (5+) at BL filter
      const koreanSeries = (krData.results || [])
        .filter(function(t) {
          const genres = t.genre_ids || [];
          return !genres.some(function(g) { return KOREAN_EXCLUDE_GENRES.includes(g); });
        })
        .filter(function(t) {
          return (t.vote_average || 0) >= 5;
        })
        .filter(function(t) {
          return !isBLSeries(t);
        })
        .map(function(t) {
          t.media_type = 'tv';
          t._isKorean = true;
          return t;
        });

      const seen = new Set();
      const combined = [];

      koreanSeries.forEach(function(item) {
        if (!seen.has(item.id) && item.poster_path && !INDIAN_LANGS.includes(item.original_language)) {
          if (familyMode && item.adult) return;
          seen.add(item.id);
          combined.push(item);
        }
      });

      [...movies, ...tvs].forEach(function(item) {
        if (!seen.has(item.id) && item.poster_path && !INDIAN_LANGS.includes(item.original_language)) {
          if (familyMode && item.adult) return;
          seen.add(item.id);
          combined.push(item);
        }
      });

      const finalResults = combined
        .filter(function(item) {
          const date = item.release_date || item.first_air_date;
          if (!date) return true;
          return date <= new Date().toISOString().split('T')[0];
        })
        .sort(function(a, b) {
          if (a._isKorean && !b._isKorean) return -1;
          if (!a._isKorean && b._isKorean) return 1;
          return (b.popularity || 0) - (a.popularity || 0);
        });

      const container = document.getElementById('search-results');
      container.innerHTML = '';

      if (finalResults.length === 0) {
        container.innerHTML = '<div style="color:#666;padding:40px 20px;text-align:center;grid-column:1/-1;">No results found.</div>';
        return;
      }

      finalResults.forEach(function(item) {
        const img = document.createElement('img');
        img.src = `${IMG_W500}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = function() {
          closeSearchModal();
          showDetails(item);
        };
        container.appendChild(img);
      });
    } catch (err) {
      console.error('[Search]', err);
    }
  }, 300);
}

// ============================================================
// BOTTOM NAV
// ============================================================

function setActiveNav(name) {
  document.querySelectorAll('.bottom-nav-item').forEach(function(el) {
    el.classList.remove('active');
  });
  const items = document.querySelectorAll('.bottom-nav-item');
  const map = { home: 0, movies: 1, series: 2, more: 3, profile: 4 };
  if (items[map[name]]) items[map[name]].classList.add('active');
}

function goHome() {
  layerStack = [];

  const pagesToClose = [
    'view-all-page', 'provider-page', 'my-list-page', 'more-page',
    'search-modal', 'genre-page', 'ongoing-page', 'completed-page',
    'vivamax-page', 'user-profile-page'
  ];
  pagesToClose.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      el.scrollTop = 0;
    }
  });

  document.body.style.overflow = '';
  setActiveNav('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  history.pushState({ mobiflixTrap: false }, '', '#home');
  history.pushState({ mobiflixHome: true }, '', '#home');
}

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
// VIEW ALL PAGE (may BL filter sa Korean Series)
// ============================================================

function openViewAll(key) {
  closeAllPagesOnly();
  const config = HOME_ROWS[key];
  if (!config) return;

  viewAllState = { key: key, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: true, seenIds: new Set(), filters: {} };

  document.getElementById('view-all-title').textContent = config.icon + ' ' + config.name;

  const sortEl = document.getElementById('filter-sort');
  if (sortEl) sortEl.value = 'popularity.desc';

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
  else if (key === 'kdrama') setActiveNav('home');

  loadViewAllBatch();
  pushLayer('view-all');
}

async function loadViewAllBatch() {
  if (viewAllState.loading || !viewAllState.hasMore) return;
  viewAllState.loading = true;
  document.getElementById('view-all-loading').style.display = 'block';

  const key = viewAllState.key;
  const config = HOME_ROWS[key];
  const grid = document.getElementById('view-all-grid');

  try {
    let data;
    const filters = viewAllState.filters || {};
    const hasFilters = filters.year || filters.genre || filters.country;
    const sortBy = filters.sort || 'popularity.desc';

    if (key === 'kdrama') {
      const today = new Date().toISOString().split('T')[0];
      let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}` +
        `&with_origin_country=KR` +
        `&sort_by=${sortBy === 'popularity.desc' ? 'first_air_date.desc' : sortBy}` +
        `&first_air_date.lte=${today}` +
        `&vote_average.gte=5` +
        `&page=${viewAllState.page}` +
        `&without_original_language=${INDIAN_LANGS.join('|')}`;

      if (filters.year) url += `&first_air_date_year=${filters.year}`;
      if (filters.genre) url += `&with_genres=${filters.genre}`;

      const res = await fetch(url);
      data = await res.json();
      let results = filterKoreanSeriesWithRating(data.results);
      results = filterReleased(results);
      results.forEach(function(item) { item.media_type = 'tv'; });
      data.results = results;
    } else if (hasFilters) {
      let mediaType = config.media;
      const filterParams = buildFilterParams(filters, mediaType);
      const url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}${filterParams}&sort_by=${sortBy}&vote_average.gte=5&page=${viewAllState.page}&without_original_language=${INDIAN_LANGS.join('|')}&without_genres=${EXCLUDED_GENRES_ALL.join(',')}`;
      const res = await fetch(url);
      data = await res.json();
      let results = applyAllFilters(data.results, mediaType);
      data.results = results;
    } else {
      if (key === 'movies') {
        data = await fetchMostWatched('movie', viewAllState.page);
      } else if (key === 'tv') {
        data = await fetchMostWatched('tv', viewAllState.page);
      }
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
    console.log('[MobiFlix] Initializing...');

    checkDailyUpdate();

    createSnow();
    loadTheme();
    renderProviders();
    renderContinueWatching();
    updateNotifBadge();
    populateCountryDropdowns();

    const notifToggle = document.getElementById('notif-toggle');
    if (notifToggle) notifToggle.checked = isNotifEnabled();

    const familyToggle = document.getElementById('family-mode-toggle');
    if (familyToggle) familyToggle.checked = isFamilyModeOn();

    const familyMode = isFamilyModeOn();

    const [moviesData, tvData, kdramaData] = await Promise.all([
      fetchTrendingUS('movie', 1),
      fetchTrendingUS('tv', 1),
      fetchKoreanSeriesNewest(1)
    ]);

    let vivamaxData = { results: [] };
    if (!familyMode) {
      vivamaxData = await fetchVivamaxMovies(1);
    } else {
      const vivamaxRow = document.getElementById('vivamax-row');
      if (vivamaxRow) vivamaxRow.style.display = 'none';
    }

    if (moviesData.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, moviesData.results.length));
      displayBanner(moviesData.results[randomIndex]);
    }

    moviesData.results.forEach(function(item) { item.media_type = 'movie'; });
    tvData.results.forEach(function(item) { item.media_type = 'tv'; });
    kdramaData.results.forEach(function(item) { item.media_type = 'tv'; });
    vivamaxData.results.forEach(function(item) { item.media_type = 'movie'; });

    renderTop10(moviesData.results, 'top10-movies', 'movie');
    renderTop10(tvData.results, 'top10-tv', 'tv');
    renderTop10(kdramaData.results, 'top10-kdrama', 'tv');

    appendToList(vivamaxData.results, 'vivamax-list', 'movie');

    generateNotifications().catch(function(err) {
      console.error('[MobiFlix] Notif error:', err);
    });

    console.log('[MobiFlix] Ready.');
  } catch (err) { console.error('[MobiFlix] Init error:', err); }
}

function startSnowWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        if (!document.getElementById('snow-container')) createSnow();
      }, 500);
    });
  } else {
    setTimeout(function() {
      if (!document.getElementById('snow-container')) createSnow();
    }, 500);
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