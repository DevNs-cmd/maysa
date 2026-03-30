// Setup Three.js minimal particle effects & floating 3D elements
class ThreeBG {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });

    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.position.z = 5;

    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create soft gold glowing particles
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    this.particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleMesh);

    // Watch placeholder (simplified metallic toruses representing gears)
    const heroContainer = document.getElementById('hero-3d');
    if (heroContainer) {
      this.group = new THREE.Group();
      
      const geo1 = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
      const mat1 = new THREE.MeshStandardMaterial({ 
        color: 0xD4AF37, 
        metalness: 0.8, 
        roughness: 0.2 
      });
      const ring1 = new THREE.Mesh(geo1, mat1);
      
      const geo2 = new THREE.TorusGeometry(1.2, 0.08, 16, 100);
      const mat2 = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF, 
        metalness: 0.9, 
        roughness: 0.1 
      });
      const ring2 = new THREE.Mesh(geo2, mat2);
      ring2.rotation.y = Math.PI / 2;

      this.group.add(ring1);
      this.group.add(ring2);
      
      // Add lighting for metallic effect
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      const pointLight = new THREE.PointLight(0xD4AF37, 1);
      pointLight.position.set(2, 3, 4);
      
      this.scene.add(ambientLight);
      this.scene.add(pointLight);
      this.scene.add(this.group);
    }

    // Handle mouse move for parallax
    this.mouseX = 0;
    this.mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Rotate particles slowly
    this.particleMesh.rotation.y += 0.001;
    this.particleMesh.rotation.x += 0.0005;

    // Follow mouse lightly for parallax
    this.particleMesh.rotation.y += this.mouseX * 0.005;
    this.particleMesh.rotation.x += this.mouseY * 0.005;

    if (this.group) {
      this.group.rotation.x += 0.005;
      this.group.rotation.y += 0.005;
      
      // Move 3D watch placeholder with mouse parallax
      this.group.position.x += (this.mouseX * 0.5 - this.group.position.x) * 0.05;
      this.group.position.y += (-this.mouseY * 0.5 - this.group.position.y) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThreeBG();
});
