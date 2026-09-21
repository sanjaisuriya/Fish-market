/**
 * Seafood & Fresh Fish Market - RTL / LTR Direction Manager
 * Persists direction preference in localStorage and handles UI state
 */

(function () {
  'use strict';

  const DIR_STORAGE_KEY = 'seafood_market_direction';
  const htmlElement = document.documentElement;

  // 1. Get stored direction (default: 'ltr')
  function getPreferredDirection() {
    return localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
  }

  // 2. Apply direction to HTML element
  function setDirection(dir) {
    htmlElement.setAttribute('dir', dir);
    if (dir === 'rtl') {
      htmlElement.setAttribute('lang', 'ar');
    } else {
      htmlElement.setAttribute('lang', 'en');
    }
    localStorage.setItem(DIR_STORAGE_KEY, dir);
    updateRtlToggleUI(dir);
  }

  // 3. Update Toggle UI
  function updateRtlToggleUI(dir) {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach((btn) => {
      const text = btn.querySelector('.rtl-text');
      const icon = btn.querySelector('i');
      if (dir === 'rtl') {
        if (text) text.textContent = 'LTR';
        if (icon) icon.className = 'bi bi-text-left text-primary';
        btn.setAttribute('aria-label', 'Switch to Left-to-Right Layout');
        btn.setAttribute('title', 'Switch to LTR Layout');
      } else {
        if (text) text.textContent = 'RTL';
        if (icon) icon.className = 'bi bi-text-right text-primary';
        btn.setAttribute('aria-label', 'Switch to Right-to-Left Layout');
        btn.setAttribute('title', 'Switch to RTL Layout');
      }
    });
  }

  // 4. Global toggle function
  window.toggleDirection = function () {
    const currentDir = htmlElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDir);
  };

  // Initialize immediately
  const initialDir = getPreferredDirection();
  setDirection(initialDir);

  // Bind click listener on DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateRtlToggleUI(initialDir);
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleDirection();
      });
    });
  });
})();
