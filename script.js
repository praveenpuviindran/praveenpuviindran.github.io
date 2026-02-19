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

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach((section) => sectionObserver.observe(section));

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
