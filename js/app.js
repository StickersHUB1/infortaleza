let allArticles = [];
let currentPage = '';

document.addEventListener('DOMContentLoaded', async () => {

  initNavigation();

  await loadArticlesMeta();

  loadInitialPage();

  document
    .getElementById('search')
    .addEventListener('input', performSearch);

  hideLoader();

});
