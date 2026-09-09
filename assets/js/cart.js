/**
 * Seafood & Fresh Fish Market - Cart Manager (cart.js)
 * Handles cart item state, weights, calculations, and local storage sync.
 */

(function () {
  const CART_KEY = 'seafood_cart';
  const COUPON_KEY = 'seafood_active_coupon';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

  function addItem(productId, quantity = 1, weightKg = 1.0, cutType = 'Standard Cut') {
    const product = window.SeafoodProducts?.getById(productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(
      item => item.id === productId && item.weightKg === weightKg && item.cutType === cutType
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        pricePerKg: parseFloat(product.pricePerKg || product.price) || 28.00,
        image: product.image,
        category: product.categoryLabel || product.categoryName || product.category || 'Fresh Seafood',
        quantity: quantity,
        weightKg: weightKg,
        cutType: cutType
      });
    }

    saveCart(cart);
    if (window.showToast) {
      window.showToast(`Added ${quantity}x ${product.name} (${weightKg} kg) to cart!`, 'success');
    }
  }

  function updateQuantity(productId, weightKg, cutType, newQty) {
    let cart = getCart();
    const index = cart.findIndex(
      item => item.id === productId && item.weightKg === weightKg && item.cutType === cutType
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

  function removeItem(productId, weightKg, cutType) {
    let cart = getCart();
    cart = cart.filter(
      item => !(item.id === productId && item.weightKg === weightKg && item.cutType === cutType)
    );
    saveCart(cart);
    if (window.showToast) window.showToast('Item removed from cart', 'info');
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
      subtotal += item.pricePerKg * item.weightKg * item.quantity;
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

    // Free delivery above ₹799
    const delivery = subtotal >= 799 || subtotal === 0 ? 0 : 60;
    // 5% standard GST on packaged fresh meat/seafood
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableSubtotal * 0.05);
    const total = taxableSubtotal + delivery + tax;

    return {
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: Math.round(subtotal),
      discount: discount,
      discountLabel: discountLabel,
      delivery: delivery,
      tax: tax,
      total: Math.round(total)
    };
  }

  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
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

  // Quick Direct Add Helper for buttons
  window.addToCartDirect = function (productId) {
    addItem(productId, 1, 1.0, 'Standard Cut');
  };

  window.CartManager = {
    get: getCart,
    add: addItem,
    updateQty: updateQuantity,
    remove: removeItem,
    clear: clearCart,
    getCalculations: getCalculations,
    updateCount: updateCartCount,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
  });
})();
