/* =============================================
   PRADEEP REDDY — PORTFOLIO SCRIPTS
   ============================================= */

(function () {
  'use strict';

  // ============ THEME TOGGLE ============
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) { themeIcon.className = 'fas fa-sun'; }
      document.querySelector('meta[name="theme-color"]').content = '#0a0a0a';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) { themeIcon.className = 'fas fa-moon'; }
      document.querySelector('meta[name="theme-color"]').content = '#ffffff';
    }
    localStorage.setItem('theme', theme);
  }

  window.setTheme = setTheme;

  // Init theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // ============ INIT ANIMATIONS ON LOAD ============
  window.addEventListener('load', () => {
    initAnimations();
  });

  // ============ TYPING ANIMATION ============
  const roles = [
    "Machine Learning", 
    "Artificial Intelligence", 
    "Deep Learning", 
    "Computer Vision", 
    "Full Stack Development", 
    "Backend Development", 
    "Frontend Development", 
    "Web Development"
  ];
  const typingEl = document.getElementById('typingText');
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeRole() {
    const current = roles[roleIndex];
    if (!isDeleting) {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(() => { isDeleting = true; typeRole(); }, 2000);
        return;
      }
      setTimeout(typeRole, 80);
    } else {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, 40);
    }
  }
  setTimeout(typeRole, 500);

  // ============ COMMAND PALETTE ============
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdHint = document.getElementById('cmdHint');
  let cmdActiveIndex = -1;

  const commands = [
    {
      group: 'Navigation', items: [
        { icon: 'fa-house', label: 'Go to Home', action: () => scrollTo('#hero'), key: 'H' },
        { icon: 'fa-user', label: 'Go to About', action: () => scrollTo('#about'), key: 'A' },
        { icon: 'fa-briefcase', label: 'Go to Experience', action: () => scrollTo('#experience'), key: 'E' },
        { icon: 'fa-code', label: 'Go to Projects', action: () => scrollTo('#projects'), key: 'P' },
        { icon: 'fa-cubes', label: 'Go to Skills', action: () => scrollTo('#skills'), key: 'S' },
        { icon: 'fa-graduation-cap', label: 'Go to Education', action: () => scrollTo('#education') },
        { icon: 'fa-envelope', label: 'Go to Contact', action: () => scrollTo('#contact'), key: 'C' },
      ]
    },
    {
      group: 'Actions', items: [
        { icon: 'fa-file-pdf', label: 'View Resume', action: () => window.open('https://drive.google.com/file/d/19iOmFIesXRM55RN8rl8yY5zhybmMg_rG/view?usp=sharing', '_blank') },
        { icon: 'fa-brands fa-linkedin', label: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/pradeep-reddy-vv', '_blank') },
        { icon: 'fa-brands fa-github', label: 'Open GitHub', action: () => window.open('https://github.com/pradeepreddyvv', '_blank') },
        { icon: 'fa-envelope', label: 'Send Email', action: () => window.open('mailto:vvenuth1@asu.edu') },
        {
          icon: 'fa-circle-half-stroke', label: 'Toggle Dark Mode', action: () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(isDark ? 'light' : 'dark');
          }
        },
        { icon: 'fa-arrow-up', label: 'Scroll to Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      ]
    },
  ];

  function openCommandPalette() {
    cmdOverlay.classList.add('active');
    cmdInput.value = '';
    cmdActiveIndex = -1;
    renderCmdResults('');
    setTimeout(() => cmdInput.focus(), 50);
    if (cmdHint) cmdHint.classList.add('hidden');
  }

  function closeCommandPalette() {
    cmdOverlay.classList.remove('active');
  }

  window.openCommandPalette = openCommandPalette;

  function renderCmdResults(query) {
    const q = query.toLowerCase().trim();
    let html = '';
    commands.forEach(group => {
      const filtered = group.items.filter(i => i.label.toLowerCase().includes(q));
      if (filtered.length === 0) return;
      html += `<div class="cmd-group-title">${group.group}</div>`;
      filtered.forEach(item => {
        const keyHtml = item.key ? `<kbd>${item.key}</kbd>` : '';
        html += `<button class="cmd-item" data-label="${item.label}">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>${keyHtml}
        </button>`;
      });
    });
    if (!html) {
      html = '<div style="padding:20px;text-align:center;color:var(--text-muted);">No results found</div>';
    }
    cmdResults.innerHTML = html;
    cmdActiveIndex = -1;
    bindCmdItems();
  }

  function bindCmdItems() {
    const items = cmdResults.querySelectorAll('.cmd-item');
    items.forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.dataset.label;
        const cmd = commands.flatMap(g => g.items).find(i => i.label === label);
        if (cmd) { cmd.action(); closeCommandPalette(); }
      });
    });
  }

  function navigateCmd(dir) {
    const items = cmdResults.querySelectorAll('.cmd-item');
    if (!items.length) return;
    items.forEach(i => i.classList.remove('active'));
    cmdActiveIndex += dir;
    if (cmdActiveIndex < 0) cmdActiveIndex = items.length - 1;
    if (cmdActiveIndex >= items.length) cmdActiveIndex = 0;
    items[cmdActiveIndex].classList.add('active');
    items[cmdActiveIndex].scrollIntoView({ block: 'nearest' });
  }

  cmdInput.addEventListener('input', () => renderCmdResults(cmdInput.value));
  cmdInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateCmd(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); navigateCmd(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const items = cmdResults.querySelectorAll('.cmd-item');
      if (cmdActiveIndex >= 0 && items[cmdActiveIndex]) {
        items[cmdActiveIndex].click();
      } else if (items.length) {
        items[0].click();
      }
    }
  });
  cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCommandPalette(); });

  // Keyboard shortcut: Cmd+K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      cmdOverlay.classList.contains('active') ? closeCommandPalette() : openCommandPalette();
    }
    if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
      closeCommandPalette();
    }
  });

  // ============ NAVBAR ============
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('navMenu');

  // Scroll header style
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    }
  });

  // Hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll for nav links
  function scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Scroll to top
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============ STAT COUNTER ANIMATION ============
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      if (counter.dataset.animated) return;
      const target = counter.textContent;
      const numMatch = target.match(/[\d.]+/);
      if (!numMatch) return;
      const num = parseFloat(numMatch[0]);
      const suffix = target.replace(numMatch[0], '');
      const isFloat = target.includes('.');
      let current = 0;
      const increment = num / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        counter.textContent = (isFloat ? current.toFixed(2) : Math.floor(current)) + suffix;
      }, 30);
      counter.dataset.animated = 'true';
    });
  }

  // ============ SCROLL REVEAL ============
  function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger counter animation for about section
          if (entry.target.closest('#about')) animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ============ SKILLS LOADING ============
  async function loadSkills() {
    try {
      const res = await fetch('./skills.json');
      const data = await res.json();
      Object.keys(data).forEach(category => {
        const container = document.getElementById('skills-' + category);
        if (!container) return;
        container.innerHTML = data[category].map(skill =>
          `<div class="skill-item">
            <img src="https://cdn.simpleicons.org/${skill.icon}" alt="${skill.name}" onerror="this.style.display='none'">
            <span>${skill.name}</span>
          </div>`
        ).join('');
      });
    } catch (e) {
      console.warn('Skills load error:', e);
    }
  }
  loadSkills();

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      
      // Remove old messages
      this.querySelectorAll('.success-message, .error-message').forEach(m => m.remove());
      const formData = new FormData(this);

      try{
        const response = await fetch("https://api.web3forms.com/submit",{
          method: "POST",
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          const msg = document.createElement('div');
          msg.className = 'success-message';
          msg.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          this.insertBefore(msg, this.firstChild);
          this.reset();
        } else {
          throw new Error('Web3Forms request failed');
        }
      } catch(error){
        const msg = document.createElement('div');
        msg.className = 'error-message';
        msg.textContent = 'Failed to send message. Please email me directly at vvenuth1@asu.edu';
        this.insertBefore(msg, this.firstChild);
      }
      finally {
        btn.innerHTML = origText;
        btn.disabled = false;
        setTimeout(() => {
        this.querySelectorAll('.success-message, .error-message').forEach(m => m.remove());
      }, 5000);
    }
    });
  }

})();
