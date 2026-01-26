/**
 * Control de Zoom Manual
 * Simula el zoom del navegador con controles en el panel lateral
 */
class ZoomControls {
  constructor() {
    this.currentZoom = 1; // 100%
    this.minZoom = 0.5;   // 50%
    this.maxZoom = 2.0;   // 200%
    this.step = 0.1;      // Incremento del 10%
    
    this.elements = {
      zoomIn: document.getElementById('zoom-in'),
      zoomOut: document.getElementById('zoom-out'),
      zoomDisplay: document.getElementById('zoom-level')
    };
    
    this.init();
  }
  
  init() {
    // Cargar zoom guardado (opcional)
    const savedZoom = localStorage.getItem('userZoom');
    if (savedZoom) {
      this.currentZoom = parseFloat(savedZoom);
      this.applyZoom();
    }
    
    // Event listeners
    this.elements.zoomIn?.addEventListener('click', () => this.zoomIn());
    this.elements.zoomOut?.addEventListener('click', () => this.zoomOut());
    
    // Atajos de teclado (Ctrl + +/- /0)
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Ctrl + Scroll (opcional)
    document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
  }
  
  zoomIn() {
    if (this.currentZoom < this.maxZoom) {
      this.currentZoom = Math.min(this.currentZoom + this.step, this.maxZoom);
      this.applyZoom();
    }
  }
  
  zoomOut() {
    if (this.currentZoom > this.minZoom) {
      this.currentZoom = Math.max(this.currentZoom - this.step, this.minZoom);
      this.applyZoom();
    }
  }
  
  resetZoom() {
    this.currentZoom = 1;
    this.applyZoom();
  }
  
  applyZoom() {
    // Aplicar zoom al body
    document.body.style.zoom = this.currentZoom;
    
    // Actualizar display
    if (this.elements.zoomDisplay) {
      this.elements.zoomDisplay.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
    
    // Guardar preferencia
    localStorage.setItem('userZoom', this.currentZoom);
    
    // Feedback visual
    this.showFeedback();
  }
  
  showFeedback() {
    // Animación sutil en el display
    this.elements.zoomDisplay?.classList.add('zoom-pulse');
    setTimeout(() => {
      this.elements.zoomDisplay?.classList.remove('zoom-pulse');
    }, 300);
  }
  
  handleKeyboard(e) {
    // Solo si presiona Ctrl/Cmd
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        this.zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        this.resetZoom();
      }
    }
  }
  
  handleWheel(e) {
    // Zoom con Ctrl + Scroll
    if (e.ctrlKey) {
      e.preventDefault();
      
      if (e.deltaY < 0) {
        this.zoomIn();   // Scroll up = zoom in
      } else {
        this.zoomOut();  // Scroll down = zoom out
      }
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.zoomControls = new ZoomControls();
});