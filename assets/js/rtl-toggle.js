/* ==========================================================================
   Seafood & Fresh Fish Market - RTL Toggle Script (rtl-toggle.js)
   ========================================================================== */

(function () {
  'use strict';

  const DIR_STORAGE_KEY = 'seafood_market_direction';
  const htmlElement = document.documentElement;

  function getPreferredDirection() {
    return localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
  }

  function setDirection(dir) {
    htmlElement.setAttribute('dir', dir);
    if (dir === 'rtl') {
      htmlElement.setAttribute('lang', 'ar');
    } else {
      htmlElement.setAttribute('lang', 'en');
    }
    localStorage.setItem(DIR_STORAGE_KEY, dir);
    updateToggleButtons(dir);
  }

  function updateToggleButtons(dir) {
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      const text = btn.querySelector('.rtl-text');
      const icon = btn.querySelector('i');
      if (dir === 'rtl') {
        if (text) text.textContent = 'LTR';
        if (icon) icon.className = 'bi bi-globe2';
        btn.setAttribute('aria-label', 'Switch to Left-to-Right Layout');
        btn.setAttribute('title', 'Switch to LTR Layout');
      } else {
        if (text) text.textContent = 'RTL';
        if (icon) icon.className = 'bi bi-globe2';
        btn.setAttribute('aria-label', 'Switch to Right-to-Left Layout');
        btn.setAttribute('title', 'Switch to RTL Layout');
      }
    });
  }

  window.toggleDirection = function () {
    const currentDir = htmlElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDir);
  };

  const currentDir = getPreferredDirection();
  setDirection(currentDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(getPreferredDirection());
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleDirection();
      });
    });
  });
})();

