const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

let currentItem;
let bannerItem;

// Track current page per category
let pages = {
  movie: 1,
  tv: 1,
  anime: 1
};

// Track loading state per category
let loading = {
  movie: false,
  tv: false,
  anime: false
};

// Track max pages (TMDB limit is usually 500 or 1000)
let maxPages = {
  movie: 500,
  tv: 500,
  anime: 500
};

// ===== FETCH FUNCTIONS =====

async function fetchTrending(type, page) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    page: data.page || 1
  };
}

async function fetchAnime(page) {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  const filtered = (data.results || []).filter(item =>
    item.original_language === 'ja' && item.genre_ids && item.genre_ids.includes(16)
  );
  return {
    results: filtered,
    total_pages: data.total_pages || 1,
    page: data.page || 1
  };
}

// ===== DISPLAY FUNCTIONS =====

function displayBanner(item) {
  bannerItem = item;
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path || item.poster_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function playBanner() {
  if (bannerItem) showDetails(bannerItem);
}

function showBannerInfo() {
  if (bannerItem) showDetails(bannerItem);
}

// Append items (not replace) — para sa infinite scroll
function appendToList(items, containerId) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    if (!item.poster_path) return;

    // Skip kung duplicate na
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

// Reset list (para sa search)
function resetList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  appendToList(items, containerId);
}

// ===== MODAL FUNCTIONS =====

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

  changeServer();
  document.getElementById('modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = (currentItem.media_type === "movie") ? "movie" : "tv";
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

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

// ===== INFINITE SCROLL LOGIC =====

// Load more items kapag naabot ang dulo
async function loadMore(category) {
  if (loading[category]) return;
  if (pages[category] >= maxPages[category]) return;

  loading[category] = true;
  pages[category] += 1;

  try {
    let result;
    let containerId;

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

    if (result && result.results && result.results.length > 0) {
      maxPages[category] = result.total_pages;
      appendToList(result.results, containerId);
      console.log(`[Infinite] ${category} page ${pages[category]} loaded (${result.results.length} items)`);
    }
  } catch (err) {
    console.error(`[Infinite] Error loading ${category}:`, err);
  } finally {
    loading[category] = false;
  }
}

// I-attach ang scroll listeners sa bawat row
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
      // Detect kung malapit na sa dulo (right side)
      const scrollLeft = el.scrollLeft;
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth;

      // Kung 200px na lang ang natitira bago ang dulo
      if (scrollLeft + clientWidth >= scrollWidth - 200) {
        loadMore(row.category);
      }
    });
  });
}

// ===== INIT =====

async function init() {
  try {
    console.log('[MyFlix] Initializing...');

    // Load initial data
    const moviesData = await fetchTrending('movie', 1);
    const tvData = await fetchTrending('tv', 1);
    const animeData = await fetchAnime(1);

    // Set max pages
    maxPages.movie = moviesData.total_pages;
    maxPages.tv = tvData.total_pages;
    maxPages.anime = animeData.total_pages;

    // Display banner
    if (moviesData.results.length > 0) {
      displayBanner(moviesData.results[Math.floor(Math.random() * moviesData.results.length)]);
    }

    // Display initial lists
    appendToList(moviesData.results, 'movies-list');
    appendToList(tvData.results, 'tvshows-list');
    appendToList(animeData.results, 'anime-list');

    // Attach infinite scroll listeners
    attachScrollListeners();

    console.log('[MyFlix] Initialized. Movies:', moviesData.results.length, '| TV:', tvData.results.length, '| Anime:', animeData.results.length);
  } catch (err) {
    console.error('[MyFlix] Init error:', err);
  }
}

init();

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeSearchModal();
  }
});
