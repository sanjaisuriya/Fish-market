/* ==========================================================================
   Seafood & Fresh Fish Market - Testimonial & Gallery Carousel (carousel.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const testimonialContainer = document.getElementById('testimonialContainer');

  if (testimonialContainer) {
    fetch('data/testimonials.json')
      .then(res => res.json())
      .then(testimonials => {
        let activeClass = 'active';
        const carouselItems = testimonials.map((t, idx) => `
          <div class="carousel-item ${idx === 0 ? 'active' : ''}">
            <div class="testimonial-card text-center max-w-2xl mx-auto">
              <img src="${t.avatar}" alt="${t.name}" class="user-avatar mx-auto mb-3">
              <div class="text-warning mb-3">
                ${'<i class="fas fa-star"></i>'.repeat(t.rating)}
              </div>
              <p class="fs-5 fst-italic mb-4 text-dark dark:text-light">"${t.text}"</p>
              <h5 class="fw-bold mb-0">${t.name}</h5>
              <small class="text-muted">${t.role}</small>
            </div>
          </div>
        `).join('');

        testimonialContainer.innerHTML = `
          <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        `;
      })
      .catch(err => console.error('Failed to load testimonials:', err));
  }
});
