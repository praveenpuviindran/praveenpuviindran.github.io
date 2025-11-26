// Dark/Light Mode Toggle with Local Storage
const toggle = document.querySelector('.toggle-wrapper');
const body = document.body;

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

toggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// Load saved theme
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Fade-in Animations
const faders = document.querySelectorAll('.fade');

const appear = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
});

faders.forEach(el => appear.observe(el));

// Highlight Nav on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(sec => navObserver.observe(sec));
