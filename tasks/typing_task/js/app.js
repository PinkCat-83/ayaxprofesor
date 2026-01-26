// ============================================================
// js/app.js
// Orquestador principal - Inicialización y eventos globales
// ============================================================

const App = {
    // Referencias a elementos DOM
    elements: {
        categorySelect: null,
        loadTextBtn: null,
        userInput: null,
        // Toggles de distractores
        starsToggle: null,
        particlesToggle: null,
        waveToggle: null,
        emojiToggle: null,
        stormToggle: null,
        chaosToggle: null, // 😈 NUEVO
        // Panel lateral
        togglePanelBtn: null,
        controlPanel: null,
        // Control de velocidad auto-escritura
        autoTypeSpeedSlider: null,
        autoTypeSpeedValue: null,
        autoTypeSection: null
    },

    // Estado de la aplicación
    state: {
        currentCategory: null,
        isPanelCollapsed: false
    },

    /**
     * Inicialización principal de la aplicación
     */
    async init() {
        //console.log('🚀 Iniciando Mecanografía AI...');

        try {
            // 1. Cachear referencias DOM
            this.cacheElements();

            // 2. Inicializar UI
            UI.init();

            // 3. Cargar categorías disponibles
            UI.showLoading('Cargando categorías...');
            await TextLoader.loadCategories();

            // 4. Poblar selector de categorías
            this.populateCategorySelector();

            // 5. Cargar primera categoría por defecto
            if (TextLoader.categories.length > 0) {
                const firstCategory = TextLoader.categories[0];
                this.state.currentCategory = firstCategory.fileName;
                this.elements.categorySelect.value = firstCategory.fileName;
                await TextLoader.loadCategoryData(firstCategory.fileName);
            } else {
                throw new Error('No hay categorías disponibles');
            }

            // 6. Configurar event listeners
            this.setupEventListeners();

            // 7. Inicializar distractores
            Distractors.stars.init();
            Distractors.wave.init();

            // 8. Cargar primer texto
            await this.loadNewText();

            //console.log('✅ Aplicación iniciada correctamente');

        } catch (error) {
            //console.error('❌ Error al inicializar la aplicación:', error);
            UI.showError('Error al cargar la aplicación. Por favor, recarga la página.');
        }
    },

    /**
     * Cachear referencias a elementos DOM
     */
    cacheElements() {
        this.elements.categorySelect = document.getElementById('category-select');
        this.elements.loadTextBtn = document.getElementById('load-text-btn');
        this.elements.userInput = document.getElementById('user-input');

        // Toggles
        this.elements.starsToggle = document.getElementById('stars-toggle');
        this.elements.particlesToggle = document.getElementById('particles-toggle');
        this.elements.waveToggle = document.getElementById('wave-toggle');
        this.elements.emojiToggle = document.getElementById('emoji-toggle');
        this.elements.stormToggle = document.getElementById('storm-toggle');
        this.elements.chaosToggle = document.getElementById('chaos-toggle'); // 😈 NUEVO

        // Panel
        this.elements.togglePanelBtn = document.getElementById('toggle-panel-btn');
        this.elements.controlPanel = document.getElementById('control-panel');

        // Control de velocidad
        this.elements.autoTypeSpeedSlider = document.getElementById('auto-type-speed');
        this.elements.autoTypeSpeedValue = document.getElementById('auto-type-speed-value');
        this.elements.autoTypeSection = document.getElementById('auto-type-section');
    },

    /**
     * Poblar selector de categorías
     */
    populateCategorySelector() {
        const select = this.elements.categorySelect;
        select.innerHTML = '';

        TextLoader.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.fileName;
            option.textContent = `${category.className} (${category.textCount} textos)`;
            select.appendChild(option);
        });
    },

    /**
     * Configurar todos los event listeners
     */
    setupEventListeners() {
        // Cambio de categoría
        this.elements.categorySelect.addEventListener('change', async (e) => {
            await this.handleCategoryChange(e.target.value);
        });

        // Botón cargar texto
        this.elements.loadTextBtn.addEventListener('click', () => {
            this.loadNewText();
        });

        // Input del usuario (delegar a Game)
        this.elements.userInput.addEventListener('input', (e) => {
            Game.handleInput(e);
        });

        // Teclas especiales en el textarea
        this.elements.userInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Atajo GLOBAL para auto-escritura (funciona sin importar el foco)
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyDown(e);
        });

        // Toggle de panel lateral
        if (this.elements.togglePanelBtn) {
            this.elements.togglePanelBtn.addEventListener('click', () => {
                this.togglePanel();
            });
        }

        // NUEVO: Prevenir copiar/pegar/cortar
        this.elements.userInput.addEventListener('copy', (e) => {
            e.preventDefault();
            //console.log('❌ Copiar deshabilitado');
        });

        this.elements.userInput.addEventListener('paste', (e) => {
            e.preventDefault();
            //console.log('❌ Pegar deshabilitado');
        });

        this.elements.userInput.addEventListener('cut', (e) => {
            e.preventDefault();
            //console.log('❌ Cortar deshabilitado');
        });

        // NUEVO: Prevenir menú contextual (clic derecho)
        this.elements.userInput.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            //console.log('❌ Menú contextual deshabilitado');
        });

        // NUEVO: Prevenir selección de texto
        this.elements.userInput.addEventListener('selectstart', (e) => {
            e.preventDefault();
            //console.log('❌ Selección deshabilitada');
        });

        // NUEVO: Prevenir arrastrar texto
        this.elements.userInput.addEventListener('dragstart', (e) => {
            e.preventDefault();
            //console.log('❌ Arrastrar texto deshabilitado');
        });

        // NUEVO: Bloquear cambios de posición del cursor
        this.elements.userInput.addEventListener('mousedown', (e) => {
            // Solo permitir clic al final del texto
            const textLength = this.elements.userInput.value.length;
            setTimeout(() => {
                this.elements.userInput.setSelectionRange(textLength, textLength);
            }, 0);
        });

        this.elements.userInput.addEventListener('keydown', (e) => {
            // Bloquear teclas de navegación
            const blockedKeys = [
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End', 'PageUp', 'PageDown'
            ];

            if (blockedKeys.includes(e.key)) {
                e.preventDefault();
                //console.log('❌ Navegación deshabilitada');
                return;
            }
        });

        // NUEVO: Forzar cursor siempre al final
        this.elements.userInput.addEventListener('select', (e) => {
            const textLength = e.target.value.length;
            e.target.setSelectionRange(textLength, textLength);
        });

        this.elements.userInput.addEventListener('click', (e) => {
            const textLength = e.target.value.length;
            e.target.setSelectionRange(textLength, textLength);
        });

        // Toggles de distractores
        this.setupDistractorToggles();

        // Control de velocidad de auto-escritura
        this.setupAutoTypeSpeedControl();
    },

    /**
     * Configurar toggles de distractores
     */
    setupDistractorToggles() {
        // Estrellas
        this.elements.starsToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                Distractors.stars.start();
            } else {
                Distractors.stars.stop();
            }
        });

        // Partículas
        this.elements.particlesToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                Distractors.particles.start();
            } else {
                Distractors.particles.stop();
            }
        });

        // Onda
        this.elements.waveToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                Distractors.wave.start();
            } else {
                Distractors.wave.stop();
            }
        });

        // Lluvia de emojis
        this.elements.emojiToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                Distractors.emojiRain.start();
            } else {
                Distractors.emojiRain.stop();
            }
        });

        // Tormenta
        this.elements.stormToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                Distractors.storm.start();
            } else {
                Distractors.storm.stop();
            }
        });

        // 😈 CAOS TOTAL
        if (this.elements.chaosToggle) {
            this.elements.chaosToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    Distractors.chaos.start();
                } else {
                    Distractors.chaos.stop();
                }
            });
        }
    },

    /**
     * Configurar control de velocidad de auto-escritura
     */
    setupAutoTypeSpeedControl() {
        if (!this.elements.autoTypeSpeedSlider) return;

        // Actualizar velocidad cuando cambia el slider
        this.elements.autoTypeSpeedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            Game.autoTypeSpeed = speed;

            // Actualizar el texto mostrado
            if (this.elements.autoTypeSpeedValue) {
                this.elements.autoTypeSpeedValue.textContent = `${speed}ms`;
            }

            // Si está escribiendo, reiniciar con nueva velocidad
            if (Game.isAutoTyping) {
                Game.stopAutoType();
                Game.startAutoType();
            }
        });
    },

    /**
     * Manejar cambio de categoría
     */
    async handleCategoryChange(fileName) {
        if (!fileName) return;

        try {
            UI.showLoading('Cargando categoría...');
            this.state.currentCategory = fileName;
            await TextLoader.loadCategoryData(fileName);

            // Cargar automáticamente un texto de la nueva categoría
            await this.loadNewText();

        } catch (error) {
            //console.error('Error al cambiar categoría:', error);
            UI.showError('Error al cargar la categoría');
        }
    },

    /**
     * Cargar un nuevo texto aleatorio (de CUALQUIER categoría)
     */
    async loadNewText() {
        try {
            // 🎲 Obtener texto aleatorio de CUALQUIER categoría
            const textData = TextLoader.getRandomTextFromAll();

            if (!textData) {
                throw new Error('No se pudo obtener un texto');
            }

            //console.log(`📖 Cargando: "${textData.title}" de "${textData.category}"`);

            // Actualizar el selector de categoría si cambió
            if (textData.categoryFile) {
                this.elements.categorySelect.value = textData.categoryFile;
                this.state.currentCategory = textData.categoryFile;
            }

            // Inicializar el juego con el texto
            Game.init(textData);

            // Auto-colapsar panel en móvil después de cargar
            if (window.innerWidth < 768 && !this.state.isPanelCollapsed) {
                setTimeout(() => this.togglePanel(), 500);
            }

        } catch (error) {
            //console.error('Error al cargar texto:', error);
            UI.showError('Error al cargar el texto. Intenta de nuevo.');
        }
    },

    /**
     * Manejar teclas especiales en el textarea
     */
    handleKeyDown(e) {

        // NUEVO: Bloquear Backspace y Delete
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            //console.log('❌ Borrado deshabilitado');
            return;
        }

        // Si el juego ha terminado y presiona Enter, reiniciar
        if (Game.isFinished && e.key === 'Enter') {
            e.preventDefault();
            this.loadNewText();
        }
    },

    /**
     * Manejar atajos de teclado globales (funcionan sin importar el foco)
     */
    handleGlobalKeyDown(e) {
        // Atajo para auto-escribir (Ctrl + Shift + T)
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            Game.toggleAutoType();
            //console.log('🎯 Atajo detectado globalmente');

            // Mostrar/ocultar sección de control
            this.toggleAutoTypeSection();
        }
    },

    /**
     * Mostrar/ocultar sección de auto-escritura
     */
    toggleAutoTypeSection() {
        if (!this.elements.autoTypeSection) return;

        if (Game.isAutoTyping) {
            this.elements.autoTypeSection.style.display = 'block';
        } else {
            this.elements.autoTypeSection.style.display = 'none';
        }
    },

    /**
     * Toggle del panel lateral
     */
    togglePanel() {
        this.state.isPanelCollapsed = !this.state.isPanelCollapsed;
        this.elements.controlPanel.classList.toggle('collapsed');

        // Cambiar icono del botón
        if (this.elements.togglePanelBtn) {
            this.elements.togglePanelBtn.textContent = this.state.isPanelCollapsed ? '☰' : '✕';
        }

        //console.log(`Panel ${this.state.isPanelCollapsed ? 'colapsado' : 'expandido'}`);
    }
};

// ============================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Manejar resize de ventana
window.addEventListener('resize', () => {
    // Actualizar tamaños de canvas si es necesario
    if (Distractors.stars.renderer) {
        Distractors.stars.renderer.setSize(window.innerWidth, window.innerHeight);
        Distractors.stars.camera.aspect = window.innerWidth / window.innerHeight;
        Distractors.stars.camera.updateProjectionMatrix();
    }

    if (Distractors.wave.canvas) {
        Distractors.wave.canvas.width = window.innerWidth;
        Distractors.wave.canvas.height = window.innerHeight;
    }
});