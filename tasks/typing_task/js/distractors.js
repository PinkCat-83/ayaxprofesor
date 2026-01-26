// ============================================================
// js/distractors.js
// Efectos visuales de distracción
// ============================================================

const Distractors = {
  
  // ============================================================
  // ESTRELLAS 3D (Three.js)
  // ============================================================
  stars: {
    scene: null,
    camera: null,
    renderer: null,
    starField: null,
    enabled: false,
    rotationSpeed: 0.0005,
    maxSpeed: 0.02,
    animationId: null,
    
    init() {
      //console.log('🌟 Inicializando estrellas 3D...');
      
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) {
        //console.warn('Canvas de estrellas no encontrado');
        return;
      }
      
      // Verificar si Three.js está disponible
      if (typeof THREE === 'undefined') {
        //console.warn('Three.js no está cargado');
        return;
      }
      
      // Scene
      this.scene = new THREE.Scene();
      
      // Camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;
      
      // Renderer
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true 
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Crear estrellas
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(5000 * 3);
      
      for (let i = 0; i < 5000 * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
      });
      
      this.starField = new THREE.Points(geometry, material);
      this.scene.add(this.starField);
      
      //console.log('✅ Estrellas 3D inicializadas');
    },
    
    start() {
      this.enabled = true;
      const canvas = document.getElementById('bg-canvas');
      if (canvas) {
        canvas.classList.remove('hidden');
      }
      this.animate();
      //console.log('🌟 Estrellas activadas');
    },
    
    stop() {
      this.enabled = false;
      const canvas = document.getElementById('bg-canvas');
      if (canvas) {
        canvas.classList.add('hidden');
      }
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      //console.log('🌟 Estrellas desactivadas');
    },
    
    animate() {
      if (!this.enabled) return;
      
      this.animationId = requestAnimationFrame(() => this.animate());
      
      if (this.starField) {
        this.starField.rotation.y += this.rotationSpeed;
        this.starField.rotation.z += this.rotationSpeed * 0.5;
      }
      
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    
    updateSpeed(wpm) {
      // Actualizar velocidad basada en WPM
      const ratio = Math.min(1, wpm / 80);
      this.rotationSpeed = 0.0005 + ratio * (this.maxSpeed - 0.0005);
    }
  },
  
  // ============================================================
  // PARTÍCULAS FLOTANTES
  // ============================================================
  particles: {
    list: [],
    enabled: false,
    animationId: null,
    
    start() {
      this.enabled = true;
      
      // Crear partículas iniciales
      for (let i = 0; i < 30; i++) {
        this.createParticle();
      }
      
      this.animate();
      //console.log('🎉 Partículas activadas');
    },
    
    stop() {
      this.enabled = false;
      
      // Eliminar todas las partículas
      this.list.forEach(particle => particle.remove());
      this.list = [];
      
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      //console.log('🎉 Partículas desactivadas');
    },
    
    createParticle() {
      const particle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        element: null,
        
        init() {
          this.element = document.createElement('div');
          this.element.className = 'particle';
          this.element.style.backgroundColor = this.color;
          this.element.style.left = this.x + 'px';
          this.element.style.top = this.y + 'px';
          document.body.appendChild(this.element);
        },
        
        update() {
          this.x += this.vx;
          this.y += this.vy;
          
          // Rebotar en bordes
          if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
          if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
          
          this.element.style.left = this.x + 'px';
          this.element.style.top = this.y + 'px';
        },
        
        remove() {
          if (this.element) {
            this.element.remove();
          }
        }
      };
      
      particle.init();
      this.list.push(particle);
      return particle;
    },
    
    animate() {
      if (!this.enabled) return;
      
      this.animationId = requestAnimationFrame(() => this.animate());
      
      this.list.forEach(particle => particle.update());
    }
  },
  
  // ============================================================
  // EFECTO ONDA
  // ============================================================
  wave: {
    canvas: null,
    ctx: null,
    enabled: false,
    offset: 0,
    y: 0,
    direction: 1,
    animationId: null,
    
    init() {
      //console.log('🌊 Inicializando onda...');
      
      this.canvas = document.getElementById('wave-canvas');
      if (!this.canvas) {
        //console.warn('Canvas de onda no encontrado');
        return;
      }
      
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.y = this.canvas.height / 2;
      
      //console.log('✅ Onda inicializada');
    },
    
    start() {
      this.enabled = true;
      if (this.canvas) {
        this.canvas.classList.add('active');
      }
      this.y = this.canvas.height / 2;
      this.draw();
      //console.log('🌊 Onda activada');
    },
    
    stop() {
      this.enabled = false;
      if (this.canvas) {
        this.canvas.classList.remove('active');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      //console.log('🌊 Onda desactivada');
    },
    
    draw() {
      if (!this.enabled || !this.ctx) return;
      
      this.animationId = requestAnimationFrame(() => this.draw());
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Cambiar estilo de onda cada 2 segundos
      const waveStyle = Math.floor(Date.now() / 2000) % 3;
      
      if (waveStyle === 0) {
        // Onda única gruesa
        this.ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
        this.ctx.lineWidth = 5;
      } else if (waveStyle === 1) {
        // Múltiples ondas delgadas
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
      } else {
        // Onda distorsionada
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.35)';
        this.ctx.lineWidth = 4;
      }
      
      this.ctx.beginPath();
      
      for (let x = 0; x < this.canvas.width; x += 3) {
        let y;
        if (waveStyle === 1) {
          y = this.y + Math.sin((x + this.offset) * 0.02) * 30 
            + Math.sin((x + this.offset * 2) * 0.05) * 15;
        } else if (waveStyle === 2) {
          y = this.y + Math.sin((x + this.offset) * 0.03) * 40 
            * (1 + Math.sin(this.offset * 0.01) * 0.5);
        } else {
          y = this.y + Math.sin((x + this.offset) * 0.025) * 50;
        }
        
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.stroke();
      
      // Mover onda verticalmente
      this.y += this.direction * 2;
      if (this.y > this.canvas.height - 100 || this.y < 100) {
        this.direction *= -1;
      }
      
      this.offset += 3;
    }
  },
  
  // ============================================================
  // LLUVIA DE EMOJIS
  // ============================================================
  emojiRain: {
    enabled: false,
    interval: null,
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
             '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐦', '🦅',
             '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌',
             '🐞', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞',
             '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅'],
    
    start() {
      this.enabled = true;
      this.interval = setInterval(() => this.createEmoji(), 300);
      //console.log('🐱 Lluvia de emojis activada');
    },
    
    stop() {
      this.enabled = false;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      // Limpiar emojis existentes
      document.querySelectorAll('.emoji-rain').forEach(e => e.remove());
      //console.log('🐱 Lluvia de emojis desactivada');
    },
    
    createEmoji() {
      if (!this.enabled) return;
      
      const emoji = document.createElement('div');
      emoji.className = 'emoji-rain';
      emoji.textContent = this.emojis[Math.floor(Math.random() * this.emojis.length)];
      emoji.style.left = Math.random() * window.innerWidth + 'px';
      emoji.style.top = '-50px';
      document.body.appendChild(emoji);
      
      const duration = 3000 + Math.random() * 2000;
      const startTime = Date.now();
      
      const fall = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1 && this.enabled) {
          emoji.style.top = (progress * window.innerHeight) + 'px';
          requestAnimationFrame(fall);
        } else {
          emoji.remove();
        }
      };
      
      fall();
    }
  },
  
  // ============================================================
  // TORMENTA (Lluvia + Truenos) - OPTIMIZADA
  // ============================================================
  storm: {
    enabled: false,
    raindrops: [],
    rainInterval: null,
    thunderTimeout: null,
    animationId: null,
    maxRaindrops: 150, // 🔧 Límite de gotas en pantalla
    
    start() {
      this.enabled = true;
      
      const rainOverlay = document.getElementById('rain-overlay');
      if (rainOverlay) {
        rainOverlay.classList.add('active');
      }
      
      // 🔧 Reducido de 50ms a 100ms y creamos menos gotas por intervalo
      this.rainInterval = setInterval(() => this.createRain(), 100);
      this.animate();
      this.triggerThunder();
      
      //console.log('⚡ Tormenta activada');
    },
    
    stop() {
      this.enabled = false;
      
      const rainOverlay = document.getElementById('rain-overlay');
      if (rainOverlay) {
        rainOverlay.classList.remove('active');
      }
      
      if (this.rainInterval) {
        clearInterval(this.rainInterval);
        this.rainInterval = null;
      }
      
      if (this.thunderTimeout) {
        clearTimeout(this.thunderTimeout);
        this.thunderTimeout = null;
      }
      
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      // Limpiar gotas
      this.raindrops.forEach(drop => drop.remove());
      this.raindrops = [];
      
      //console.log('⚡ Tormenta desactivada');
    },
    
    createRain() {
      if (!this.enabled) return;
      
      // 🔧 Solo crear gotas si no superamos el límite
      if (this.raindrops.length >= this.maxRaindrops) return;
      
      // 🔧 Reducido de 50 a 15 gotas por intervalo
      const numDrops = 15;
      
      for (let i = 0; i < numDrops; i++) {
        const raindrop = {
          x: Math.random() * window.innerWidth,
          y: -20,
          speed: 15 + Math.random() * 10,
          element: null,
          
          init() {
            this.element = document.createElement('div');
            this.element.className = 'raindrop';
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            document.body.appendChild(this.element);
          },
          
          update() {
            this.y += this.speed;
            this.element.style.top = this.y + 'px';
            
            if (this.y > window.innerHeight) {
              return false;
            }
            return true;
          },
          
          remove() {
            if (this.element && this.element.parentNode) {
              this.element.remove();
            }
          }
        };
        
        raindrop.init();
        this.raindrops.push(raindrop);
      }
    },
    
    animate() {
      if (!this.enabled) return;
      
      this.animationId = requestAnimationFrame(() => this.animate());
      
      // 🔧 Actualizar y filtrar gotas en una sola pasada
      this.raindrops = this.raindrops.filter(drop => {
        const isAlive = drop.update();
        if (!isAlive) {
          drop.remove();
        }
        return isAlive;
      });
    },
    
    triggerThunder() {
      if (!this.enabled) return;
      
      const thunderFlash = document.getElementById('thunder-flash');
      if (thunderFlash) {
        thunderFlash.classList.add('active');
        
        // Sonido de trueno (Web Audio API)
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(30 + Math.random() * 70, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.3);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
          //console.warn('Audio no disponible:', e);
        }
        
        setTimeout(() => {
          thunderFlash.classList.remove('active');
        }, 300);
      }
      
      // Próximo trueno en 3-8 segundos
      if (this.enabled) {
        this.thunderTimeout = setTimeout(() => this.triggerThunder(), 3000 + Math.random() * 5000);
      }
    }
  },
  
  // ============================================================
  // 😈 CAOS TOTAL - EL MÁS MOLESTO DE TODOS (INTENSO)
  // ============================================================
  chaos: {
    enabled: false,
    intervals: [],
    timeouts: [],
    elements: [],
    isMirrored: false,
    currentRotation: 0,
    currentScale: 1,
    
    start() {
      this.enabled = true;
      this.isMirrored = false;
      this.currentRotation = 0;
      this.currentScale = 1;
      
      // 1. 🎨 Cambio de colores aleatorios del fondo (MÁS RÁPIDO)
      this.intervals.push(setInterval(() => {
        if (!this.enabled) return;
        const hue = Math.random() * 360;
        document.body.style.transition = 'background-color 0.2s';
        document.body.style.backgroundColor = `hsla(${hue}, 60%, 12%, 0.4)`;
      }, 800)); // ⚡ 2000ms → 800ms
      
      // 2. 🔄 Rotación y transformaciones INTENSAS de la pantalla
      this.intervals.push(setInterval(() => {
        if (!this.enabled) return;
        this.applyRandomTransform();
      }, 1200)); // ⚡ 3000ms → 1200ms + más variedad
      
      // 2.5 🪞 EFECTO ESPEJO aleatorio (NUEVO)
      this.intervals.push(setInterval(() => {
        if (!this.enabled) return;
        // 30% de probabilidad de activar/desactivar espejo
        if (Math.random() < 0.3) {
          this.toggleMirror();
        }
      }, 2000)); // Cada 2 segundos puede cambiar
      
      // 3. 💥 Explosiones de texto aleatorio (MÁS FRECUENTES)
      this.intervals.push(setInterval(() => {
        this.createTextExplosion();
      }, 600)); // ⚡ 1500ms → 600ms
      
      // 4. 👻 Imágenes fantasma que persiguen el cursor (MÁS INTENSAS)
      this.startGhostCursor();
      
      // 5. 📏 Zoom pulsante más agresivo
      this.intervals.push(setInterval(() => {
        if (!this.enabled) return;
        this.currentScale = 0.9 + Math.random() * 0.25; // ⚡ 0.9 a 1.15 (antes 0.95-1.05)
        this.applyTransform();
      }, 1000)); // ⚡ 2500ms → 1000ms
      
      // 6. 🌀 Elementos giratorios flotantes (MÁS CAOS)
      this.intervals.push(setInterval(() => {
        this.createSpinningShape();
      }, 400)); // ⚡ 1000ms → 400ms
      
      // 7. 📢 Mensajes molestos aleatorios (MÁS FRECUENTES)
      this.intervals.push(setInterval(() => {
        this.showAnnoyingMessage();
      }, 2000)); // ⚡ 4000ms → 2000ms
      
      // 8. 🌪️ Efectos especiales súper molestos (NUEVO)
      this.intervals.push(setInterval(() => {
        this.createSpecialChaos();
      }, 3000));
      
      console.log('😈💀 ¡CAOS TOTAL EXTREMO ACTIVADO! ¡MUCHA SUERTE!');
    },
    
    applyRandomTransform() {
      // Rotación más agresiva
      this.currentRotation = (Math.random() - 0.5) * 20; // ⚡ ±10 grados (antes ±2.5)
      this.applyTransform();
    },
    
    toggleMirror() {
      this.isMirrored = !this.isMirrored;
      this.applyTransform();
      
      if (this.isMirrored) {
        console.log('🪞 ¡MODO ESPEJO ACTIVADO!');
      } else {
        console.log('🪞 Modo espejo desactivado');
      }
    },
    
    applyTransform() {
      const main = document.querySelector('.app-container');
      if (!main) return;
      
      main.style.transition = 'transform 0.4s ease';
      
      let transform = `rotate(${this.currentRotation}deg) scale(${this.currentScale})`;
      
      // Añadir espejo si está activo
      if (this.isMirrored) {
        transform += ' scaleX(-1)';
      }
      
      main.style.transform = transform;
    },
    
    stop() {
      this.enabled = false;
      
      // Limpiar intervalos
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals = [];
      
      // Limpiar timeouts
      this.timeouts.forEach(timeout => clearTimeout(timeout));
      this.timeouts = [];
      
      // Limpiar elementos del DOM
      this.elements.forEach(el => el.remove());
      this.elements = [];
      
      // Limpiar elementos por clase
      document.querySelectorAll('.chaos-text, .chaos-shape, .chaos-message, .ghost-cursor, .chaos-overlay').forEach(e => e.remove());
      
      // Restaurar estilos
      document.body.style.backgroundColor = '';
      document.body.style.transition = '';
      const main = document.querySelector('.app-container');
      if (main) {
        main.style.transform = '';
        main.style.transition = '';
      }
      
      this.isMirrored = false;
      this.currentRotation = 0;
      this.currentScale = 1;
      
      console.log('😌 Caos desactivado... por ahora');
    },
    
    createTextExplosion() {
      if (!this.enabled) return;
      
      const messages = [
        '😵', '💫', '⚡', '💥', '🌟', '❌', '⭐', '🔥',
        '¡ERROR!', '¡BOOM!', '¡ZAP!', '¡POW!', 'WOW', 'OOPS',
        'a', 'b', 'c', 'x', 'y', 'z', '123', '???', '!!!',
        '🎯', '💀', '👀', '🤪', '😱', '🌀', '💣', '🎪', ' 😸 Meow~~', '😻 Miau'
      ];
      
      // ⚡ Más explosiones (de 8 a 15)
      for (let i = 0; i < 15; i++) {
        const el = document.createElement('div');
        el.className = 'chaos-text';
        el.textContent = messages[Math.floor(Math.random() * messages.length)];
        el.style.cssText = `
          position: fixed;
          left: ${Math.random() * window.innerWidth}px;
          top: ${Math.random() * window.innerHeight}px;
          font-size: ${25 + Math.random() * 50}px;
          font-weight: bold;
          color: hsl(${Math.random() * 360}, 100%, 65%);
          pointer-events: none;
          z-index: 9999;
          animation: chaosTextExplode ${0.5 + Math.random() * 0.7}s ease-out forwards;
          text-shadow: 0 0 15px currentColor, 0 0 30px currentColor;
        `;
        document.body.appendChild(el);
        this.elements.push(el);
        
        this.timeouts.push(setTimeout(() => el.remove(), 1200));
      }
    },
    
    startGhostCursor() {
      let lastX = 0, lastY = 0;
      
      const ghostInterval = setInterval(() => {
        if (!this.enabled) {
          clearInterval(ghostInterval);
          return;
        }
        
        // ⚡ Crear más rastros (cada 50ms en vez de 100ms)
        const ghost = document.createElement('div');
        ghost.className = 'ghost-cursor';
        ghost.style.cssText = `
          position: fixed;
          left: ${lastX}px;
          top: ${lastY}px;
          width: ${15 + Math.random() * 20}px;
          height: ${15 + Math.random() * 20}px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            hsla(${Math.random() * 360}, 100%, 60%, 0.8), 
            transparent);
          pointer-events: none;
          z-index: 9998;
          animation: ghostFade ${0.6 + Math.random() * 0.4}s ease-out forwards;
        `;
        document.body.appendChild(ghost);
        
        this.timeouts.push(setTimeout(() => ghost.remove(), 1000));
      }, 50); // ⚡ 100ms → 50ms (el doble de rastros)
      
      const mouseMoveHandler = (e) => {
        if (this.enabled) {
          lastX = e.clientX;
          lastY = e.clientY;
        }
      };
      
      document.addEventListener('mousemove', mouseMoveHandler);
      this.intervals.push(ghostInterval);
      
      // Limpiar evento cuando se desactive
      const checkInterval = setInterval(() => {
        if (!this.enabled) {
          document.removeEventListener('mousemove', mouseMoveHandler);
          clearInterval(checkInterval);
        }
      }, 500);
    },
    
    createSpinningShape() {
      if (!this.enabled) return;
      
      const shapes = ['⬛', '⬜', '🔶', '🔷', '🔸', '🔹', '⭕', '❌', '⭐', '💠',
                      '🎯', '💥', '⚡', '🌀', '🔥', '💫', '✨', '🌟'];
      const el = document.createElement('div');
      el.className = 'chaos-shape';
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${-50}px;
        font-size: ${35 + Math.random() * 40}px;
        pointer-events: none;
        z-index: 9999;
        animation: chaosSpin ${2 + Math.random() * 1.5}s linear forwards;
        filter: drop-shadow(0 0 10px currentColor);
      `;
      document.body.appendChild(el);
      this.elements.push(el);
      
      this.timeouts.push(setTimeout(() => el.remove(), 3500));
    },
    
    showAnnoyingMessage() {
      if (!this.enabled) return;
      
      const messages = [
        '🤪 ¿Puedes concentrarte?',
        '😵‍💫 ¡Ups! ¿Te distraigo?',
        '🎯 ¡Mira aquí!',
        '👀 ¡No mires!',
        '🎪 ¡Circo mode ON!',
        '🌈 ¡Colorines!',
        '⚡ ¡MODO CAOS!',
        '🎲 Suerte con eso...',
        '🔮 ¿Lees al revés?',
        '💫 ¡GIRA TODO!',
        '🔥 ¡Esto es INTENSO!',
        '💀 ¡CAOS EXTREMO!',
        '🌀 ¡Todo da vueltas!',
        '😱 ¿AÚN ESCRIBIENDO?',
        ' 🙊🙉🙈 ¡Mira detrás de ti, un mono de tres cabezas!'
      ];
      
      const el = document.createElement('div');
      el.className = 'chaos-message';
      el.textContent = messages[Math.floor(Math.random() * messages.length)];
      el.style.cssText = `
        position: fixed;
        left: 50%;
        top: ${10 + Math.random() * 70}%;
        transform: translateX(-50%) rotate(${(Math.random() - 0.5) * 15}deg);
        background: linear-gradient(135deg, 
          hsl(${Math.random() * 360}, 80%, 50%), 
          hsl(${Math.random() * 360}, 80%, 40%));
        color: white;
        padding: 18px 35px;
        border-radius: 20px;
        font-size: ${22 + Math.random() * 10}px;
        font-weight: bold;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 15px 40px rgba(0,0,0,0.6), 0 0 20px currentColor;
        animation: chaosMessageBounce 0.3s ease-out, chaosMessageFade 1.5s ease-out forwards;
      `;
      document.body.appendChild(el);
      this.elements.push(el);
      
      this.timeouts.push(setTimeout(() => el.remove(), 1500));
    },
    
    // 🌪️ NUEVO: Efectos especiales súper molestos
    createSpecialChaos() {
      if (!this.enabled) return;
      
      const effects = [
        () => this.flashOverlay(),
        () => this.shakeScreen(),
        () => this.invertColors(),
        () => this.createTextWall()
      ];
      
      // Ejecutar efecto aleatorio
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      randomEffect();
    },
    
    flashOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'chaos-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
          hsla(${Math.random() * 360}, 100%, 50%, 0.3),
          hsla(${Math.random() * 360}, 100%, 50%, 0.3));
        pointer-events: none;
        z-index: 9997;
        animation: chaosFlash 0.5s ease-out forwards;
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 500);
    },
    
    shakeScreen() {
      const main = document.querySelector('.app-container');
      if (!main) return;
      
      let shakeCount = 0;
      const shakeInterval = setInterval(() => {
        const randomX = (Math.random() - 0.5) * 30;
        const randomY = (Math.random() - 0.5) * 30;
        main.style.transform = `translate(${randomX}px, ${randomY}px)`;
        
        shakeCount++;
        if (shakeCount >= 10) {
          clearInterval(shakeInterval);
          this.applyTransform();
        }
      }, 50);
    },
    
    invertColors() {
      const main = document.querySelector('.app-container');
      if (!main) return;
      
      main.style.filter = 'invert(1) hue-rotate(180deg)';
      setTimeout(() => {
        main.style.filter = '';
      }, 800);
    },
    
    createTextWall() {
      const wall = document.createElement('div');
      wall.className = 'chaos-overlay';
      wall.textContent = '█'.repeat(200);
      wall.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 40px;
        color: hsla(${Math.random() * 360}, 100%, 50%, 0.4);
        word-wrap: break-word;
        pointer-events: none;
        z-index: 9997;
        animation: chaosTextWall 1.5s ease-out forwards;
        line-height: 0.8;
      `;
      document.body.appendChild(wall);
      setTimeout(() => wall.remove(), 1500);
    }
  }
};