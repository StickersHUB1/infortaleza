function initNavigation(){

  document
  .querySelectorAll('nav a[data-page]')
  .forEach(link => {

    link.addEventListener('click', e => {

      e.preventDefault();

      const page = link.dataset.page;

      location.hash = page;

      loadPage(page);

    });

  });

}


function loadInitialPage(){

  const page =
  location.hash.replace('#','') || 'inicio';

  loadPage(page);

}


function loadPage(page){

  currentPage = page;

  updateActiveNav(page);

  const content =
  document.getElementById('content');

  content.innerHTML = '';

  if(page === 'inicio'){

    loadHomePage();

  }
  else if(page === 'investigaciones'){

    loadCategory('investigacion');

  }
  else if(page === 'documentos'){

    loadCategory('documento');

  }
  else if(page === 'articulos'){

    loadCategory('articulo');

  }
  else if(page === 'contacto'){

    loadContact();

  }
  else{

    loadNotFound();

  }

}


function updateActiveNav(page){

  document
  .querySelectorAll('nav a[data-page]')
  .forEach(link => {

    if(link.dataset.page === page)
      link.classList.add('active');
    else
      link.classList.remove('active');

  });

}
