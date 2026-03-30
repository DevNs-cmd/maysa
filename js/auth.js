class Auth {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('masaya_user')) || null;
    this.init();
  }

  init() {
    this.setupModal();
    this.updateUI();
  }

  setupModal() {
    // Create Modal HTML and inject to body
    const modalHTML = `
      <div id="auth-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 25, 25, 0.8); backdrop-filter: blur(10px); z-index: 10000; align-items: center; justify-content: center;">
        <div class="glass-panel" style="width: 100%; max-width: 400px; padding: 2.5rem; position: relative;">
          <button id="close-auth" class="icon-btn" style="position: absolute; top: 1rem; right: 1rem;"><i class="fas fa-times"></i></button>
          
          <div id="login-form">
            <h2 style="text-align: center; margin-bottom: 2rem;">Welcome Back</h2>
            <form onsubmit="return false">
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--color-gold); font-size: 0.9rem;">Email</label>
                <input type="email" id="login-email" class="form-input" required style="width: 100%; padding: 0.8rem; background: rgba(248, 245, 240, 0.05); border: 1px solid var(--glass-border); color: var(--color-white); border-radius: 8px; outline: none;">
              </div>
              <div style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--color-gold); font-size: 0.9rem;">Password</label>
                <input type="password" id="login-password" class="form-input" required style="width: 100%; padding: 0.8rem; background: rgba(248, 245, 240, 0.05); border: 1px solid var(--glass-border); color: var(--color-white); border-radius: 8px; outline: none;">
              </div>
              <button type="submit" id="submit-login" class="btn-primary" style="width: 100%; margin-bottom: 1rem;">Sign In</button>
              <p style="text-align: center; color: var(--color-text-muted); font-size: 0.9rem;">
                New to Masaya? <a href="#" id="toggle-signup" style="color: var(--color-gold);">Create Account</a>
              </p>
            </form>
          </div>

          <div id="signup-form" style="display: none;">
            <h2 style="text-align: center; margin-bottom: 2rem;">Create Account</h2>
            <form onsubmit="return false">
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--color-gold); font-size: 0.9rem;">Full Name</label>
                <input type="text" id="signup-name" class="form-input" required style="width: 100%; padding: 0.8rem; background: rgba(248, 245, 240, 0.05); border: 1px solid var(--glass-border); color: var(--color-white); border-radius: 8px; outline: none;">
              </div>
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--color-gold); font-size: 0.9rem;">Email</label>
                <input type="email" id="signup-email" class="form-input" required style="width: 100%; padding: 0.8rem; background: rgba(248, 245, 240, 0.05); border: 1px solid var(--glass-border); color: var(--color-white); border-radius: 8px; outline: none;">
              </div>
              <div style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--color-gold); font-size: 0.9rem;">Password</label>
                <input type="password" id="signup-password" class="form-input" required style="width: 100%; padding: 0.8rem; background: rgba(248, 245, 240, 0.05); border: 1px solid var(--glass-border); color: var(--color-white); border-radius: 8px; outline: none;">
              </div>
              <button type="submit" id="submit-signup" class="btn-primary" style="width: 100%; margin-bottom: 1rem;">Register</button>
              <p style="text-align: center; color: var(--color-text-muted); font-size: 0.9rem;">
                Already have an account? <a href="#" id="toggle-login" style="color: var(--color-gold);">Sign In</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('auth-modal');
    
    // Auth Trigger
    document.querySelectorAll('.auth-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.user) {
          // Logout logic
          this.logout();
        } else {
          modal.style.display = 'flex';
          gsap.fromTo(modal.firstElementChild, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
        }
      });
    });

    // Close Modal
    document.getElementById('close-auth').addEventListener('click', () => {
      gsap.to(modal.firstElementChild, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => { modal.style.display = 'none'; }});
    });

    // Toggle forms
    document.getElementById('toggle-signup').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('signup-form').style.display = 'block';
    });

    document.getElementById('toggle-login').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    });

    // Handle Login
    document.getElementById('submit-login').addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      if (email) {
        this.login(email.split('@')[0]);
        modal.style.display = 'none';
      }
    });

    // Handle Signup
    document.getElementById('submit-signup').addEventListener('click', () => {
      const name = document.getElementById('signup-name').value;
      if (name) {
        this.login(name);
        modal.style.display = 'none';
      }
    });

    // Focus input styles logic
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--color-gold)';
        input.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.2)';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = 'var(--glass-border)';
        input.style.boxShadow = 'none';
      });
    });
  }

  login(name) {
    this.user = { name };
    localStorage.setItem('masaya_user', JSON.stringify(this.user));
    this.updateUI();
    if(window.cart) cart.showNotification(`Welcome back, ${name}!`);
  }

  logout() {
    this.user = null;
    localStorage.removeItem('masaya_user');
    this.updateUI();
    if(window.cart) cart.showNotification('Logged out successfully.');
  }

  updateUI() {
    const authIcons = document.querySelectorAll('.auth-trigger');
    authIcons.forEach(icon => {
      if (this.user) {
        icon.innerHTML = `<i class="fas fa-sign-out-alt"></i><span style="font-size: 0.8rem; margin-left: 0.5rem; font-family: var(--font-sans); color: var(--color-gold);">${this.user.name}</span>`;
        icon.title = "Logout";
      } else {
        icon.innerHTML = `<i class="fas fa-user"></i>`;
        icon.title = "Login / Signup";
      }
    });
  }
}

// Ensure auth is initialized on load
document.addEventListener('DOMContentLoaded', () => {
  window.auth = new Auth();
});
