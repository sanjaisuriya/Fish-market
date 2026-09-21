/* ==========================================================================
   Seafood & Fresh Fish Market - Product Filtering & Search (product-filter.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productContainer');
  const searchInput = document.getElementById('productSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const availabilityFilter = document.getElementById('availabilityFilter');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');

  let productsData = [];
  let isListView = false;

  if (!productGrid) return; // Exit if not on products page

  // Fetch Products Data
  fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
      productsData = data;
      renderProducts();
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      productGrid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">Failed to load product catalog.</p></div>';
    });

  function renderProducts() {
    let filtered = [...productsData];

    // Search query
    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category Filter
    if (categoryFilter && categoryFilter.value !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === categoryFilter.value.toLowerCase());
    }

    // Availability Filter
    if (availabilityFilter && availabilityFilter.checked) {
      filtered = filtered.filter(p => p.availability === 'In Stock');
    }

    // Sort
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
    }

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-fish fa-3x text-muted mb-3"></i>
          <h4>No Seafood Matches Found</h4>
          <p class="text-muted">Try adjusting your search terms or filter selection.</p>
        </div>`;
      return;
    }

    if (isListView) {
      productGrid.innerHTML = filtered.map(p => `
        <div class="col-12 mb-3">
          <div class="market-card flex-row flex-wrap align-items-center p-3">
            <div class="card-img-wrapper" style="width: 200px; height: 140px; flex-shrink: 0;">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
              <span class="badge-freshness">${p.freshness}</span>
            </div>
            <div class="card-body-custom flex-grow-1 px-4 py-2">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="text-uppercase text-secondary font-semibold text-xs">${p.category}</span>
                  <h4 class="mb-1"><a href="product-details.html?id=${p.id}">${p.name}</a></h4>
                  <p class="text-muted text-sm mb-2" style="max-width: 500px;">${p.description}</p>
                </div>
                <div class="text-end">
                  <div class="product-price-tag">₹${p.price.toFixed(2)} <span>/ ${p.unit}</span></div>
                  <span class="badge bg-success-subtle text-success border border-success-subtle">${p.availability}</span>
                </div>
              </div>
              <div class="d-flex gap-2 mt-3">
                <button onclick="openEnquiryModal('${p.name}')" class="btn btn-primary-custom btn-sm">
                  <i class="fas fa-paper-plane me-1"></i> Order Enquiry
                </button>
                <button onclick="openQuickViewModal('${p.id}')" class="btn btn-outline-custom btn-sm">
                  <i class="fas fa-eye me-1"></i> Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      productGrid.innerHTML = filtered.map(p => `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="market-card">
            <div class="card-img-wrapper">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
              <span class="badge-freshness">${p.freshness}</span>
              <span class="badge-category">${p.category}</span>
            </div>
            <div class="card-body-custom">
              <h5 class="card-title mb-1"><a href="product-details.html?id=${p.id}">${p.name}</a></h5>
              <div class="d-flex align-items-center gap-1 mb-2 text-warning text-sm">
                <i class="fas fa-star"></i>
                <span class="fw-bold text-dark dark:text-light">${p.rating}</span>
                <span class="text-muted">(${p.reviewsCount})</span>
              </div>
              <p class="text-muted text-sm line-clamp-2 mb-3">${p.description}</p>
              <div class="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                <div class="product-price-tag">₹${p.price.toFixed(2)} <span>/ ${p.unit}</span></div>
                <div class="d-flex gap-2">
                  <button onclick="openQuickViewModal('${p.id}')" class="btn btn-outline-custom btn-sm p-2" title="Quick View">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button onclick="openEnquiryModal('${p.name}')" class="btn btn-primary-custom btn-sm">
                    <i class="fas fa-cart-plus me-1"></i> Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', renderProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', renderProducts);
  if (sortSelect) sortSelect.addEventListener('change', renderProducts);
  if (availabilityFilter) availabilityFilter.addEventListener('change', renderProducts);

  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      isListView = false;
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      renderProducts();
    });

    viewListBtn.addEventListener('click', () => {
      isListView = true;
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      renderProducts();
    });
  }
});
