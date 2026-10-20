document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. Smooth Scrolling with precise navbar offset =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // In mobile view (<= 1024px), dropdown accordion triggers only expand/collapse submenus
      if (window.innerWidth <= 1024 && this.matches('.nav-item-dropdown > a')) {
        return;
      }

      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();

        // Close mobile menu if open before calculating scroll
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navRight = document.getElementById('navRight');
        if (mobileMenuBtn && navRight && navRight.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          navRight.classList.remove('active');
          document.body.style.overflow = '';
        }

        const header = document.getElementById('navbar');
        const navHeight = header ? header.offsetHeight : 75;
        let top = 0;
        let curr = el;
        while (curr) {
          top += curr.offsetTop;
          curr = curr.offsetParent;
        }

        window.scrollTo({
          top: Math.max(0, top - navHeight - 15),
          behavior: 'smooth'
        });

        // Update active class immediately on click
        document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
        if (!this.classList.contains('btn-nav')) {
          this.classList.add('active');
        }
      }
    });
  });

  // ===== 1.5. URL Hash Arrival Handler (prevents cutoff when navigating from other pages) =====
  if (window.location.hash) {
    const hash = window.location.hash;
    const targetEl = document.querySelector(hash);
    if (targetEl) {
      const scrollToHash = () => {
        const header = document.getElementById('navbar');
        const navHeight = header ? header.offsetHeight : 75;
        let top = 0;
        let curr = targetEl;
        while (curr) {
          top += curr.offsetTop;
          curr = curr.offsetParent;
        }
        window.scrollTo({
          top: Math.max(0, top - navHeight - 15),
          behavior: 'smooth'
        });
        targetEl.classList.add('target-highlight');
        setTimeout(() => targetEl.classList.remove('target-highlight'), 2600);
      };
      setTimeout(scrollToHash, 100);
      window.addEventListener('load', scrollToHash);
    }
  }

  // ===== ScrollSpy for Nav Menu =====
  const navLinks = document.querySelectorAll('.nav-menu > li > a:not(.btn-nav)');
  const trackedSections = [];
  navLinks.forEach(link => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#') && id.length > 1) {
      const sec = document.querySelector(id);
      if (sec) trackedSections.push({ link, sec });
    }
  });

  window.addEventListener('scroll', () => {
    // If scrolled near bottom of page (Contacto section)
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 80);
    if (isAtBottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      const contactBtn = document.querySelector('.nav-menu a.btn-nav');
      if (contactBtn) contactBtn.classList.add('active');
      return;
    }

    const scrollPos = window.pageYOffset + 120;
    let current = null;

    for (let i = trackedSections.length - 1; i >= 0; i--) {
      const item = trackedSections[i];
      let top = 0;
      let curr = item.sec;
      while (curr) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      if (scrollPos >= top - 20) {
        current = item;
        break;
      }
    }

    if (current) {
      navLinks.forEach(l => l.classList.remove('active'));
      current.link.classList.add('active');
    }
  }, { passive: true });

  // ===== 2. Navbar shadow on scroll =====
  const header = document.getElementById('navbar');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 20
        ? '0 4px 10px rgba(0,0,0,0.12)'
        : '0 2px 8px rgba(0,0,0,0.08)';
    });
  }

  // ===== 2.5. Mobile Hamburger Menu & Accordion Dropdowns =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navRight = document.getElementById('navRight');
  
  if (mobileMenuBtn && navRight) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenuBtn.classList.toggle('active');
      navRight.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      // If closing menu, close any open mobile accordion dropdowns
      if (!isActive) {
        document.querySelectorAll('.nav-item-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    // Mobile Accordion Toggle for Dropdowns (tap to expand/collapse)
    document.querySelectorAll('.nav-item-dropdown > a').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const parent = trigger.closest('.nav-item-dropdown');
          const isCurrentlyOpen = parent.classList.contains('open');
          
          // Close other open mobile dropdowns for accordion effect
          document.querySelectorAll('.nav-item-dropdown.open').forEach(d => {
            if (d !== parent) d.classList.remove('open');
          });
          
          parent.classList.toggle('open', !isCurrentlyOpen);
        }
      });
    });

    // Close menu when a navigation destination link is clicked
    document.querySelectorAll('.nav-menu a:not(.nav-item-dropdown > a)').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navRight.classList.remove('active');
        document.body.style.overflow = '';
        document.querySelectorAll('.nav-item-dropdown.open').forEach(d => d.classList.remove('open'));
      });
    });
  }

  // ===== 3. Language Selector Dropdown =====
  const langToggle = document.getElementById('langToggle');
  const langSelector = langToggle ? langToggle.closest('.lang-selector') : null;
  const langDropdown = document.getElementById('langDropdown');

  if (langToggle && langDropdown && langSelector) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSelector.classList.toggle('open');
      langToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Note: lang-btn selection and UI sync is centrally managed by i18n.js
  }

  // ===== 4. Contact Form (Formspree AJAX) =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const successEl = document.getElementById('form-success');
      const errorEl   = document.getElementById('form-error');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Validate required fields
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => {
        f.style.borderColor = '';
        if (!f.value.trim()) {
          f.style.borderColor = '#e53935';
          valid = false;
        }
      });
      if (!valid) return;

      // Disable submit while sending
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      try {
        const formData = new FormData(contactForm);
        const resp = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          if (successEl) { successEl.style.display = 'block'; }
          if (errorEl)   { errorEl.style.display   = 'none';  }
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (_) {
        if (errorEl)   { errorEl.style.display   = 'block'; }
        if (successEl) { successEl.style.display = 'none';  }
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }

  // ===== IFPD Interactive Tabs System =====
  const ifpdTabBtns = document.querySelectorAll('.ifpd-tab-btn');
  const ifpdTabPanels = document.querySelectorAll('.ifpd-tab-panel');

  if (ifpdTabBtns.length > 0 && ifpdTabPanels.length > 0) {
    ifpdTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        ifpdTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        ifpdTabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // Smooth scroll and subject pre-selection for tab consultation buttons
    document.querySelectorAll('.btn-tab-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subjectSelect = document.getElementById('form-subject');
        if (subjectSelect) {
          // Select option 1 (Diseño de Procedimientos por Instrumentos)
          if (subjectSelect.options.length > 1) {
            subjectSelect.selectedIndex = 1;
          }
        }
      });
    });
  }

});

