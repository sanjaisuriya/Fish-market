/**
 * Seafood & Fresh Fish Market - Customer Dashboard (dashboard.js)
 */

(function () {
  function initDashboard() {
    renderDashboardMetrics();
    renderRecentOrdersTable();
    loadProfileData();
    setupProfileForm();
    setupDashboardTabs();
  }

  function renderDashboardMetrics() {
    const orders = window.CheckoutManager?.getOrders() || [];
    const wishlist = window.WishlistManager?.get() || [];

    const totalOrdersEl = document.getElementById('metric-total-orders');
    const pendingOrdersEl = document.getElementById('metric-pending-orders');
    const completedOrdersEl = document.getElementById('metric-completed-orders');
    const wishlistCountEl = document.getElementById('metric-wishlist-count');

    const pending = orders.filter(o => o.status === 'Processing' || o.status === 'Out for Delivery').length;
    const completed = orders.filter(o => o.status === 'Delivered').length;

    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pending;
    if (completedOrdersEl) completedOrdersEl.textContent = completed;
    if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
  }

  function renderRecentOrdersTable(limit = 5) {
    const tableBody = document.getElementById('recent-orders-tbody');
    if (!tableBody) return;

    const orders = window.CheckoutManager?.getOrders() || [];
    if (orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="fas fa-box-open fs-2 mb-2 d-block"></i>
            No seafood orders placed yet. <a href="products.html" class="text-primary fw-semibold">Start shopping fresh catch!</a>
          </td>
        </tr>
      `;
      return;
    }

    const recent = orders.slice(0, limit);
    tableBody.innerHTML = recent.map(order => {
      let statusBadge = 'bg-secondary';
      if (order.status === 'Delivered') statusBadge = 'bg-success';
      if (order.status === 'Processing') statusBadge = 'bg-warning text-dark';
      if (order.status === 'Out for Delivery') statusBadge = 'bg-info text-dark';

      const itemsSummary = order.items.map(i => `${i.name} (${i.weight || '1kg'})`).join(', ');

      return `
        <tr>
          <td class="fw-bold text-primary">#${order.orderId}</td>
          <td>${order.date} <small class="text-muted d-block">${order.time || ''}</small></td>
          <td style="max-width: 250px;" class="text-truncate" title="${itemsSummary}">${itemsSummary}</td>
          <td class="fw-bold">₹${order.amount}</td>
          <td><span class="badge ${statusBadge} px-2 py-1">${order.status}</span></td>
          <td>
            <a href="orders.html?view=${order.orderId}" class="btn btn-outline-sea btn-sm">
              <i class="fas fa-eye me-1"></i> Track
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function loadProfileData() {
    const user = window.AuthManager?.getUser() || {
      name: 'Sanjai Kumar',
      email: 'sanjai.market@seafoodfresh.com',
      phone: '+91 98765 43210',
      address: '42 Marine Drive, Bayview Heights, Chennai, Tamil Nadu - 600004'
    };

    const nameInputs = document.querySelectorAll('.user-profile-name');
    const emailInputs = document.querySelectorAll('.user-profile-email');
    const phoneInputs = document.querySelectorAll('.user-profile-phone');
    const addressInputs = document.querySelectorAll('.user-profile-address');
    const avatarImages = document.querySelectorAll('.user-profile-avatar');

    nameInputs.forEach(el => {
      if (el.tagName === 'INPUT') el.value = user.name || '';
      else el.textContent = user.name || 'User Account';
    });

    emailInputs.forEach(el => {
      if (el.tagName === 'INPUT') el.value = user.email || '';
      else el.textContent = user.email || '';
    });

    phoneInputs.forEach(el => {
      if (el.tagName === 'INPUT') el.value = user.phone || '';
      else el.textContent = user.phone || '';
    });

    addressInputs.forEach(el => {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.value = user.address || '';
      else el.textContent = user.address || '';
    });
  }

  function setupProfileForm() {
    const form = document.getElementById('profile-edit-form');
    if (!form) return;

    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('keypress', (e) => {
        const charCode = (e.which !== undefined) ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) e.preventDefault();
      });
      phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        address: form.address.value.trim()
      };

      if (!updatedUser.name) {
        if (window.showToast) window.showToast('Name cannot be empty', 'warning');
        return;
      }

      window.AuthManager?.setUser(updatedUser);
      loadProfileData();
      if (window.showToast) window.showToast('Profile updated successfully!', 'success');
    });
  }

  function setupDashboardTabs() {
    const navLinks = document.querySelectorAll('.dash-nav-item[data-section]');
    const sections = document.querySelectorAll('.dash-content-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(sec => {
          if (sec.id === targetSection) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });
      });
    });
  }

  window.DashboardManager = {
    init: initDashboard,
    refreshMetrics: renderDashboardMetrics
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recent-orders-tbody') || document.getElementById('metric-total-orders')) {
      initDashboard();
    }
  });
})();
