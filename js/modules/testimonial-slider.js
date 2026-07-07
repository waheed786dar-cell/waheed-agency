'use strict';

/**
 * Simple, dependency-free testimonial carousel.
 * Auto-plays, pauses on hover/focus, supports dot navigation and swipe.
 */
(function TestimonialSlider() {

  function init() {
    const track = Helpers.qs('#testimonialTrack');
    const dotsContainer = Helpers.qs('#testimonialDots');
    if (!track || !dotsContainer) return;

    const slides = Helpers.qsa('.card-testimonial', track);
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 6000;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Helpers.qsa('button', dotsContainer);

    function goTo(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function next() { goTo(currentIndex + 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    // Pause on hover / focus for accessibility
    const slider = track.closest('.testimonial-slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Basic touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? next() : goTo(currentIndex - 1);
      }
    }, { passive: true });

    startAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
