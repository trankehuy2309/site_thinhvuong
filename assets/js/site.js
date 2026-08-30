// Lux Metal — Shared Site Interactions (Vanilla JS, no routing, no content rendering)
// Handles: mobile menu toggle, quote modal open/close, contact/quote form
// fake-success UX, product/news category filter, product image slider, scroll-to-top.
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
  // INSTANT QUOTE MODAL DIALOG
  // ==========================================
  const quoteModal = document.getElementById('quote-modal');
  const closeQuoteModalBtn = document.getElementById('close-quote-modal-btn');
  const headerQuoteTriggerBtn = document.getElementById('header-quote-trigger-btn');
  const floatingQuoteBtn = document.getElementById('floating-quote-btn');
  const quoteModalForm = document.getElementById('quote-modal-form');
  const quoteModalSuccess = document.getElementById('quote-modal-success');

  function openQuoteModal(productName) {
    if (!quoteModal) return;
    quoteModal.classList.remove('hidden');
    if (quoteModalForm) quoteModalForm.classList.remove('hidden');
    if (quoteModalSuccess) quoteModalSuccess.classList.add('hidden');
    if (productName) {
      const prodInput = document.getElementById('quote-product-input');
      if (prodInput) prodInput.value = productName;
    }
    document.body.style.overflow = 'hidden';
  }

  function closeQuoteModal() {
    if (!quoteModal) return;
    quoteModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  if (headerQuoteTriggerBtn) headerQuoteTriggerBtn.addEventListener('click', () => openQuoteModal());
  if (floatingQuoteBtn) floatingQuoteBtn.addEventListener('click', () => openQuoteModal());
  if (closeQuoteModalBtn) closeQuoteModalBtn.addEventListener('click', closeQuoteModal);
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeQuoteModal();
    });
  }
  if (quoteModalForm) {
    quoteModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      quoteModalForm.classList.add('hidden');
      if (quoteModalSuccess) quoteModalSuccess.classList.remove('hidden');
    });
  }

  // Global delegation: any button with .btn-request-quote opens the modal
  // pre-filled with the product name from data-product-name.
  document.addEventListener('click', (e) => {
    const quoteBtn = e.target.closest('.btn-request-quote');
    if (quoteBtn) {
      e.preventDefault();
      const pName = quoteBtn.getAttribute('data-product-name') || '';
      openQuoteModal(pName);
    }
  });

  // ==========================================
  // INLINE / CONTACT / QUOTE FORM FAKE-SUCCESS UX
  // ==========================================
  function wireFakeSubmit(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('hidden');
        if (success) success.classList.remove('hidden');
      });
    }
  }
  wireFakeSubmit('inline-quote-form', 'inline-quote-success');
  wireFakeSubmit('contact-page-form', 'contact-page-success-msg');

  // ==========================================
  // NEWS CATEGORY FILTER (tin-tuc.html) — progressive enhancement only.
  // All articles remain fully present in the HTML for SEO; this only
  // toggles visibility client-side.
  // ==========================================
  const newsCatButtons = document.querySelectorAll('.news-cat-btn');
  const newsArticles = document.querySelectorAll('.news-filterable');
  if (newsCatButtons.length && newsArticles.length) {
    newsCatButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        newsCatButtons.forEach((b) => {
          b.classList.remove('bg-[#0f2d59]', 'text-white', 'shadow-sm');
          b.classList.add('bg-white', 'border', 'border-slate-300', 'text-slate-700');
        });
        btn.classList.remove('bg-white', 'border', 'border-slate-300', 'text-slate-700');
        btn.classList.add('bg-[#0f2d59]', 'text-white', 'shadow-sm');

        const cat = btn.getAttribute('data-cat') || 'all';
        newsArticles.forEach((art) => {
          const artCat = art.getAttribute('data-cat');
          art.classList.toggle('hidden', cat !== 'all' && artCat !== cat);
        });
      });
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

    const prevBtn = slider.querySelector('.product-slider-prev');
    const nextBtn = slider.querySelector('.product-slider-next');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));
    dots.forEach((d) => d.addEventListener('click', () => goTo(Number(d.getAttribute('data-index')))));
    thumbs.forEach((t) => t.addEventListener('click', () => goTo(Number(t.getAttribute('data-index')))));
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
