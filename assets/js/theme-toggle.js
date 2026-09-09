/* ==========================================================================
   Seafood & Fresh Fish Market - Theme Toggle Script (theme-toggle.js)
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'oceanfresh_theme';

  function getPreferredTheme() {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '<i class="fas fa-sun me-1"></i> <span class="d-none d-md-inline">Light Mode</span>';
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        btn.innerHTML = '<i class="fas fa-moon me-1"></i> <span class="d-none d-md-inline">Dark Mode</span>';
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });
  }

  // Initial Theme Application
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(getPreferredTheme());
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    });
  });
})();
