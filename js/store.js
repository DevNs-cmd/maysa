// Shared store UI logic for MASAYA emerald storefront
const formatINR = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const Store = (() => {
  const state = {
    category: 'all',
    sort: 'featured',
    priceMax: 52000,
    cart: Number(localStorage.getItem('masaya_cart_count') || 0),
  };

  const els = {};

  const setCart = (n) => {
    state.cart = n;
    localStorage.setItem('masaya_cart_count', String(n));
    document.querySelectorAll('#cart-count').forEach((el) => (el.textContent = n));
  };

  const showToast = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1400);
  };

  const renderFilters = () => {
    if (!els.filterWrap) return;
    const cats = ['all', 'rings', 'necklaces', 'earrings', 'bracelets', 'accessories'];
    els.filterWrap.innerHTML = cats
      .map(
        (c) =>
          `<button class="pill ${state.category === c ? 'active' : ''}" data-cat="${c}">${c
            .charAt(0)
            .toUpperCase()}${c.slice(1)}</button>`
      )
      .join('');
  };

  const applyFilters = () => {
    let list = catalog.filter((p) => p.price <= state.priceMax);
    if (state.category !== 'all') list = list.filter((p) => p.category === state.category);
    switch (state.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        list.sort((a, b) => (b.badge === 'New') - (a.badge === 'New'));
        break;
      default:
        list.sort((a, b) => a.id - b.id);
    }
    renderGrid(list);
  };

  const renderGrid = (list) => {
    if (!els.grid) return;
    els.grid.innerHTML = list
      .map(
        (p) => `
        <article class="card reveal" data-id="${p.id}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          <a href="product.html?id=${p.id}">
            <div class="img-stack">
              <img class="img-primary" src="${p.img}" data-primary="${p.img}" data-secondary="${p.img2 || p.img}" alt="${p.name}">
              <img class="img-secondary" src="${p.img2 || p.img}" alt="${p.name} lifestyle">
            </div>
          </a>
          <div class="card-body">
            <div class="title">${p.name}</div>
            <div class="sub">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
            <div class="price">${formatINR(p.price)}</div>
            <div class="swatches">
              ${(p.swatches || []).map((c) => `<span class="dot" data-primary="${p.img}" data-secondary="${p.img2 || p.img}" style="background:${c}"></span>`).join('')}
            </div>
            <button class="add-btn" data-id="${p.id}">Add to bag</button>
          </div>
        </article>`
      )
      .join('');

    // intersection reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    els.grid.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  };

  const bindEvents = () => {
    els.filterWrap?.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      state.category = pill.dataset.cat;
      renderFilters();
      applyFilters();
    });

    els.sort?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      applyFilters();
    });

    els.price?.addEventListener('input', (e) => {
      state.priceMax = Number(e.target.value);
      if (els.priceLabel) els.priceLabel.textContent = `Up to ${formatINR(state.priceMax)}`;
      applyFilters();
    });

    els.grid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-btn');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const product = catalog.find((p) => p.id === id);
      if (!product) return;
      setCart(state.cart + 1);
      showToast(`${product.name} added to bag`);
    });

    document.getElementById('shop-now')?.addEventListener('click', () =>
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
    );
    document.getElementById('view-rings')?.addEventListener('click', () => {
      state.category = 'rings';
      renderFilters();
      applyFilters();
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const init = (category = 'all') => {
    state.category = category;
    els.filterWrap = document.getElementById('category-filters');
    els.grid = document.getElementById('product-grid');
    els.sort = document.getElementById('sort');
    els.price = document.getElementById('price-max');
    els.priceLabel = document.getElementById('price-label');

    renderFilters();
    applyFilters();
    setCart(state.cart);
    bindEvents();
    // sticky nav state
    const navEl = document.querySelector('.nav');
    const onScroll = () => {
      if (!navEl) return;
      if (window.scrollY > 40) navEl.classList.add('nav-scrolled');
      else navEl.classList.remove('nav-scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // cart drawer
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const openDrawer = () => { drawer?.classList.add('show'); overlay?.classList.add('show'); };
    const closeDrawer = () => { drawer?.classList.remove('show'); overlay?.classList.remove('show'); };
    document.querySelectorAll('#cart-btn').forEach(btn => btn.addEventListener('click', openDrawer));
    overlay?.addEventListener('click', closeDrawer);
    document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);

    // mobile nav drawer (only on index.html, safe-checked)
    const mDrawer = document.getElementById('mobile-drawer');
    const mOverlay = document.getElementById('mobile-overlay');
    const mOpen = document.getElementById('mobile-open');
    const mClose = document.getElementById('mobile-close');
    const openM = () => { mDrawer?.classList.add('show'); mOverlay?.classList.add('show'); };
    const closeM = () => { mDrawer?.classList.remove('show'); mOverlay?.classList.remove('show'); };
    mOpen?.addEventListener('click', openM);
    mClose?.addEventListener('click', closeM);
    mOverlay?.addEventListener('click', closeM);
  };

  return { init, setCart };
})();
    // Swatch hover swaps image
    els.grid.querySelectorAll('.dot').forEach((dot) => {
      dot.addEventListener('mouseenter', (e) => {
        const card = e.target.closest('.card');
        const primary = card.querySelector('.img-primary');
        const secondary = card.querySelector('.img-secondary');
        if (!primary || !secondary) return;
        primary.style.opacity = '0';
        secondary.style.opacity = '1';
      });
      dot.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.card');
        const primary = card.querySelector('.img-primary');
        const secondary = card.querySelector('.img-secondary');
        if (!primary || !secondary) return;
        primary.style.opacity = '1';
        secondary.style.opacity = '0';
      });
    });
