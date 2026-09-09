/* ==========================================================================
   Seafood & Fresh Fish Market - Form Validation Script (form-validation.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Generic Bootstrap Form Validation Initializer
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault(); // Prevent standard page reload for interactive demo feedback
        showFormSuccessAlert(form);
      }
      form.classList.add('was-validated');
    }, false);
  });

  function showFormSuccessAlert(form) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert alert-success alert-dismissible fade show mt-3';
    alertBox.setAttribute('role', 'alert');
    alertBox.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      <strong>Thank you!</strong> Your request has been submitted successfully. Our fresh market team will contact you shortly!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Find container or prepend inside form
    form.insertAdjacentElement('beforebegin', alertBox);
    form.reset();
    form.classList.remove('was-validated');

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      if (alertBox && alertBox.parentNode) {
        alertBox.remove();
      }
    }, 5000);
  }

  // Newsletter Subscription Form Handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(nForm => {
    nForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = nForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        alert('🎉 Subscription Successful! You will now receive daily fish market prices and fresh catch alerts.');
        emailInput.value = '';
      }
    });
  });
});
