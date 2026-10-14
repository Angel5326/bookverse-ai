/* ============================================================
   BookVerse AI — main.js
   Author: Person 2 (Frontend / UI-UX)
   No jQuery needed. Pure vanilla JS.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================
     1. MESSAGES AUTO-DISMISS (toast system)
     ==================================================== */
  const toasts = document.querySelectorAll('.bv-toast');

  toasts.forEach((toast, i) => {
    // Stagger appearance
    toast.style.transitionDelay = `${i * 0.1}s`;

    // Auto-dismiss after 5 s
    const timeout = setTimeout(() => dismissToast(toast), 5000 + i * 200);

    // Manual close
    const closeBtn = toast.querySelector('.bv-toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        dismissToast(toast);
      });
    }
  });

  function dismissToast(toast) {
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    // Fallback if animation doesn't fire
    setTimeout(() => toast.remove(), 400);
  }


  /* ====================================================
     2. NAVBAR — shadow on scroll
     ==================================================== */
  const navbar = document.querySelector('.bv-navbar');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }


  /* ====================================================
     3. MOBILE NAVBAR TOGGLER
     ==================================================== */
  const toggler = document.getElementById('bv-nav-toggler');
  const mobileMenu = document.getElementById('bv-mobile-menu');

  if (toggler && mobileMenu) {
    toggler.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggler.setAttribute('aria-expanded', isOpen);
      toggler.querySelector('i').className = isOpen
        ? 'bi bi-x-lg'
        : 'bi bi-list';
    });

    // Close mobile menu when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggler.setAttribute('aria-expanded', 'false');
        toggler.querySelector('i').className = 'bi bi-list';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggler.setAttribute('aria-expanded', 'false');
        const icon = toggler.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      }
    });
  }


  /* ====================================================
     4. SCROLL REVEAL — IntersectionObserver
     ==================================================== */
  const revealTargets = document.querySelectorAll('.bv-reveal, .bv-reveal-stagger');

  if (revealTargets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));
  }


  /* ====================================================
     5. CATEGORY CHIP FILTER (homepage UI)
     ==================================================== */
  const categoryChips = document.querySelectorAll('[data-filter-chip]');

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Toggle active state
      const group = chip.closest('[data-filter-group]');
      if (group) {
        group.querySelectorAll('[data-filter-chip]').forEach(c => c.classList.remove('active'));
      }
      chip.classList.toggle('active');
    });
  });


  /* ====================================================
     6. HERO PANEL — book card scroll (if overflowing)
     ==================================================== */
  const heroPanel = document.querySelector('.bv-hero__books-row');

  if (heroPanel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    heroPanel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - heroPanel.offsetLeft;
      scrollLeft = heroPanel.scrollLeft;
      heroPanel.style.cursor = 'grabbing';
    });

    ['mouseleave', 'mouseup'].forEach(evt => {
      heroPanel.addEventListener(evt, () => {
        isDown = false;
        heroPanel.style.cursor = 'grab';
      });
    });

    heroPanel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - heroPanel.offsetLeft;
      const walk = (x - startX) * 1.5;
      heroPanel.scrollLeft = scrollLeft - walk;
    });
  }


  /* ====================================================
     7. SMOOTH HOVER on book cards (extra tilt effect)
     ==================================================== */
  const bookCards = document.querySelectorAll('.bv-book-card');

  bookCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${y}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });


  /* ====================================================
     8. NAVBAR ACTIVE LINK highlight
     ==================================================== */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.bv-navbar__links a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });


  /* ====================================================
     9. NEWSLETTER FORM — basic UX feedback
     ==================================================== */
  document.querySelectorAll('.bv-newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      // If action is '#', prevent default and show info
      if (form.getAttribute('action') === '#') {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          const btn = form.querySelector('button');
          if (btn) {
            const original = btn.textContent;
            btn.textContent = '✓ Thanks!';
            btn.disabled = true;
            setTimeout(() => {
              btn.textContent = original;
              btn.disabled = false;
              input.value = '';
            }, 3000);
          }
        }
      }
    });
  });

}); // end DOMContentLoaded
