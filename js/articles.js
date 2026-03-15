async function loadArticlesMeta(){

  try{

    const res =
    await fetch('data/articles.json');

    allArticles =
    await res.json();

  }
  catch(e){

    allArticles = [];

  }

}


function loadCategory(tag){

  if(!allArticles.length){
    loadEmpty();
    return;
  }

  const filtered =
  allArticles.filter(a =>
  (a.tags || []).includes(tag));

  const hero = `

  <div class="hero">
    <h2>${capitalize(tag)}</h2>
  </div>

  `;

  const list =
  filtered.map(a => buildCard(a)).join('');

  document.getElementById('content').innerHTML =
  hero + `<div class="articles">${list}</div>`;

}


function buildCard(a){

  return `

  <article class="card">

    <h2>${a.title}</h2>

    <p>${a.summary || ''}</p>

    <span class="meta">${a.date || ''}</span>

    <a href="article.html?slug=${a.slug}">
      Leer
    </a>

  </article>

  `;

}


function loadContact(){

  const html = `

  <div class="hero">
    <h2>Contacto</h2>
  </div>

  <div class="card">
    <p>
    Puedes escribirnos a 
    <a href="mailto:contacto@infortaleza.com">
    contacto@infortaleza.com
    </a>
    </p>
  </div>

  `;

  document.getElementById('content').innerHTML = html;

}


function loadNotFound(){

  document.getElementById('content').innerHTML =
  `<div class="hero"><h2>Página no encontrada</h2></div>`;

}


function loadEmpty(){

  document.getElementById('content').innerHTML =
  `<div class="hero"><h2>No hay contenido</h2></div>`;

}


function capitalize(s){

  return s.charAt(0).toUpperCase() + s.slice(1);

}
