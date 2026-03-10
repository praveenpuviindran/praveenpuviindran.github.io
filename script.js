const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const toggleLabel = document.querySelector('.toggle-label');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function updateThemeUI(theme) {
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  toggleLabel.textContent = isLight ? 'Light' : 'Dark';
}

function applyTheme(theme, persist = true) {
  body.setAttribute('data-theme', theme);
  updateThemeUI(theme);
  if (persist) {
    localStorage.setItem('theme', theme);
  }
}

(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme, false);
    return;
  }

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark', false);
})();

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  const navIsOpen = body.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(navIsOpen));
});

nav.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const faders = document.querySelectorAll('.fade');
const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

faders.forEach((element) => fadeObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const activeNavMap = {
  'nba-portfolio': 'postgrad',
  undergrad: 'postgrad',
  projects: 'postgrad'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      const navId = activeNavMap[id] || id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${navId}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach((section) => sectionObserver.observe(section));

// ── Dynamic background canvas ───────────────────────────────────────────────
(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, mouseX = 0, mouseY = 0, scrollFrac = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / W - 0.5;
    mouseY = e.clientY / H - 0.5;
  });

  window.addEventListener('scroll', () => {
    scrollFrac = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  }, { passive: true });

  // Orb definitions: base position (0–1), size fraction, colour, drift phase + speed
  const orbs = [
    { bx: 0.12, by: 0.14, r: 0.34, rgb: [255, 122, 24],  ph: 0.0, spd: 0.00045 },
    { bx: 0.88, by: 0.06, r: 0.40, rgb: [56,  189, 248], ph: 1.3, spd: 0.00058 },
    { bx: 0.50, by: 0.55, r: 0.30, rgb: [99,  102, 241], ph: 2.5, spd: 0.00038 },
    { bx: 0.08, by: 0.82, r: 0.24, rgb: [56,  189, 248], ph: 0.7, spd: 0.00052 },
    { bx: 0.92, by: 0.74, r: 0.28, rgb: [255, 122, 24],  ph: 1.9, spd: 0.00042 },
    { bx: 0.55, by: 0.92, r: 0.22, rgb: [99,  102, 241], ph: 3.1, spd: 0.00060 },
  ];

  let t = 0;

  function draw(ts) {
    t = ts;
    ctx.clearRect(0, 0, W, H);

    const isDark = document.body.getAttribute('data-theme') !== 'light';
    const baseAlpha = isDark ? 0.13 : 0.08;

    // Shift colours slightly based on scroll position (cool blue -> warm orange)
    const warmShift = scrollFrac * 0.3;

    orbs.forEach((orb) => {
      const drift = t * orb.spd;
      const dx = Math.sin(drift + orb.ph)        * 0.055;
      const dy = Math.cos(drift * 0.73 + orb.ph) * 0.045;

      const cx = (orb.bx + dx + mouseX * 0.055) * W;
      const cy = (orb.by + dy + mouseY * 0.035) * H;
      const radius = orb.r * Math.min(W, H);

      // Interpolate RGB slightly toward warm/cool based on scroll
      const [r0, g0, b0] = orb.rgb;
      const r = Math.round(r0 + (255 - r0) * warmShift * 0.15);
      const g = Math.round(g0 * (1 - warmShift * 0.05));
      const b = Math.round(b0 * (1 - warmShift * 0.12));

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${baseAlpha})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${baseAlpha * 0.4})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

const profileImage = document.querySelector('[data-profile-image]');
if (profileImage) {
  profileImage.addEventListener('error', () => {
    const container = profileImage.closest('.profile-photo');
    if (container) {
      container.classList.add('is-placeholder');
    }
    profileImage.remove();
  });
}
