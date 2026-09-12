const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

// ===== ENDPOINTS =====
const MOVIE_ENDPOINTS = [
  { name: 'VidLink', url: 'https://vidlink.pro/movie/' },
  { name: 'VidSrc.dev', url: 'https://vidsrc.dev/embed/movie/' },
  { name: '111Movies', url: 'https://111movies.com/movie/' },
  { name: 'VidJoy', url: 'https://vidjoy.pro/embed/movie/' },
  { name: 'VidSrc.io', url: 'https://vidsrc.io/embed/movie/' },
  { name: 'VidSrc.cc', url: 'https://vidsrc.cc/v2/embed/movie/' },
  { name: 'VidSrc.xyz', url: 'https://vidsrc.xyz/embed/movie/' },
  { name: '2Embed', url: 'https://www.2embed.cc/embed/' },
  { name: 'MoviesAPI', url: 'https://moviesapi.club/movie/' }
];

const SERIES_ENDPOINTS = [
  { name: 'VidLink', url: 'https://vidlink.pro/tv/' },
  { name: 'VidSrc.vip', url: 'https://vidsrc.vip/embed/tv/' },
  { name: '111Movies', url: 'https://111movies.com/tv/' },
  { name: 'VidSrc.dev', url: 'https://vidsrc.dev/embed/tv/' },
  { name: 'VidJoy', url: 'https://vidjoy.pro/embed/tv/' },
  { name: 'VidSrc.me', url: 'https://vidsrc.me/embed/tv/' },
  { name: 'VidSrc.cc', url: 'https://vidsrc.cc/v2/embed/tv/' },
  { name: 'VidSrc.xyz', url: 'https://vidsrc.xyz/embed/tv/' },
  { name: '2Embed', url: 'https://www.2embed.cc/embedtvfull/' },
  { name: 'MoviesAPI', url: 'https://moviesapi.club/tv/' }
];

// ===== GENRE MAP =====
const GENRE_MAP = {
  movie: { name: 'Trending Movies', type: 'trending', media: 'movie', icon: '🔥' },
  tv: { name: 'Trending TV Shows', type: 'trending', media: 'tv', icon: '📺' },
  action: { name: 'Action', movieId: 28, tvId: 10759, icon: '💥' },
  horror: { name: 'Horror', movieId: 27, tvId: 9648, icon: '👻' },
  scifi: { name: 'Sci-Fi', movieId: 878, tvId: 10765, icon: '🚀' },
  comedy: { name: 'Comedy', movieId: 35, tvId: 35, icon: '😂' },
  romance: { name: 'Romance', movieId: 10749, tvId: 18, icon: '💕' },
  drama: { name: 'Drama', movieId: 18, tvId: 18, icon: '🎭' },
  thriller: { name: 'Thriller', movieId: 53, tvId: 9648, icon: '🕵️' },
  fantasy: { name: 'Fantasy', movieId: 14, tvId: 10765, icon: '🧙' },
  mystery: { name: 'Mystery', movieId: 9648, tvId: 9648, icon: '🔍' }
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
  moviePage: 1,
  tvPage: 1,
  movieMaxPages: 500,
  tvMaxPages: 500,
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

// POPULARITY (Movie) — hindi Trending
async function fetchByGenreMovie(genreId, page) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// POPULARITY (TV Show) — hindi Trending
async function fetchByGenreTV(genreId, page) {
  const res = await fetch(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
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

// ===== SERVER DROPDOWN (Server 1, Server 2, ...) =====
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

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
  document.body.style.overflow = '';
}

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
    moviePage: 1,
    tvPage: 1,
    movieMaxPages: 500,
    tvMaxPages: 500,
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

  document.getElementById('view-all-page').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('view-all-page').scrollTop = 0;

  loadViewAllBatch();
}

async function loadViewAllBatch() {
  if (viewAllState.loading || !viewAllState.hasMore) return;

  viewAllState.loading = true;
  document.getElementById('view-all-loading').style.display = 'block';

  const genre = GENRE_MAP[viewAllState.key];
  const grid = document.getElementById('view-all-grid');

  try {
    let movieData = { results: [], total_pages: 1 };
    let tvData = { results: [], total_pages: 1 };

    if (genre.type === 'trending') {
      const data = await fetchTrending(genre.media, viewAllState.moviePage);
      if (genre.media === 'movie') {
        movieData = data;
      } else {
        tvData = data;
      }
      viewAllState.moviePage += 1;
    } else {
      const moviePromise = fetchByGenreMovie(genre.movieId, viewAllState.moviePage);
      const tvPromise = fetchByGenreTV(genre.tvId, viewAllState.tvPage);

      const [movieRes, tvRes] = await Promise.all([moviePromise, tvPromise]);
      movieData = movieRes;
      tvData = tvRes;

      viewAllState.movieMaxPages = movieData.total_pages;
      viewAllState.tvMaxPages = tvData.total_pages;

      viewAllState.moviePage += 1;
      viewAllState.tvPage += 1;

      if (viewAllState.moviePage > viewAllState.movieMaxPages &&
          viewAllState.tvPage > viewAllState.tvMaxPages) {
        viewAllState.hasMore = false;
      }
    }

    const combined = [];
    const maxLen = Math.max(movieData.results.length, tvData.results.length);
    for (let i = 0; i < maxLen; i++) {
      if (movieData.results[i]) combined.push(movieData.results[i]);
      if (tvData.results[i]) combined.push(tvData.results[i]);
    }

    combined.forEach(item => {
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

    if (genre.type !== 'trending') {
      if (viewAllState.moviePage > viewAllState.movieMaxPages &&
          viewAllState.tvPage > viewAllState.tvMaxPages) {
        viewAllState.hasMore = false;
      }
    } else {
      if (viewAllState.moviePage > movieData.total_pages) {
        viewAllState.hasMore = false;
      }
    }

    if (!viewAllState.hasMore) {
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
  document.getElementById('view-all-page').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('view-all-grid').innerHTML = '';
  viewAllState.initialized = false;
  viewAllState.seenIds = new Set();
}

function attachViewAllScroll() {
  const page = document.getElementById('view-all-page');
  if (!page) return;

  page.addEventListener('scroll', () => {
    if (!viewAllState.initialized) return;
    if (viewAllState.loading) return;
    if (!viewAllState.hasMore) return;

    if (page.scrollTop + page.clientHeight >= page.scrollHeight - 500) {
      loadViewAllBatch();
    }
  });
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
    attachViewAllScroll();
    console.log('[MobiFlix] Ready.');
  } catch (err) {
    console.error('[MobiFlix] Init error:', err);
  }
}

init();

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
