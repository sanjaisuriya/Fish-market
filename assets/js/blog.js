/**
 * Seafood & Fresh Fish Market - Blog Engine
 * Search, Category Filtering, and Dynamic Rendering
 */

const BLOG_ARTICLES = [
  {
    id: 'how-to-choose-fresh-seafood',
    title: 'How to Choose Fresh Seafood: The Complete Inspection Checklist',
    category: 'guides',
    categoryLabel: 'Buying Guide',
    date: 'Oct 18, 2026',
    author: 'Chef Marcus Sterling',
    authorRole: 'Master Fishmonger',
    readTime: '5 min read',
    image: 'assets/images/blog_how_to_choose_fresh_fish_1788859736684.jpg',
    fallback: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    summary: 'Learn how to inspect clear convex eyes, fresh ocean briny smell (never fishy), vibrant bright-red gills, and resilient elastic flesh texture.',
    relatedIds: ['seafood-storage-guide-keep-it-fresh-at-home', 'from-harbor-to-your-table']
  },
  {
    id: 'best-seafood-for-family-dinners',
    title: 'Best Seafood for Family Dinners: Wholesome & Delicious Picks',
    category: 'cooking',
    categoryLabel: 'Family Dinners',
    date: 'Oct 14, 2026',
    author: 'David Lin',
    authorRole: 'Seafood Culinary Specialist',
    readTime: '6 min read',
    image: 'assets/images/blog_family_seafood_dinner_spread_1788931530653.jpg',
    fallback: 'https://images.unsplash.com/photo-1559737558-245cb384c688?auto=format&fit=crop&w=800&q=80',
    summary: 'Discover family-friendly crowd pleasers including rich pan-seared salmon fillets, sweet tiger prawns, mild pomfret, and tender calamari squid.',
    relatedIds: ['the-benefits-of-eating-seafood', 'how-to-choose-fresh-seafood']
  },
  {
    id: 'how-we-keep-seafood-fresh-during-delivery',
    title: 'How We Keep Seafood Fresh During Delivery: Our 0°C Cold-Chain',
    category: 'delivery',
    categoryLabel: 'Cold-Chain Delivery',
    date: 'Oct 10, 2026',
    author: 'Victor Vance',
    authorRole: 'Cold-Chain Logistics Lead',
    readTime: '4 min read',
    image: 'assets/images/cold_chain_seafood_delivery_van_1788931165408.jpg',
    fallback: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    summary: 'An inside look at our unbroken cold-chain: triple-layer insulated thermal packaging, food-grade ice packs, and temperature-controlled refrigerated vans.',
    relatedIds: ['seafood-storage-guide-keep-it-fresh-at-home', 'from-harbor-to-your-table']
  },
  {
    id: 'seafood-storage-guide-keep-it-fresh-at-home',
    title: 'Seafood Storage Guide: How to Keep It Ice-Fresh at Home',
    category: 'storage',
    categoryLabel: 'Storage & Care',
    date: 'Oct 06, 2026',
    author: 'Maya Torres',
    authorRole: 'Quality & Food Safety Director',
    readTime: '5 min read',
    image: 'assets/images/blog_seafood_home_ice_storage_1788931472846.jpg',
    fallback: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80',
    summary: 'Master home storage guidelines: proper fridge vs. freezer timing, optimal 32°F–36°F temperature zones, vacuum packs, and parchment wrapping.',
    relatedIds: ['how-we-keep-seafood-fresh-during-delivery', 'how-to-choose-fresh-seafood']
  },
  {
    id: 'the-benefits-of-eating-seafood',
    title: 'The Vital Health Benefits of Eating Fresh Wild Seafood',
    category: 'health',
    categoryLabel: 'Health & Nutrition',
    date: 'Sep 28, 2026',
    author: 'Dr. Elena Vance',
    authorRole: 'Marine Nutritionist',
    readTime: '6 min read',
    image: 'assets/images/blog_seafood_health_nutrition_1788860547723.jpg',
    fallback: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    summary: 'Supercharge your body with lean bioavailable protein, heart-healthy EPA/DHA Omega-3s, natural Vitamin D, zinc, selenium, and essential minerals.',
    relatedIds: ['best-seafood-for-family-dinners', 'how-to-choose-fresh-seafood']
  },
  {
    id: 'from-harbor-to-your-table',
    title: 'From Harbor to Your Table: The Journey of Daily Fresh Catch',
    category: 'journey',
    categoryLabel: 'Harbor Stories',
    date: 'Sep 20, 2026',
    author: 'Arthur Pendelton',
    authorRole: 'Dock Master & Sourcing Lead',
    readTime: '7 min read',
    image: 'assets/images/blog_harbor_journey_boats_1788860601516.jpg',
    fallback: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    summary: 'Follow the complete ocean-to-doorstep journey: dawn landings with local fishermen, precision dockside sorting, hygienic prep, and express delivery.',
    relatedIds: ['how-we-keep-seafood-fresh-during-delivery', 'how-to-choose-fresh-seafood']
  }
];

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  document.addEventListener('DOMContentLoaded', () => {
    initBlogFilters();
    renderBlog();
  });

  function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.blog-cat-btn');
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
        renderBlog();
      });
    });

    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderBlog();
      });
    }
  }

  function getFilteredBlog() {
    return BLOG_ARTICLES.filter(a => {
      const matchCat = (currentCategory === 'all') || (a.category === currentCategory);
      const matchSearch = a.title.toLowerCase().includes(searchQuery) ||
                          a.summary.toLowerCase().includes(searchQuery) ||
                          a.categoryLabel.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });
  }

  function renderBlog() {
    const container = document.getElementById('blog-grid-container');
    if (!container) return;

    const filtered = getFilteredBlog();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-5 bg-card rounded-4 border">
            <i class="bi bi-newspaper text-primary display-3 mb-3"></i>
            <h4 class="fw-bold">No Articles Found</h4>
            <p class="text-muted">No journal articles matched your current keywords.</p>
            <button class="btn btn-ocean mt-2" onclick="resetBlogFilters()">
              <i class="bi bi-arrow-counterclockwise"></i> Reset Blog Filters
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(a => `
      <div class="col-md-6 col-lg-4">
        <div class="blog-card">
          <div class="blog-thumb">
            <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.onerror=null; this.src='${a.fallback}';">
          </div>
          <div class="blog-body">
            <div class="blog-meta">
              <span><i class="bi bi-calendar3 text-primary me-1"></i>${a.date}</span>
              <span><i class="bi bi-clock text-primary me-1"></i>${a.readTime}</span>
            </div>
            <span class="badge bg-primary-subtle text-primary fw-semibold mb-2 align-self-start">${a.categoryLabel}</span>
            <h5 class="blog-title fw-bold mb-2">
              <a href="blog-details.html?id=${a.id}" class="text-secondary">${a.title}</a>
            </h5>
            <p class="text-muted small mb-3 flex-grow-1">${a.summary}</p>
            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
              <small class="fw-semibold text-secondary">${a.author}</small>
              <a href="blog-details.html?id=${a.id}" class="fw-bold text-primary">
                Read Article <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.resetBlogFilters = function () {
    currentCategory = 'all';
    searchQuery = '';

    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) searchInput.value = '';

    const filterBtns = document.querySelectorAll('.blog-cat-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active', 'btn-ocean');
        btn.classList.remove('btn-outline-ocean');
      } else {
        btn.classList.remove('active', 'btn-ocean');
        btn.classList.add('btn-outline-ocean');
      }
    });

    renderBlog();
  };
})();
