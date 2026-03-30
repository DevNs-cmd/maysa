class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('masaya_cart')) || [];
    this.init();
  }

  init() {
    this.updateCartCount();
    this.renderCartItems();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add to cart buttons everywhere
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const id = parseInt(e.target.dataset.id);
        if(!isNaN(id)) {
          this.addItem(id);
          this.showNotification('Item added to cart!');
        }
      }
    });

    // Remove buttons in cart page
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
      cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
          const id = parseInt(e.target.dataset.id);
          this.removeItem(id);
        } else if (e.target.classList.contains('qty-btn')) {
          const id = parseInt(e.target.dataset.id);
          const currentQty = this.items.find(i => i.id === id).quantity;
          const newQty = e.target.dataset.action === 'plus' ? currentQty + 1 : currentQty - 1;
          this.updateQuantity(id, newQty);
        }
      });
    }
  }

  addItem(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = this.items.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.updateCartCount();
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    this.updateCartCount();
    this.renderCartItems();
  }

  updateQuantity(id, quantity) {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }
    
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
      this.renderCartItems();
      this.updateCartCount();
    }
  }

  saveCart() {
    localStorage.setItem('masaya_cart', JSON.stringify(this.items));
  }

  updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach(el => {
      el.textContent = total;
      // Animate count change
      gsap.fromTo(el, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
    });
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const summaryTotal = document.getElementById('cart-summary-total');
    
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart reveal-up">
          <h3>Your cart is empty</h3>
          <p>Discover our exclusive collections</p>
          <a href="shop.html" class="btn-primary" style="margin-top: 1rem;">Shop Now</a>
        </div>
      `;
      if(summaryTotal) summaryTotal.textContent = '$0';
      return;
    }

    container.innerHTML = this.items.map(item => `
      <div class="cart-item glass-panel reveal-up" style="display: flex; gap: 2rem; padding: 1.5rem; margin-bottom: 1.5rem; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">
        <div class="cart-item-details" style="flex: 1;">
          <h4 style="margin-bottom: 0.5rem; font-family: var(--font-sans); color: var(--color-emerald-dark);">${item.name}</h4>
          <span style="color: var(--color-gold); font-family: var(--font-serif); font-size: 1.2rem;">${formatPrice(item.price)}</span>
        </div>
        <div class="cart-item-qty" style="display: flex; align-items: center; gap: 1rem;">
          <button class="icon-btn qty-btn" data-id="${item.id}" data-action="minus" style="font-size: 1.5rem;">-</button>
          <span style="font-size: 1.2rem; min-width: 20px; text-align: center;">${item.quantity}</span>
          <button class="icon-btn qty-btn" data-id="${item.id}" data-action="plus" style="font-size: 1.5rem;">+</button>
        </div>
        <div class="cart-item-total" style="width: 120px; text-align: right;">
          <span style="color: var(--color-emerald-dark); font-weight: bold;">${formatPrice(item.price * item.quantity)}</span>
        </div>
        <button class="icon-btn remove-item" data-id="${item.id}" style="color: #ff4444;" title="Remove Item">
          <i class="fas fa-trash remove-item" data-id="${item.id}" style="pointer-events: none;"></i>
        </button>
      </div>
    `).join('');

    if (summaryTotal) {
      const total = this.getTotalPrice();
      summaryTotal.textContent = formatPrice(total);
      
      // Also update subtotal if exists
      const subtotal = document.getElementById('cart-subtotal');
      if (subtotal) subtotal.textContent = formatPrice(total);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'glass-panel';
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 2rem;
      color: var(--color-gold);
      z-index: 9999;
      transform: translateY(100px);
      opacity: 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    gsap.to(notification, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        setTimeout(() => {
          gsap.to(notification, {
            y: 50,
            opacity: 0,
            duration: 0.3,
            onComplete: () => notification.remove()
          });
        }, 3000);
      }
    });
  }
}

// Initialize cart globally
const cart = new Cart();
