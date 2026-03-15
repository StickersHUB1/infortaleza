let allArticles = [];
let currentPage = '';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadArticlesMeta();
  loadInitialPage();
  document.getElementById('search').addEventListener('input', performSearch);
});

function initNavigation() {
  document.querySelectorAll('nav a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(link.dataset.page);
    });
  });
}

function loadInitialPage() {
  const page = location.hash.replace('#','') || 'inicio';
  loadPage(page);
}

function updateActiveNav(page) {
  document.querySelectorAll('nav a[data-page]').forEach(link => {
    if(link.dataset.page === page) link.classList.add('active');
    else link.classList.remove('active');
  });
}

async function loadArticlesMeta() {
  try {
    const res = await fetch('data/articles.json');
    allArticles = await res.json();
  } catch (e) {
    allArticles = [];
  }
}

async function loadPage(page) {
  currentPage = page;
  updateActiveNav(page);
  const content = document.getElementById('content');
  content.innerHTML = '';
  if(page === 'inicio') {
    await loadHomePage();
  } else if(page === 'investigaciones') {
    await loadCategory('investigacion');
  } else if(page === 'documentos') {
    await loadCategory('documento');
  } else if(page === 'articulos') {
    await loadCategory('articulo');
  } else if(page === 'contacto') {
    loadContact();
  } else {
    loadNotFound();
  }
}

async function loadHomePage() {
  if(!allArticles.length){ loadEmpty(); return; }
  const sorted = [...allArticles].sort((a,b) => new Date(b.date) - new Date(a.date));
  const heroArticle = sorted[0];
  const hero = `<div class="hero"><h2>${heroArticle.title}</h2><p>${heroArticle.summary||''}</p><a href="article.html?slug=${heroArticle.slug}">Leer más</a></div>`;
  const list = sorted.slice(1,5).map(a => buildCard(a)).join('');
  document.getElementById('content').innerHTML = hero + `<div class="articles">${list}</div>`;
}

async function loadCategory(tag) {
  if(!allArticles.length){ loadEmpty(); return; }
  const filtered = allArticles.filter(a => (a.tags||[]).includes(tag));
  const hero = `<div class="hero"><h2>${capitalize(tag)}</h2></div>`;
  const list = filtered.map(a => buildCard(a)).join('');
  document.getElementById('content').innerHTML = hero + `<div class="articles">${list}</div>`;
}

function loadContact() {
  const hero = `<div class="hero"><h2>Contacto</h2></div>`;
  const info = `<div class="card"><p>Puedes escribirnos a <a href="mailto:contacto@infortaleza.com">contacto@infortaleza.com</a></p></div>`;
  document.getElementById('content').innerHTML = hero + info;
}

function loadNotFound() {
  document.getElementById('content').innerHTML = `<div class="hero"><h2>Página no encontrada</h2></div>`;
}

function loadEmpty() {
  document.getElementById('content').innerHTML = `<div class="hero"><h2>No hay contenido</h2></div>`;
}

function buildCard(a) {
  return `<article class="card">
    <h2>${a.title}</h2>
    <p>${a.summary || ''}</p>
    <span class="meta">${a.date || ''}</span>
    <a href="article.html?slug=${a.slug}">Leer</a>
  </article>`;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* Búsqueda en todo el sitio */
function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
}

async function performSearch() {
  const query = document.getElementById('search').value.trim();
  if(!query) { loadPage(currentPage); return; }
  const normQ = normalize(query);
  const results = [];
  for(const art of allArticles) {
    const text = normalize(`${art.title} ${art.summary||''}`);
    let match = text.includes(normQ);
    let snippet = art.summary || '';
    if(!match) {
      try {
        const res = await fetch(art.content);
        const html = await res.text();
        const plain = normalize(html);
        const idx = plain.indexOf(normQ);
        if(idx !== -1) {
          match = true;
          const start = Math.max(0, idx - 50);
          const end = Math.min(plain.length, idx + normQ.length + 50);
          snippet = html.substring(start, end);
        }
      } catch {}
    }
    if(match) results.push({art, snippet});
  }
  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
  const hero = `<div class="hero"><h2>Resultados para "${query}"</h2></div>`;
  const list = results.map(({art,snippet}) => {
    const highlighted = snippet.replace(regex, m => `<mark>${m}</mark>`);
    return `<article class="card">
      <h2>${art.title}</h2>
      <p>${highlighted}</p>
      <span class="meta">${art.date || ''}</span>
      <a href="article.html?slug=${art.slug}&q=${encodeURIComponent(query)}">Leer</a>
    </article>`;
  }).join('');
  document.getElementById('content').innerHTML = hero + `<div class="articles">${list}</div>`;
}
