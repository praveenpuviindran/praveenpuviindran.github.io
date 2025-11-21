// Dark/Light Mode Toggle
const toggle = document.querySelector('.toggle-wrapper');
const body = document.body;

toggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
