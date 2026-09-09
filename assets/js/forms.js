/**
 * Seafood & Fresh Fish Market - Forms & Custom Interactions
 * Handles Order Enquiry presets, Package selection, Newsletter subscriptions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initUrlParamsHandler();
    initNewsletterForms();
    initPackageSelection();
    initCuttingOptionsSelector();
  });

  // 1. URL Parameters handler for pre-populating enquiry form fields
  function initUrlParamsHandler() {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const packageParam = urlParams.get('package');

    const seafoodTypeSelect = document.getElementById('enquiry-seafood-type');
    const messageTextarea = document.getElementById('enquiry-message');

    if (productParam && seafoodTypeSelect) {
      // Find matching option or set value
      let found = false;
      for (let i = 0; i < seafoodTypeSelect.options.length; i++) {
        if (seafoodTypeSelect.options[i].text.toLowerCase().includes(productParam.toLowerCase())) {
          seafoodTypeSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found && messageTextarea) {
        messageTextarea.value = `Hi, I would like to place an order enquiry for: ${productParam}.`;
      }
    }

    if (packageParam) {
      if (seafoodTypeSelect) {
        seafoodTypeSelect.value = 'custom-box';
      }
      const qtyInput = document.getElementById('enquiry-quantity');
      const isCommercial = packageParam.toLowerCase().includes('wholesale') || packageParam.toLowerCase().includes('commercial') || packageParam.toLowerCase().includes('b2b');
      if (isCommercial) {
        if (qtyInput) qtyInput.value = '25.0';
        if (messageTextarea) {
          messageTextarea.value = `Inquiry for Commercial B2B Restaurant Supply / Wholesale Bulk Orders (${packageParam}). Please provide wholesale rate card, cut specifications, and daily dock delivery schedule.`;
        }
      } else if (messageTextarea) {
        messageTextarea.value = `I am interested in ordering the "${packageParam}" package. Please let me know today's catch availability and delivery schedule.`;
      }
      const formCard = document.getElementById('enquiryForm');
      if (formCard) {
        setTimeout(() => {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    }
  }

  // 2. Newsletter Subscription Handlers
  function initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value || !validateEmail(emailInput.value)) {
          window.showToast('Please enter a valid email address.', 'error');
          if (emailInput) emailInput.classList.add('is-invalid');
          return;
        }

        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        
        window.showToast('Thank you for subscribing! You will receive our daily fresh catch catch-list & discounts.', 'success');
        form.reset();
        setTimeout(() => emailInput.classList.remove('is-valid'), 3000);
      });
    });
  }

  // 3. Package Selection from Pricing Page
  function initPackageSelection() {
    const packageButtons = document.querySelectorAll('.select-package-btn');
    packageButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const packageName = btn.getAttribute('data-package') || 'Custom Seafood Box';
        window.location.href = `contact.html?package=${encodeURIComponent(packageName)}`;
      });
    });
  }

  // 4. Interactive Cutting Selector on Product Details
  function initCuttingOptionsSelector() {
    const cutOptionCards = document.querySelectorAll('.cut-option-card');
    const selectedCutDisplay = document.getElementById('selected-cut-display');
    const cutInputHidden = document.getElementById('selected-cut-input');

    cutOptionCards.forEach(card => {
      card.addEventListener('click', () => {
        cutOptionCards.forEach(c => c.classList.remove('border-primary', 'bg-primary-subtle', 'active'));
        card.classList.add('border-primary', 'bg-primary-subtle', 'active');
        
        const cutName = card.getAttribute('data-cut') || 'Whole Cleaned';
        if (selectedCutDisplay) selectedCutDisplay.textContent = cutName;
        if (cutInputHidden) cutInputHidden.value = cutName;

        window.showToast(`Selected Cut Option: ${cutName}`, 'info');
      });
    });
  }

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
})();
