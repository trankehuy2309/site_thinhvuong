// Lux Metal — Shared Site Interactions (Vanilla JS, no routing, no content rendering)
// Handles: mobile menu toggle, product category filter, product image slider,
// hero slideshow, scroll-to-top. (Không còn form báo giá — liên hệ trực tiếp qua Zalo.)

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MOBILE NAVIGATION DRAWER TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // ==========================================
  // PRODUCT CATEGORY FILTER (san-pham.html) — progressive enhancement only.
  // ==========================================
  const prodCatButtons = document.querySelectorAll('.product-cat-btn');
  const prodSections = document.querySelectorAll('.product-cat-section');
  if (prodCatButtons.length && prodSections.length) {
    prodCatButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        prodCatButtons.forEach((b) => {
          b.classList.remove('bg-[#0f2d59]', 'text-white', 'shadow-sm');
          b.classList.add('bg-white', 'border', 'border-slate-300', 'text-slate-700');
        });
        btn.classList.remove('bg-white', 'border', 'border-slate-300', 'text-slate-700');
        btn.classList.add('bg-[#0f2d59]', 'text-white', 'shadow-sm');

        const cat = btn.getAttribute('data-cat') || 'all';
        prodSections.forEach((sec) => {
          const secCat = sec.getAttribute('data-cat');
          sec.classList.toggle('hidden', cat !== 'all' && secCat !== cat);
        });
        const target = cat === 'all' ? null : document.getElementById(cat);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ==========================================
  // PRODUCT IMAGE SLIDER (san-pham/*.html detail pages)
  // ==========================================
  document.querySelectorAll('.product-slider').forEach((slider) => {
    const track = slider.querySelector('.product-slider-track');
    const slides = slider.querySelectorAll('.product-slider-track > div');
    const dots = slider.querySelectorAll('.product-slider-dot');
    const thumbs = slider.querySelectorAll('.product-slider-thumb');
    if (!track || slides.length === 0) return;
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => {
        d.classList.toggle('bg-white', di === index);
        d.classList.toggle('bg-white/50', di !== index);
      });
      thumbs.forEach((t, ti) => {
        t.classList.toggle('border-[#0f2d59]', ti === index);
        t.classList.toggle('border-transparent', ti !== index);
      });
    }

    function start() {
      stop();
      if (slides.length > 1) timer = setInterval(() => goTo(index + 1), 4000);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    const prevBtn = slider.querySelector('.product-slider-prev');
    const nextBtn = slider.querySelector('.product-slider-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); start(); });
    dots.forEach((d) => d.addEventListener('click', () => { goTo(Number(d.getAttribute('data-index'))); start(); }));
    thumbs.forEach((t) => t.addEventListener('click', () => { goTo(Number(t.getAttribute('data-index'))); start(); }));
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    start();
  });

  // ==========================================
  // HERO IMAGE AUTO SLIDESHOW (index.html)
  // ==========================================
  document.querySelectorAll('.hero-slider').forEach((slider) => {
    const track = slider.querySelector('.hero-slider-track');
    const slides = slider.querySelectorAll('.hero-slider-track > div');
    const dots = slider.querySelectorAll('.hero-slider-dot');
    if (!track || slides.length === 0) return;
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => {
        d.classList.toggle('bg-white', di === index);
        d.classList.toggle('w-4', di === index);
        d.classList.toggle('bg-white/50', di !== index);
        d.classList.toggle('w-1.5', di !== index);
      });
    }

    function start() {
      stop();
      timer = setInterval(() => goTo(index + 1), 3000);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    dots.forEach((d) =>
      d.addEventListener('click', () => {
        goTo(Number(d.getAttribute('data-index')));
        start();
      })
    );
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    start();
  });

  // ==========================================
  // SCROLL TO TOP FLOATING BUTTON
  // ==========================================
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('hidden');
        scrollToTopBtn.classList.add('flex');
      } else {
        scrollToTopBtn.classList.add('hidden');
        scrollToTopBtn.classList.remove('flex');
      }
    });
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
