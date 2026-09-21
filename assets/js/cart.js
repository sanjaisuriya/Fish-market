/**
 * Seafood & Fresh Fish Market - Cart Manager (cart.js)
 * Handles cart item state, weights, calculations, and local storage sync.
 */

(function () {
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
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

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

    const lookup = window.SeafoodProducts?.getById ? window.SeafoodProducts.getById(id) : null;
    const resolvedName = name && name !== 'Fresh Seafood Item' ? name : (lookup?.name || id);
    const resolvedPrice = (!isNaN(price) && price > 0) ? price : (parseFloat(lookup?.price || lookup?.pricePerKg) || 28.00);
    const resolvedImage = (image && !image.includes('premium_photo') && !image.includes('photo-1534939561126-855b8675edd7')) ? image : (lookup?.image || 'assets/images/raw_norwegian_salmon_fillet_1788766533557.jpg');
    const resolvedCategory = category || lookup?.categoryLabel || lookup?.categoryName || lookup?.category || 'Fresh Seafood';

    let cart = getCart();
    const existingIndex = cart.findIndex(
      item => item.id === id && parseFloat(item.weightKg) === weight && item.cutType === cut
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
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
      window.showToast(`Added ${qty}x ${resolvedName} (${weight} kg - ${cut}) to cart!`, 'success');
    }
  }

  function updateQuantity(productId, weightKg, cutType, newQty) {
    let cart = getCart();
    const targetWeight = weightKg !== undefined ? parseFloat(weightKg) : undefined;
    const index = cart.findIndex(
      item => item.id === productId && (targetWeight === undefined || parseFloat(item.weightKg) === targetWeight) && (cutType === undefined || item.cutType === cutType)
    );

    if (index > -1) {
      if (newQty <= 0) {
        cart.splice(index, 1);
        if (window.showToast) window.showToast('Item removed from cart', 'info');
      } else {
        cart[index].quantity = parseInt(newQty, 10) || 1;
      }
      saveCart(cart);
    }
  }

  function updateQuantityByIndex(index, newQty) {
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

  function removeItem(productId, weightKg, cutType) {
    let cart = getCart();
    const targetWeight = weightKg !== undefined ? parseFloat(weightKg) : undefined;
    cart = cart.filter(
      item => !(item.id === productId && (targetWeight === undefined || parseFloat(item.weightKg) === targetWeight) && (cutType === undefined || item.cutType === cutType))
    );
    saveCart(cart);
    if (window.showToast) window.showToast('Item removed from cart', 'info');
  }

  function removeItemByIndex(index) {
    let cart = getCart();
    const idx = parseInt(index, 10);
    if (idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
      saveCart(cart);
      if (window.showToast) window.showToast('Item removed from cart', 'info');
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
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
      return { success: true, message: 'Coupon FRESH20 applied!' };
    } else if (formatted === 'WELCOME50') {
      localStorage.setItem(COUPON_KEY, 'WELCOME50');
      if (window.showToast) window.showToast('Coupon WELCOME50 applied: ₹50 OFF!', 'success');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
      return { success: true, message: 'Coupon WELCOME50 applied!' };
    } else {
      if (window.showToast) window.showToast('Invalid or expired coupon code', 'warning');
      return { success: false, message: 'Invalid coupon' };
    }
  }

  function removeCoupon() {
    localStorage.removeItem(COUPON_KEY);
    if (window.showToast) window.showToast('Coupon removed', 'info');
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
  }

  // Quick Direct Add Helper for buttons
  window.addToCartDirect = function (productId, name, price, image, category, qty = 1, weightKg = 1.0, cutType = 'Standard Cut') {
    if (name || price || image || category) {
      addItem({
        id: productId,
        name: name,
        pricePerKg: price,
        image: image,
        category: category,
        quantity: qty,
        weightKg: weightKg,
        cutType: cutType
      });
    } else {
      addItem(productId, qty, weightKg, cutType);
    }
  };

  window.CartManager = {
    get: getCart,
    add: addItem,
    addItem: addItem,
    updateQty: updateQuantity,
    updateQuantity: updateQuantity,
    updateQtyByIndex: updateQuantityByIndex,
    remove: removeItem,
    removeItem: removeItem,
    removeByIndex: removeItemByIndex,
    clear: clearCart,
    clearCart: clearCart,
    getCalculations: getCalculations,
    updateCount: updateCartCount,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
  });
})();
