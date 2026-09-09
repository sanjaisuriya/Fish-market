/**
 * Seafood & Fresh Fish Market - Master JavaScript (ES6+)
 * Core UI interactions, sticky navigation, toasts, back-to-top, countdown timers
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStickyNavbar();
    initMobileNavbarToggle();
    initBackToTop();
    initActiveNavLinks();
    initQuantityControls();
    initCountdownTimer();
    initGlobalSearchModal();
    initAuthTabs();
  });

  /* ------------------------------------------------------------------------
     0. Mobile Navbar Collapse Fallback Handler
     ------------------------------------------------------------------------ */
  function initMobileNavbarToggle() {
    const toggler = document.querySelector('.navbar-toggler');
    if (!toggler) return;

    toggler.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('data-bs-target') || '#navbarMainCollapse';
      const collapseEl = document.querySelector(targetSelector);
      if (!collapseEl) return;

      // If bootstrap collapse is loaded, let bootstrap or toggle class directly
      if (window.bootstrap && bootstrap.Collapse) {
        let bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (!bsCollapse) {
          bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
        }
        bsCollapse.toggle();
      } else {
        // Direct CSS fallback
        collapseEl.classList.toggle('show');
      }
    });
  }

  /* ------------------------------------------------------------------------
     0. Auth Hash Tab Controller
     ------------------------------------------------------------------------ */
  function initAuthTabs() {
    if (window.location.hash === '#register' || window.location.hash === '#signup') {
      const regTab = document.getElementById('register-tab');
      if (regTab && window.bootstrap) {
        const tabTrigger = new bootstrap.Tab(regTab);
        tabTrigger.show();
      } else if (regTab) {
        regTab.click();
      }
    } else if (window.location.hash === '#login' || window.location.hash === '#signin') {
      const loginTab = document.getElementById('signin-tab');
      if (loginTab && window.bootstrap) {
        const tabTrigger = new bootstrap.Tab(loginTab);
        tabTrigger.show();
      } else if (loginTab) {
        loginTab.click();
      }
    }
  }

  /* ------------------------------------------------------------------------
     1. Sticky Navbar
     ------------------------------------------------------------------------ */
  function initStickyNavbar() {
    const navbar = document.querySelector('.main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Back to Top Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Scroll back to top');
      btn.innerHTML = '<i class="bi bi-arrow-up-short fs-3"></i>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Active Nav Link Highlighting
     ------------------------------------------------------------------------ */
  function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href === currentPath) {
        link.classList.add('active');
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Global Toast Notification System
     ------------------------------------------------------------------------ */
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    let iconClass = 'bi-check-circle-fill text-success';
    if (type === 'error') iconClass = 'bi-exclamation-triangle-fill text-danger';
    if (type === 'info') iconClass = 'bi-info-circle-fill text-primary';

    toast.innerHTML = `
      <i class="bi ${iconClass} fs-4"></i>
      <div class="flex-grow-1">
        <div class="fw-bold">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <small class="text-muted">${message}</small>
      </div>
      <button type="button" class="btn-close ms-2" aria-label="Close"></button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }
    }, 4500);
  };

  /* ------------------------------------------------------------------------
     5. Quantity Controller (+ / -)
     ------------------------------------------------------------------------ */
  function initQuantityControls() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn-minus, .qty-btn-plus');
      if (!btn) return;

      const group = btn.closest('.input-group-quantity');
      if (!group) return;

      const input = group.querySelector('.qty-input');
      if (!input) return;

      let value = parseInt(input.value, 10) || 1;
      const min = parseInt(input.getAttribute('min'), 10) || 1;
      const max = parseInt(input.getAttribute('max'), 10) || 100;

      if (btn.classList.contains('qty-btn-plus')) {
        if (value < max) value++;
      } else if (btn.classList.contains('qty-btn-minus')) {
        if (value > min) value--;
      }

      input.value = value;
      input.dispatchEvent(new Event('change'));
    });
  }

  /* ------------------------------------------------------------------------
     6. Countdown Timer (Coming Soon & Maintenance)
     ------------------------------------------------------------------------ */
  function initCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    // Set target date 14 days from current date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    function update() {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        timerElement.innerHTML = '<h3 class="text-white">We are Open for Orders!</h3>';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minutesEl = document.getElementById('cd-minutes');
      const secondsEl = document.getElementById('cd-seconds');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ------------------------------------------------------------------------
     7. Search Modal & Trigger
     ------------------------------------------------------------------------ */
  function initGlobalSearchModal() {
    const searchBtns = document.querySelectorAll('.global-search-trigger');
    searchBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchModalEl = document.getElementById('globalSearchModal');
        if (searchModalEl && window.bootstrap) {
          const modal = new bootstrap.Modal(searchModalEl);
          modal.show();
          setTimeout(() => {
            const input = searchModalEl.querySelector('input');
            if (input) input.focus();
          }, 400);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Recipe Print & Share API
     ------------------------------------------------------------------------ */
  window.printRecipe = function () {
    window.print();
  };

  window.sharePage = function (title, text, url) {
    const shareData = {
      title: title || document.title,
      text: text || 'Check out this fresh seafood selection!',
      url: url || window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Share canceled', err));
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        window.showToast('Link copied to clipboard! Share it with friends.', 'info');
      });
    }
  };

  /* ------------------------------------------------------------------------
     9. Universal Cart Manager & Dynamic Badge Counter
     ------------------------------------------------------------------------ */
  const CART_KEY = 'seafood_cart';
  const COUPON_KEY = 'seafood_active_coupon';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
    
    // Update or inject badge into every nav-cart-btn across the page
    const cartBtns = document.querySelectorAll('.nav-cart-btn');
    cartBtns.forEach(btn => {
      let badge = btn.querySelector('.cart-count-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-count-badge badge rounded-pill bg-danger ms-1';
        btn.appendChild(badge);
      }
      badge.textContent = totalItems;
      if (totalItems > 0) {
        badge.style.display = 'inline-flex';
        badge.classList.remove('d-none');
      } else {
        badge.style.display = 'none';
      }
    });

    // Also update any standalone .cart-count-badge elements
    const standaloneBadges = document.querySelectorAll('.cart-count-badge:not(.nav-cart-btn .cart-count-badge)');
    standaloneBadges.forEach(badge => {
      badge.textContent = totalItems;
      if (totalItems > 0) {
        badge.style.display = 'inline-flex';
        badge.classList.remove('d-none');
      } else {
        badge.style.display = 'none';
      }
    });
  }

  // Centralized Master Catalog for instant lookup across all pages
  const DEFAULT_PRODUCT_CATALOG = {
    'prod-salmon': {
      id: 'prod-salmon',
      name: 'Norwegian Atlantic Salmon',
      price: 34.50,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/raw_norwegian_salmon_fillet_1788766533557.jpg'
    },
    'prod-tuna': {
      id: 'prod-tuna',
      name: 'Yellowfin Tuna Loin',
      price: 38.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/yellowfin_tuna_loin_catch_1788765304353.jpg'
    },
    'prod-seabass': {
      id: 'prod-seabass',
      name: 'Mediterranean Sea Bass',
      price: 28.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/mediterranean_sea_bass_fresh_1788766017507.jpg'
    },
    'prod-squid': {
      id: 'prod-squid',
      name: 'Calamari Squid (Cleaned)',
      price: 22.00,
      category: 'Squid & Calamari',
      categoryLabel: 'Squid & Calamari',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/cleaned_calamari_squid_fresh_1788766184966.jpg'
    },
    'prod-tiger-prawns': {
      id: 'prod-tiger-prawns',
      name: 'Jumbo Tiger Prawns',
      price: 42.00,
      category: 'Prawns & Shrimp',
      categoryLabel: 'Prawns & Shrimp',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/tiger_prawns_catch_1788765391401.jpg'
    },
    'prod-white-prawns': {
      id: 'prod-white-prawns',
      name: 'Coastal White Prawns',
      price: 24.50,
      category: 'Prawns & Shrimp',
      categoryLabel: 'Prawns & Shrimp',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/coastal_white_prawns_1788781343200.jpg'
    },
    'prod-pomfret': {
      id: 'prod-pomfret',
      name: 'Silver Pomfret',
      price: 32.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/silver_pomfret_fish_1788781292906.jpg'
    },
    'prod-mud-crab': {
      id: 'prod-mud-crab',
      name: 'Live Blue Swimmer Crab',
      price: 36.00,
      category: 'Crab & Shellfish',
      categoryLabel: 'Crab & Shellfish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/blue_swimmer_crab_1788781381393.jpg'
    },
    'prod-lobster': {
      id: 'prod-lobster',
      name: 'Rock Spiny Lobster',
      price: 68.00,
      category: 'Crab & Shellfish',
      categoryLabel: 'Crab & Shellfish',
      image: '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/spiny_rock_lobster_1788781406447.jpg'
    }
  };

  window.SeafoodProducts = {
    getById: function(id) {
      if (typeof SEAFOOD_PRODUCTS !== 'undefined' && Array.isArray(SEAFOOD_PRODUCTS)) {
        const found = SEAFOOD_PRODUCTS.find(p => p.id === id);
        if (found) return found;
      }
      return DEFAULT_PRODUCT_CATALOG[id] || null;
    },
    getAll: function() {
      if (typeof SEAFOOD_PRODUCTS !== 'undefined' && Array.isArray(SEAFOOD_PRODUCTS)) {
        return SEAFOOD_PRODUCTS;
      }
      return Object.values(DEFAULT_PRODUCT_CATALOG);
    }
  };

  function addItem(item) {
    if (!item || !item.id) return;
    let cart = getCart();
    const weightKg = parseFloat(item.weightKg) || 1.0;
    const cutType = item.cutType || 'Standard Cut';
    const quantity = parseInt(item.quantity, 10) || 1;

    // Resolve exact product details if missing or placeholder
    const lookup = window.SeafoodProducts.getById(item.id);
    const resolvedName = item.name && item.name !== 'Fresh Seafood Item' ? item.name : (lookup?.name || 'Fresh Seafood Item');
    const resolvedPrice = parseFloat(item.pricePerKg || item.price || lookup?.price) || 28.00;
    const resolvedImage = (item.image && !item.image.includes('images.unsplash.com/photo-1534939561126-855b8675edd7')) ? item.image : (lookup?.image || item.image || '../../brain/3ce8e3c3-fc6a-4415-a28a-fa22e1f46b69/raw_norwegian_salmon_fillet_1788766533557.jpg');
    const resolvedCategory = item.category || lookup?.categoryLabel || lookup?.category || 'Fresh Seafood';

    const existingIndex = cart.findIndex(
      i => i.id === item.id && (parseFloat(i.weightKg) === weightKg) && (i.cutType === cutType)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      // Also update image and name if it was previously a placeholder
      if (cart[existingIndex].image.includes('images.unsplash.com/photo-1534939561126-855b8675edd7') && lookup?.image) {
        cart[existingIndex].image = lookup.image;
        cart[existingIndex].name = lookup.name;
      }
    } else {
      cart.push({
        id: item.id,
        name: resolvedName,
        pricePerKg: resolvedPrice,
        image: resolvedImage,
        category: resolvedCategory,
        quantity: quantity,
        weightKg: weightKg,
        cutType: cutType
      });
    }

    saveCart(cart);
    if (window.showToast) {
      window.showToast(`Added ${quantity}x ${resolvedName} (${weightKg} kg - ${cutType}) to Cart!`, 'success');
    }
  }

  function removeProduct(productId, weightKg, cutType) {
    let cart = getCart();
    cart = cart.filter(
      item => !(item.id === productId && (weightKg === undefined || parseFloat(item.weightKg) === parseFloat(weightKg)) && (cutType === undefined || item.cutType === cutType))
    );
    saveCart(cart);
    if (window.showToast) window.showToast('Item removed from cart', 'info');
  }

  function updateQty(productId, weightKg, cutType, newQty) {
    let cart = getCart();
    const index = cart.findIndex(
      item => item.id === productId && (weightKg === undefined || parseFloat(item.weightKg) === parseFloat(weightKg)) && (cutType === undefined || item.cutType === cutType)
    );
    if (index > -1) {
      if (newQty <= 0) {
        cart.splice(index, 1);
        if (window.showToast) window.showToast('Item removed from cart', 'info');
      } else {
        cart[index].quantity = newQty;
      }
      saveCart(cart);
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
  }

  function getCalculations() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += (item.pricePerKg || item.price || 0) * (item.weightKg || 1) * (item.quantity || 1);
    });

    const coupon = localStorage.getItem(COUPON_KEY);
    let discount = 0;
    let discountLabel = '';
    if (coupon === 'FRESH20' && subtotal > 0) {
      discount = Math.round(subtotal * 0.2);
      discountLabel = '20% OFF (FRESH20)';
    } else if (coupon === 'WELCOME50' && subtotal >= 500) {
      discount = 50;
      discountLabel = '₹50 Flat OFF';
    }

    const delivery = subtotal >= 799 || subtotal === 0 ? 0 : 60;
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableSubtotal * 0.05);
    const total = taxableSubtotal + delivery + tax;

    return {
      itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
      subtotal: Math.round(subtotal),
      discount: discount,
      discountLabel: discountLabel,
      delivery: delivery,
      tax: tax,
      total: Math.round(total)
    };
  }

  function applyCoupon(code) {
    const formatted = (code || '').trim().toUpperCase();
    if (formatted === 'FRESH20') {
      localStorage.setItem(COUPON_KEY, 'FRESH20');
      if (window.showToast) window.showToast('Coupon FRESH20 applied: 20% discount!', 'success');
      return { success: true, message: 'Coupon FRESH20 applied!' };
    } else if (formatted === 'WELCOME50') {
      localStorage.setItem(COUPON_KEY, 'WELCOME50');
      if (window.showToast) window.showToast('Coupon WELCOME50 applied: ₹50 OFF!', 'success');
      return { success: true, message: 'Coupon WELCOME50 applied!' };
    } else {
      if (window.showToast) window.showToast('Invalid or expired coupon code', 'warning');
      return { success: false, message: 'Invalid coupon' };
    }
  }

  function removeCoupon() {
    localStorage.removeItem(COUPON_KEY);
    if (window.showToast) window.showToast('Coupon removed', 'info');
  }

  window.addToCartDirect = function(productId, name, price, image, category, qty = 1, weightKg = 1.0, cutType = 'Standard Cut') {
    const productObj = window.SeafoodProducts.getById(productId);
    if (productObj) {
      addItem({
        id: productObj.id,
        name: productObj.name,
        pricePerKg: productObj.price || productObj.pricePerKg,
        image: productObj.image,
        category: productObj.categoryLabel || productObj.category || 'Fresh Seafood',
        quantity: qty,
        weightKg: weightKg,
        cutType: cutType
      });
    } else {
      addItem({
        id: productId,
        name: name || 'Fresh Seafood Item',
        pricePerKg: price || 28.00,
        image: image,
        category: category || 'Fresh Fish',
        quantity: qty,
        weightKg: weightKg,
        cutType: cutType
      });
    }
  };

  window.CartManager = {
    get: getCart,
    add: addItem,
    updateQty: updateQty,
    remove: removeProduct,
    clear: clearCart,
    getCalculations: getCalculations,
    updateCount: updateCartCount,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Auto heal any previously stored carts with broken/placeholder images
    const currentCart = getCart();
    let modified = false;
    currentCart.forEach(item => {
      const prod = window.SeafoodProducts.getById(item.id);
      if (prod && (item.image.includes('unsplash.com/photo-1534939561126-855b8675edd7') || item.name === 'Fresh Seafood Item')) {
        item.image = prod.image;
        item.name = prod.name;
        item.pricePerKg = prod.price || prod.pricePerKg;
        item.category = prod.categoryLabel || prod.category;
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
    }

    updateCartCount();
  });
})();

