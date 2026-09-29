/* ==================================================
   ZUTA TECHNOLOGY · SCRIPT
   ================================================== */
(function () {
  'use strict';

  /* ---------- PAGE NAVIGATION ---------- */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-links a[data-page]');
  const allTriggers = document.querySelectorAll('[data-page]');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  function showPage(pageId) {
    pages.forEach((p) => p.classList.remove('active-page'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active-page');

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.page === pageId && !link.classList.contains('nav-cta')) {
        link.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
    history.replaceState(null, '', '#' + pageId);
  }

  allTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const pageId = trigger.dataset.page;
      if (pageId) {
        e.preventDefault();
        showPage(pageId);
      }
    });
  });

  // Deep-link support
  (function initFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      document.querySelector('.nav-links a[data-page="home"]')?.classList.add('active');
    }
  })();

  /* ---------- MOBILE MENU ---------- */
  function closeMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = '1';
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ---------- CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

      try {
        const res = await fetch('https://formsubmit.co/ajax/zutatechnology@gmail.com', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm),
        });

        if (!res.ok) throw new Error('Network error');

        formStatus.hidden = false;
        formStatus.querySelector('span').textContent =
          'Message received. We\'ll reply within 24 hours.';
        contactForm.reset();
      } catch (err) {
        formStatus.hidden = false;
        formStatus.style.background = '#fef2f2';
        formStatus.style.borderColor = '#fecaca';
        formStatus.style.color = '#b91c1c';
        formStatus.querySelector('span').textContent =
          'Something went wrong. Please email zutatechnology@gmail.com directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        setTimeout(() => {
          formStatus.hidden = true;
          formStatus.style.background = '';
          formStatus.style.borderColor = '';
          formStatus.style.color = '';
        }, 6000);
      }
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- CAL.COM BOOKING WIDGET ---------- */
  (function loadCal() {
    const calLinks = document.querySelectorAll('[data-cal-link]');
    if (!calLinks.length) return;

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    Cal('init', { origin: 'https://app.cal.com' });

    // Attach click handler to each trigger
    calLinks.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        Cal('openModal', {
          calLink: el.dataset.calLink,
          config: el.dataset.calConfig ? JSON.parse(el.dataset.calConfig) : {},
        });
      });
    });
  })();
})();