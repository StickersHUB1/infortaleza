function normalize(text){

  return text
  .toLowerCase()
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu,'');

}


async function performSearch(){

  const query =
  document.getElementById('search').value.trim();

  if(!query){
    loadPage(currentPage);
    return;
  }

  const normQ = normalize(query);

  const results = [];

  for(const art of allArticles){

    const text =
    normalize(`${art.title} ${art.summary || ''}`);

    if(text.includes(normQ))
      results.push({art,snippet:art.summary});

  }

  renderSearchResults(results,query);

}


function renderSearchResults(results,query){

  const regex =
  new RegExp(
  query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),
  'gi'
  );

  const hero = `

  <div class="hero">
    <h2>Resultados para "${query}"</h2>
  </div>

  `;

  const list = results.map(({art,snippet})=>{

    const highlighted =
    snippet.replace(regex,m=>`<mark>${m}</mark>`);

    return `

    <article class="card">

      <h2>${art.title}</h2>

      <p>${highlighted}</p>

      <span class="meta">${art.date || ''}</span>

      <a href="article.html?slug=${art.slug}">
        Leer
      </a>

    </article>

    `;

  }).join('');

  document.getElementById('content').innerHTML =
  hero + `<div class="articles">${list}</div>`;

}
