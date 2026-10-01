/* MH TECH — script.js
   1. Menú mobile
   2. Scroll-spy
   3. Panel de tickets animado
   4. Relojes en tiempo real (Córdoba, Argentina)
   5. Contadores dinámicos de estadísticas
   6. Fondo de partículas interactivas
   7. Copiar email
   8. Toggle día/noche
   9. Botón flotante WhatsApp
   10. Animación de entrada al scroll (reveal)
*/

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c MH TECH %c operando 🚀', 'background:#33d6e0;color:#000;font-weight:bold;padding:2px 6px;border-radius:4px;', 'color:#e9edf3;');

  initMobileNav();
  initScrollSpy();
  initTicketPanel();
  initCordobaClock();
  initStatCounters();
  initParticles();
  initCopyEmail();
  initTheme();
  initWhatsApp();
  initReveal();
});

/* 1. MENÚ MOBILE ---------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* 2. SCROLL-SPY ------------------------------------------------------ */
function initScrollSpy() {
  const links = document.querySelectorAll('.main-nav a[data-section]');
  if (!links.length) return;

  const sections = Array.from(links)
    .map(l => document.getElementById(l.dataset.section))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.main-nav a[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* 3. TICKET PANEL ---------------------------------------------------- */
function initTicketPanel() {
  const list = document.getElementById('ticket-list');
  if (!list) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const queue = [
    { id: '4471', desc: 'VPN no conecta — cuenta Claro',     status: 'open'     },
    { id: '4472', desc: 'Login corporativo bloqueado — GM',    status: 'progress' },
    { id: '4470', desc: 'Sync de base de datos técnicos',        status: 'resolved' },
    { id: '4473', desc: 'Incidente de red y conectividad',     status: 'open'     },
    { id: '4474', desc: 'Monitoreo de APIs en Kibana',          status: 'progress' },
    { id: '4468', desc: 'Automatización con Power Automate',    status: 'resolved' },
    { id: '4475', desc: 'Acceso bloqueado — cuenta GM',         status: 'open'     },
    { id: '4476', desc: 'Script SQL para métricas operativas',   status: 'resolved' },
  ];

  const labels = { open: 'Abierto', progress: 'En curso', resolved: 'Resuelto' };
  let cursor = 3;

  setInterval(() => {
    const rows = list.querySelectorAll('.ticket-row');
    const oldest = rows[0];
    if (!oldest) return;

    const next = queue[cursor % queue.length];
    cursor++;

    oldest.classList.add('ticket-row-out');
    setTimeout(() => {
      oldest.querySelector('.ticket-id').textContent = `#${next.id}`;
      oldest.querySelector('.ticket-desc').textContent = next.desc;
      const s = oldest.querySelector('.ticket-status');
      s.className = `ticket-status status-${next.status}`;
      s.textContent = labels[next.status];
      oldest.classList.remove('ticket-row-out');
      list.appendChild(oldest);
    }, 300);
  }, 4000);
}

/* 4. RELOJES EN TIEMPO REAL (CÓRDOBA) -------------------------------- */
function initCordobaClock() {
  const clockEl = document.querySelector('#cba-clock .clock-time');
  const sideClockEl = document.getElementById('cba-clock-side');

  function updateClock() {
    try {
      const now = new Date();
      const options = { timeZone: 'America/Argentina/Cordoba', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timeStr = new Intl.DateTimeFormat('es-AR', options).format(now);
      if (clockEl) clockEl.textContent = timeStr;
      if (sideClockEl) sideClockEl.textContent = timeStr;
    } catch (e) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      if (clockEl) clockEl.textContent = timeStr;
      if (sideClockEl) sideClockEl.textContent = timeStr;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* 5. CONTADORES DINÁMICOS DE ESTADÍSTICAS --------------------------- */
function initStatCounters() {
  const statsSection = document.querySelector('.stats');
  const numbers = document.querySelectorAll('.stat-num');
  if (!statsSection || !numbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || animated) return;
      animated = true;

      numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        const suffix = num.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          num.innerHTML = `${current}<span>${suffix}</span>`;
        }, 40);
      });
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* 6. FONDO DE PARTÍCULAS INTERACTIVAS ------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(width > 768 ? 60 : 30, 70);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(51, 214, 224, 0.4)';
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(51, 214, 224, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mouseDist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(180, 77, 255, ${0.25 * (1 - mouseDist / mouse.radius)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* 7. COPIAR EMAIL ---------------------------------------------------- */
function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  if (!btn) return;

  const email = btn.dataset.email;
  const orig  = btn.textContent;

  btn.addEventListener('click', e => {
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      btn.textContent = 'Copiado ✓';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    });
  });
}

/* 8. TOGGLE DÍA / NOCHE -------------------------------------------- */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('mhtech-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    btn.textContent = '🌙';
  } else {
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    btn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('mhtech-theme', isLight ? 'light' : 'dark');
  });
}

/* 9. WHATSAPP FLOTANTE ---------------------------------------------- */
function initWhatsApp() {
  if (document.getElementById('whatsapp-float')) return;

  const btn = document.createElement('a');
  btn.id  = 'whatsapp-float';
  btn.href   = 'https://wa.me/5493518587200?text=Hola,%20vi%20la%20web%20de%20MH%20TECH%20y%20necesito%20soporte%20técnico.';
  btn.target = '_blank';
  btn.rel    = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp');

  btn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>`;

  Object.assign(btn.style, {
    position:         'fixed',
    bottom:          '24px',
    right:            '24px',
    backgroundColor: '#25d366',
    color:            '#fff',
    width:           '56px',
    height:          '56px',
    borderRadius:    '50%',
    display:          'flex',
    alignItems:      'center',
    justifyContent:  'center',
    boxShadow:       '0 4px 14px rgba(0,0,0,0.4)',
    zIndex:          '9999',
    transition:      'transform 0.3s ease, background-color 0.3s ease',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform         = 'scale(1.1)';
    btn.style.backgroundColor = '#20ba5a';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform         = 'scale(1)';
    btn.style.backgroundColor = '#25d366';
  });

  document.body.appendChild(btn);
}

/* 10. SCROLL REVEAL -------------------------------------------------- */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.service-card, .stat-item, .process-step, .stack-cat, .project-card'
  );

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}
