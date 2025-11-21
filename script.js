// Dark/Light Mode Toggle
const toggle = document.querySelector('.toggle-wrapper');
const body = document.body;

toggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
});

// Mobile Nav Toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}
