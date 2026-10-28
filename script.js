// ==========================================================================
// TISHOO MANUFACTURING COMPANY - CLIENT LOGIC & MICRO-INTERACTIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initKeywordRotator();
  initTelemetryCounters();
  initPortfolioFilter();
  initInteractiveCalculator();
  initInquiryForm();
});

// 1. Mobile Hamburger Drawer
function initMobileDrawer() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close when clicking outside or on a link
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '☰';
    }
  });
}

// 2. Dynamic Keyword Rotator (Hero Title)
function initKeywordRotator() {
  const rotator = document.querySelector('.dynamic-rotator');
  if (!rotator) return;

  const keywords = [
    'Feels Like Muslin',
    '100% Virgin Pulp',
    'Ultra Absorbent',
    'Contai Wholesale Hub',
    'Hygienic & Skin Safe'
  ];
  let index = 0;

  setInterval(() => {
    rotator.style.opacity = '0';
    rotator.style.transform = 'translateY(6px)';

    setTimeout(() => {
      index = (index + 1) % keywords.length;
      rotator.textContent = keywords[index];
      rotator.style.opacity = '1';
      rotator.style.transform = 'translateY(0)';
    }, 300);
  }, 3200);
}

// 3. Animated Count-Up Telemetry Numbers (IntersectionObserver)
function initTelemetryCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let count = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCount(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOutQuad = 1 - (1 - progress) * (1 - progress);
          const current = progress * target;
          el.textContent = isDecimal ? current.toFixed(1) + suffix : Math.floor(current) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

// 4. Portfolio Filter Rail with Smooth Centering
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Smooth scroll button into center view
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      const category = btn.getAttribute('data-filter') || 'all';
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 5. Dynamic Interactive Value Calculator (Pure Portfolio - Zero E-Commerce)
function initInteractiveCalculator() {
  const guestSlider = document.getElementById('calcGuests');
  const guestVal = document.getElementById('calcGuestsVal');
  const settingSelect = document.getElementById('calcSetting');
  const resultPulls = document.getElementById('calcResultPulls');
  const resultCases = document.getElementById('calcResultCases');
  const btnInquire = document.getElementById('btnCalcInquire');

  if (!guestSlider || !resultPulls) return;

  function updateCalc() {
    const guests = parseInt(guestSlider.value, 10);
    const multiplier = parseFloat(settingSelect?.value || '2.5');
    if (guestVal) guestVal.textContent = guests.toLocaleString('en-IN');

    // Calculate monthly pulls needed
    const monthlyPulls = Math.round(guests * multiplier * 30);
    resultPulls.textContent = monthlyPulls.toLocaleString('en-IN') + ' pulls';

    // Standard case: 40 boxes x 80 pulls = 3200 pulls per master carton
    const cases = Math.ceil(monthlyPulls / 3200);
    if (resultCases) {
      resultCases.textContent = `${cases} Master Cartons`;
    }

    if (btnInquire) {
      const text = `Namaste Tishoo! We require approximately ${monthlyPulls.toLocaleString('en-IN')} pulls (${cases} master cartons) monthly for our establishment. Please share your wholesale catalog.`;
      btnInquire.href = `https://wa.me/918001284094?text=${encodeURIComponent(text)}`;
    }
  }

  guestSlider.addEventListener('input', updateCalc);
  if (settingSelect) settingSelect.addEventListener('change', updateCalc);
  updateCalc();
}

// 6. WhatsApp Inquiry Form Handoff
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value.trim() || 'Client';
    const requirement = document.getElementById('formRequirement')?.value || 'Wholesale Supply';
    const message = document.getElementById('formMessage')?.value.trim() || '';

    const payload = `Namaste Tishoo! My name is ${name}.
Requirement: ${requirement}
Details: ${message}

(Sent via Tishoo Portfolio Website)`;

    const url = `https://wa.me/918001284094?text=${encodeURIComponent(payload)}`;
    window.open(url, '_blank');
  });
}
