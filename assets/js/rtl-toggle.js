/* ==========================================================================
   Seafood & Fresh Fish Market - RTL Toggle Script (rtl-toggle.js)
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'oceanfresh_direction';

  function getPreferredDirection() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function setDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleButtons(dir);
  }

  function updateToggleButtons(dir) {
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      if (dir === 'rtl') {
        btn.innerHTML = '<i class="fas fa-globe me-1"></i> <span class="d-none d-md-inline">LTR Layout</span>';
        btn.setAttribute('aria-label', 'Switch to LTR Layout');
      } else {
        btn.innerHTML = '<i class="fas fa-globe me-1"></i> <span class="d-none d-md-inline">RTL Layout</span>';
        btn.setAttribute('aria-label', 'Switch to RTL Layout');
      }
    });
  }

  // Initial Direction Application
  const currentDir = getPreferredDirection();
  setDirection(currentDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(getPreferredDirection());
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
        setDirection(newDir);
      });
    });
  });
})();
