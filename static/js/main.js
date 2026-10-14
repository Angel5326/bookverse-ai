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
      threshold: 0,
      rootMargin: '250px 0px 250px 0px'
    });

    document.body.classList.add('js-reveal-ready');
    revealTargets.forEach(el => observer.observe(el));

    // Fallback: make sure all content becomes visible even if observer is slow or user jumps to anchor
    setTimeout(() => {
      revealTargets.forEach(el => el.classList.add('visible'));
    }, 1200);
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
     5.5 HERO SHELF TABS FILTERING (Recommended / Upcoming)
     ==================================================== */
  const shelfTabs = document.querySelectorAll('.bv-shelf__tab[data-shelf-tab]');
  const shelfCards = document.querySelectorAll('.bv-shelf__card[data-shelf-item]');

  shelfTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      shelfTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-shelf-tab');
      shelfCards.forEach(card => {
        const itemTypes = card.getAttribute('data-shelf-item') || '';
        if (filter === 'all' || itemTypes.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
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

  /* ====================================================
     10. BOOK CAROUSEL NAVIGATION & PAGE INDICATOR
     ==================================================== */
  document.querySelectorAll('.bv-section').forEach(section => {
    const carousel = section.querySelector('.bv-books-carousel');
    const prevBtn = section.querySelector('.bv-nav-arrow--prev');
    const nextBtn = section.querySelector('.bv-nav-arrow--next');
    const pageCurrent = section.querySelector('.bv-page-current');
    const pageTotal = section.querySelector('.bv-page-total');

    if (!carousel) return;

    const updateControls = () => {
      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const clientWidth = carousel.clientWidth;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);

      const items = carousel.querySelectorAll('.bv-carousel-item');
      if (items.length === 0) return;

      const itemWidth = items[0].offsetWidth + 12;
      const visibleCount = Math.max(1, Math.floor(clientWidth / itemWidth));
      const totalPages = Math.max(1, Math.ceil(items.length / visibleCount));
      const currentPage = Math.min(totalPages, Math.max(1, Math.floor((scrollLeft + itemWidth * 0.5) / (visibleCount * itemWidth)) + 1));

      if (pageTotal) pageTotal.textContent = totalPages;
      if (pageCurrent) pageCurrent.textContent = currentPage;

      if (prevBtn) {
        prevBtn.disabled = scrollLeft <= 8;
      }
      if (nextBtn) {
        nextBtn.disabled = scrollLeft >= maxScroll - 8;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = carousel.clientWidth * 0.88;
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = carousel.clientWidth * 0.88;
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    carousel.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    setTimeout(updateControls, 150);
  });

  /* ====================================================
     10b. HERO SHELF NAVIGATION (PREV / NEXT ARROWS & TABS)
     ==================================================== */
  const shelfTrack = document.getElementById('bv-shelf-track');
  const shelfPrev = document.getElementById('bv-shelf-prev');
  const shelfNext = document.getElementById('bv-shelf-next');

  function updateShelfButtons() {
    if (!shelfTrack) return;
    const scrollLeft = shelfTrack.scrollLeft;
    const maxScroll = Math.max(0, shelfTrack.scrollWidth - shelfTrack.clientWidth);
    if (shelfPrev) shelfPrev.disabled = scrollLeft <= 8;
    if (shelfNext) shelfNext.disabled = scrollLeft >= maxScroll - 8;
  }

  if (shelfTrack) {
    if (shelfPrev) {
      shelfPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = shelfTrack.clientWidth * 0.75;
        shelfTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (shelfNext) {
      shelfNext.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = shelfTrack.clientWidth * 0.75;
        shelfTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    shelfTrack.addEventListener('scroll', updateShelfButtons, { passive: true });
    window.addEventListener('resize', updateShelfButtons);
    setTimeout(updateShelfButtons, 150);

    const shelfTabs = document.querySelectorAll('.bv-shelf__tab[data-shelf-tab]');
    const shelfItems = document.querySelectorAll('.bv-shelf__card[data-shelf-item]');

    shelfTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        shelfTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-shelf-tab');

        shelfItems.forEach(item => {
          const itemType = item.getAttribute('data-shelf-item') || '';
          if (filter === 'all' || itemType.includes(filter)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
        shelfTrack.scrollLeft = 0;
        setTimeout(updateShelfButtons, 60);
      });
    });
  }

  /* ====================================================
     11. AJAX ADD TO CART (CARD & MODAL BUTTONS)
     ==================================================== */
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function showToast(message, type = 'success') {
    let wrapper = document.querySelector('.bv-messages-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'bv-messages-wrapper';
      document.body.appendChild(wrapper);
    }

    const toast = document.createElement('div');
    toast.className = `bv-toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="bi bi-check-circle-fill bv-toast__icon" aria-hidden="true"></i>
      <div class="bv-toast__body">
        <div class="bv-toast__title">Cart Updated</div>
        ${message}
      </div>
      <button class="bv-toast__close" aria-label="Close notification">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    `;
    wrapper.appendChild(toast);

    const closeBtn = toast.querySelector('.bv-toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.add('dismissing');
        setTimeout(() => toast.remove(), 400);
      });
    }

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('dismissing');
        setTimeout(() => toast.remove(), 400);
      }
    }, 3500);
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-add-to-cart, .js-modal-add-cart');
    if (!btn) return;

    e.preventDefault();
    const addUrl = btn.getAttribute('data-add-url');
    if (!addUrl) return;

    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" style="width:12px;height:12px;" role="status"></span>';

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(addUrl, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrfToken || '',
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        const badge = document.getElementById('bv-nav-cart-badge');
        if (badge) {
          badge.textContent = data.cart_count;
          badge.classList.remove('d-none');
        }

        btn.innerHTML = '<i class="bi bi-check2"></i>';
        btn.style.background = '#15803d';
        btn.style.color = '#ffffff';

        showToast(data.message || 'Book added to your cart!');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 1600);
      } else {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      window.location.href = addUrl;
    }
  });

}); // end DOMContentLoaded
