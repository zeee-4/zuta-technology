/* ==========================================================================
   ZUTA TECHNOLOGY — Main Script
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------
     PAGE NAVIGATION
  ---------------------------------------- */
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

    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }

    // Update URL hash without page jump
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

  // Deep-link support: open page based on URL hash
  (function initFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      document.querySelector('.nav-links a[data-page="home"]')?.classList.add('active');
    }
  })();

  /* ----------------------------------------
     MOBILE MENU TOGGLE
  ---------------------------------------- */
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
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------
     CONTACT FORM
     Sends via FormSubmit.co (free, no signup)
     First submission triggers a one-time email verification.
     Swap the action URL with your Formspree endpoint if you prefer.
  ---------------------------------------- */
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

      const formData = new FormData(contactForm);

      try {
        // FormSubmit endpoint — replace email below with your actual email
        const res = await fetch('https://formsubmit.co/ajax/zutatechnology@gmail.com', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData,
        });

        if (!res.ok) throw new Error('Network error');

        formStatus.hidden = false;
        formStatus.querySelector('span').textContent =
          'Thank you! Your message has been received. I\'ll reply within 24 hours.';
        contactForm.reset();
      } catch (err) {
        formStatus.hidden = false;
        formStatus.style.background = '#fef2f2';
        formStatus.style.borderColor = '#fecaca';
        formStatus.style.color = '#dc2626';
        formStatus.querySelector('span').textContent =
          'Sorry, something went wrong. Please email zutatechnology@gmail.com directly.';
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

  /* ----------------------------------------
     FOOTER YEAR
  ---------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();