document.addEventListener('DOMContentLoaded', () => {
  // --- DATA ---
  const products = [
    {
      id: 1,
      name: 'Torsade Pave Ring',
      category: 'rings',
      color: 'white',
      stone: 'white',
      design: 'torsade',
      price: 29700,
      badge: 'New',
      chips: ['Sterling silver', 'White zirconia'],
      image: 'https://images.pexels.com/photos/2675323/pexels-photo-2675323.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 0
    },
    {
      id: 2,
      name: 'Geometric Pave Ring',
      category: 'rings',
      color: 'yellow',
      stone: 'white',
      design: 'geometric',
      price: 33000,
      chips: ['Yellow vermeil', 'Pave zirconia'],
      image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 1
    },
    {
      id: 3,
      name: 'Lumiere Pave Necklace',
      category: 'necklaces',
      color: 'white',
      stone: 'white',
      design: 'lumiere',
      price: 40700,
      chips: ['Adjustable chain', 'Signature sparkle'],
      image: 'https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 2
    },
    {
      id: 4,
      name: 'Lumiere Pave Earrings',
      category: 'earrings',
      color: 'white',
      stone: 'white',
      design: 'lumiere',
      price: 19800,
      chips: ['Everyday size', 'Lightweight'],
      image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 3
    },
    {
      id: 5,
      name: 'Lilac Lumiere Pave Bracelet',
      category: 'bracelets',
      color: 'lavender',
      stone: 'purple',
      design: 'lumiere',
      price: 35200,
      badge: 'Limited',
      chips: ['Lavender lacquer', 'Pave zirconia'],
      image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 4
    },
    {
      id: 6,
      name: 'Triple Pave Ear Cuff',
      category: 'earrings',
      color: 'white',
      stone: 'white',
      design: 'artdeco',
      price: 11000,
      chips: ['No piercing', 'Stack friendly'],
      image: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 5
    },
    {
      id: 7,
      name: 'Pave Heart Necklace',
      category: 'necklaces',
      color: 'yellow',
      stone: 'white',
      design: 'artdeco',
      price: 28600,
      chips: ['Heart motif', 'Adjustable drop'],
      image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 6
    },
    {
      id: 8,
      name: 'Double Chain Pave Bracelet',
      category: 'bracelets',
      color: 'rose',
      stone: 'white',
      design: 'torsade',
      price: 26400,
      chips: ['Rose vermeil', 'Layered look'],
      image: 'https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=1200',
      order: 7
    }
  ];

  // --- STATE ---
  const state = {
    sort: 'featured',
    cartCount: parseInt(localStorage.getItem('masaya_printemps_cart') || '0', 10)
  };

  // --- ELEMENTS ---
  const gridEl = document.getElementById('product-grid');
  const resultCountEl = document.getElementById('result-count');
  const sortSelect = document.getElementById('sort-select');
  const overlay = document.getElementById('overlay');
  const filtersPanel = document.getElementById('filters');
  const cartCountEls = document.querySelectorAll('#cart-count');

  // --- HELPERS ---
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const getChecked = (filterKey) =>
    Array.from(document.querySelectorAll(`[data-filter="${filterKey}"] input:checked`)).map((input) => input.value);

  const priceBandMatches = (price, bands) => {
    if (bands.length === 0) return true;
    return bands.some((band) => {
      if (band === 'low') return price <= 20000;
      if (band === 'mid') return price > 20000 && price <= 40000;
      if (band === 'high') return price > 40000;
      return true;
    });
  };

  const applyFilters = () => {
    const selected = {
      category: getChecked('category'),
      color: getChecked('color'),
      stone: getChecked('stone'),
      price: getChecked('price'),
      design: getChecked('design')
    };

    const filtered = products.filter((p) => {
      const matchCategory = selected.category.length ? selected.category.includes(p.category) : true;
      const matchColor = selected.color.length ? selected.color.includes(p.color) : true;
      const matchStone = selected.stone.length ? selected.stone.includes(p.stone) : true;
      const matchDesign = selected.design.length ? selected.design.includes(p.design) : true;
      const matchPrice = priceBandMatches(p.price, selected.price);
      return matchCategory && matchColor && matchStone && matchDesign && matchPrice;
    });

    render(sortProducts(filtered));
    closeFilters();
  };

  const sortProducts = (list) => {
    const sorted = [...list];
    switch (state.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        sorted.sort((a, b) => b.order - a.order);
        break;
      default:
        sorted.sort((a, b) => a.order - b.order);
    }
    return sorted;
  };

  const render = (list) => {
    if (!gridEl) return;
    gridEl.innerHTML = list
      .map((p) => {
        const badge = p.badge ? `<span class="badge">${p.badge}</span>` : '';
        const chips = (p.chips || []).map((c) => `<span class="chip">${c}</span>`).join('');
        return `
          <article class="product-card" data-id="${p.id}">
            <div class="card-img">
              ${badge}
              <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="card-body">
              <h3 class="card-title">${p.name}</h3>
              <div class="card-price">${formatPrice(p.price)}</div>
              <div class="chip-row">${chips}</div>
              <button class="add-btn primary" data-id="${p.id}">Add to bag</button>
            </div>
          </article>
        `;
      })
      .join('');

    resultCountEl.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
  };

  const updateCartCount = () => {
    cartCountEls.forEach((el) => {
      el.textContent = state.cartCount;
    });
  };

  const openFilters = () => {
    filtersPanel.classList.add('open');
    overlay.classList.add('active');
  };

  const closeFilters = () => {
    filtersPanel.classList.remove('open');
    overlay.classList.remove('active');
  };

  const clearFilters = () => {
    document.querySelectorAll('.pill-group input:checked').forEach((input) => (input.checked = false));
    applyFilters();
  };

  // --- EVENT BINDINGS ---
  document.getElementById('apply-filters')?.addEventListener('click', applyFilters);
  document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
  document.getElementById('filter-toggle')?.addEventListener('click', openFilters);
  document.getElementById('close-filters')?.addEventListener('click', closeFilters);
  overlay?.addEventListener('click', closeFilters);

  sortSelect?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFilters();
  });

  gridEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (!id) return;
    state.cartCount += 1;
    localStorage.setItem('masaya_printemps_cart', state.cartCount.toString());
    updateCartCount();
    btn.textContent = 'Added';
    setTimeout(() => (btn.textContent = 'Add to bag'), 1200);
  });

  // --- INIT ---
  applyFilters(); // renders with default filters (none)
  updateCartCount();
});
