gsap.registerPlugin(ScrollTrigger);

class Animations {
  constructor() {
    this.initLoader();
    this.initScrollReveal();
    this.initNavbar();
  }

  initLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.style.display = 'none';

    // Slide out the transition curtain to the right
    const transition = document.querySelector('.page-transition');
    if (transition) {
      setTimeout(() => {
        gsap.to(transition, {
          x: '100%',
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
             this.pageTransitionIn();
             transition.style.display = 'none'; // hide when done
          }
        });
      }, 300); // 300ms showing logo briefly
    } else {
      this.pageTransitionIn();
    }
  }

  pageTransitionIn() {
    // Elegant fade in instead of sliding
    gsap.from('main', { opacity: 0, duration: 0.8, ease: "power2.out" });

    if(document.querySelector('.hero-content h1')) {
      gsap.from('.hero-content h1', { y: 20, opacity: 0, duration: 0.8, delay: 0.2 });
      gsap.from('.hero-content p', { y: 20, opacity: 0, duration: 0.8, delay: 0.4 });
      gsap.from('.hero-btns', { y: 20, opacity: 0, duration: 0.8, delay: 0.6 });
    }
  }

  initScrollReveal() {
    // Subtle float up
    gsap.utils.toArray('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        y: 0,
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    // Subtle fade stagger grid
    gsap.utils.toArray('.product-grid').forEach((grid) => {
      gsap.from(grid.children, {
        scrollTrigger: {
          trigger: grid,
          start: "top 85%"
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
      });
    });
  }

  initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  static triggerPageOut(url) {
    // Elegant left-to-right sliding transition
    const transition = document.querySelector('.page-transition');
    if(transition) {
      transition.style.display = 'flex';
      transition.style.visibility = 'visible';
      gsap.fromTo(transition, { x: '-100%' }, {
        x: '0%', 
        duration: 0.6, 
        ease: "power3.inOut", 
        onComplete: () => {
          window.location.href = url;
        }
      });
    } else {
      window.location.href = url;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.animations = new Animations();

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target && !target.startsWith('http') && !target.startsWith('#')) {
        e.preventDefault();
        Animations.triggerPageOut(target);
      }
    });
  });
});
