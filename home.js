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

let currentItem;
let bannerItem;
let pages = { movie: 1, tv: 1, anime: 1 };
let loading = { movie: false, tv: false, anime: false };
let maxPages = { movie: 500, tv: 500, anime: 500 };

// ===== FETCH =====
async function fetchTrending(type, page) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

async function fetchAnime(page) {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  const filtered = (data.results || []).filter(item =>
    item.original_language === 'ja' && item.genre_ids && item.genre_ids.includes(16)
  );
  return { results: filtered, total_pages: data.total_pages || 1 };
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
  document.getElementById('modal-backdrop').src = `${IMG_URL}${item.backdrop_path || item.poster_path}`;

  const rating = Math.round(item.vote_average / 2);
  document.getElementById('modal-rating').innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  document.getElementById('modal-year').textContent = year || '—';

  const type = item.media_type === 'movie' ? 'Movie' : (item.media_type === 'tv' ? 'TV Show' : 'Anime');
  document.getElementById('modal-type').textContent = type;

  // Populate server dropdown based on type
  populateServerDropdown(item);

  // Auto-load first server
  changeServer();

  document.getElementById('modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ===== POPULATE SERVER DROPDOWN =====
function populateServerDropdown(item) {
  const select = document.getElementById('server');
  const isMovie = item.media_type === 'movie' || (!item.media_type && item.title);
  const endpoints = isMovie ? MOVIE_ENDPOINTS : SERIES_ENDPOINTS;

  select.innerHTML = '';
  endpoints.forEach((ep, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = ep.name;
    select.appendChild(option);
  });

  // Store endpoints reference
  select.dataset.type = isMovie ? 'movie' : 'tv';
}

// ===== CHANGE SERVER =====
function changeServer() {
  if (!currentItem) return;

  const select = document.getElementById('server');
  const index = parseInt(select.value) || 0;
  const type = select.dataset.type || (currentItem.media_type === 'movie' ? 'movie' : 'tv');
  const endpoints = type === 'movie' ? MOVIE_ENDPOINTS : SERIES_ENDPOINTS;
  const endpoint = endpoints[index];

  if (!endpoint) return;

  let embedURL = '';

  // Build URL based on endpoint type
  if (endpoint.url.includes('vidsrc.cc/v2')) {
    embedURL = `${endpoint.url}${currentItem.id}`;
  } else if (endpoint.url.includes('vidsrc.me') || endpoint.url.includes('vidsrc.vip')) {
    embedURL = `${endpoint.url}${currentItem.id}`;
  } else if (endpoint.url.includes('2embed.cc/embedtvfull')) {
    embedURL = `${endpoint.url}${currentItem.id}`;
  } else if (endpoint.url.includes('vidsrc.net')) {
    embedURL = `${endpoint.url}${type}/?tmdb=${currentItem.id}`;
  } else {
    embedURL = `${endpoint.url}${currentItem.id}`;
  }

  document.getElementById('modal-video').src = embedURL;
  console.log(`[Player] ${endpoint.name} → ${embedURL}`);
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

// ===== INFINITE SCROLL =====
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
    } else if (category === 'anime') {
      result = await fetchAnime(pages[category]);
      containerId = 'anime-list';
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

function attachScrollListeners() {
  const rows = [
    { id: 'movies-list', category: 'movie' },
    { id: 'tvshows-list', category: 'tv' },
    { id: 'anime-list', category: 'anime' }
  ];
  rows.forEach(row => {
    const el = document.getElementById(row.id);
    if (!el) return;
    el.addEventListener('scroll', () => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 200) {
        loadMore(row.category);
      }
    });
  });
}

// ===== INIT =====
async function init() {
  try {
    const moviesData = await fetchTrending('movie', 1);
    const tvData = await fetchTrending('tv', 1);
    const animeData = await fetchAnime(1);

    maxPages.movie = moviesData.total_pages;
    maxPages.tv = tvData.total_pages;
    maxPages.anime = animeData.total_pages;

    if (moviesData.results.length > 0) {
      displayBanner(moviesData.results[Math.floor(Math.random() * moviesData.results.length)]);
    }
    appendToList(moviesData.results, 'movies-list');
    appendToList(tvData.results, 'tvshows-list');
    appendToList(animeData.results, 'anime-list');
    attachScrollListeners();

    console.log('[MyFlix] Ready.');
  } catch (err) {
    console.error('[MyFlix] Init error:', err);
  }
}

init();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeSearchModal(); }
});
