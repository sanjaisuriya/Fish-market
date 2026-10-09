/**
 * Seafood & Fresh Fish Market - Recipes Engine
 * Category filtering, search, difficulty filters, and cooking times
 */

const SEAFOOD_RECIPES = [
  {
    id: 'recipe-seafood-paella',
    title: 'Traditional Spanish Seafood Paella',
    category: 'signature',
    categories: ['signature', 'fish', 'prawns', 'healthy'],
    categoryLabel: 'Signature Special',
    difficulty: 'Medium',
    prepTime: '20 min',
    cookTime: '35 min',
    servings: '4–6 Servings',
    calories: '490 kcal',
    image: 'assets/images/blog_family_seafood_dinner_dish_closeup_1788862492244.jpg',
    desc: 'Fragrant saffron rice simmered in rich ocean broth loaded with jumbo king prawns, mussels, and squid.'
  },
  {
    id: 'recipe-garlic-butter-prawns',
    title: 'Garlic Butter Tossed Tiger Prawns',
    category: 'prawns',
    categories: ['prawns', 'fried', 'signature'],
    categoryLabel: 'Prawn Recipes',
    difficulty: 'Easy',
    prepTime: '10 min',
    cookTime: '8 min',
    servings: '2–3 Servings',
    calories: '290 kcal',
    image: 'assets/images/jumbo_tiger_prawns_1788781319176.jpg',
    desc: 'Plump king prawns tossed in foaming butter, crushed garlic, and fresh Italian parsley.'
  },
  {
    id: 'recipe-crab-curry',
    title: 'Coastal Spicy Coconut Crab Curry',
    category: 'curry',
    categories: ['curry', 'lobster'],
    categoryLabel: 'Seafood Curry',
    difficulty: 'Medium',
    prepTime: '25 min',
    cookTime: '30 min',
    servings: '4 Servings',
    calories: '450 kcal',
    image: 'assets/images/garlic_herb_king_crab_cluster.jpg',
    desc: 'Authentic coastal blue swimmer crab simmered in a velvety gravy of roasted spices and coconut milk.'
  },
  {
    id: 'recipe-grilled-salmon',
    title: 'Herb & Lemon Garlic Grilled Salmon',
    category: 'grilled',
    categories: ['grilled', 'fish', 'healthy'],
    categoryLabel: 'Grilled Seafood',
    difficulty: 'Easy',
    prepTime: '15 min',
    cookTime: '12 min',
    servings: '4 Servings',
    calories: '380 kcal',
    image: 'assets/images/herb_grilled_salmon_recipe_1788761308064.jpg',
    desc: 'Succulent Atlantic salmon steak seared with rosemary, fresh thyme, minced garlic, and charred lemon wedges.'
  },

  {
    id: 'recipe-lobster-tail',
    title: 'Gourmet Butter-Poached Whole Lobster',
    category: 'lobster',
    categories: ['lobster', 'signature', 'healthy'],
    categoryLabel: 'Lobster & Crab',
    difficulty: 'Chef Special',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: '2 Servings',
    calories: '410 kcal',
    image: 'assets/images/spiny_rock_lobster_1788781406447.jpg',
    desc: 'Succulent whole Maine lobster gently poached in garlic butter broth, served with fresh lemon wedges and sea salt.'
  },
  {
    id: 'recipe-calamari',
    title: 'Crispy Golden Calamari & Tartar Dip',
    category: 'fried',
    categories: ['fried'],
    categoryLabel: 'Crispy Appetizers',
    difficulty: 'Easy',
    prepTime: '12 min',
    cookTime: '8 min',
    servings: '3–4 Servings',
    calories: '340 kcal',
    image: 'assets/images/cleaned_calamari_squid_fresh_1788766184966.jpg',
    desc: 'Tender ocean squid rings flash-fried in light seasoned batter, served with homemade herb tartar dip.'
  }
];

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let currentDifficulty = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    initRecipeFilters();
    renderRecipes();
  });

  function initRecipeFilters() {
    const filterBtns = document.querySelectorAll('.recipe-cat-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => {
          b.classList.remove('active', 'btn-ocean');
          b.classList.add('btn-outline-ocean');
        });
        btn.classList.add('active', 'btn-ocean');
        btn.classList.remove('btn-outline-ocean');

        currentCategory = btn.getAttribute('data-category') || 'all';
        renderRecipes();
      });
    });

    const searchInput = document.getElementById('recipe-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderRecipes();
      });
    }

    const diffSelect = document.getElementById('recipe-difficulty-select');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        renderRecipes();
      });
    }
  }

  function getFilteredRecipes() {
    return SEAFOOD_RECIPES.filter(r => {
      const catList = r.categories || [r.category];
      const matchCat = (currentCategory === 'all') || (r.category === currentCategory) || catList.includes(currentCategory);
      const matchDiff = (currentDifficulty === 'all') || (r.difficulty.toLowerCase() === currentDifficulty.toLowerCase());
      const matchSearch = r.title.toLowerCase().includes(searchQuery) ||
                          r.desc.toLowerCase().includes(searchQuery) ||
                          r.categoryLabel.toLowerCase().includes(searchQuery);

      return matchCat && matchDiff && matchSearch;
    });
  }

  function renderRecipes() {
    const container = document.getElementById('recipes-grid-container');
    if (!container) return;

    const filtered = getFilteredRecipes();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-5 bg-card rounded-4 border">
            <i class="bi bi-book text-primary display-3 mb-3"></i>
            <h4 class="fw-bold">No Recipes Found</h4>
            <p class="text-muted">No culinary creations matched your current search criteria.</p>
            <button class="btn btn-ocean mt-2" onclick="resetRecipeFilters()">
              <i class="bi bi-arrow-counterclockwise"></i> Reset Recipe Filters
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(r => `
      <div class="col-md-6 col-lg-4">
        <div class="recipe-card">
          <div class="recipe-thumb">
            <img src="${r.image}" alt="${r.title}" loading="lazy">
            <div class="recipe-meta-pill">
              <i class="bi bi-clock"></i> ${r.prepTime} prep • ${r.cookTime} cook
            </div>
          </div>
          <div class="recipe-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary-subtle text-primary fw-semibold">${r.categoryLabel}</span>
              <span class="badge bg-light text-secondary border"><i class="bi bi-speedometer2 me-1"></i>${r.difficulty}</span>
            </div>
            <h5 class="recipe-title fw-bold mb-2">
              <a href="recipe-details.html?id=${r.id}">${r.title}</a>
            </h5>
            <p class="text-muted small mb-3 flex-grow-1">${r.desc}</p>
            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
              <small class="text-muted"><i class="bi bi-people-fill text-primary"></i> ${r.servings}</small>
              <a href="recipe-details.html?id=${r.id}" class="btn btn-sm btn-ocean">
                View Recipe <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.resetRecipeFilters = function () {
    currentCategory = 'all';
    searchQuery = '';
    currentDifficulty = 'all';

    const searchInput = document.getElementById('recipe-search-input');
    if (searchInput) searchInput.value = '';

    const diffSelect = document.getElementById('recipe-difficulty-select');
    if (diffSelect) diffSelect.value = 'all';

    const filterBtns = document.querySelectorAll('.recipe-cat-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active', 'btn-ocean');
        btn.classList.remove('btn-outline-ocean');
      } else {
        btn.classList.remove('active', 'btn-ocean');
        btn.classList.add('btn-outline-ocean');
      }
    });

    renderRecipes();
  };
})();
