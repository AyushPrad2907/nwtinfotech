/**
 * NWT Infotech – script.js
 * Handles: Navbar, Cart, Checkout, Animations, Counters, Typing effect
 */

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
function initNav() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      })
    );
  }

  // Active link
  const page = (location.pathname.split('/').pop() || 'index.html').split('#')[0].split('?')[0];
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const linkPath = link.getAttribute('href').split('#')[0].split('?')[0];
    if (linkPath === page) link.classList.add('active');
  });

  updateCartBadge();
}

/* ─────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
───────────────────────────────────────────────────────── */
function initAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger').forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el      = e.target;
      const target  = parseInt(el.dataset.count, 10);
      const suffix  = el.dataset.suffix || '';
      let current   = 0;
      const step    = Math.max(1, Math.ceil(target / 55));
      const timer   = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('en-IN') + suffix;
        if (current >= target) clearInterval(timer);
      }, 22);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ─────────────────────────────────────────────────────────
   CART — localStorage
───────────────────────────────────────────────────────── */
const CART_KEY = 'nwt_cart';

function getCart() {
  try {
    const r = localStorage.getItem(CART_KEY);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

function saveCart(service, plan, price) {
  localStorage.setItem(CART_KEY, JSON.stringify({ service, plan, price, ts: Date.now() }));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function updateCartBadge() {
  const has = !!getCart();
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = '1';
    b.style.display = has ? 'inline-flex' : 'none';
  });
}

function addToCart(service, plan, price) {
  saveCart(service, plan, price);
  updateCartBadge();
  showToast('Added to cart!', `${service} — ${plan}`);
}

/* ─────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────── */
function showToast(title, sub) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="t-icon">🛒</div><div class="t-text"><strong>${title}</strong>${sub}</div>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

/* ─────────────────────────────────────────────────────────
   SERVICE BUTTONS
───────────────────────────────────────────────────────── */
function initServiceButtons() {
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.service, btn.dataset.plan, parseInt(btn.dataset.price, 10));
    });
  });
}

/* ─────────────────────────────────────────────────────────
   CHECKOUT
───────────────────────────────────────────────────────── */
function initCheckout() {
  if (!document.getElementById('order-summary-wrap')) return;

  const cart = getCart();
  const fmt  = n => `₹${Number(n).toLocaleString('en-IN')}`;

  if (!cart) {
    // Empty cart state
    document.getElementById('order-summary-content').innerHTML = `
      <div class="empty-cart">
        <span class="ico">🛒</span>
        <p>Your cart is empty. Please select a service first.</p>
        <a href="services.html" class="btn btn-primary btn-sm">Browse Services</a>
      </div>`;
    document.getElementById('checkout-form-section').style.display = 'none';
    document.querySelector('.advance-box').style.display = 'none';
    return;
  }

  const advance = Math.round(cart.price * 0.30);

  // Populate summary
  document.getElementById('summary-service').textContent = cart.service;
  document.getElementById('summary-plan').textContent    = cart.plan;
  document.getElementById('summary-price').textContent   = fmt(cart.price);
  document.getElementById('advance-amount').textContent  = fmt(advance);

  // Restore visibility
  document.getElementById('checkout-form-section').style.display = 'block';
  document.querySelector('.advance-box').style.display = 'block';

  // Add remove button if not exists
  if (!document.getElementById('btn-remove-cart')) {
    const removeBtnWrap = document.createElement('div');
    removeBtnWrap.className = 'summary-row';
    removeBtnWrap.style.marginTop = '16px';
    removeBtnWrap.style.borderBottom = 'none';
    removeBtnWrap.innerHTML = `<button id="btn-remove-cart" class="btn btn-ghost btn-sm btn-full" style="border-color: rgba(239, 68, 68, 0.25); color: #f87171; background: rgba(239, 68, 68, 0.03);">❌ Remove Item</button>`;
    document.getElementById('order-summary-content').appendChild(removeBtnWrap);

    document.getElementById('btn-remove-cart').addEventListener('click', () => {
      clearCart();
      updateCartBadge();
      // Restore default summary DOM elements
      document.getElementById('order-summary-content').innerHTML = `
        <div class="summary-row"><span class="label">Service</span><span class="value" id="summary-service">—</span></div>
        <div class="summary-row"><span class="label">Plan</span><span class="value" id="summary-plan">—</span></div>
        <div class="summary-row summary-total"><span class="label">Total Price</span><span class="value" id="summary-price">0</span></div>
      `;
      initCheckout();
      showToast('Cart Cleared', 'Your selected service has been removed.');
    });
  }

  // QR display
  const qrEl = document.getElementById('qr-advance-display');
  if (qrEl) qrEl.textContent = fmt(advance);

  // File uploads
  document.querySelectorAll('.file-upload-area').forEach(area => {
    const input = area.querySelector('input[type="file"]');
    const label = area.querySelector('.file-name');
    if (!input || !label) return;
    input.addEventListener('change', () => {
      label.textContent = input.files[0] ? `✓ ${input.files[0].name}` : '';
      area.style.borderColor = input.files[0] ? 'var(--blue)' : '';
    });
  });

  // Form submit
  const form = document.getElementById('checkout-form');
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      showToast('Form Incomplete', 'Please fill in all required fields.');
      return;
    }
    
    const themeSelect = document.getElementById('theme-select');
    if (!themeSelect || !themeSelect.value) {
      showToast('Select Theme', 'Please choose a design style preference.');
      return;
    }

    const cart = getCart();
    if (!cart) {
      showToast('Cart Empty', 'Please select a service before placing an order.');
      return;
    }

    // Get input values
    const notesInput = document.getElementById('project-notes');
    const voiceInput = document.querySelector('input[name="voice_message"]');
    const utrInput = document.getElementById('utr-number');
    
    const orderData = {
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      phone: document.getElementById('client-phone').value,
      service: cart.service,
      plan: cart.plan,
      price: cart.price,
      design_theme: themeSelect.value,
      notes: notesInput ? notesInput.value : '',
      voiceFile: voiceInput?.files[0] || null,
      utr: utrInput ? utrInput.value : ''
    };

    // Get screenshot file
    const fileInput = document.querySelector('input[name="payment_screenshot"]');
    const file = fileInput?.files[0] || null;

    // Set loading state
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Order';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⚡ Processing Order...';
    }

    try {
      // Submit order & upload file to Supabase
      const result = await submitOrderToSupabase(orderData, file);
      
      // On success
      if (submitBtn) submitBtn.innerHTML = '✓ Success!';
      
      // Update success popup details dynamically if elements exist
      const popValName = document.querySelector('.popup-info-box .popup-info-val');
      if (popValName) popValName.textContent = orderData.name;
      
      document.getElementById('success-popup').classList.add('visible');
      setTimeout(() => {
        clearCart();
        updateCartBadge();
      }, 1500);
      
    } catch (err) {
      console.error(err);
      showToast('Order Failed', err.message || 'Something went wrong. Please try again.');
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

function closePopup() {
  document.getElementById('success-popup')?.classList.remove('visible');
  setTimeout(() => { window.location.href = 'index.html'; }, 350);
}

/* ─────────────────────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   DESIGN ENGINE SHOWCASE TABS
───────────────────────────────────────────────────────── */
function initDesignEngine() {
  const tabs = document.querySelectorAll('.de-tab');
  const visuals = document.querySelectorAll('.de-visual');
  const title = document.querySelector('.de-viewer-title');
  
  if (!tabs.length || !visuals.length) return;

  let activeIndex = 0;
  let cycleInterval = null;

  function setTabActive(index) {
    activeIndex = index;
    const tab = tabs[index];
    const targetVisual = tab.dataset.visual;

    // Deactivate all tabs and visuals
    tabs.forEach(t => t.classList.remove('active'));
    visuals.forEach(v => v.classList.remove('active'));
    
    // Activate selected tab & corresponding visual
    tab.classList.add('active');
    const targetEl = document.getElementById(`visual-${targetVisual}`);
    if (targetEl) targetEl.classList.add('active');
    
    // Update header file name based on tab
    if (title) {
      if (targetVisual === 'web') title.textContent = 'design_system_preview.jpg';
      else if (targetVisual === 'ai') title.textContent = 'ai_neural_core_graph.jpg';
      else if (targetVisual === 'flows') title.textContent = 'smooth_flows_animation.jpg';
    }
  }

  // Click handler
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      setTabActive(index);
      // If clicked, reset the auto-cycle timer to prevent abrupt switching
      if (cycleInterval) {
        clearInterval(cycleInterval);
        startAutoCycle();
      }
    });
  });

  // Auto-cycle logic only for mobile/tablet (width <= 900px)
  function startAutoCycle() {
    if (window.innerWidth <= 900) {
      cycleInterval = setInterval(() => {
        let nextIndex = (activeIndex + 1) % tabs.length;
        setTabActive(nextIndex);
      }, 2000); // changes every 2 seconds
    }
  }

  function stopAutoCycle() {
    if (cycleInterval) {
      clearInterval(cycleInterval);
      cycleInterval = null;
    }
  }

  // Start initial check
  startAutoCycle();

  // Watch for window resize events
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
      if (!cycleInterval) startAutoCycle();
    } else {
      stopAutoCycle();
    }
  });
}

/* ─────────────────────────────────────────────────────────
   HERO LIVE COMPILE / INTERACTIVE CONTROLS
───────────────────────────────────────────────────────── */
function initHeroInteractive() {
  const btnCode = document.getElementById('btn-show-code');
  const btnLive = document.getElementById('btn-show-live');
  const codeView = document.getElementById('screen-code-view');
  const liveView = document.getElementById('screen-live-view');

  if (!btnCode || !btnLive || !codeView || !liveView) return;

  btnCode.addEventListener('click', () => {
    btnCode.classList.add('active');
    btnLive.classList.remove('active');
    codeView.style.opacity = '1';
    codeView.style.pointerEvents = 'all';
    liveView.style.opacity = '0';
    liveView.style.pointerEvents = 'none';
  });

  btnLive.addEventListener('click', () => {
    btnLive.classList.add('active');
    btnCode.classList.remove('active');
    codeView.style.opacity = '0';
    codeView.style.pointerEvents = 'none';
    liveView.style.opacity = '1';
    liveView.style.pointerEvents = 'all';
  });
}

/* ─────────────────────────────────────────────────────────
   ⏳ PRELOADER
   ───────────────────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('fade-out');
  }, 2500);
}

/* ─────────────────────────────────────────────────────────
   DYNAMIC TYPING EFFECT
   ───────────────────────────────────────────────────────── */
function initDynamicTechText() {
  const target = document.getElementById('dynamic-tech-text');
  if (!target) return;
  const words = ['Technology', 'Innovation', 'AI Integration', 'Modern Code', 'Expert Design'];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIdx];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx === currentWord.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  type();
}

/* ─────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Check for admin query parameter to redirect to admin dashboard
  if (window.location.search.toLowerCase().includes('admin')) {
    window.location.href = 'admin.html';
    return;
  }

  initPreloader();
  initNav();
  initAnimations();
  initCounters();
  initServiceButtons();
  initCheckout();
  initFAQ();
  initSmoothScroll();
  initDesignEngine();
  initHeroInteractive();
  initDynamicTechText();
});