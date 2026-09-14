const API_KEY = 'e0a7266a5d0e95c36475f349d8bc0a5a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

// ===== STREAMING PROVIDERS =====
const STREAMING_PROVIDERS = [
  { name: 'Netflix', id: 8, type: 'provider', color: '#e50914' },
  { name: 'Disney+', id: 337, type: 'provider', color: '#113ccf' },
  { name: 'Amazon Prime Video', id: 9, type: 'provider', color: '#00a8e1' },
  { name: 'Peacock', id: 386, type: 'provider', color: '#000000' },
  { name: 'Hulu', id: 15, type: 'provider', color: '#1ce783' },
  { name: 'Apple TV+', id: 350, type: 'provider', color: '#1c1c1e' }
];

const PROVIDER_LOGOS = {
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'Amazon Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo_%282022%29.svg',
  'Peacock': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
  'Hulu': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
  'Apple TV+': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg'
};

// ===== ENDPOINTS =====
const MOVIE_ENDPOINTS = [
  { name: 'Zxcstream', url: 'https://zxcstream.icu/watch/movie/' },
  { name: 'Vidstuck', url: 'https://vidstuck.xyz/embed/movie/' },
  { name: 'VidLink', url: 'https://vidlink.pro/movie/' },
  { name: '111Movies', url: 'https://111movies.com/movie/' },
  { name: 'VidSrc.io', url: 'https://vidsrc.io/embed/movie/' },
  { name: '2Embed', url: 'https://www.2embed.cc/embed/' }
];

const SERIES_ENDPOINTS = [
  { name: 'Zxcstream', url: 'https://zxcstream.icu/watch/tv/' },
  { name: 'Vidstuck', url: 'https://vidstuck.xyz/embed/tv/' },
  { name: 'VidSrc.me', url: 'https://vidsrc.me/embed/tv/' }
];

// ===== GENRE MAP (Movies at TV Shows na lang) =====
const GENRE_MAP = {
  movie: { name: 'Movies', type: 'trending', media: 'movie', icon: '🔥' },
  tv:    { name: 'TV Shows', type: 'trending', media: 'tv', icon: '📺' }
};

let currentItem;
let bannerItem;
let currentView = 'details';

let pages = { movie: 1, tv: 1 };
let loading = { movie: false, tv: false };
let maxPages = { movie: 500, tv: 500 };

let viewAllState = {
  key: null, page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set()
};

let providerPageState = {
  providerId: null,
  providerName: '',
  providerType: 'provider',
  page: 1,
  maxPages: 500,
  loading: false,
  hasMore: true,
  initialized: false,
  seenIds: new Set()
};

let moviesPageState = {
  page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set()
};

let seriesPageState = {
  page: 1, maxPages: 500, loading: false, hasMore: true, initialized: false, seenIds: new Set()
};

// ===== FETCH: TRENDING (sikat ngayong linggo) =====
async function fetchTrending(type, page) {
  let url;
  if (type === 'movie') {
    url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;
  } else {
    url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// ===== FETCH: TOP RATED (para sa malalim na scroll) =====
async function fetchTopRated(type, page) {
  const res = await fetch(
    `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&page=${page}`
  );
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// ===== FETCH BY PROVIDER =====
async function fetchByProvider(providerId, mediaType, page) {
  const res = await fetch(
    `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_watch_providers=${providerId}&watch_region=US&page=${page}&sort_by=popularity.desc&with_original_language=en`
  );
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// ===== DISPLAY BANNER =====
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
    const type = item.media_type === 'movie' ? 'Movie' : (item.media_type === 'tv' ? 'TV Show' : 'Movie');
    typeEl.textContent = type;
  }

  const descEl = document.getElementById('banner-description');
  if (descEl) descEl.textContent = item.overview || 'No description available.';
}

function playBanner() { if (bannerItem) showDetails(bannerItem); }

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

// ===== STREAMING PROVIDERS RENDER =====
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

// ===== PROVIDER PAGE =====
function openProviderPage(providerId, providerName, providerType) {
  resetAllPages();
  const page = document.getElementById('provider-page');
  page.classList.add('open');
  page.scrollTop = 0;

  providerPageState = {
    providerId: providerId,
    providerName: providerName,
    providerType: providerType || 'provider',
    page: 1,
    maxPages: 500,
    loading: false,
    hasMore: true,
    initialized: true,
    seenIds: new Set()
  };

  document.getElementById('provider-page-title').textContent = '📡 ' + providerName;
  document.getElementById('provider-page-grid').innerHTML = '';
  document.getElementById('provider-page-end').style.display = 'none';
  document.getElementById('provider-page-loading').style.display = 'none';

  page.removeEventListener('scroll', providerPageScrollHandler);
  page.addEventListener('scroll', providerPageScrollHandler, { passive: true });

  loadProviderBatch();
}

function closeProviderPage() {
  const page = document.getElementById('provider-page');
  page.classList.remove('open');
  page.scrollTop = 0;
  document.getElementById('provider-page-grid').innerHTML = '';
  providerPageState.initialized = false;
  setActiveNav('home');
}

function providerPageScrollHandler() {
  if (!providerPageState.initialized) return;
  if (providerPageState.loading) return;
  if (!providerPageState.hasMore) return;
  const page = document.getElementById('provider-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) {
    loadProviderBatch();
  }
}

async function loadProviderBatch() {
  if (providerPageState.loading || !providerPageState.hasMore) return;
  providerPageState.loading = true;
  document.getElementById('provider-page-loading').style.display = 'block';

  try {
    const mediaType = providerPageState.page <= 1 ? 'movie' : 'tv';
    const apiPage = Math.ceil(providerPageState.page / 2);

    const data = await fetchByProvider(providerPageState.providerId, mediaType, apiPage);

    providerPageState.maxPages = data.total_pages;
    providerPageState.page += 1;

    const grid = document.getElementById('provider-page-grid');
    data.results.forEach(function(item) {
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

    if (providerPageState.page > providerPageState.maxPages) {
      providerPageState.hasMore = false;
      document.getElementById('provider-page-end').style.display = 'block';
    }
  } catch (err) {
    console.error('[ProviderPage]', err);
  } finally {
    providerPageState.loading = false;
    document.getElementById('provider-page-loading').style.display = 'none';
  }
}

// ===== SHOW DETAILS =====
function showDetails(item) {
  currentItem = item;
  currentView = 'details';

  document.getElementById('modal-poster').src = `${IMG_URL}${item.backdrop_path || item.poster_path}`;
  document.getElementById('modal-title').textContent = item.title || item.name;

  const ratingNum = (item.vote_average || 0).toFixed(1);
  document.getElementById('modal-rating-num').textContent = ratingNum;

  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  document.getElementById('modal-year-num').textContent = year || '—';

  const runtimeEl = document.getElementById('modal-runtime');
  if (item.runtime) {
    const hours = Math.floor(item.runtime / 60);
    const mins = item.runtime % 60;
    runtimeEl.textContent = hours + 'H ' + mins + 'M';
  } else {
    runtimeEl.textContent = '—';
  }

  document.getElementById('modal-description').textContent = item.overview || 'No description available.';

  updateBookmarkUI(item);

  document.getElementById('details-view').style.display = 'block';
  document.getElementById('player-view').style.display = 'none';

  document.getElementById('modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ===== BOOKMARK =====
function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('mobiflix_watchlist')) || []; }
  catch (e) { return []; }
}

function saveWatchlist(list) {
  localStorage.setItem('mobiflix_watchlist', JSON.stringify(list));
}

function updateBookmarkUI(item) {
  const list = getWatchlist();
  const exists = list.find(function(x) { return x.id === item.id; });
  const icon = document.getElementById('bookmark-icon');
  const text = document.getElementById('bookmark-text');
  if (exists) {
    icon.className = 'fa fa-bookmark';
    text.textContent = 'Added to List';
  } else {
    icon.className = 'fa fa-bookmark-o';
    text.textContent = 'Add to List';
  }
}

function toggleAddToList() {
  if (!currentItem) return;
  const list = getWatchlist();
  const index = list.findIndex(function(x) { return x.id === currentItem.id; });
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push({
      id: currentItem.id,
      title: currentItem.title || currentItem.name,
      poster_path: currentItem.poster_path,
      media_type: currentItem.media_type || (currentItem.title ? 'movie' : 'tv'),
      vote_average: currentItem.vote_average,
      release_date: currentItem.release_date || currentItem.first_air_date
    });
  }
  saveWatchlist(list);
  updateBookmarkUI(currentItem);
}

// ===== PLAY NOW =====
function playNow() {
  if (!currentItem) return;

  const isMovie = currentItem.media_type === 'movie' || (!currentItem.media_type && currentItem.title);
  const endpoints = isMovie ? MOVIE_ENDPOINTS : SERIES_ENDPOINTS;
  const endpoint = endpoints[0];
  if (!endpoint) return;

  const embedURL = endpoint.url + currentItem.id;
  document.getElementById('modal-video').src = embedURL;

  document.getElementById('details-view').style.display = 'none';
  document.getElementById('player-view').style.display = 'block';

  setTimeout(function() {
    const wrapper = document.getElementById('player-wrapper');
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

    if (!isFullscreen) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().then(function() {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(function() {});
          }
        }).catch(function() {});
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(function() {});
        }
      }
    }
  }, 300);
}

// ===== CLOSE PLAYER VIEW =====
function closePlayerView() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }

  document.getElementById('modal-video').src = '';
  document.getElementById('player-view').style.display = 'none';
  document.getElementById('details-view').style.display = 'block';
}

// ===== CLOSE MODAL =====
function closeModal() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }

  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
  document.body.style.overflow = '';
  document.getElementById('details-view').style.display = 'block';
  document.getElementById('player-view').style.display = 'none';
}

// ===== RESET ALL PAGES =====
function resetAllPages() {
  const pagesToClose = [
    'view-all-page',
    'provider-page',
    'movies-page',
    'series-page',
    'my-list-page',
    'more-page',
    'search-modal'
  ];
  pagesToClose.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      el.style.display = '';
    }
  });

  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';

  const detailsView = document.getElementById('details-view');
  const playerView = document.getElementById('player-view');
  if (detailsView) detailsView.style.display = 'block';
  if (playerView) playerView.style.display = 'none';

  const video = document.getElementById('modal-video');
  if (video) video.src = '';

  document.body.style.overflow = '';
}

// ===== MY LIST PAGE =====
function openMyListPage() {
  resetAllPages();
  setActiveNav('mylist');
  const page = document.getElementById('my-list-page');
  page.classList.add('open');
  page.scrollTop = 0;
  renderMyList();
}

function closeMyListPage() {
  document.getElementById('my-list-page').classList.remove('open');
  setActiveNav('home');
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
    img.onclick = function() {
      fetchFullDetails(item.id, item.media_type);
    };
    grid.appendChild(img);
  });
}

async function fetchFullDetails(id, mediaType) {
  try {
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();
    data.media_type = type;
    showDetails(data);
  } catch (err) {
    console.error('[MyList]', err);
  }
}

// ===== SEARCH =====
function openSearchModal() {
  resetAllPages();
  setActiveNav('search');
  const modal = document.getElementById('search-modal');
  modal.classList.add('open');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    document.getElementById('search-input').focus();
  }, 200);
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  modal.classList.remove('open');
  modal.scrollTop = 0;
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
  document.body.style.overflow = '';
  setActiveNav('home');
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
    const filtered = (data.results || []).filter(function(item) {
      if (!item.poster_path) return false;
      return item.media_type === 'movie' || item.media_type === 'tv';
    });

    const container = document.getElementById('search-results');
    container.innerHTML = '';
    filtered.forEach(function(item) {
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.onclick = function() {
        closeSearchModal();
        showDetails(item);
      };
      container.appendChild(img);
    });
  }, 300);
}

// ===== BOTTOM NAV =====
function setActiveNav(name) {
  document.querySelectorAll('.bottom-nav-item').forEach(function(el) {
    el.classList.remove('active');
  });
  const items = document.querySelectorAll('.bottom-nav-item');
  const map = { home: 0, search: 1, movies: 2, series: 3, mylist: 4, more: 5 };
  if (items[map[name]]) items[map[name]].classList.add('active');
}

function goHome() {
  resetAllPages();
  setActiveNav('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MOVIES PAGE =====
function openMoviesPage() {
  resetAllPages();
  setActiveNav('movies');
  const page = document.getElementById('movies-page');
  page.classList.add('open');
  page.scrollTop = 0;

  moviesPageState = {
    page: 1,
    maxPages: 500,
    loading: false,
    hasMore: true,
    initialized: true,
    seenIds: new Set()
  };

  document.getElementById('movies-page-grid').innerHTML = '';
  document.getElementById('movies-page-end').style.display = 'none';
  document.getElementById('movies-page-loading').style.display = 'none';

  page.removeEventListener('scroll', moviesPageScrollHandler);
  page.addEventListener('scroll', moviesPageScrollHandler, { passive: true });

  loadMoviesPageBatch();
}

function closeMoviesPage() {
  const page = document.getElementById('movies-page');
  page.classList.remove('open');
  document.getElementById('movies-page-grid').innerHTML = '';
  moviesPageState.initialized = false;
  setActiveNav('home');
}

function moviesPageScrollHandler() {
  if (!moviesPageState.initialized) return;
  if (moviesPageState.loading) return;
  if (!moviesPageState.hasMore) return;
  const page = document.getElementById('movies-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) {
    loadMoviesPageBatch();
  }
}

async function loadMoviesPageBatch() {
  if (moviesPageState.loading || !moviesPageState.hasMore) return;
  moviesPageState.loading = true;
  document.getElementById('movies-page-loading').style.display = 'block';

  try {
    const data = moviesPageState.page <= 2
      ? await fetchTrending('movie', moviesPageState.page)
      : await fetchTopRated('movie', moviesPageState.page);

    moviesPageState.maxPages = data.total_pages;
    moviesPageState.page += 1;

    const grid = document.getElementById('movies-page-grid');
    data.results.forEach(function(item) {
      if (!item.poster_path) return;
      if (moviesPageState.seenIds.has(item.id)) return;
      moviesPageState.seenIds.add(item.id);
      item.media_type = 'movie';
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });

    if (moviesPageState.page > moviesPageState.maxPages) {
      moviesPageState.hasMore = false;
      document.getElementById('movies-page-end').style.display = 'block';
    }
  } catch (err) {
    console.error('[MoviesPage]', err);
  } finally {
    moviesPageState.loading = false;
    document.getElementById('movies-page-loading').style.display = 'none';
  }
}

// ===== SERIES PAGE =====
function openSeriesPage() {
  resetAllPages();
  setActiveNav('series');
  const page = document.getElementById('series-page');
  page.classList.add('open');
  page.scrollTop = 0;

  seriesPageState = {
    page: 1,
    maxPages: 500,
    loading: false,
    hasMore: true,
    initialized: true,
    seenIds: new Set()
  };

  document.getElementById('series-page-grid').innerHTML = '';
  document.getElementById('series-page-end').style.display = 'none';
  document.getElementById('series-page-loading').style.display = 'none';

  page.removeEventListener('scroll', seriesPageScrollHandler);
  page.addEventListener('scroll', seriesPageScrollHandler, { passive: true });

  loadSeriesPageBatch();
}

function closeSeriesPage() {
  const page = document.getElementById('series-page');
  page.classList.remove('open');
  document.getElementById('series-page-grid').innerHTML = '';
  seriesPageState.initialized = false;
  setActiveNav('home');
}

function seriesPageScrollHandler() {
  if (!seriesPageState.initialized) return;
  if (seriesPageState.loading) return;
  if (!seriesPageState.hasMore) return;
  const page = document.getElementById('series-page');
  if (!page) return;
  if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) {
    loadSeriesPageBatch();
  }
}

async function loadSeriesPageBatch() {
  if (seriesPageState.loading || !seriesPageState.hasMore) return;
  seriesPageState.loading = true;
  document.getElementById('series-page-loading').style.display = 'block';

  try {
    const data = seriesPageState.page <= 2
      ? await fetchTrending('tv', seriesPageState.page)
      : await fetchTopRated('tv', seriesPageState.page);

    seriesPageState.maxPages = data.total_pages;
    seriesPageState.page += 1;

    const grid = document.getElementById('series-page-grid');
    data.results.forEach(function(item) {
      if (!item.poster_path) return;
      if (seriesPageState.seenIds.has(item.id)) return;
      seriesPageState.seenIds.add(item.id);
      item.media_type = 'tv';
      const img = document.createElement('img');
      img.src = `${IMG_W500}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.loading = 'lazy';
      img.dataset.id = item.id;
      img.onclick = function() { showDetails(item); };
      grid.appendChild(img);
    });

    if (seriesPageState.page > seriesPageState.maxPages) {
      seriesPageState.hasMore = false;
      document.getElementById('series-page-end').style.display = 'block';
    }
  } catch (err) {
    console.error('[SeriesPage]', err);
  } finally {
    seriesPageState.loading = false;
    document.getElementById('series-page-loading').style.display = 'none';
  }
}

// ===== MORE PAGE =====
function openMorePage() {
  resetAllPages();
  setActiveNav('more');
  const page = document.getElementById('more-page');
  page.classList.add('open');
  page.scrollTop = 0;
}

function closeMorePage() {
  document.getElementById('more-page').classList.remove('open');
  setActiveNav('home');
}

// ===== VIEW ALL PAGE =====
function openViewAll(key) {
  resetAllPages();
  const genre = GENRE_MAP[key];
  if (!genre) return;

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

  page.removeEventListener('scroll', viewAllScrollHandler);
  page.addEventListener('scroll', viewAllScrollHandler, { passive: true });

  loadViewAllBatch();
}

async function loadViewAllBatch() {
  if (viewAllState.loading || !viewAllState.hasMore) return;
  viewAllState.loading = true;
  document.getElementById('view-all-loading').style.display = 'block';

  const genre = GENRE_MAP[viewAllState.key];
  const grid = document.getElementById('view-all-grid');

  try {
    let data;
    if (viewAllState.page <= 2) {
      data = await fetchTrending(genre.media, viewAllState.page);
    } else {
      data = await fetchTopRated(genre.media, viewAllState.page);
    }

    viewAllState.maxPages = data.total_pages;
    viewAllState.page += 1;

    data.results.forEach(function(item) {
      if (!item.poster_path) return;
      if (viewAllState.seenIds.has(item.id)) return;
      viewAllState.seenIds.add(item.id);
      item.media_type = genre.media;
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
  document.getElementById('view-all-grid').innerHTML = '';
  viewAllState.initialized = false;
  viewAllState.seenIds = new Set();
  setActiveNav('home');
}

let viewAllScrollTimer = null;

function viewAllScrollHandler() {
  if (!viewAllState.initialized) return;
  if (viewAllState.loading) return;
  if (!viewAllState.hasMore) return;
  const page = document.getElementById('view-all-page');
  if (!page) return;
  clearTimeout(viewAllScrollTimer);
  viewAllScrollTimer = setTimeout(function() {
    if (page.scrollTop + page.clientHeight >= page.scrollHeight - 300) {
      loadViewAllBatch();
    }
  }, 150);
}

// ===== HOMEPAGE INFINITE SCROLL =====
async function loadMore(category) {
  if (loading[category] || pages[category] >= maxPages[category]) return;
  loading[category] = true;
  pages[category] += 1;
  try {
    let result, containerId;
    if (category === 'movie') {
      result = pages[category] <= 2
        ? await fetchTrending('movie', pages[category])
        : await fetchTopRated('movie', pages[category]);
      containerId = 'movies-list';
    } else if (category === 'tv') {
      result = pages[category] <= 2
        ? await fetchTrending('tv', pages[category])
        : await fetchTopRated('tv', pages[category]);
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

function attachScrollListeners() {
  const rows = [
    { id: 'movies-list', category: 'movie' },
    { id: 'tvshows-list', category: 'tv' }
  ];

  rows.forEach(function(row) {
    const el = document.getElementById(row.id);
    if (!el) return;
    el.addEventListener('scroll', function() {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 300) {
        loadMore(row.category);
      }
    }, { passive: true });
  });
}

// ===== INIT =====
async function init() {
  try {
    console.log('[MobiFlix] Initializing...');

    renderProviders();

    const moviesData = await fetchTrending('movie', 1);
    const tvData = await fetchTrending('tv', 1);
    maxPages.movie = moviesData.total_pages;
    maxPages.tv = tvData.total_pages;

    if (moviesData.results.length > 0) {
      displayBanner(moviesData.results[Math.floor(Math.random() * moviesData.results.length)]);
    }
    appendToList(moviesData.results, 'movies-list');
    appendToList(tvData.results, 'tvshows-list');

    attachScrollListeners();
    console.log('[MobiFlix] Ready.');
  } catch (err) {
    console.error('[MobiFlix] Init error:', err);
  }
}

init();

// ===== KEYBOARD =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeSearchModal();
    closeViewAll();
    closeProviderPage();
    closeMoviesPage();
    closeSeriesPage();
    closeMorePage();
    closeMyListPage();
  }
});
