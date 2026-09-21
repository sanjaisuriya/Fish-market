/**
 * Seafood & Fresh Fish Market - Products Engine
 * Dynamic Search, Category Filtering, Price Slider, Sorting, Grid/List Views & Quick Modal
 */

const SEAFOOD_PRODUCTS = [
  {
    id: 'prod-salmon',
    name: 'Norwegian Atlantic Salmon',
    category: 'fish',
    categoryLabel: 'Fresh Fish',
    price: 34.00,
    rating: 4.9,
    reviews: 128,
    badge: 'Fresh Catch',
    badgeClass: 'badge-fresh',
    origin: 'Cold Fjords of Norway (Wild / Farmed)',
    image: 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg',
    desc: 'Omega-3 rich sashimi grade fillets with velvety, melt-in-mouth texture.',
    cuts: ['Whole Cleaned', 'Skin-On Fillet', 'Steak Slices', 'Curry Cut'],
    available: true
  },
  {
    id: 'prod-tuna',
    name: 'Yellowfin Tuna Loin',
    category: 'fish',
    categoryLabel: 'Fresh Fish',
    price: 38.00,
    rating: 4.8,
    reviews: 94,
    badge: 'Wild Caught',
    badgeClass: 'badge-wild',
    origin: 'Indian Ocean Deep Waters',
    image: 'assets/images/yellowfin_tuna_loin_catch_1788765304353.jpg',
    desc: 'Ruby red, dense steak cuts ideal for pan-searing or poke bowls.',
    cuts: ['Sashimi Block', 'Steak Slices', 'Curry Cut'],
    available: true
  },
  {
    id: 'prod-seabass',
    name: 'Mediterranean Sea Bass',
    category: 'fish',
    categoryLabel: 'Fresh Fish',
    price: 28.00,
    rating: 4.7,
    reviews: 76,
    badge: "Chef's Choice",
    badgeClass: 'badge-coral',
    origin: 'Mediterranean Coastal Waters',
    image: 'assets/images/mediterranean_sea_bass_fresh_1788766017507.jpg',
    desc: 'Sweet, delicate white meat that crisps up beautifully with herbs and lemon.',
    cuts: ['Whole Scaled & Gutted', 'Butterfly Fillet', 'Curry Cut'],
    available: true
  },
  {
    id: 'prod-squid',
    name: 'Calamari Squid (Cleaned)',
    category: 'other',
    categoryLabel: 'Squid & Calamari',
    price: 22.00,
    rating: 4.8,
    reviews: 98,
    badge: 'Bestseller',
    badgeClass: 'badge-coral',
    origin: 'Coastal Waters',
    image: 'assets/images/cleaned_calamari_squid_fresh_1788766184966.jpg',
    desc: 'Tender, ocean-fresh calamari squid with ink removed. Perfect for quick pan-sear or crispy frying.',
    cuts: ['Whole Cleaned Tubes & Tentacles', 'Rings Cut'],
    available: true
  },
  {
    id: 'prod-pomfret',
    name: 'Silver Pomfret',
    category: 'fish',
    categoryLabel: 'Fresh Fish',
    price: 32.00,
    rating: 4.9,
    reviews: 112,
    badge: 'Bestseller',
    badgeClass: 'badge-coral',
    origin: 'Arabian Sea Coasts',
    image: 'assets/images/silver_pomfret_fish_1788781292906.jpg',
    desc: 'Soft, tender, and uniquely sweet flesh. Ideal for shallow frying, tandoor, or rich coconut curries.',
    cuts: ['Whole Cleaned (With Slits)', 'Steak Slices'],
    available: true
  },
  {
    id: 'prod-tiger-prawns',
    name: 'Jumbo Tiger Prawns',
    category: 'prawns',
    categoryLabel: 'Prawns & Shrimp',
    price: 42.00,
    rating: 5.0,
    reviews: 180,
    badge: 'Premium Grade',
    badgeClass: 'badge-coral',
    origin: 'Bay of Bengal Deep Waters',
    image: 'assets/images/tiger_prawns_catch_1788765391401.jpg',
    desc: 'Crisp, succulent bite with sweet natural brininess. Deveined upon request.',
    cuts: ['Whole Head-On', 'Deveined & Peeled', 'Tail-On Butterfly'],
    available: true
  },
  {
    id: 'prod-white-prawns',
    name: 'Coastal White Prawns',
    category: 'prawns',
    categoryLabel: 'Prawns & Shrimp',
    price: 24.00,
    rating: 4.7,
    reviews: 88,
    badge: 'Fresh Catch',
    badgeClass: 'badge-fresh',
    origin: 'Local Estuary & Coastal Catch',
    image: 'assets/images/coastal_white_prawns_1788781343200.jpg',
    desc: 'Sweet, tender prawns ideal for traditional curries, stir-fries, and pasta dishes.',
    cuts: ['Peeled & Deveined', 'Headless Shell-On'],
    available: true
  },
  {
    id: 'prod-mud-crab',
    name: 'Live Blue Swimmer Crab',
    category: 'crab',
    categoryLabel: 'Mud & Blue Crabs',
    price: 36.00,
    rating: 4.8,
    reviews: 65,
    badge: 'Wild Caught',
    badgeClass: 'badge-wild',
    origin: 'Coastal Estuaries',
    image: 'assets/images/blue_swimmer_crab_1788781381393.jpg',
    desc: 'Sweet and luscious crab meat inside strong shells. Perfect for pepper crab or fiery spicy curries.',
    cuts: ['Whole Live', 'Cleaned & Halved (Claws Cracked)'],
    available: true
  },
  {
    id: 'prod-lobster',
    name: 'Rock Spiny Lobster',
    category: 'lobster',
    categoryLabel: 'Spiny Lobsters',
    price: 68.00,
    rating: 4.9,
    reviews: 52,
    badge: 'Gourmet Selection',
    badgeClass: 'badge-coral',
    origin: 'Deep Sea Coral Reefs',
    image: 'assets/images/spiny_rock_lobster_1788781406447.jpg',
    desc: 'Luxuriously sweet tail meat with a firm bite. Excellent grilled with garlic herb butter.',
    cuts: ['Whole Cleaned', 'Tail Split Halves'],
    available: true
  }
];

// Product Controller
(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let maxPrice = 80;
  let currentSort = 'default';
  let viewMode = 'grid'; // 'grid' or 'list'

  document.addEventListener('DOMContentLoaded', () => {
    initProductFilters();
    renderProducts();
    initQuickViewModal();

    // Check if category or search was provided in URL and scroll to catalog
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category') || urlParams.has('search') || window.location.hash === '#products-catalog') {
      setTimeout(() => {
        const catalogEl = document.getElementById('products-catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  });

  function applyCategorySelection(cat) {
    currentCategory = cat || 'all';
    const categoryBtns = document.querySelectorAll('.product-cat-filter');
    let matched = false;
    categoryBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === currentCategory) {
        btn.classList.add('active', 'btn-ocean');
        btn.classList.remove('btn-outline-ocean');
        matched = true;
      } else {
        btn.classList.remove('active', 'btn-ocean');
        btn.classList.add('btn-outline-ocean');
      }
    });

    if (!matched) {
      categoryBtns.forEach(btn => {
        const btnCat = btn.getAttribute('data-category');
        if (btnCat === 'all') {
          btn.classList.add('active', 'btn-ocean');
          btn.classList.remove('btn-outline-ocean');
        } else {
          btn.classList.remove('active', 'btn-ocean');
          btn.classList.add('btn-outline-ocean');
        }
      });
    }

    renderProducts();
  }

  function initProductFilters() {
    // 1. Category Filter Pills / Buttons
    const categoryBtns = document.querySelectorAll('.product-cat-filter');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.getAttribute('data-category') || 'all';
        applyCategorySelection(cat);
      });
    });

    // 2. Search Input
    const searchInput = document.getElementById('product-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
      });
    }

    // 3. Price Range Slider
    const priceSlider = document.getElementById('price-range-slider');
    const priceDisplay = document.getElementById('price-range-val');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        maxPrice = parseFloat(e.target.value);
        priceDisplay.textContent = `₹${maxPrice.toFixed(2)}`;
        renderProducts();
      });
    }

    // 4. Sort Dropdown
    const sortSelect = document.getElementById('product-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }

    // 5. Grid / List View Toggle
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        gridBtn.classList.add('active', 'btn-ocean');
        gridBtn.classList.remove('btn-outline-ocean');
        listBtn.classList.remove('active', 'btn-ocean');
        listBtn.classList.add('btn-outline-ocean');
        renderProducts();
      });
      listBtn.addEventListener('click', () => {
        viewMode = 'list';
        listBtn.classList.add('active', 'btn-ocean');
        listBtn.classList.remove('btn-outline-ocean');
        gridBtn.classList.remove('active', 'btn-ocean');
        gridBtn.classList.add('btn-outline-ocean');
        renderProducts();
      });
    }

    // Read URL Search Params (e.g., products.html?category=fish&search=salmon)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (searchParam && searchInput) {
      searchQuery = searchParam.toLowerCase().trim();
      searchInput.value = searchParam;
    }

    if (catParam) {
      applyCategorySelection(catParam);
    }

    // Intercept footer category links ONLY if already on products.html with active catalog
    const hasProductGrid = !!document.getElementById('products-grid-container');
    if (hasProductGrid) {
      const footerCatLinks = document.querySelectorAll('footer a[href*="products.html?category="]');
      footerCatLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const match = href.match(/category=([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            e.preventDefault();
            window.history.pushState({}, '', href);
            applyCategorySelection(match[1]);
            const catalogEl = document.getElementById('products-catalog');
            if (catalogEl) {
              catalogEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    }
  }

  function getFilteredProducts() {
    return SEAFOOD_PRODUCTS.filter(p => {
      const matchCat = (currentCategory === 'all') || 
                       (currentCategory === 'fish' && p.category === 'fish') ||
                       (currentCategory === 'prawns' && (p.category === 'prawns' || p.id.includes('prawn'))) ||
                       (currentCategory === 'shellfish' && (p.category === 'shellfish' || p.category === 'crab' || p.category === 'lobster' || p.categoryLabel.toLowerCase().includes('shellfish') || p.categoryLabel.toLowerCase().includes('oyster'))) ||
                       (currentCategory === 'crab' && (p.category === 'crab' || p.id.includes('crab') || p.name.toLowerCase().includes('crab') || p.categoryLabel.toLowerCase().includes('crab'))) ||
                       (currentCategory === 'lobster' && (p.category === 'lobster' || p.id.includes('lobster') || p.name.toLowerCase().includes('lobster') || p.categoryLabel.toLowerCase().includes('lobster'))) ||
                       (currentCategory === 'other' && p.category === 'other');

      const matchSearch = p.name.toLowerCase().includes(searchQuery) ||
                          p.desc.toLowerCase().includes(searchQuery) ||
                          p.categoryLabel.toLowerCase().includes(searchQuery);

      const matchPrice = p.price <= maxPrice;

      return matchCat && matchSearch && matchPrice;
    }).sort((a, b) => {
      if (currentSort === 'price-low') return a.price - b.price;
      if (currentSort === 'price-high') return b.price - a.price;
      if (currentSort === 'name-asc') return a.name.localeCompare(b.name);
      if (currentSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }

  function renderProducts() {
    const container = document.getElementById('products-grid-container');
    const countDisplay = document.getElementById('products-count-badge');
    if (!container) return;

    const filtered = getFilteredProducts();

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} products`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-5 bg-card rounded-4 border">
            <i class="bi bi-water text-primary display-3 mb-3"></i>
            <h4 class="fw-bold">No Seafood Matches Found</h4>
            <p class="text-muted">Try adjusting your category filter, price range, or search term.</p>
            <button class="btn btn-ocean mt-2" onclick="resetProductFilters()">
              <i class="bi bi-arrow-counterclockwise"></i> Reset All Filters
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (viewMode === 'grid') {
      container.className = 'row g-4';
      container.innerHTML = filtered.map(p => `
        <div class="col-sm-6 col-lg-4">
          <div class="product-card h-100">
            <div class="product-thumb">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
              <div class="product-badge-group">
                <span class="${p.badgeClass}">${p.badge}</span>
              </div>
            </div>
            <div class="product-body d-flex flex-column">
              <span class="product-category">${p.categoryLabel}</span>
              <h5 class="product-title">
                <a href="product-details.html?id=${p.id}">${p.name}</a>
              </h5>
              <p class="product-desc">${p.desc}</p>
              <div class="product-footer mt-auto pt-3 border-top">
                <div class="product-footer-top d-flex justify-content-between align-items-center mb-2">
                  <div class="product-price">
                    ₹${p.price.toFixed(2)} <small>/ kg</small>
                  </div>
                  <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-ocean quick-view-btn px-2" data-id="${p.id}" title="Quick View & Cuts" aria-label="Quick View ${p.name}">
                      <i class="bi bi-eye"></i>
                    </button>
                    <a href="product-details.html?id=${p.id}" class="btn btn-sm btn-outline-secondary px-2" title="View Full Details" aria-label="View Details of ${p.name}">
                      <i class="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <button type="button" class="btn btn-ocean w-100 add-to-cart-btn py-2" data-id="${p.id}" aria-label="Add ${p.name} to Cart">
                  <i class="bi bi-cart-plus-fill me-2"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      // List View
      container.className = 'row g-3';
      container.innerHTML = filtered.map(p => `
        <div class="col-12">
          <div class="product-card flex-md-row">
            <div class="product-thumb" style="max-width: 260px; min-width: 220px;">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
              <div class="product-badge-group">
                <span class="${p.badgeClass}">${p.badge}</span>
              </div>
            </div>
            <div class="product-body d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <span class="product-category">${p.categoryLabel}</span>
                    <h5 class="product-title mb-1">
                      <a href="product-details.html?id=${p.id}">${p.name}</a>
                    </h5>
                    <div class="rating-stars mb-2">
                      ${renderStars(p.rating)} <span class="text-muted small">(${p.reviews} reviews)</span>
                    </div>
                  </div>
                  <div class="product-price text-end text-nowrap">
                    ₹${p.price.toFixed(2)} <small class="d-block">/ kg</small>
                  </div>
                </div>
                <p class="product-desc my-2">${p.desc}</p>
              </div>
              <div class="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-2 border-top gap-2">
                <small class="text-muted"><i class="bi bi-geo-alt-fill text-primary me-1"></i> ${p.origin}</small>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn-sm btn-outline-ocean quick-view-btn" data-id="${p.id}">
                    <i class="bi bi-eye me-1"></i> Quick View
                  </button>
                  <button type="button" class="btn btn-sm btn-ocean add-to-cart-btn" data-id="${p.id}">
                    <i class="bi bi-cart-plus-fill me-1"></i> Add to Cart
                  </button>
                  <a href="product-details.html?id=${p.id}" class="btn btn-sm btn-outline-secondary">
                    Details <i class="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    bindProductEvents();
  }

  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="bi bi-star-fill text-warning"></i> ';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="bi bi-star-half text-warning"></i> ';
      } else {
        stars += '<i class="bi bi-star text-muted"></i> ';
      }
    }
    return stars;
  }

  function bindProductEvents() {
    const quickBtns = document.querySelectorAll('.quick-view-btn');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        openQuickViewModal(id);
      });
    });

    const addCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        if (window.addToCartDirect) {
          window.addToCartDirect(id);
        }
      });
    });
  }

  function openQuickViewModal(productId) {
    const product = SEAFOOD_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modalEl = document.getElementById('quickViewModal');
    if (!modalEl || !window.bootstrap) return;

    modalEl.querySelector('.modal-product-img').src = product.image;
    modalEl.querySelector('.modal-product-title').textContent = product.name;
    modalEl.querySelector('.modal-product-category').textContent = product.categoryLabel;
    modalEl.querySelector('.modal-product-price').textContent = `₹${product.price.toFixed(2)} / kg`;
    modalEl.querySelector('.modal-product-origin').textContent = product.origin;
    modalEl.querySelector('.modal-product-desc').textContent = product.desc;
    
    // Render available cuts
    const cutsContainer = modalEl.querySelector('.modal-product-cuts');
    if (cutsContainer) {
      cutsContainer.innerHTML = product.cuts.map(c => `
        <span class="badge bg-light text-dark border p-2 me-1 mb-1">
          <i class="bi bi-scissors text-primary me-1"></i>${c}
        </span>
      `).join('');
    }

    // Set Add to Cart button on modal
    const modalAddBtn = modalEl.querySelector('.modal-add-cart-btn');
    if (modalAddBtn) {
      modalAddBtn.onclick = function() {
        if (window.addToCartDirect) {
          window.addToCartDirect(product.id);
        }
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      };
    }

    // Set details link
    const detailsLink = modalEl.querySelector('.modal-details-btn');
    if (detailsLink) {
      detailsLink.href = `product-details.html?id=${product.id}`;
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  function initQuickViewModal() {
    // Check if modal container exists or create it
    if (!document.getElementById('quickViewModal')) {
      const modalMarkup = `
        <div class="modal fade" id="quickViewModal" tabindex="-1" aria-labelledby="quickViewModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow-xl overflow-hidden">
              <div class="modal-header border-bottom-0 pb-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4 pt-0">
                <div class="row g-4 align-items-center">
                  <div class="col-md-5">
                    <img src="" alt="" class="modal-product-img img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="aspect-ratio: 1/1;">
                  </div>
                  <div class="col-md-7">
                    <span class="modal-product-category text-primary fw-bold text-uppercase small"></span>
                    <h3 class="modal-product-title fw-bold my-1"></h3>
                    <div class="modal-product-price fs-4 fw-bold text-primary mb-2"></div>
                    <p class="modal-product-desc text-muted mb-3"></p>
                    <div class="mb-3">
                      <strong class="d-block small text-uppercase text-muted mb-1">Origin / Sourcing:</strong>
                      <span class="modal-product-origin text-dark fw-medium"></span>
                    </div>
                    <div class="mb-4">
                      <strong class="d-block small text-uppercase text-muted mb-2">Custom Cutting Options:</strong>
                      <div class="modal-product-cuts d-flex flex-wrap"></div>
                    </div>
                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-ocean flex-grow-1 modal-add-cart-btn">
                        <i class="bi bi-cart-plus-fill me-1"></i> Add 1kg to Cart
                      </button>
                      <a href="#" class="btn btn-outline-ocean modal-details-btn">
                        Details <i class="bi bi-arrow-right ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalMarkup);
    }
  }

  window.resetProductFilters = function () {
    currentCategory = 'all';
    searchQuery = '';
    maxPrice = 80;
    currentSort = 'default';

    const searchInput = document.getElementById('product-search-input');
    if (searchInput) searchInput.value = '';

    const priceSlider = document.getElementById('price-range-slider');
    const priceDisplay = document.getElementById('price-range-val');
    if (priceSlider && priceDisplay) {
      priceSlider.value = 80;
      priceDisplay.textContent = '₹80.00';
    }

    const sortSelect = document.getElementById('product-sort-select');
    if (sortSelect) sortSelect.value = 'default';

    const categoryBtns = document.querySelectorAll('.product-cat-filter');
    categoryBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active', 'btn-ocean');
        btn.classList.remove('btn-outline-ocean');
      } else {
        btn.classList.remove('active', 'btn-ocean');
        btn.classList.add('btn-outline-ocean');
      }
    });

    renderProducts();
  };
})();
