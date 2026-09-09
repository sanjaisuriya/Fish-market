/**
 * Seafood & Fresh Fish Market - Wishlist Manager (wishlist.js)
 * Manages customer saved items and syncs with UI icons and navbar counters.
 */

(function () {
  const WISHLIST_KEY = 'seafood_wishlist';

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    updateWishlistCount();
    updateHeartIcons();
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { list } }));
  }

  function has(productId) {
    const list = getWishlist();
    return list.includes(productId);
  }

  function toggle(productId) {
    let list = getWishlist();
    const product = window.SeafoodProducts?.getById(productId);
    const prodName = product ? product.name : 'Product';

    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
      saveWishlist(list);
      if (window.showToast) window.showToast(`Removed ${prodName} from wishlist`, 'info');
      return false;
    } else {
      list.push(productId);
      saveWishlist(list);
      if (window.showToast) window.showToast(`Saved ${prodName} to wishlist!`, 'success');
      return true;
    }
  }

  function remove(productId) {
    let list = getWishlist();
    list = list.filter(id => id !== productId);
    saveWishlist(list);
    if (window.showToast) window.showToast('Item removed from wishlist', 'info');
  }

  function updateWishlistCount() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    const list = getWishlist();
    badges.forEach(badge => {
      badge.textContent = list.length;
      if (list.length > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  function updateHeartIcons() {
    const list = getWishlist();
    const buttons = document.querySelectorAll('.btn-wishlist-toggle');

    buttons.forEach(btn => {
      const id = btn.getAttribute('data-id');
      const icon = btn.querySelector('i');
      if (!icon) return;

      if (list.includes(id)) {
        btn.classList.add('active');
        icon.className = 'fas fa-heart text-danger';
      } else {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
      }
    });
  }

  window.toggleWishlist = function (productId) {
    toggle(productId);
  };

  window.WishlistManager = {
    get: getWishlist,
    has: has,
    toggle: toggle,
    remove: remove,
    updateCount: updateWishlistCount,
    updateIcons: updateHeartIcons
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
    updateHeartIcons();
  });
})();
