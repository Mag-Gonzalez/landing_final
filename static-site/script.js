const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const tableNodes = Array.from(document.querySelectorAll('.table-node'));
const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
const panels = Array.from(document.querySelectorAll('.dashboard-panel'));
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const testimonialDots = Array.from(document.querySelectorAll('.testimonial-dots .dot'));
let testimonialIndex = 0;
let testimonialTimer;

function toggleMenu() {
  mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('open');
}

menuToggle?.addEventListener('click', toggleMenu);

window.addEventListener('scroll', () => {
  if (!header) return;
  const active = window.scrollY > 40;
  header.classList.toggle('scrolled', active);
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const status = button.dataset.status;
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    tableNodes.forEach((node) => {
      const nodeStatus = node.classList.contains('free') ? 'free'
        : node.classList.contains('occupied') ? 'occupied'
        : node.classList.contains('reserved') ? 'reserved' : 'all';

      if (status === 'all' || status === nodeStatus) {
        node.style.opacity = '1';
        node.style.pointerEvents = 'auto';
      } else {
        node.style.opacity = '0.25';
        node.style.pointerEvents = 'none';
      }
    });
  });
});

if (filterButtons.length) {
  filterButtons[0].classList.add('active');
}

function selectTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === tabId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => selectTab(button.dataset.tab));
});

function showTestimonial(index) {
  testimonialCards.forEach((card) => {
    card.classList.toggle('active', card.dataset.testimonial === String(index));
  });
  testimonialDots.forEach((dot) => {
    dot.classList.toggle('active', dot.dataset.index === String(index));
  });
}

function nextTestimonial() {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  showTestimonial(testimonialIndex);
}

testimonialDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    testimonialIndex = Number(dot.dataset.index);
    showTestimonial(testimonialIndex);
    resetTestimonialTimer();
  });
});

function resetTestimonialTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 5000);
}

document.querySelector('.testimonial-slider')?.addEventListener('mouseenter', () => {
  clearInterval(testimonialTimer);
});
document.querySelector('.testimonial-slider')?.addEventListener('mouseleave', resetTestimonialTimer);

resetTestimonialTimer();
selectTab('reservas');
showTestimonial(0);

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
  }
});
