document.addEventListener('DOMContentLoaded', () => {
    // --- REGISTER GSAP PLUGINS ---
    gsap.registerPlugin(ScrollTrigger);

    // --- SYSTEM STATE ---
    const state = {
        cart: JSON.parse(localStorage.getItem('masaya_cart')) || [],
        isNavScrolled: false
    };

    // --- UTILITIES ---
    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);

    // --- CUSTOM CURSOR SYSTEM ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let ballX = 0, ballY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth lag follow using GSAP ticker
        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
            ballX += (mouseX - ballX) * dt;
            ballY += (mouseY - ballY) * dt;
            
            gsap.set(cursor, { 
                x: ballX - (cursor.offsetWidth / 2), 
                y: ballY - (cursor.offsetHeight / 2) 
            });
        });

        // Hover states
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .product-card, .category-block, .nav-icon')) {
                cursor.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .product-card, .category-block, .nav-icon')) {
                cursor.classList.remove('hovering');
            }
        });
    }

    // --- SCROLL PROGRESS & NAVBAR ---
    const scrollIndicator = document.getElementById('scroll-indicator');
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollIndicator) scrollIndicator.style.width = scrolled + "%";

        if (winScroll > 40 && !state.isNavScrolled) {
            navbar.classList.add('scrolled');
            navbar.style.top = '20px';
            state.isNavScrolled = true;
        } else if (winScroll <= 40 && state.isNavScrolled) {
            navbar.classList.remove('scrolled');
            navbar.style.top = '44px';
            state.isNavScrolled = false;
        }
    });

    // --- HERO SLIDER (SWIPER + ANTIGRAVITY) ---
    const heroSwiper = new Swiper('.mainHeroSwiper', {
        loop: true,
        speed: 1200,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: { delay: 6000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
        on: {
            slideChangeTransitionStart: function () {
                const activeSlide = this.slides[this.activeIndex];
                animateSlideContent(activeSlide);
            }
        }
    });

    function animateSlideContent(slide) {
        // Word Reveal Animation
        const words = slide.querySelectorAll('.word-reveal span');
        gsap.set(words, { y: '110%' });
        gsap.to(words, {
            y: '0%',
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            delay: 0.2
        });

        // Subtext & CTA
        const subtext = slide.querySelector('p');
        const cta = slide.querySelector('.hero-cta');
        gsap.fromTo([subtext, cta], 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
        );
    }

    // Initial Trigger
    animateSlideContent(heroSwiper.slides[heroSwiper.activeIndex]);

    // Antigravity Parallax (Mouse move on Hero)
    const heroSection = document.querySelector('.hero-slider');
    const productLayers = document.querySelectorAll('.hero-product-layer');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 2;
            const yPos = (clientY / window.innerHeight - 0.5) * 2;

            productLayers.forEach(layer => {
                gsap.to(layer, {
                    duration: 0.9,
                    rotateY: xPos * 12,
                    rotateX: -yPos * 12,
                    x: xPos * 20,
                    y: yPos * 20,
                    ease: 'power2.out'
                });
            });
        });

        // Idle Float
        productLayers.forEach(layer => {
            gsap.to(layer, {
                y: '-=15',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        // Scroll Parallax for Product
        window.addEventListener('scroll', () => {
             const scrolled = window.scrollY;
             gsap.to(productLayers, { y: scrolled * -0.12, overwrite: 'auto' });
        });
    }

    // --- REVEAL ANIMATIONS (SCROLL TRIGGER) ---
    const revealTitles = document.querySelectorAll('.reveal-title');
    revealTitles.forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => title.classList.add('active')
        });
    });

    const parallaxImgs = document.querySelectorAll('.parallax-img');
    parallaxImgs.forEach(img => {
        gsap.to(img, {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // --- TOAST SYSTEM ---
    const showToast = (message) => {
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div class="toast" id="${toastId}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17L4 12" />
                </svg>
                <span>${message}</span>
            </div>
        `;
        const container = document.getElementById('toast-system');
        container.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastEl = document.getElementById(toastId);
        setTimeout(() => toastEl.classList.add('active'), 100);
        
        setTimeout(() => {
            toastEl.classList.remove('active');
            setTimeout(() => toastEl.remove(), 500);
        }, 3000);
    };

    // --- PRODUCT CARD SYSTEM ---
    const featuredGrid = document.getElementById('featured-grid');

    const urlParams = new URLSearchParams(window.location.search);
    const catFilter = urlParams.get('cat');

    const renderProducts = (targetEl) => {
        if (!targetEl) return;
        
        const isShop = targetEl.id === 'shop-grid';
        const displayProducts = (isShop && catFilter) 
            ? products.filter(p => p.category === catFilter) 
            : (isShop ? products : products.slice(0, 4));

        targetEl.innerHTML = displayProducts.map((p, index) => {
            const isOOS = p.stock === 0;
            const isNew = p.id === 1 || p.id === 5;
            const lifestyleImg = p.imageHover || p.image;

            return `
                <div class="product-card" onclick="location.href='product.html?id=${p.id}'" data-id="${p.id}">
                    <div class="card-badges">
                        ${isNew ? '<span class="badge badge-new">New In</span>' : ''}
                        ${isOOS ? '<span class="badge badge-oos">Sold Out</span>' : ''}
                    </div>
                    <button class="btn-wishlist" onclick="event.stopPropagation(); this.classList.toggle('active')">
                        <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1.1 1 7.7 7.8 7.7-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                    </button>
                    <div class="card-image-wrapper">
                        <img src="${p.image}" alt="${p.name}" class="img-primary">
                        <img src="${lifestyleImg}" alt="${p.name}" class="img-lifestyle">
                    </div>
                    <div class="card-info">
                        <div class="card-variants">
                            ${(p.variants || []).map(v => `<div class="color-swatch" style="background:${v.hex}" data-variant-img="${p.image}"></div>`).join('')}
                        </div>
                        <h3 class="card-title">${p.name}</h3>
                        <div class="card-price">
                             <span class="price-current">${formatPrice(p.price)}</span>
                             ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
                        </div>
                        <button class="quick-add-btn" data-id="${p.id}" ${isOOS ? 'disabled' : ''} onclick="event.stopPropagation(); window.addToCart(${p.id})">
                            ${isOOS ? 'Notify Me' : 'Quick Add'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Real-time Swatch Hover
        targetEl.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                const card = this.closest('.product-card');
                const primaryImg = card.querySelector('.img-primary');
                // For demo, we just pulsate the image or we could swap src if we had per-variant images
                primaryImg.style.transform = 'scale(1.08)';
            });
            swatch.addEventListener('mouseout', function() {
                const card = this.closest('.product-card');
                const primaryImg = card.querySelector('.img-primary');
                primaryImg.style.transform = 'scale(1)';
            });
        });

        // Stagger reveal on cards
        gsap.from(targetEl.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: targetEl,
                start: 'top 85%',
            }
        });
    };

    // --- BRAND LOAD ANIMATION ---
    const brand = document.querySelector('.nav-brand');
    if (brand) {
        gsap.fromTo(brand, 
            { opacity: 0, letterSpacing: '20px' }, 
            { opacity: 1, letterSpacing: '8px', duration: 1.4, ease: 'power4.out', delay: 0.5 }
        );
    }

    // --- MEGA MENU PREVIEW SWAP ---
    const megaLinks = document.querySelectorAll('.mega-col a');
    const megaPreviewImg = document.getElementById('mega-preview-img');
    
    const previewMap = {
        'rings': 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
        'earrings': 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800',
        'bracelets': 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
        'necklaces': 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800'
    };

    megaLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            const url = new URL(link.href);
            const cat = url.searchParams.get('cat');
            if (cat && previewMap[cat] && megaPreviewImg) {
                megaPreviewImg.src = previewMap[cat];
                gsap.fromTo(megaPreviewImg, { opacity: 0.8, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.6 });
            }
        });
    });

    renderProducts(featuredGrid);
    renderProducts(document.getElementById('shop-grid'));

    // --- CART SYSTEM ---
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        state.cart.push(product);
        localStorage.setItem('masaya_cart', JSON.stringify(state.cart));
        
        showToast(`${product.name} added to selection`);
        updateCartUI();
    };

    const updateCartUI = () => {
        const pulseDot = document.querySelector('.cart-pulse-dot');
        if (state.cart.length > 0) {
            pulseDot.style.display = 'block';
        } else {
            pulseDot.style.display = 'none';
        }
    };

    updateCartUI();

    // --- CART DRAWER ---
    const cartTrigger = document.getElementById('cart-trigger');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const closeCart = document.getElementById('close-cart');

    const toggleCart = () => {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : 'auto';
    };

    if (cartTrigger) cartTrigger.onclick = toggleCart;
    if (closeCart) closeCart.onclick = toggleCart;
    if (cartOverlay) cartOverlay.onclick = toggleCart;

    // --- AMBIENT ORB ANIMATION ---
    gsap.to('.orb-1', { 
        x: 50, y: 30, 
        duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' 
    });
    gsap.to('.orb-2', { 
        x: -40, y: -20, 
        duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' 
    });

    // --- PAGE TRANSITION ---
    const overlay = document.querySelector('.page-transition-overlay');
    window.addEventListener('beforeunload', () => {
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
    });
    window.addEventListener('load', () => {
        gsap.to(overlay, { opacity: 0, duration: 0.3 });
    });

});
