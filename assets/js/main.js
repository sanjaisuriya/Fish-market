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
    // Ensure navbar dropdowns use static positioning so Popper doesn't displace them offscreen on mobile
    document.querySelectorAll('.main-navbar .dropdown-toggle').forEach(function (toggle) {
      toggle.setAttribute('data-bs-display', 'static');
    });

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
      const raw = localStorage.getItem(CART_KEY);
      if (raw === null) {
        const sampleCart = [
          {
            id: 'prod-salmon',
            name: 'Norwegian Atlantic Salmon',
            pricePerKg: 34.00,
            image: 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg',
            category: 'Fresh Fish',
            quantity: 2,
            weightKg: 1.0,
            cutType: 'Skin-On Fillet'
          },
          {
            id: 'prod-tiger-prawns',
            name: 'Jumbo Tiger Prawns',
            pricePerKg: 42.00,
            image: 'assets/images/tiger_prawns_catch_1788765391401.jpg',
            category: 'Prawns & Shrimp',
            quantity: 1,
            weightKg: 0.5,
            cutType: 'Cleaned & Deveined'
          },
          {
            id: 'prod-mud-crab',
            name: 'Live Blue Swimmer Crab',
            pricePerKg: 36.00,
            image: 'assets/images/blue_swimmer_crab_1788781381393.jpg',
            category: 'Crab & Shellfish',
            quantity: 3,
            weightKg: 1.0,
            cutType: 'Whole Live'
          }
        ];
        localStorage.setItem(CART_KEY, JSON.stringify(sampleCart));
        return sampleCart;
      }
      return JSON.parse(raw) || [];
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
      price: 34.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg'
    },
    'prod-tuna': {
      id: 'prod-tuna',
      name: 'Yellowfin Tuna Loin',
      price: 38.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: 'assets/images/yellowfin_tuna_loin_catch_1788765304353.jpg'
    },
    'prod-seabass': {
      id: 'prod-seabass',
      name: 'Mediterranean Sea Bass',
      price: 28.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: 'assets/images/mediterranean_sea_bass_fresh_1788766017507.jpg'
    },
    'prod-squid': {
      id: 'prod-squid',
      name: 'Calamari Squid (Cleaned)',
      price: 22.00,
      category: 'Squid & Calamari',
      categoryLabel: 'Squid & Calamari',
      image: 'assets/images/cleaned_calamari_squid_fresh_1788766184966.jpg'
    },
    'prod-tiger-prawns': {
      id: 'prod-tiger-prawns',
      name: 'Jumbo Tiger Prawns',
      price: 42.00,
      category: 'Prawns & Shrimp',
      categoryLabel: 'Prawns & Shrimp',
      image: 'assets/images/tiger_prawns_catch_1788765391401.jpg'
    },
    'prod-white-prawns': {
      id: 'prod-white-prawns',
      name: 'Coastal White Prawns',
      price: 24.00,
      category: 'Prawns & Shrimp',
      categoryLabel: 'Prawns & Shrimp',
      image: 'assets/images/coastal_white_prawns_1788781343200.jpg'
    },
    'prod-pomfret': {
      id: 'prod-pomfret',
      name: 'Silver Pomfret',
      price: 32.00,
      category: 'Fresh Fish',
      categoryLabel: 'Fresh Fish',
      image: 'assets/images/silver_pomfret_fish_1788781292906.jpg'
    },
    'prod-mud-crab': {
      id: 'prod-mud-crab',
      name: 'Live Blue Swimmer Crab',
      price: 36.00,
      category: 'Crab & Shellfish',
      categoryLabel: 'Crab & Shellfish',
      image: 'assets/images/blue_swimmer_crab_1788781381393.jpg'
    },
    'prod-lobster': {
      id: 'prod-lobster',
      name: 'Rock Spiny Lobster',
      price: 68.00,
      category: 'Crab & Shellfish',
      categoryLabel: 'Crab & Shellfish',
      image: 'assets/images/spiny_rock_lobster_1788781406447.jpg'
    },
    'prod-halibut': {
      id: 'prod-halibut',
      name: 'Center-Cut Halibut & Herb Butter',
      price: 39.50,
      category: 'Fresh Fish',
      categoryLabel: 'Chef Signature',
      image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=1000&q=85'
    },
    'prod-crab-kit': {
      id: 'prod-crab-kit',
      name: 'Garlic-Herb King Crab Cluster',
      price: 44.00,
      category: 'Crab & Shellfish',
      categoryLabel: 'Ready-to-Cook Kit',
      image: 'assets/images/garlic_herb_king_crab_cluster.jpg'
    },
    'prod-salmon-kit': {
      id: 'prod-salmon-kit',
      name: 'Citrus & Dill Norwegian Salmon',
      price: 34.00,
      category: 'Fresh Fish',
      categoryLabel: 'Ready-to-Cook Kit',
      image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&w=800&q=80'
    },
    'prod-prawn-skewer': {
      id: 'prod-prawn-skewer',
      name: 'Spiced Tiger Prawn Skewers (8pc)',
      price: 32.00,
      category: 'Prawns & Shrimp',
      categoryLabel: 'Ready-to-Cook Kit',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80'
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

  function addItem(productOrId, quantity = 1, weightKg = 1.0, cutType = 'Standard Cut') {
    let id, name, price, image, category, qty, weight, cut;

    if (typeof productOrId === 'object' && productOrId !== null) {
      id = productOrId.id;
      name = productOrId.name;
      price = parseFloat(productOrId.pricePerKg || productOrId.price);
      image = productOrId.image;
      category = productOrId.category || productOrId.categoryLabel || productOrId.categoryName;
      qty = parseInt(productOrId.quantity, 10) || 1;
      weight = parseFloat(productOrId.weightKg) || 1.0;
      cut = productOrId.cutType || 'Standard Cut';
    } else {
      id = productOrId;
      qty = parseInt(quantity, 10) || 1;
      weight = parseFloat(weightKg) || 1.0;
      cut = cutType || 'Standard Cut';
    }

    if (!id) return;
    let cart = getCart();

    // Resolve exact product details if missing or placeholder
    const lookup = window.SeafoodProducts?.getById ? window.SeafoodProducts.getById(id) : null;
    const resolvedName = name && name !== 'Fresh Seafood Item' ? name : (lookup?.name || 'Fresh Seafood Item');
    const resolvedPrice = (!isNaN(price) && price > 0) ? price : (parseFloat(lookup?.price || lookup?.pricePerKg) || 28.00);
    const resolvedImage = (image && !image.includes('premium_photo') && !image.includes('photo-1534939561126-855b8675edd7')) ? image : (lookup?.image || 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg');
    const resolvedCategory = category || lookup?.categoryLabel || lookup?.category || 'Fresh Seafood';

    const existingIndex = cart.findIndex(
      i => i.id === id && (parseFloat(i.weightKg) === weight) && (i.cutType === cut)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
      // Also update image and name if it was previously a placeholder
      if ((!cart[existingIndex].image || cart[existingIndex].image.includes('premium_photo') || cart[existingIndex].image.includes('photo-1534939561126-855b8675edd7')) && lookup?.image) {
        cart[existingIndex].image = lookup.image;
        cart[existingIndex].name = lookup.name;
      }
    } else {
      cart.push({
        id: id,
        name: resolvedName,
        pricePerKg: resolvedPrice,
        image: resolvedImage,
        category: resolvedCategory,
        quantity: qty,
        weightKg: weight,
        cutType: cut
      });
    }

    saveCart(cart);
    if (window.showToast) {
      window.showToast(`Added ${qty}x ${resolvedName} (${weight} kg - ${cut}) to Cart!`, 'success');
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
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
      if (window.showToast) window.showToast('Coupon FRESH20 applied: 20% discount!', 'success');
      return { success: true, message: 'Coupon FRESH20 applied!' };
    } else if (formatted === 'WELCOME50') {
      localStorage.setItem(COUPON_KEY, 'WELCOME50');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
      if (window.showToast) window.showToast('Coupon WELCOME50 applied: ₹50 OFF!', 'success');
      return { success: true, message: 'Coupon WELCOME50 applied!' };
    } else {
      if (window.showToast) window.showToast('Invalid or expired coupon code', 'warning');
      return { success: false, message: 'Invalid coupon' };
    }
  }

  function removeCoupon() {
    localStorage.removeItem(COUPON_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
    if (window.showToast) window.showToast('Coupon removed', 'info');
  }

  function updateQtyByIndex(index, newQty) {
    let cart = getCart();
    const idx = parseInt(index, 10);
    if (idx >= 0 && idx < cart.length) {
      if (newQty <= 0) {
        cart.splice(idx, 1);
        if (window.showToast) window.showToast('Item removed from cart', 'info');
      } else {
        cart[idx].quantity = parseInt(newQty, 10) || 1;
      }
      saveCart(cart);
    }
  }

  function removeByIndex(index) {
    let cart = getCart();
    const idx = parseInt(index, 10);
    if (idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
      saveCart(cart);
      if (window.showToast) window.showToast('Item removed from cart', 'info');
    }
  }

  window.addToCartDirect = function(productId, name, price, image, category, qty = 1, weightKg = 1.0, cutType = 'Standard Cut') {
    const productObj = window.SeafoodProducts?.getById ? window.SeafoodProducts.getById(productId) : null;
    if (productObj) {
      addItem({
        id: productObj.id,
        name: name || productObj.name,
        pricePerKg: (!isNaN(parseFloat(price)) && parseFloat(price) > 0) ? parseFloat(price) : (productObj.price || productObj.pricePerKg),
        image: image || productObj.image,
        category: category || productObj.categoryLabel || productObj.category || 'Fresh Seafood',
        quantity: qty,
        weightKg: weightKg,
        cutType: cutType
      });
    } else {
      addItem({
        id: productId,
        name: name || 'Fresh Seafood Item',
        pricePerKg: (!isNaN(parseFloat(price)) && parseFloat(price) > 0) ? parseFloat(price) : 28.00,
        image: image || 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg',
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
    addItem: addItem,
    updateQty: updateQty,
    updateQuantity: updateQty,
    updateQtyByIndex: updateQtyByIndex,
    remove: removeProduct,
    removeItem: removeProduct,
    removeByIndex: removeByIndex,
    clear: clearCart,
    clearCart: clearCart,
    getCalculations: getCalculations,
    updateCount: updateCartCount,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon
  };

  /* ------------------------------------------------------------------------
     Universal Auth Navbar Integration (Syncs all pages with logged-in user)
     ------------------------------------------------------------------------ */
  function updateGlobalAuthNavbar() {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('seafood_user'));
    } catch (e) {
      user = null;
    }

    const authTargets = document.querySelectorAll('.nav-login-btn, .nav-auth-btn');
    authTargets.forEach(target => {
      // Don't overwrite if it's already customized inside an auth-nav-container handled by auth.js
      if (target.closest('.auth-nav-container')) return;

      if (user) {
        target.classList.remove('nav-auth-btn');
        target.classList.add('btn', 'btn-outline-sea', 'btn-sm', 'd-inline-flex', 'align-items-center', 'gap-2');
        target.href = 'dashboard.html';
        target.title = 'My Account';
        target.innerHTML = `<i class="bi bi-person-check-fill text-success fs-5"></i><span>${user.name ? user.name.split(' ')[0] : 'Account'}</span>`;
      } else {
        target.classList.add('nav-auth-btn');
        target.classList.remove('btn', 'btn-outline-sea', 'btn-sm');
        target.href = 'login.html';
        target.title = 'Login / Register';
        target.innerHTML = `<i class="bi bi-person-circle"></i><span>Login / Register</span>`;
      }
    });
  }

  // Ensure window.AuthManager exists even if auth.js is not loaded on this page
  if (!window.AuthManager) {
    window.AuthManager = {
      getUser: function() {
        try { return JSON.parse(localStorage.getItem('seafood_user')); } catch (e) { return null; }
      },
      setUser: function(user) {
        localStorage.setItem('seafood_user', JSON.stringify(user));
        updateGlobalAuthNavbar();
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
      },
      logout: function() {
        localStorage.removeItem('seafood_user');
        updateGlobalAuthNavbar();
        if (window.showToast) window.showToast('You have been logged out successfully', 'info');
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
      },
      updateNavbar: updateGlobalAuthNavbar
    };
  }

  window.addEventListener('authChanged', () => {
    updateGlobalAuthNavbar();
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Auto heal any previously stored carts with broken/placeholder images
    const currentCart = getCart();
    let modified = false;
    currentCart.forEach(item => {
      const prod = window.SeafoodProducts.getById(item.id);
      if (prod && (!item.image || item.image.includes('photo-1599488615731-7e5c2823ff28') || item.image.includes('premium_photo') || item.image.includes('photo-1534939561126-855b8675edd7') || item.image.includes('assets/images/herb_grilled_salmon_recipe') || item.name === 'Fresh Seafood Item')) {
        item.image = prod.image;
        item.name = prod.name;
        item.pricePerKg = prod.price || prod.pricePerKg;
        item.category = prod.categoryLabel || prod.category;
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: currentCart } }));
    }

    updateCartCount();
    updateGlobalAuthNavbar();
  });
})();

