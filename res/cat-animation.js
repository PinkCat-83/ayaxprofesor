/**
 * Lógica de Animación de Gatos Rebotando
 * Usa HTML5 Canvas para mejor rendimiento
 * ADAPTADO PARA LARAVEL BREEZE
 */

// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('catCanvas');
    
    if (!canvas) {
        console.error('Canvas #catCanvas no encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');

    let width, height;
    let cats = [];

    // Configuración
    const CAT_COUNT = 15; // Cantidad de gatos
    const CAT_SIZE = 60;  // Tamaño base
    const SPEED = 1.5;    // Velocidad de movimiento

    // Definimos la forma del gato usando SVG Path para dibujarlo en canvas
    const catPath = new Path2D("M25,15 L15,5 C15,5 10,15 10,20 C5,20 0,25 0,35 C0,50 15,60 30,60 C45,60 60,50 60,35 C60,25 55,20 50,20 C50,15 45,5 45,5 L35,15 Z");

    class Cat {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * (width - CAT_SIZE);
            this.y = Math.random() * (height - CAT_SIZE);
            this.dx = (Math.random() - 0.5) * SPEED * 2;
            this.dy = (Math.random() - 0.5) * SPEED * 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.scale = 0.5 + Math.random() * 0.5;
            this.opacity = 0.1 + Math.random() * 0.15;
            this.color = `rgba(244, 114, 182, ${this.opacity})`;
        }

        update() {
            // Rebotar en paredes
            if (this.x + this.dx > width - (CAT_SIZE * this.scale) || this.x + this.dx < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.dy > height - (CAT_SIZE * this.scale) || this.y + this.dy < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x + (CAT_SIZE * this.scale)/2, this.y + (CAT_SIZE * this.scale)/2);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            ctx.translate(-(CAT_SIZE * this.scale)/2, -(CAT_SIZE * this.scale)/2);
            
            ctx.fillStyle = this.color;
            ctx.fill(catPath);

            // Ojos sencillos
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
            ctx.beginPath();
            ctx.arc(20, 35, 5, 0, Math.PI * 2);
            ctx.arc(40, 35, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function init() {
        resize();
        cats = [];
        for (let i = 0; i < CAT_COUNT; i++) {
            cats.push(new Cat());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        cats.forEach(cat => {
            cat.update();
            cat.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    
    // Iniciar
    init();
});