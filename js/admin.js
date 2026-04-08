(() => {
  const STORAGE_ADMIN_PRODUCTS = 'masaya_admin_products';
  const STORAGE_CART = 'masaya_cart_items';
  const STORAGE_ANALYTICS = 'masaya_admin_stats';

  // seed analytics if missing
  const defaultStats = { impressions: 1280, orders: 46, activeDelivery: 7 };
  const stats = { ...defaultStats, ...(JSON.parse(localStorage.getItem(STORAGE_ANALYTICS) || '{}')) };
  localStorage.setItem(STORAGE_ANALYTICS, JSON.stringify(stats));

  const adminProducts = JSON.parse(localStorage.getItem(STORAGE_ADMIN_PRODUCTS) || '[]');

  const formatINR = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const showToast = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1400);
  };

  const saveProducts = (list) => {
    localStorage.setItem(STORAGE_ADMIN_PRODUCTS, JSON.stringify(list));
  };

  const renderKpis = () => {
    document.getElementById('kpi-imp').textContent = stats.impressions;
    document.getElementById('kpi-orders').textContent = stats.orders;
    document.getElementById('kpi-active').textContent = stats.activeDelivery;
    const lowStock = adminProducts.filter((p) => Number(p.stock || 0) < 5).length;
    document.getElementById('kpi-low').textContent = lowStock;
  };

  const renderProducts = () => {
    const body = document.querySelector('#admin-products tbody');
    body.innerHTML = adminProducts
      .map(
        (p, idx) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${formatINR(p.price)}</td>
          <td>${p.stock || 0}</td>
          <td><button class="icon-btn" data-remove="${idx}" aria-label="Delete"><i class="fas fa-trash"></i></button></td>
        </tr>`
      )
      .join('');
    body.querySelectorAll('[data-remove]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.remove);
        adminProducts.splice(idx, 1);
        saveProducts(adminProducts);
        renderProducts();
        showToast('Product removed');
      })
    );
  };

  const deliveryRoster = [
    { name: 'Arjun', active: true },
    { name: 'Meera', active: false },
    { name: 'Kabir', active: true },
    { name: 'Zoya', active: true },
  ];

  const renderDelivery = () => {
    const body = document.querySelector('#admin-delivery tbody');
    body.innerHTML = deliveryRoster
      .map(
        (d, idx) => `
      <tr>
        <td>${d.name}</td>
        <td><span class="status-dot" style="background:${d.active ? '#1f6a4b' : '#d9d9d9'}"></span> ${d.active ? 'Active' : 'Offline'}</td>
        <td><button class="icon-btn" data-toggle="${idx}" aria-label="Toggle"><i class="fas fa-sync"></i></button></td>
      </tr>`
      )
      .join('');
    body.querySelectorAll('[data-toggle]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.toggle);
        deliveryRoster[idx].active = !deliveryRoster[idx].active;
        renderDelivery();
      })
    );
  };

  const form = document.getElementById('admin-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const newProduct = {
      name: data.name,
      category: data.category,
      price: Number(data.price || 0),
      stock: Number(data.stock || 0),
      img: data.img,
      img2: data.img2 || data.img,
      badge: data.badge || '',
      swatches: ['#e9f5ef', '#1f6a4b', '#d6c59a'],
    };
    adminProducts.push(newProduct);
    saveProducts(adminProducts);
    renderProducts();
    form.reset();
    showToast('Product saved & published');
  });

  document.getElementById('admin-logout')?.addEventListener('click', () => {
    localStorage.removeItem('masaya_role');
    showToast('Logged out');
    setTimeout(() => (window.location.href = 'index.html'), 800);
  });

  // mobile drawer on admin page
  const mDrawer = document.getElementById('mobile-drawer');
  const mOverlay = document.getElementById('mobile-overlay');
  const mOpen = document.getElementById('mobile-open');
  const mClose = document.getElementById('mobile-close');
  const openM = () => { mDrawer?.classList.add('show'); mOverlay?.classList.add('show'); };
  const closeM = () => { mDrawer?.classList.remove('show'); mOverlay?.classList.remove('show'); };
  mOpen?.addEventListener('click', openM);
  mClose?.addEventListener('click', closeM);
  mOverlay?.addEventListener('click', closeM);

  renderKpis();
  renderProducts();
  renderDelivery();
})();
