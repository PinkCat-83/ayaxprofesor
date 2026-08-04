// ============================================================
// js/ui.js
// Manipulación del DOM y renderizado de elementos
// ============================================================

const UI = {
    elements: {
        targetText: null,
        textTitle: null,
        userInput: null,
        wpm: null,
        cpm: null,
        errors: null,
        errorPercent: null,
        timer: null,
        expectedKey: null,
        lastKey: null
    },

    /**
     * Inicializar y cachear referencias a elementos DOM
     */
    init() {
        //console.log('🎨 Inicializando UI...');

        this.elements.targetText = document.getElementById('target-text');
        this.elements.textTitle = document.getElementById('text-title');
        this.elements.userInput = document.getElementById('user-input');
        this.elements.wpm = document.getElementById('wpm');
        this.elements.cpm = document.getElementById('cpm');
        this.elements.errors = document.getElementById('errors');
        this.elements.errorPercent = document.getElementById('error-percent');
        this.elements.timer = document.getElementById('timer');
        this.elements.expectedKey = document.getElementById('expected-key');
        this.elements.lastKey = document.getElementById('last-key');

        // Verificar que todos los elementos existen
        const missingElements = [];
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                missingElements.push(key);
            }
        }

        if (missingElements.length > 0) {
            //console.warn('⚠️ Elementos DOM no encontrados:', missingElements);
        } else {
            //console.log('✅ UI inicializada correctamente');
        }
    },

    /**
     * Actualizar el título del texto
     * @param {string} title - Título a mostrar
     */
    updateTextTitle(title) {
        if (this.elements.textTitle) {
            this.elements.textTitle.textContent = title ? `📖 ${title}` : '';
        }
    },

    /**
     * Renderizar el texto objetivo con spans individuales para cada carácter
     * @param {string} text - Texto a renderizar
     */
    renderTargetText(text) {
        if (!this.elements.targetText) return;

        let html = '';

        // Crear span por cada carácter
        text.split('').forEach((char, index) => {
            const isCurrent = index === 0 ? 'current' : '';
            const display = char === '\n' ? '↵' : char;
            const br = char === '\n' ? '<br>' : '';
            const dataAttr = char === '\n' ? 'data-char="newline"' : '';
            html += `<span id="char-${index}" class="${isCurrent}" ${dataAttr}>${display}</span>${br}`;
        });

        this.elements.targetText.innerHTML = html;
        this.elements.targetText.scrollTop = 0;

        //console.log(`✅ Texto renderizado: ${text.length} caracteres`);
    },

    /**
     * Actualizar los valores visuales de las métricas
     * @param {Object} metricsData - Objeto con wpm, cpm, errors, errorPercent, time
     */
    updateMetricsDisplay(metricsData) {
        if (this.elements.wpm) {
            this.elements.wpm.textContent = metricsData.wpm || 0;
        }
        if (this.elements.cpm) {
            this.elements.cpm.textContent = metricsData.cpm || 0;
        }
        if (this.elements.errors) {
            this.elements.errors.textContent = metricsData.errors || 0;
        }
        if (this.elements.errorPercent) {
            this.elements.errorPercent.textContent = metricsData.errorPercent || '0%';
        }
        if (this.elements.timer) {
            this.elements.timer.textContent = metricsData.time || 0;
        }
    },

    /**
     * Resaltar un carácter específico
     * @param {number} index - Índice del carácter
     * @param {string} className - Clase CSS a aplicar ('current', 'correct', 'incorrect')
     */
    highlightChar(index, className) {
        const charElement = document.getElementById(`char-${index}`);
        if (charElement) {
            charElement.className = className;
        }
    },

    /**
     * Remover clase de un carácter
     * @param {number} index - Índice del carácter
     * @param {string} className - Clase a remover
     */
    removeCharClass(index, className) {
        const charElement = document.getElementById(`char-${index}`);
        if (charElement) {
            charElement.classList.remove(className);
        }
    },

    /**
     * Añadir clase a un carácter
     * @param {number} index - Índice del carácter
     * @param {string} className - Clase a añadir
     */
    addCharClass(index, className) {
        const charElement = document.getElementById(`char-${index}`);
        if (charElement) {
            charElement.classList.add(className);
        }
    },

    /**
     * Contar caracteres con una clase específica
     * @param {string} className - Nombre de la clase a contar
     * @returns {number} Cantidad de elementos con esa clase
     */
    countCharsWithClass(className) {
        if (!this.elements.targetText) return 0;

        const elements = this.elements.targetText.querySelectorAll(`span.${className}`);
        return elements.length;
    },

    /**
     * Mostrar estado de carga
     * @param {string} message - Mensaje a mostrar
     */
    showLoading(message = 'Cargando...') {
        if (!this.elements.targetText) return;

        // Limpiar título
        this.updateTextTitle('');

        this.elements.targetText.innerHTML = `
      <div class="loading-state">
        <div class="loader"></div>
        <span class="loading-text">${message}</span>
      </div>
    `;
    },

    /**
     * Mostrar error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        if (!this.elements.targetText) return;

        // Limpiar título
        this.updateTextTitle('');

        this.elements.targetText.innerHTML = `
      <div class="error-state" style="text-align: center; color: #f87171; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <div style="font-size: 1.2rem;">${message}</div>
      </div>
    `;
    },

    /**
 * Mostrar pantalla de finalización con estadísticas
 * @param {Object} finalStats - Estadísticas finales
 */
showFinishScreen(finalStats) {
    if (!this.elements.targetText) return;

    this.elements.targetText.innerHTML = `<div class="finish-container"><div class="finish-emoji">🎉</div><h2 class="finish-title">¡PRUEBA COMPLETADA!</h2><div class="finish-stats-grid"><div class="finish-stat wpm"><div class="finish-stat-label">Palabras PM</div><div class="finish-stat-value">${finalStats.wpm}</div></div><div class="finish-stat cpm"><div class="finish-stat-label">Pulsaciones PM</div><div class="finish-stat-value">${finalStats.cpm}</div></div><div class="finish-stat errors"><div class="finish-stat-label">% Errores</div><div class="finish-stat-value">${finalStats.errorPercent}</div></div><div class="finish-stat accuracy"><div class="finish-stat-label">Precisión</div><div class="finish-stat-value">${finalStats.accuracy}</div></div></div><div class="finish-time">⏱️ Tiempo: ${finalStats.time}s</div><div class="finish-continue">Presiona Enter para continuar</div></div>`;
    
    this.elements.targetText.scrollTop = 0;
},

    /**
     * Limpiar el área de entrada
     */
    clearInput() {
        if (this.elements.userInput) {
            this.elements.userInput.value = '';
        }
    },

    /**
     * Enfocar el área de entrada
     */
    focusInput() {
        if (this.elements.userInput) {
            this.elements.userInput.focus();
        }
    },

    /**
     * Deshabilitar área de entrada
     */
    disableInput() {
        if (this.elements.userInput) {
            this.elements.userInput.disabled = true;
        }
    },

    /**
     * Habilitar área de entrada
     */
    enableInput() {
        if (this.elements.userInput) {
            this.elements.userInput.disabled = false;
        }
    },

    /**
     * Obtener elemento de carácter por índice
     * @param {number} index - Índice del carácter
     * @returns {HTMLElement|null}
     */
    getCharElement(index) {
        return document.getElementById(`char-${index}`);
    },

    /**
     * Formatear un carácter para mostrarlo en las cajas de feedback de tecla
     * @param {string|null|undefined} char - Carácter a formatear
     * @returns {string}
     */
    formatKeyDisplay(char) {
        if (char === null || char === undefined) return '–';
        if (char === '\n') return '↵';
        if (char === ' ') return '␣';
        return char;
    },

    /**
     * Actualizar la caja que muestra la tecla que se espera pulsar
     * @param {string|null|undefined} char - Carácter esperado
     */
    setExpectedKey(char) {
        if (!this.elements.expectedKey) return;
        this.elements.expectedKey.textContent = this.formatKeyDisplay(char);
    },

    /**
     * Actualizar la caja que muestra la última tecla pulsada
     * @param {string|null|undefined} char - Carácter pulsado (null para estado neutro)
     * @param {boolean} isCorrect - Si la tecla pulsada fue correcta
     */
    setLastKey(char, isCorrect) {
        if (!this.elements.lastKey) return;
        const el = this.elements.lastKey;

        el.textContent = this.formatKeyDisplay(char);
        el.classList.remove('key-box--correct', 'key-box--incorrect', 'key-box--neutral');

        if (char === null || char === undefined) {
            el.classList.add('key-box--neutral');
            return;
        }

        if (isCorrect) {
            el.classList.add('key-box--correct');
            return;
        }

        // Error: forzar el reinicio de la animación de sacudida en CADA
        // pulsación incorrecta, incluso si se repite la misma tecla
        // consecutivamente (si no, la clase ya estaría puesta y CSS no
        // relanzaría la animación).
        el.classList.remove('key-box--incorrect');
        void el.offsetWidth; // fuerza reflow para reiniciar la animación
        el.classList.add('key-box--incorrect');
    },

    /**
     * Reiniciar el panel de feedback de tecla a su estado inicial
     */
    resetKeyFeedback() {
        this.setExpectedKey(null);
        this.setLastKey(null);
    }
};