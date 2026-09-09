/**
 * Seafood & Fresh Fish Market - Theme Manager (Dark / Light Mode)
 * Persists user preference in localStorage
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'seafood_market_theme';
  const htmlElement = document.documentElement;

  // 1. Get initial theme (localStorage or system preference)
  function getPreferredTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // 2. Set theme on DOM and update button state
  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleUI(theme);
  }

  // 3. Update toggle buttons on the page
  function updateThemeToggleUI(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      const text = btn.querySelector('.theme-text');
      if (theme === 'dark') {
        if (icon) icon.className = 'bi bi-sun-fill text-warning';
        if (text) text.textContent = 'Light';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        if (icon) icon.className = 'bi bi-moon-stars-fill';
        if (text) text.textContent = 'Dark';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });
  }

  // 4. Toggle theme handler
  window.toggleTheme = function () {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Initialize immediately on script execution to avoid flickering
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  // Bind click listeners after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggleUI(initialTheme);
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleTheme();
      });
    });
  });
})();
