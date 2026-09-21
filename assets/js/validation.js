/**
 * Seafood & Fresh Fish Market - Live Form Validation & Authentication Simulation
 * Validates Contact, Order Enquiry, Login, and Register forms with real-time UI feedback
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initContactValidation();
    initLoginValidation();
    initRegisterValidation();
    initPasswordToggle();
  });

  /* ------------------------------------------------------------------------
     1. Contact & Order Enquiry Form Validation & Dual Submission (WhatsApp / Email)
     ------------------------------------------------------------------------ */
  function initContactValidation() {
    const contactForm = document.getElementById('contact-enquiry-form');
    if (!contactForm) return;

    const whatsappBtn = document.getElementById('btn-submit-whatsapp');
    const storeWhatsAppNumber = '18005553474'; // Market WhatsApp Number
    const phoneInput = document.getElementById('contact-phone');

    if (phoneInput) {
      setupNumericPhoneInput(phoneInput, 'Order enquiry phone number');
    }

    function validateFormData() {
      let isValid = true;
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const seafoodSelect = document.getElementById('enquiry-seafood-type');
      const qtyInput = document.getElementById('enquiry-quantity');
      const dateInput = document.getElementById('enquiry-date');
      const notesInput = document.getElementById('enquiry-message');

      // Full Name
      if (nameInput) {
        if (nameInput.value.trim().length < 2) {
          showInputError(nameInput, 'Please enter your full name (minimum 2 characters).');
          isValid = false;
        } else {
          clearInputError(nameInput);
        }
      }

      // Email
      if (emailInput) {
        if (!isValidEmail(emailInput.value.trim())) {
          showInputError(emailInput, 'Please provide a valid email address.');
          isValid = false;
        } else {
          clearInputError(emailInput);
        }
      }

      // Phone (Strict Numeric & Length Validation)
      if (phoneInput) {
        if (!validatePhoneNumber(phoneInput, 'Order enquiry phone number')) {
          isValid = false;
        }
      }

      // Seafood Type
      if (seafoodSelect) {
        if (!seafoodSelect.value || seafoodSelect.value === '') {
          showInputError(seafoodSelect, 'Please select the seafood variety you are inquiring about.');
          isValid = false;
        } else {
          clearInputError(seafoodSelect);
        }
      }

      // Quantity
      if (qtyInput) {
        if (parseFloat(qtyInput.value) <= 0 || isNaN(parseFloat(qtyInput.value))) {
          showInputError(qtyInput, 'Please specify an order quantity greater than 0 kg.');
          isValid = false;
        } else {
          clearInputError(qtyInput);
        }
      }

      // Preferred Delivery Date
      if (dateInput) {
        if (!dateInput.value) {
          showInputError(dateInput, 'Please select your preferred delivery date.');
          isValid = false;
        } else {
          clearInputError(dateInput);
        }
      }

      if (!isValid) {
        window.showToast('Please correct the highlighted fields in the enquiry form.', 'error');
        return null;
      }

      const seafoodName = seafoodSelect.options[seafoodSelect.selectedIndex]?.text || seafoodSelect.value;
      const refId = 'ENQ-' + Math.floor(10000 + Math.random() * 90000);

      return {
        refId,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        seafood: seafoodName,
        quantity: qtyInput.value.trim(),
        date: dateInput.value,
        notes: notesInput ? notesInput.value.trim() : ''
      };
    }

    function saveEnquiryLocally(data) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('seafood_enquiries')) || [];
        enquiries.unshift({ ...data, createdAt: new Date().toISOString(), status: 'Under Review' });
        localStorage.setItem('seafood_enquiries', JSON.stringify(enquiries));
      } catch (e) {
        // Safe fallback
      }
    }

    function showConfirmationModal(data, whatsappUrl) {
      const modalEl = document.getElementById('enquirySuccessModal');
      if (modalEl && window.bootstrap) {
        const nameEl = document.getElementById('modal-enq-name');
        const refEl = document.getElementById('modal-enq-ref');
        const itemEl = document.getElementById('modal-enq-item');
        const qtyEl = document.getElementById('modal-enq-qty');
        const dateEl = document.getElementById('modal-enq-date');
        const waLink = document.getElementById('modal-enq-whatsapp-link');

        if (nameEl) nameEl.textContent = data.name;
        if (refEl) refEl.textContent = '#' + data.refId;
        if (itemEl) itemEl.textContent = data.seafood;
        if (qtyEl) qtyEl.textContent = `${data.quantity} kg`;
        if (dateEl) dateEl.textContent = data.date;
        if (waLink) waLink.href = whatsappUrl;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }

    function buildWhatsAppMessage(data) {
      const message = 
`🐟 *FRESH SEAFOOD ORDER ENQUIRY* [Ref: #${data.refId}]
━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${data.name}
📱 *Phone / WhatsApp:* ${data.phone}
📧 *Email Address:* ${data.email}
🐠 *Seafood Variety:* ${data.seafood}
⚖️ *Order Quantity:* ${data.quantity} kg
📅 *Preferred Delivery Date:* ${data.date}
🔪 *Cutting Style & Notes:* ${data.notes || 'Standard Pier Cleaning'}
━━━━━━━━━━━━━━━━━━━
_Hi Dock Manager, please confirm live catch availability, cuts & price for my order._`;

      return `https://api.whatsapp.com/send?phone=${storeWhatsAppNumber}&text=${encodeURIComponent(message)}`;
    }

    // 1. WhatsApp Direct Submission Button
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = validateFormData();
        if (!data) return;

        saveEnquiryLocally(data);
        const waUrl = buildWhatsAppMessage(data);

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');

        // Show confirmation popup & toast
        showConfirmationModal(data, waUrl);
        window.showToast('Opening WhatsApp with your order enquiry...', 'success');
        contactForm.reset();
        contactForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      });
    }

    // 2. Email Form Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = validateFormData();
      if (!data) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Submitting Enquiry...';
      }

      saveEnquiryLocally(data);
      const waUrl = buildWhatsAppMessage(data);

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        contactForm.reset();
        contactForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

        showConfirmationModal(data, waUrl);
        window.showToast('Your seafood order enquiry has been submitted! Our dock manager will call or reply within 30 mins.', 'success');
      }, 1000);
    });
  }

  /* ------------------------------------------------------------------------
     2. Login Form Validation
     ------------------------------------------------------------------------ */
  function initLoginValidation() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');

      if (!isValidEmail(emailInput.value.trim())) {
        showInputError(emailInput, 'Please enter a valid account email.');
        isValid = false;
      } else {
        clearInputError(emailInput);
      }

      if (passInput.value.length < 6) {
        showInputError(passInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        clearInputError(passInput);
      }

      if (!isValid) return;

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Signing In...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Sign In';
        }
        const userEmail = emailInput ? emailInput.value.trim() : 'user@fishmarket.com';
        const userName = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const loggedInUser = {
          name: userName,
          email: userEmail,
          role: 'Customer',
          phone: '+91 98765 43210',
          memberSince: 'March 2026'
        };
        try {
          localStorage.setItem('seafood_user', JSON.stringify(loggedInUser));
          if (window.AuthManager?.updateNavbar) window.AuthManager.updateNavbar();
          window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: loggedInUser } }));
        } catch (err) {
          console.warn('Could not persist session:', err);
        }

        window.showToast(`Welcome back, ${userName}! Signed in successfully.`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      }, 1000);
    });
  }

  /* ------------------------------------------------------------------------
     3. Registration Form Validation
     ------------------------------------------------------------------------ */
  function initRegisterValidation() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
      setupNumericPhoneInput(phoneInput, 'Registration phone number');
    }

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const passInput = document.getElementById('reg-password');
      const confirmInput = document.getElementById('reg-confirm-password');
      const termsCheck = document.getElementById('reg-terms');

      if (nameInput && nameInput.value.trim().length < 2) {
        showInputError(nameInput, 'Full name is required.');
        isValid = false;
      } else if (nameInput) {
        clearInputError(nameInput);
      }

      if (emailInput && !isValidEmail(emailInput.value.trim())) {
        showInputError(emailInput, 'Valid email required.');
        isValid = false;
      } else if (emailInput) {
        clearInputError(emailInput);
      }

      if (phoneInput) {
        if (!validatePhoneNumber(phoneInput, 'Registration phone number')) {
          isValid = false;
        }
      }

      if (passInput && passInput.value.length < 6) {
        showInputError(passInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else if (passInput) {
        clearInputError(passInput);
      }

      if (confirmInput && (confirmInput.value !== passInput.value || confirmInput.value === '')) {
        showInputError(confirmInput, 'Passwords do not match.');
        isValid = false;
      } else if (confirmInput) {
        clearInputError(confirmInput);
      }

      if (termsCheck && !termsCheck.checked) {
        showInputError(termsCheck, 'You must agree to the Terms and Conditions.');
        isValid = false;
      } else if (termsCheck) {
        clearInputError(termsCheck);
      }

      if (!isValid) {
        window.showToast('Please fix the errors in registration.', 'error');
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Create Account';
        }
        const newUserName = nameInput ? nameInput.value.trim() : 'Customer';
        const newUserEmail = emailInput ? emailInput.value.trim() : 'user@fishmarket.com';
        const newUserPhone = phoneInput ? phoneInput.value.trim() : '+91 98765 43210';
        const newUser = {
          name: newUserName,
          email: newUserEmail,
          phone: newUserPhone,
          role: 'Customer',
          memberSince: 'March 2026'
        };
        try {
          localStorage.setItem('seafood_user', JSON.stringify(newUser));
          if (window.AuthManager?.updateNavbar) window.AuthManager.updateNavbar();
          window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: newUser } }));
        } catch (err) {
          console.warn('Could not persist session:', err);
        }

        window.showToast(`Account created successfully! Welcome, ${newUserName}.`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      }, 1200);
    });
  }

  /* ------------------------------------------------------------------------
     4. Password Reveal Toggle
     ------------------------------------------------------------------------ */
  function initPasswordToggle() {
    const toggles = document.querySelectorAll('.toggle-password-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'bi bi-eye-slash-fill';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'bi bi-eye-fill';
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Phone Input & Numeric Validation Helpers
     ------------------------------------------------------------------------ */
  function setupNumericPhoneInput(phoneInput, label = 'Phone number') {
    if (!phoneInput) return;

    // Prevent non-numeric key presses (A-Z, a-z, symbols, spaces, etc.)
    phoneInput.addEventListener('keypress', function (e) {
      const charCode = (e.which !== undefined) ? e.which : e.keyCode;
      // Allow only numbers '0' (48) to '9' (57)
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
        return false;
      }
    });

    // Handle beforeinput (e.g. on modern browsers / mobile devices)
    phoneInput.addEventListener('beforeinput', function (e) {
      if (e.data && !/^\d+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    // Real-time input sanitizer (strips non-digits instantly)
    phoneInput.addEventListener('input', function () {
      const cleanVal = this.value.replace(/\D/g, '');
      if (this.value !== cleanVal) {
        this.value = cleanVal;
      }
      if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
        validatePhoneNumber(this, label);
      }
    });

    // Paste handler (cleans pasted content to numbers only)
    phoneInput.addEventListener('paste', function (e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
      const numericPaste = paste.replace(/\D/g, '');
      const start = this.selectionStart || 0;
      const end = this.selectionEnd || 0;
      const currentVal = this.value || '';
      const newVal = (currentVal.substring(0, start) + numericPaste + currentVal.substring(end)).slice(0, 15);
      this.value = newVal;
      const newPos = Math.min(newVal.length, start + numericPaste.length);
      this.setSelectionRange(newPos, newPos);
      if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
        validatePhoneNumber(this, label);
      }
    });

    // On blur validation
    phoneInput.addEventListener('blur', function () {
      if (this.value.trim().length > 0) {
        validatePhoneNumber(this, label);
      }
    });
  }

  function validatePhoneNumber(input, label = 'Phone number') {
    const val = (input.value || '').trim();
    if (!val) {
      showInputError(input, `${label} is required.`);
      return false;
    }
    if (!/^\d+$/.test(val)) {
      showInputError(input, `${label} must contain only numeric characters (0–9).`);
      return false;
    }
    if (val.length < 7) {
      showInputError(input, `Please enter a valid ${label.toLowerCase()} (minimum 7 digits).`);
      return false;
    }
    if (val.length > 15) {
      showInputError(input, `${label} cannot exceed 15 digits.`);
      return false;
    }
    clearInputError(input);
    return true;
  }

  /* Helper Functions */
  function showInputError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    let feedback = input.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      input.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
  }

  function clearInputError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }

  function isValidEmail(email) {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
})();
