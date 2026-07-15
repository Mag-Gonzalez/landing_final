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
  const opening = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('open');
  // accesibilidad
  menuToggle.setAttribute('aria-expanded', String(opening));

  // stagger de items del menú mobile
  const items = Array.from(mobileMenu.querySelectorAll('a'));
  items.forEach((it, i) => {
    if (opening) {
      it.style.transitionDelay = `${i * 45}ms`;
    } else {
      it.style.transitionDelay = `${(items.length - i) * 15}ms`;
    }
  });
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

/* ---- Animaciones JS adicionales ---- */

document.addEventListener('DOMContentLoaded', () => {
  // Título: añadir clase para activar animación escalonada
  const title = document.querySelector('.hero-title');
  if (title) {
    const parts = Array.from(title.querySelectorAll('span'));
    parts.forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
    });
    // small timeout so CSS transitions apply after paint
    requestAnimationFrame(() => title.classList.add('animate'));
  }

  // Reveal on scroll para secciones y tarjetas
  const revealSelector = '.section .card, .section .dish-card, .section .stat-card, .testimonial-card, .map-card, .hero-badge';
  const revealElements = Array.from(document.querySelectorAll(revealSelector));
  revealElements.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealElements.forEach(el => obs.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  // Parallax ligero para partículas en hero (mouse)
  const hero = document.querySelector('.hero');
  const particles = Array.from(document.querySelectorAll('.hero-particles span'));
  if (hero && particles.length) {
    let lastX = 0, lastY = 0;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      // apply small transforms
      particles.forEach((p, i) => {
        const depth = (i % 5) * 0.6 + 0.6;
        const tx = px * 18 * depth;
        const ty = py * 12 * depth;
        p.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      particles.forEach(p => p.style.transform = 'translate(0,0)');
    });
  }

  // Micro-interacción: ripple effect en botones
  const buttons = Array.from(document.querySelectorAll('.button'));
  buttons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = `${size}px`;
      const x = ev.clientX - rect.left - size/2;
      const y = ev.clientY - rect.top - size/2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), opacity 520ms ease';
      btn.appendChild(ripple);
      requestAnimationFrame(() => ripple.style.transform = 'scale(1)');
      setTimeout(() => {
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 600);
      }, 400);
    });
  });

  // Ensure toggle has aria attributes
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', String(menuToggle.classList.contains('open')));
  }
});
