function loadHomePage(){

  if(!allArticles.length){
    loadEmpty();
    return;
  }

  const sorted =
  [...allArticles]
  .sort((a,b)=> new Date(b.date) - new Date(a.date));

  const hero = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const fourth = sorted[3];
  const fifth = sorted[4];

  const html = `

  <section class="home-grid">

    <article class="hero-main">

      <h1>${hero.title}</h1>

      <p>${hero.summary || ''}</p>

      <a href="article.html?slug=${hero.slug}">
        Leer artículo
      </a>

    </article>

    ${second ? buildHomeCard(second) : ''}
    ${third ? buildHomeCard(third) : ''}
    ${fourth ? buildHomeCard(fourth) : ''}
    ${fifth ? buildHomeCard(fifth) : ''}

  </section>

  `;

  document.getElementById("content").innerHTML = html;

}


function buildHomeCard(a){

  return `

  <article class="home-card">

    <h3>${a.title}</h3>

    <p>${a.summary || ''}</p>

    <a href="article.html?slug=${a.slug}">
      Leer
    </a>

  </article>

  `;

}
