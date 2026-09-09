/* ==========================================================================
   Seafood & Fresh Fish Market - Recipe Filtering & Search (recipe-filter.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const recipeGrid = document.getElementById('recipeContainer');
  const searchInput = document.getElementById('recipeSearchInput');
  const categoryFilter = document.getElementById('recipeCategoryFilter');
  const difficultyFilter = document.getElementById('difficultyFilter');

  let recipesData = [];

  if (!recipeGrid) return; // Exit if not on recipes page

  fetch('data/recipes.json')
    .then(res => res.json())
    .then(data => {
      recipesData = data;
      renderRecipes();
    })
    .catch(err => {
      console.error('Failed to load recipes:', err);
      recipeGrid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">Failed to load recipes.</p></div>';
    });

  function renderRecipes() {
    let filtered = [...recipesData];

    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.toLowerCase();
      filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.mainIngredient.toLowerCase().includes(q));
    }

    if (categoryFilter && categoryFilter.value !== 'all') {
      filtered = filtered.filter(r => r.category.toLowerCase() === categoryFilter.value.toLowerCase());
    }

    if (difficultyFilter && difficultyFilter.value !== 'all') {
      filtered = filtered.filter(r => r.difficulty.toLowerCase() === difficultyFilter.value.toLowerCase());
    }

    if (filtered.length === 0) {
      recipeGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-utensils fa-3x text-muted mb-3"></i>
          <h4>No Seafood Recipes Found</h4>
          <p class="text-muted">Try searching with a different key ingredient or category filter.</p>
        </div>`;
      return;
    }

    recipeGrid.innerHTML = filtered.map(r => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="market-card">
          <div class="card-img-wrapper">
            <img src="${r.image}" alt="${r.title}" loading="lazy">
            <span class="badge-freshness bg-teal">${r.category}</span>
            <span class="badge-category">${r.difficulty}</span>
          </div>
          <div class="card-body-custom">
            <h5 class="card-title mb-2"><a href="recipe-details.html?id=${r.id}">${r.title}</a></h5>
            <p class="text-muted text-sm line-clamp-2 mb-3">${r.description}</p>
            <div class="d-flex justify-content-between align-items-center text-xs text-muted mb-3 pt-2 border-top">
              <span><i class="far fa-clock me-1"></i> ${r.prepTime} Prep</span>
              <span><i class="fas fa-fire me-1"></i> ${r.cookTime} Cook</span>
              <span><i class="fas fa-user-friends me-1"></i> Serves ${r.servings}</span>
            </div>
            <a href="recipe-details.html?id=${r.id}" class="btn btn-secondary-custom w-100 justify-content-center">
              <i class="fas fa-book-open me-1"></i> View Full Recipe
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderRecipes);
  if (categoryFilter) categoryFilter.addEventListener('change', renderRecipes);
  if (difficultyFilter) difficultyFilter.addEventListener('change', renderRecipes);
});
