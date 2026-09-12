const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

// ===== ENDPOINTS =====
const MOVIE_ENDPOINTS = [
  { name: 'VidLink', url: 'https://vidlink.pro/movie/' },
  { name: '111Movies', url: 'https://111movies.com/movie/' },
  { name: 'VidSrc.io', url: 'https://vidsrc.io/embed/movie/' },
  { name: '2Embed', url: 'https://www.2embed.cc/embed/' }
];

const SERIES_ENDPOINTS = [
  { name: 'VidSrc.me', url: 'https://vidsrc.me/embed/tv/' },
  { name: '2Embed', url: 'https://www.2embed.cc/embed/' }
];

// ===== GENRE MAP =====
const GENRE_MAP = {
  movie: { name: 'Trending Movies', type: 'trending', media: 'movie', icon: '🔥' },
  tv: { name: 'Trending TV Shows', type: 'trending', media: 'tv', icon: '📺' },
  action: { name: 'Action', id: 28, icon: '💥' },
  horror: { name: 'Horror', id: 27, icon: '👻' },
  scifi: { name: 'Sci-Fi', id: 878, icon: '🚀' },
  comedy: { name: 'Comedy', id: 35, icon: '😂' },
  romance: { name: 'Romance', id: 10749, icon: '💕' },
  drama: { name: 'Drama', id: 18, icon: '🎭' },
  thriller: { name: 'Thriller', id: 53, icon: '🕵️' },
  fantasy: { name: 'Fantasy', id: 14, icon: '🧙' },
  mystery: { name: 'Mystery', id: 9648, icon: '🔍' }
};

// ===== GENRES for home rows =====
const GENRES = [
  { name: 'Action', id: 28, container: 'action-list', key: 'action' },
  { name: 'Horror', id: 27, container: 'horror-list', key: 'horror' },
  { name: 'Sci-Fi', id: 878, container: 'scifi-list', key: 'scifi' },
  { name: 'Comedy', id: 35, container: 'comedy-list', key: 'comedy' },
  { name: 'Romance', id: 10749, container: 'romance-list', key: 'romance' },
  { name: 'Drama', id: 18, container: 'drama-list', key: 'drama' },
  { name: 'Thriller', id: 53, container: 'thriller-list', key: 'thriller' },
  { name: 'Fantasy', id: 14, container: 'fantasy-list', key: 'fantasy' },
  { name: 'Mystery', id: 9648, container: 'mystery-list', key: 'mystery' }
];

let currentItem;
let bannerItem;

let pages = {
  movie: 1, tv: 1,
  action: 1, horror: 1, scifi: 1, comedy: 1, romance: 1,
  drama: 1, thriller: 1, fantasy: 1, mystery: 1
};

let loading = {
  movie: false, tv: false,
  action: false, horror: false, scifi: false, comedy: false, romance: false,
  drama: false, thriller: false, fantasy: false, mystery: false
};

let maxPages = {
  movie: 500, tv: 500,
  action: 500, horror: 500, scifi: 500, comedy: 500, romance: 500,
  drama: 500, thriller: 500, fantasy: 500, mystery: 500
};

// ===== VIEW ALL STATE =====
let viewAllState = {
  key: null,
  page: 1,
  maxPages: 500,
  loading: false,
  hasMore: true,
  initialized: false,
  seenIds: new Set()
};

// ===== FETCH =====
async function fetchTrending(type, page) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

async function fetchByGenreMovie(genreId, page) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// ===== DISPLAY =====
function displayBanner(item) {
  bannerItem = item;
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path || item.poster_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function playBanner() { if (bannerItem) showDetails(bannerItem); }
function showBannerInfo() { if (bannerItem) showDetails(bannerItem); }

function appendToList(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(item => {
    if (!item.poster_path) return;
    const existing = container.querySelector(`img[data-id="${item.id}"]`);
    if (existing) return;
    const img = document.createElement('img');
    img.src = `${IMG_W500}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.loading = 'lazy';
    img.dataset.id = item.id;
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}

// ===== MODAL =====
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_W500}${item.poster_path}`;

  const rating = Math.round(item.vote_average / 2);
  document.getElementById('modal-rating').innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  document.getElementById('modal-year').textContent = year || '—';

  const type = item.media_type === 'movie' ? 'Movie' : (item.media_type === 'tv' ? 'TV Show' : 'Movie');
  document.getElementById('modal-type').textContent = type;

  populateServerDropdown(item);
  changeServer();

  document.getElementById('modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ===== SERVER DROPDOWN =====
function populateServerDropdown(item) {
  const select = document.getElementById('server');
  const isMovie = item.media_type === 'movie' || (!item.media_type && item.title);
  const endpoints = isMovie ? MOVIE_ENDPOINTS : SERIES_ENDPOINTS;

  select.innerHTML = '';
  endpoints.forEach((ep, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = 'Server ' + (i + 1);
    select.appendChild(option);
  });

  select.dataset.type = isMovie ? 'movie' : 'tv';
}

function changeServer() {
  if (!currentItem) return;
  const select = document.getElementById('server');
  const index = parseInt(select.value) || 0;
  const type = select.dataset.type || 'movie';
  const endpoints = type === 'movie' ? MOVIE_ENDPOINTS : SERIES_ENDPOINTS;
  const endpoint = endpoints[index];
  if (!endpoint) return;

  let embedURL = `${endpoint.url}${currentItem.id}`;
  document.getElementById('modal-video').src = embedURL;
}

// ===== CLOSE MODAL =====
function closeModal() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
  document.body.style.overflow = '';

  const icon = document.getElementById('fullscreen-icon');
  if (icon) icon.className = 'fa fa-expand';
}

// ===== FULLSCREEN =====
function toggleFullscreen() {
  const wrapper = document.getElementById('player-wrapper');
  const icon = document.getElementById('fullscreen-icon');

  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  if (!isFullscreen) {
    if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen().catch(function() {});
    } else if (wrapper.webkitRequestFullscreen) {
      wrapper.webkitRequestFullscreen();
    }
    if (icon) icon.className = 'fa fa-compress';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (icon) icon.className = 'fa fa-expand';
  }
}

function updateFullscreenUI() {
  const icon = document.getElementById('fullscreen-icon');
  const isFs = document.fullscreenElement || document.webkitFullscreenElement;
  if (icon) icon.className = isFs ? 'fa fa-compress' : 'fa fa-expand';
}

document.addEventListener('fullscreenchange', updateFullscreenUI);
document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

// ===== SEARCH =====
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
  document.body.style.overflow = 'hidden';
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
  document.body.style.overflow = '';
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
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    const container = document.getElementById('search-results');
    container.innerHTML = '';
    data.results.forEach(item => {
      if (!item.poster_path) return;
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.onclick = () => {
        closeSearchModal();
        showDetails(item);
      };
      container.appendChild(img);
    });
  }, 300);
}

// ===== SIDE MENU =====
function toggleMenu() {
  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('menu-overlay');
  if (!menu || !overlay) return;
  menu.classList.toggle('open');
  overlay.classList.toggle('open');
}

// ===== VIEW ALL PAGE =====
function openViewAll(key) {
  const genre = GENRE_MAP[key];
  if (!genre) return;

  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('menu-overlay');
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');

  viewAllState = {
    key: key,
    page: 1,
    maxPages: 500,
    loading: false,
    hasMore: true,
    initialized: true,
    seenIds: new Set()
  };

  document.getElementById('view-all-title').textContent = (genre.icon || '🎬') + ' ' + genre.name;

  const grid = document.getElementById('view-all-grid');
  grid.innerHTML = '';
  document.getElementById('view-all-end').style.display = 'none';
  document.getElementById('view-all-loading').style.display = 'none';

  const page = document.getElementById('view-all-page');
  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  page.style.overflowY = 'auto';
  page.style.webkitOverflowScrolling = 'touch';

  loadViewAllBatch();

  // Mobile: i-attach ang touchmove listener para siguradong naglo-load
  setTimeout(function() {
    attachViewAllScroll();
  }, 100);
}

async function loadViewAllBatch() {
  if (viewAllState.loading || !viewAllState.hasMore) return;

  viewAllState.loading = true;
  document.getElementById('view-all-loading').style.display = 'block';

  const genre = GENRE_MAP[viewAllState.key];
  const grid = document.getElementById('view-all-grid');

  try {
    let data;
    if (genre.type === 'trending') {
      data = await fetchTrending(genre.media, viewAllState.page);
    } else {
      data = await fetchByGenreMovie(genre.id, viewAllState.page);
    }

    viewAllState.maxPages = data.total_pages;
    viewAllState.page += 1;

    data.results.forEach(item => {
      if (!item.poster_path) return;
      if (viewAllState.seenIds.has(item.id)) return;
      viewAllState.seenIds.add(item.id);

      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = () => showDetails(item);
      grid.appendChild(img);
    });

    if (viewAllState.page > viewAllState.maxPages) {
      viewAllState.hasMore = false;
      document.getElementById('view-all-end').style.display = 'block';
    }
  } catch (err) {
    console.error('[ViewAll]', err);
  } finally {
    viewAllState.loading = false;
    document.getElementById('view-all-loading').style.display = 'none';
  }
}

function closeViewAll() {
  const page = document.getElementById('view-all-page');
  page.classList.remove('open');
  page.scrollTop = 0;
  document.body.style.overflow = '';
  document.getElementById('view-all-grid').innerHTML = '';
  viewAllState.initialized = false;
  viewAllState.seenIds = new Set();
}

// ===== VIEW ALL SCROLL (mobile-friendly) =====
let viewAllScrollTimer = null;

function attachViewAllScroll() {
  const page = document.getElementById('view-all-page');
  if (!page) return;

  // Tanggalin ang dating listeners
  page.removeEventListener('scroll', viewAllScrollHandler);
  page.removeEventListener('touchmove', viewAllScrollHandler);

  // Scroll handler
  page.addEventListener('scroll', viewAllScrollHandler, { passive: true });
  page.addEventListener('touchmove', viewAllScrollHandler, { passive: true });
}

function viewAllScrollHandler() {
  if (!viewAllState.initialized) return;
  if (viewAllState.loading) return;
  if (!viewAllState.hasMore) return;

  const page = document.getElementById('view-all-page');
  if (!page) return;

  clearTimeout(viewAllScrollTimer);
  viewAllScrollTimer = setTimeout(function() {
    const scrollPos = page.scrollTop + page.clientHeight;
    const threshold = page.scrollHeight - 300;

    if (scrollPos >= threshold) {
      console.log('[ViewAll] Loading more... (scrollPos:', scrollPos, 'threshold:', threshold, ')');
      loadViewAllBatch();
    }
  }, 150);
}

// ===== INFINITE SCROLL (HOME ROWS) =====
async function loadMore(category) {
  if (loading[category] || pages[category] >= maxPages[category]) return;
  loading[category] = true;
  pages[category] += 1;

  try {
    let result, containerId;
    if (category === 'movie') {
      result = await fetchTrending('movie', pages[category]);
      containerId = 'movies-list';
    } else if (category === 'tv') {
      result = await fetchTrending('tv', pages[category]);
      containerId = 'tvshows-list';
    }
    if (result && result.results.length > 0) {
      maxPages[category] = result.total_pages;
      appendToList(result.results, containerId);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading[category] = false;
  }
}

async function loadMoreGenre(category, genreId, containerId) {
  if (loading[category] || pages[category] >= maxPages[category]) return;
  loading[category] = true;
  pages[category] += 1;

  try {
    const data = await fetchByGenreMovie(genreId, pages[category]);
    if (data.results.length > 0) {
      maxPages[category] = data.total_pages;
      appendToList(data.results, containerId);
    }
  } catch (err) {
    console.error('[Genre]', err);
  } finally {
    loading[category] = false;
  }
}

function attachScrollListeners() {
  const rows = [
    { id: 'movies-list', category: 'movie' },
    { id: 'tvshows-list', category: 'tv' },
    { id: 'action-list', category: 'action', genre: 28 },
    { id: 'horror-list', category: 'horror', genre: 27 },
    { id: 'scifi-list', category: 'scifi', genre: 878 },
    { id: 'comedy-list', category: 'comedy', genre: 35 },
    { id: 'romance-list', category: 'romance', genre: 10749 },
    { id: 'drama-list', category: 'drama', genre: 18 },
    { id: 'thriller-list', category: 'thriller', genre: 53 },
    { id: 'fantasy-list', category: 'fantasy', genre: 14 },
    { id: 'mystery-list', category: 'mystery', genre: 9648 }
  ];

  rows.forEach(row => {
    const el = document.getElementById(row.id);
    if (!el) return;
    el.addEventListener('scroll', () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) {
        if (row.genre) {
          loadMoreGenre(row.category, row.genre, row.id);
        } else {
          loadMore(row.category);
        }
      }
    });
  });
}

// ===== INIT =====
async function init() {
  try {
    console.log('[MobiFlix] Initializing...');

    const moviesData = await fetchTrending('movie', 1);
    const tvData = await fetchTrending('tv', 1);

    maxPages.movie = moviesData.total_pages;
    maxPages.tv = tvData.total_pages;

    if (moviesData.results.length > 0) {
      displayBanner(moviesData.results[Math.floor(Math.random() * moviesData.results.length)]);
    }
    appendToList(moviesData.results, 'movies-list');
    appendToList(tvData.results, 'tvshows-list');

    for (let i = 0; i < GENRES.length; i++) {
      const genre = GENRES[i];
      try {
        const data = await fetchByGenreMovie(genre.id, 1);
        appendToList(data.results, genre.container);
      } catch (err) {
        console.error('[MobiFlix] Genre error:', genre.name, err);
      }
    }

    attachScrollListeners();
    console.log('[MobiFlix] Ready.');
  } catch (err) {
    console.error('[MobiFlix] Init error:', err);
  }
}

init();

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeSearchModal();
    closeViewAll();
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }
});
