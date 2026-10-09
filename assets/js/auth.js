/**
 * Seafood & Fresh Fish Market - Authentication & Profile Manager (auth.js)
 */

(function () {
  const USER_KEY = 'seafood_user';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateAuthNavbar();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    updateAuthNavbar();
    if (window.showToast) window.showToast('You have been logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  }

  function updateAuthNavbar() {
    // Authentication & Dashboard removed per specification
    // No login, sign up, or dashboard links will be injected
  }

  // Password Visibility Toggle Utility
  function setupPasswordToggles() {
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-group')?.querySelector('input');
        const icon = btn.querySelector('i');
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'fas fa-eye-slash text-muted';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'fas fa-eye text-muted';
        }
      });
    });
  }

  window.AuthManager = {
    getUser: getUser,
    setUser: setUser,
    logout: logout,
    updateNavbar: updateAuthNavbar
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateAuthNavbar();
    setupPasswordToggles();
  });
})();
