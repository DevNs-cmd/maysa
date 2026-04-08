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
    // search
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        search(e.target.value.trim());
      }
    });

    // sticky nav
    const navEl = document.querySelector('.nav');
    const onScroll = () => {
      if (!navEl) return;
      navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // cart drawer
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const openDrawer = () => { drawer?.classList.add('show'); overlay?.classList.add('show'); };
    const closeDrawer = () => { drawer?.classList.remove('show'); overlay?.classList.remove('show'); };
    document.querySelectorAll('#cart-btn').forEach((btn) => btn.addEventListener('click', openDrawer));
    overlay?.addEventListener('click', closeDrawer);
    document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);

    // mobile nav
    const mDrawer = document.getElementById('mobile-drawer');
    const mOverlay = document.getElementById('mobile-overlay');
    const mOpen = document.getElementById('mobile-open');
    const mClose = document.getElementById('mobile-close');
    const openM = () => { mDrawer?.classList.add('show'); mOverlay?.classList.add('show'); };
    const closeM = () => { mDrawer?.classList.remove('show'); mOverlay?.classList.remove('show'); };
    mOpen?.addEventListener('click', openM);
    mClose?.addEventListener('click', closeM);
    mOverlay?.addEventListener('click', closeM);

    // rails arrows
    document.querySelectorAll('.rail').forEach((rail) => {
      const inner = rail.querySelector('.rail-inner');
      rail.querySelector('[data-arrow="left"]')?.addEventListener('click', () => inner.scrollBy({ left: -320, behavior: 'smooth' }));
      rail.querySelector('[data-arrow="right"]')?.addEventListener('click', () => inner.scrollBy({ left: 320, behavior: 'smooth' }));
    });

    // login/admin
    const userBtn = document.getElementById('login-user');
    const adminBtn = document.getElementById('login-admin');
    const adminForm = document.getElementById('admin-form');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.getElementById('admin-close');
    userBtn?.addEventListener('click', () => { state.role = 'user'; localStorage.setItem('masaya_role', 'user'); showToast('Signed in as user'); });
    adminBtn?.addEventListener('click', () => adminModal?.classList.add('show'));
    adminClose?.addEventListener('click', () => adminModal?.classList.remove('show'));
    adminForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(adminForm));
      if (data.secret !== ADMIN_KEY) {
        showToast('Wrong secret key');
        return;
      }
      state.role = 'admin';
      localStorage.setItem('masaya_role', 'admin');
      // add product
      const newProduct = {
        name: data.name,
        category: data.category,
        price: Number(data.price || 0),
        img: data.img,
        img2: data.img2 || data.img,
        badge: data.badge || '',
        swatches: ['#e9f5ef', '#1f6a4b', '#d6c59a'],
      };
      const stored = JSON.parse(localStorage.getItem(STORAGE_ADMIN_PRODUCTS) || '[]');
      stored.push(newProduct);
      localStorage.setItem(STORAGE_ADMIN_PRODUCTS, JSON.stringify(stored));
      window.location.reload();
    });
  };

const initPage = () => {
  renderRails();
  renderGridIfAny();
  setCart(state.cart);
  renderCart();
  bindGlobalUI();
};

const initCategory = (category) => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const list = catalog.filter((p) => p.category === category);
  renderGrid(grid, list);
  setCart(state.cart);
  renderCart();
  bindGlobalUI();
};

initPage();
window.Store = { init: initCategory, setCart };
