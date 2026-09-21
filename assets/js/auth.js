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
    const user = getUser();
    const authLinksContainers = document.querySelectorAll('.auth-nav-container');

    authLinksContainers.forEach(container => {
      container.classList.add('d-inline-flex', 'align-items-center', 'flex-nowrap');
      if (user) {
        container.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-outline-sea btn-sm dropdown-toggle d-flex align-items-center gap-2 text-nowrap" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-user-circle fs-5"></i>
              <span>${user.name ? user.name.split(' ')[0] : 'Account'}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><a class="dropdown-item" href="dashboard.html"><i class="fas fa-columns me-2 text-primary"></i>Dashboard</a></li>
              <li><a class="dropdown-item" href="orders.html"><i class="fas fa-box-open me-2 text-primary"></i>My Orders</a></li>
              <li><a class="dropdown-item" href="wishlist.html"><i class="fas fa-heart me-2 text-danger"></i>My Wishlist</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" onclick="window.AuthManager.logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
            </ul>
          </div>
        `;
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-outline-sea btn-sm text-nowrap">
            <i class="fas fa-sign-in-alt me-1"></i> Login
          </a>
          <a href="register.html" class="btn btn-primary-sea btn-sm text-nowrap d-inline-flex">
            <i class="fas fa-user-plus me-1"></i> Register
          </a>
        `;
      }
    });

    const individualAuthBtns = document.querySelectorAll('.nav-login-btn, .nav-auth-btn');
    individualAuthBtns.forEach(btn => {
      if (btn.closest('.auth-nav-container')) return;
      if (user) {
        btn.classList.remove('nav-auth-btn');
        btn.classList.add('btn', 'btn-outline-sea', 'btn-sm', 'd-inline-flex', 'align-items-center', 'gap-2');
        btn.href = 'dashboard.html';
        btn.title = 'My Account';
        btn.innerHTML = `<i class="bi bi-person-check-fill text-success fs-5"></i><span>${user.name ? user.name.split(' ')[0] : 'Account'}</span>`;
      } else {
        btn.classList.add('nav-auth-btn');
        btn.classList.remove('btn', 'btn-outline-sea', 'btn-sm');
        btn.href = 'login.html';
        btn.title = 'Login / Register';
        btn.innerHTML = `<i class="bi bi-person-circle"></i><span>Login / Register</span>`;
      }
    });
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
