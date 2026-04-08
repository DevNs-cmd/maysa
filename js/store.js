// MASAYA storefront controller
// Handles catalog rendering (rails + grids), cart, search, sticky nav, and simple admin add/edit.

const ADMIN_KEY = 'masaya-admin';
const STORAGE_CART = 'masaya_cart_items';
const STORAGE_COUNT = 'masaya_cart_count';
const STORAGE_ADMIN_PRODUCTS = 'masaya_admin_products';

// merge admin-added products
const adminProducts = JSON.parse(localStorage.getItem(STORAGE_ADMIN_PRODUCTS) || '[]');
window.catalog = [...catalog, ...adminProducts.map((p, i) => ({ ...p, id: 1000 + i }))];

const state = {
  cart: JSON.parse(localStorage.getItem(STORAGE_CART) || '[]'),
  role: localStorage.getItem('masaya_role') || 'guest',
};

const formatINR = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const setCart = (items) => {
  state.cart = items;
  localStorage.setItem(STORAGE_CART, JSON.stringify(items));
  localStorage.setItem(STORAGE_COUNT, String(items.reduce((s, i) => s + i.qty, 0)));
  const count = items.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach((el) => (el.textContent = count));
  renderCart();
};

const showToast = (msg) => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1400);
};

const ensureLoginModal = () => {
  if (!document.getElementById('login-modal')) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'login-modal';
    modal.innerHTML = `
      <div class="modal-card glass-panel" style="padding:2rem; max-width:400px; width:90%;">
        <div class="modal-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="margin:0; font-family:var(--font-sans);">Account Access</h3>
          <button class="icon-btn" id="login-close" aria-label="Close login"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-row" style="display:flex; gap:8px; margin-bottom:1.5rem;">
          <label class="pill" style="flex:1; padding:10px; cursor:pointer; border:1px solid var(--stroke); border-radius:12px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.4);">
            <input type="radio" name="login-role" value="user" checked style="margin-right:8px;"> Customer
          </label>
          <label class="pill" style="flex:1; padding:10px; cursor:pointer; border:1px solid var(--stroke); border-radius:12px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.4);">
            <input type="radio" name="login-role" value="admin" style="margin-right:8px;"> Admin
          </label>
        </div>
        <div class="modal-row" style="display:flex; gap:12px; flex-direction:column;">
          <input type="email" id="login-email" placeholder="Email Address" style="padding:12px; border-radius:10px; border:1px solid var(--stroke); background:rgba(255,255,255,0.8);">
          <input type="password" id="login-pass" placeholder="Password" style="padding:12px; border-radius:10px; border:1px solid var(--stroke); background:rgba(255,255,255,0.8);">
          <button class="btn primary add-wide" id="login-submit" style="margin-top:0.5rem;">Sign In</button>
          <button class="btn ghost add-wide" id="login-google" style="border:1px solid var(--stroke); color:var(--emerald-900); background:#fff; margin-top:0.5rem;">
            <i class="fab fa-google" style="margin-right:8px;"></i>Continue with Google
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Bind inner events once
    modal.querySelector('#login-close')?.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
    
    const handleLogin = (e) => {
      const role = modal.querySelector('input[name="login-role"]:checked')?.value || 'user';
      localStorage.setItem('masaya_role', role);
      showToast(`Welcome back, ${role === 'admin' ? 'Curator' : 'Guest'}`);
      modal.classList.remove('show');
    };
    modal.querySelector('#login-submit')?.addEventListener('click', handleLogin);
    modal.querySelector('#login-google')?.addEventListener('click', handleLogin);
  }
  // delegate triggers globally
  if (!document.body.dataset.loginDelegated) {
    document.body.dataset.loginDelegated = '1';
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('#login-user') || e.target.closest('.login-user')) {
        e.preventDefault();
        document.getElementById('login-modal')?.classList.add('show');
        const userRadio = document.querySelector('input[name=\"login-role\"][value=\"user\"]');
        if (userRadio) userRadio.checked = true;
      }
      if (e.target.closest('#login-admin') || e.target.closest('.login-admin')) {
        e.preventDefault();
        document.getElementById('login-modal')?.classList.add('show');
        const adminRadio = document.querySelector('input[name=\"login-role\"][value=\"admin\"]');
        if (adminRadio) adminRadio.checked = true;
      }
    });
  }
};

const ensureCartDrawer = () => {
  if (!document.getElementById('cart-drawer')) {
    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'cart-drawer';
    drawer.innerHTML = `
      <div class="drawer-header" style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem; border-bottom:1px solid var(--stroke);">
        <strong style="font-size:1.2rem;">Your Luxury Bag</strong>
        <button class="icon-btn" id="drawer-close" aria-label="Close"><i class="fas fa-times"></i></button>
      </div>
      <div class="drawer-body" style="padding:1.5rem; flex:1; overflow-y:auto;">
        <p style="color:var(--emerald-700);">Your bag is currently empty.</p>
      </div>
      <div class="drawer-footer" style="padding:1.5rem; border-top:1px solid var(--stroke);">
        <button class="btn primary add-wide" onclick="location.href='cart.html'">View Full Bag</button>
      </div>`;
    document.body.appendChild(drawer);

    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.id = 'drawer-overlay';
    document.body.appendChild(overlay);

    const close = () => { drawer.classList.remove('show'); overlay.classList.remove('show'); };
    drawer.querySelector('#drawer-close')?.addEventListener('click', close);
    overlay.addEventListener('click', close);
  }
};

const cardTemplate = (p) => `
    <article class="card reveal" id="card-${p.id}" data-id="${p.id}">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <a href="product.html?id=${p.id}">
        <div class="img-stack">
          <img class="img-primary" src="${p.img}" alt="${p.name}">
          <img class="img-secondary" src="${p.img2 || p.img}" alt="${p.name} lifestyle">
        </div>
      </a>
      <div class="card-body">
        <div class="title">${p.name}</div>
        <div class="sub">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
        <div class="price">${formatINR(p.price)}</div>
        <div class="swatches">
          ${(p.swatches || []).map((c) => `<span class="dot" style="background:${c}"></span>`).join('')}
        </div>
        <button class="add-btn" data-id="${p.id}">Add to bag</button>
      </div>
    </article>
  `;

  const renderRail = (wrap, list) => {
    const inner = wrap.querySelector('.rail-inner');
    if (!inner) return;
    inner.innerHTML = list.map(cardTemplate).join('');
    attachCardInteractions(inner);
  };

  const renderGrid = (wrap, list) => {
    wrap.innerHTML = list.map(cardTemplate).join('');
    attachCardInteractions(wrap);
  };

  const attachCardInteractions = (root) => {
    // add to cart
    root.querySelectorAll('.add-btn').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        const product = catalog.find((p) => p.id === id);
        if (!product) return;
        const existing = state.cart.find((c) => c.id === id);
        let next;
        if (existing) {
          next = state.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
        } else {
          next = [...state.cart, { id, qty: 1, name: product.name, price: product.price, img: product.img }];
        }
        setCart(next);
        showToast(`${product.name} added`);
      })
    );

    // swatch hover swaps
    root.querySelectorAll('.dot').forEach((dot) => {
      dot.addEventListener('mouseenter', (e) => {
        const card = dot.closest('.card');
        card.querySelector('.img-primary').style.opacity = '0';
        card.querySelector('.img-secondary').style.opacity = '1';
      });
      dot.addEventListener('mouseleave', (e) => {
        const card = dot.closest('.card');
        card.querySelector('.img-primary').style.opacity = '1';
        card.querySelector('.img-secondary').style.opacity = '0';
      });
    });

    // reveal on view
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.18 }
    );
    root.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  };

  const renderRails = () => {
    document.querySelectorAll('[data-rail]').forEach((rail) => {
      const cat = rail.dataset.rail;
      const list = catalog.filter((p) => p.category === cat).slice(0, 12);
      renderRail(rail, list);
    });
  };

  const renderGridIfAny = () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    renderGrid(grid, catalog.slice(0, 30));
  };

  const renderCart = () => {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    const body = drawer.querySelector('.drawer-body');
    if (!body) return;
    if (state.cart.length === 0) {
      body.innerHTML = `<p style="color:var(--emerald-700);">Your bag is empty.</p>`;
      return;
    }
    body.innerHTML = state.cart
      .map(
        (item, idx) => `
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
          <img src="${item.img}" style="width:56px;height:56px;object-fit:cover;border-radius:12px;">
          <div style="flex:1;">
            <div style="font-weight:700;">${item.name}</div>
            <div style="color:var(--emerald-700);">${formatINR(item.price)} · Qty ${item.qty}</div>
          </div>
          <button class="icon-btn" data-remove="${idx}" aria-label="Remove"><i class="fas fa-times"></i></button>
        </div>`
      )
      .join('');
    body.querySelectorAll('[data-remove]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.remove);
        const next = [...state.cart];
        next.splice(idx, 1);
        setCart(next);
      })
    );
  };

  const search = (term) => {
    if (!term) return;
    const match = catalog.find((p) => p.name.toLowerCase().includes(term.toLowerCase()) || p.category.includes(term.toLowerCase()));
    if (match) {
      const el = document.getElementById(`card-${match.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(`Jumped to ${match.name}`);
    } else {
      showToast('No matching product');
    }
  };

const bindGlobalUI = () => {
  ensureLoginModal();
  ensureCartDrawer();
  
  // Delegation for global triggers - handles all buttons even if dynamically added
  document.addEventListener('click', (e) => {
    // Cart open
    const cartBtn = e.target.closest('#cart-btn, .cart-btn');
    if (cartBtn) {
      e.preventDefault();
      document.getElementById('cart-drawer')?.classList.add('show');
      document.getElementById('drawer-overlay')?.classList.add('show');
      return;
    }

    // Login user
    const userBtn = e.target.closest('#login-user, .login-user, [aria-label="Account"]');
    if (userBtn) {
      e.preventDefault();
      const modal = document.getElementById('login-modal');
      if (modal) {
        modal.classList.add('show');
        modal.querySelector('input[value="user"]').checked = true;
      }
      return;
    }

    // Login admin
    const adminBtn = e.target.closest('#login-admin, .login-admin');
    if (adminBtn) {
      e.preventDefault();
      const modal = document.getElementById('login-modal');
      if (modal) {
        modal.classList.add('show');
        modal.querySelector('input[value="admin"]').checked = true;
      }
      return;
    }
  });

  // Search functionality
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      search(e.target.value.trim());
    }
  });

  // Sticky nav logic
  const navEl = document.querySelector('.nav, .site-header');
  const onScroll = () => {
    if (!navEl) return;
    navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile nav delegation (Unified)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#mobile-open, .mobile-nav-btn, .menu-btn')) {
      e.preventDefault();
      document.getElementById('mobile-drawer')?.classList.add('show');
      document.getElementById('mobile-overlay')?.classList.add('show');
    }
    if (e.target.closest('#mobile-close, #mobile-overlay')) {
      e.preventDefault();
      document.getElementById('mobile-drawer')?.classList.remove('show');
      document.getElementById('mobile-overlay')?.classList.remove('show');
    }
  });

  // Rails arrows
  document.querySelectorAll('.rail').forEach((rail) => {
    const inner = rail.querySelector('.rail-inner');
    rail.querySelector('[data-arrow="left"]')?.addEventListener('click', () => inner.scrollBy({ left: -320, behavior: 'smooth' }));
    rail.querySelector('[data-arrow="right"]')?.addEventListener('click', () => inner.scrollBy({ left: 320, behavior: 'smooth' }));
  });
};

const ensureMobileChrome = () => {
  // create drawer + overlay if missing (safety for pages not updated)
  if (!document.getElementById('mobile-drawer')) {
    const drawer = document.createElement('aside');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobile-drawer';
    drawer.innerHTML = `
      <header>
        <div class="close-row">
          <span class="brand" style="font-size:1.1rem;">MASAYA</span>
          <button class="icon-btn" id="mobile-close" aria-label="Close menu"><i class="fas fa-times"></i></button>
        </div>
      </header>
      <a href="index.html">Home</a>
      <a href="rings.html">Rings</a>
      <a href="necklaces.html">Necklaces</a>
      <a href="earrings.html">Earrings</a>
      <a href="bracelets.html">Bracelets</a>
      <a href="accessories.html">Accessories</a>
      <a href="product.html">Any product</a>`;
    document.body.appendChild(drawer);
  }
  if (!document.getElementById('mobile-overlay')) {
    const ov = document.createElement('div');
    ov.className = 'drawer-overlay';
    ov.id = 'mobile-overlay';
    document.body.appendChild(ov);
  }
  // ensure hamburger exists
  if (!document.getElementById('mobile-open')) {
    const nav = document.querySelector('.nav');
    if (nav) {
      const btn = document.createElement('button');
      btn.className = 'mobile-nav-btn';
      btn.id = 'mobile-open';
      btn.setAttribute('aria-label','Open menu');
      btn.innerHTML = '<i class=\"fas fa-bars\"></i>';
      nav.insertBefore(btn, nav.querySelector('.actions'));
    }
  }
  // bind open/close once
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const openBtn = document.getElementById('mobile-open');
  const closeBtn = document.getElementById('mobile-close');
  const open = () => { drawer?.classList.add('show'); overlay?.classList.add('show'); };
  const close = () => { drawer?.classList.remove('show'); overlay?.classList.remove('show'); };
  if (openBtn && !openBtn.dataset.bound) { openBtn.dataset.bound='1'; openBtn.addEventListener('click', (e)=>{e.preventDefault(); open();}); }
  if (closeBtn && !closeBtn.dataset.bound) { closeBtn.dataset.bound='1'; closeBtn.addEventListener('click', (e)=>{e.preventDefault(); close();}); }
  if (overlay && !overlay.dataset.bound) { overlay.dataset.bound='1'; overlay.addEventListener('click', (e)=>{e.preventDefault(); close();}); }
  if (!document.body.dataset.navDelegated) {
    document.body.dataset.navDelegated='1';
    document.body.addEventListener('click', (e)=>{
      if (e.target.closest('#mobile-open')) { e.preventDefault(); open(); }
      if (e.target.closest('#mobile-close') || e.target.closest('#mobile-overlay')) { e.preventDefault(); close(); }
    });
  }
};

const initPage = () => {
  ensureMobileChrome();
  renderRails();
  renderGridIfAny();
  setCart(state.cart);
  renderCart();
  bindGlobalUI();
};

const initCategory = (category) => {
  ensureMobileChrome();
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const list = catalog.filter((p) => p.category === category);
  renderGrid(grid, list);
  setCart(state.cart);
  renderCart();
  bindGlobalUI();
};

if (!window.NO_AUTO_INIT) {
  initPage();
}
window.Store = { init: initCategory, setCart, bindGlobalUI, ensureLoginModal, ensureCartDrawer, ensureMobileChrome };
