document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. Smooth Scrolling with precise navbar offset =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        const header = document.getElementById('navbar');
        const navHeight = header ? header.offsetHeight : 75;
        const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;
        
        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });

        // Update active class immediately on click
        document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
        if (!this.classList.contains('btn-nav')) {
          this.classList.add('active');
        }

        // Close mobile menu if open
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navRight = document.getElementById('navRight');
        if (mobileMenuBtn && navRight && navRight.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          navRight.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // ===== ScrollSpy for Nav Menu =====
  const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-nav)');
  const trackedSections = [];
  navLinks.forEach(link => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#') && id.length > 1) {
      const sec = document.querySelector(id);
      if (sec) trackedSections.push({ link, sec });
    }
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 120;
    let current = null;

    for (const item of trackedSections) {
      const top = item.sec.offsetTop;
      const height = item.sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
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

  // ===== 2.5. Mobile Hamburger Menu =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navRight = document.getElementById('navRight');
  
  if (mobileMenuBtn && navRight) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navRight.classList.toggle('active');
      
      // Prevent body scrolling when menu is open
      if (navRight.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navRight.classList.remove('active');
        document.body.style.overflow = '';
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

    // Update the current flag + code when a language is chosen
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const flag = btn.querySelector('.fi');
        const code = btn.getAttribute('data-code');
        const flagClass = btn.getAttribute('data-flag');

        // Update the toggle button display
        const currentFlag = langToggle.querySelector('.fi');
        const currentCode = document.getElementById('currentLangCode');
        if (currentFlag && flagClass) {
          // Reset all fi-* classes
          currentFlag.className = `fi fis ${flagClass}`;
        }
        if (currentCode && code) {
          currentCode.textContent = code;
        }

        // Close dropdown
        langSelector.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');

        // Update the hidden form lang field
        const formLang = document.getElementById('form-lang');
        if (formLang) formLang.value = btn.getAttribute('data-lang');
        
        // Close mobile menu if open
        if (mobileMenuBtn && navRight && navRight.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          navRight.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
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

});
