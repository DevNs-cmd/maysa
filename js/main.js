document.addEventListener('DOMContentLoaded', () => {

  const createProductCard = (product) => {
    return `
      <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
        <div class="card-ribbons">
            <div class="ribbon-light">New</div>
            <div class="ribbon-dark">Exclusive</div>
        </div>
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">${formatPrice(product.price)}</p>
          <button class="add-to-cart-btn btn-outline" style="width: 100%; border-radius: 20px; font-size: 0.8rem;" data-id="${product.id}" onclick="event.stopPropagation()">Add to Cart</button>
        </div>
      </div>
    `;
  };

  // Search System
  const searchTrigger = document.getElementById('search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const toggleSearch = () => searchOverlay.classList.toggle('active');
  
  if (searchTrigger) searchTrigger.onclick = toggleSearch;
  if (searchClose) searchClose.onclick = toggleSearch;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (q.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      ).slice(0, 6);

      searchResults.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="location.href='product.html?id=${p.id}'">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p>${p.category.toUpperCase()} • ${formatPrice(p.price)}</p>
          </div>
        </div>
      `).join('');
    });
  }

  // Optimized Home Page Grid Logic
  const featuredGrid = document.getElementById('featured-grid');
  const categoryTabs = document.querySelectorAll('.category-tab');

  const renderFeatured = (cat = 'bracelets') => {
    if (!featuredGrid) return;
    const filtered = products.filter(p => 
      cat === 'all' ? true : p.category === cat.toLowerCase()
    ).slice(0, 4);
    
    featuredGrid.innerHTML = filtered.map(createProductCard).join('');
    gsap.from(featuredGrid.children, { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 });
  };

  if (categoryTabs.length > 0) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderFeatured(tab.textContent.trim());
      });
    });
    // Initial Render
    renderFeatured('bracelets');
  }

  // Standard Grids
  const menGrid = document.getElementById('men-grid');
  if (menGrid) {
    const menItems = products.filter(p => p.category === 'watches').slice(0, 8);
    menGrid.innerHTML = menItems.map(createProductCard).join('');
  }

  const mangalGrid = document.getElementById('mangal-grid');
  if (mangalGrid) {
    const mangalItems = products.filter(p => p.category === 'mangalsutra' || p.category === 'necklaces').slice(0, 8);
    mangalGrid.innerHTML = mangalItems.map(createProductCard).join('');
  }

  // Shop Page Logic
  const shopGrid = document.getElementById('shop-grid');
  if (shopGrid) {
    let currentCategory = 'all';
    let currentBrand = 'all';
    let currentSort = 'popular';
    
    const renderShop = () => {
      let filtered = [...products];

      // Filtering
      if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
      }
      if (currentBrand !== 'all') {
        filtered = filtered.filter(p => p.brand === currentBrand);
      }

      // Sorting
      if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else {
        filtered.sort((a, b) => b.rating - a.rating); // popular
      }

      shopGrid.innerHTML = filtered.map(createProductCard).join('');
      
      // Re-initialize scroll animations on new items if needed
      gsap.from(shopGrid.children, { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 });
    };

    renderShop();

    // Filters event listeners
    const categoryBtns = document.querySelectorAll('.filter-category');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.filter;
        renderShop();
      });
    });

    const sortSelect = document.getElementById('sort-options');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderShop();
      });
    }

    // Initial animation
    gsap.from('.sidebar', { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" });
  }

  // Product Detail Page Logic
  const productContainer = document.getElementById('product-detail-container');
  if (productContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id')) || 1; // Default to 1 if no id
    
    const product = products.find(p => p.id === id);
    if(product) {
      document.title = `${product.name} | Masaya`;
      
      const mainImage = document.getElementById('main-image');
      if (mainImage) mainImage.src = product.image;

      document.getElementById('product-brand').textContent = product.brand.toUpperCase();
      document.getElementById('product-title').textContent = product.name;
      document.getElementById('product-price').textContent = formatPrice(product.price);
      document.getElementById('product-desc').textContent = product.description;
      
      const reviewStars = document.getElementById('product-reviews');
      if (reviewStars) {
        reviewStars.innerHTML = `★ ${product.rating} (${product.reviews} reviews)`;
      }

      const addBtn = document.getElementById('pd-add-to-cart');
      if (addBtn) addBtn.dataset.id = product.id;

      // Image Zoom Logic
      const imgWrapper = document.getElementById('img-zoom-wrapper');
      if(imgWrapper && mainImage) {
        imgWrapper.addEventListener('mousemove', (e) => {
          const rect = imgWrapper.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          mainImage.style.transformOrigin = `${(x/rect.width)*100}% ${(y/rect.height)*100}%`;
          mainImage.style.transform = 'scale(2)';
        });
        imgWrapper.addEventListener('mouseleave', () => {
          mainImage.style.transformOrigin = 'center center';
          mainImage.style.transform = 'scale(1)';
        });
      }

      // Re-trigger reveal animation for dynamic content
      if (typeof gsap !== 'undefined') {
          gsap.from('.product-details-content > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 });
      }
    }
  }

  // Mobile Nav Toggle Logic
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileMenuBtn && mobileNavOverlay && mobileNavClose) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    mobileNavClose.addEventListener('click', () => {
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

});
