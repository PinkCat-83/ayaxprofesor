// ============================================================
// js/game.js
// Lógica principal del juego de mecanografía
// ============================================================

const Game = {
    // Estado del juego
    targetText: "",
    isFinished: false,
    textData: null,

    // NUEVO: Estado de auto-escritura
    autoTypeInterval: null,
    isAutoTyping: false,
    autoTypeSpeed: 20, // milisegundos entre caracteres (ajustable)

    /**
     * Inicializar juego con un texto específico
     * @param {Object} textData - Datos del texto (id, title, text, category)
     */
    init(textData) {
        //console.log(`🎮 Iniciando juego: "${textData.title}"`);

        this.textData = textData;
        this.isFinished = false;
        this.targetText = textData.text;

        // Detener auto-escritura si estaba activa
        this.stopAutoType();

        // Resetear métricas
        Metrics.reset();

        // Actualizar título
        UI.updateTextTitle(textData.title);

        // Renderizar texto objetivo
        UI.renderTargetText(this.targetText);

        // Limpiar y habilitar input
        UI.clearInput();
        UI.enableInput();
        UI.focusInput();
    },

    /**
     * Manejar entrada del usuario
     * @param {Event} event - Evento de input
     */
    handleInput(event) {
        // Si el juego ha terminado, no procesar
        if (this.isFinished) return;

        const typedText = event.target.value;

        // Iniciar timer si es el primer carácter
        if (typedText.length === 1 && !Metrics.isTyping) {
            Metrics.startTimer();
        }

        // Manejar borrado
        /*
        if (event.inputType === 'deleteContentBackward') {
            this.handleBackspace(typedText.length);
            return;
        }
            */

        // Validar carácter actual
        const currentPosition = typedText.length - 1;
        const targetChar = this.targetText[currentPosition];
        const typedChar = typedText[currentPosition];

        // Bloquear Enter si no corresponde
        if (targetChar === '\n' && typedChar !== '\n') {
            const charElement = UI.getCharElement(currentPosition);
            if (charElement) {
                this.shakeElement(charElement);
            }
            event.target.value = typedText.slice(0, -1);
            return;
        }

        // Validar carácter
        const isCorrect = this.validateChar(typedChar, targetChar, currentPosition);

        if (!isCorrect) {
            // Error: marcar y borrar
            const charElement = UI.getCharElement(currentPosition);
            if (charElement && !charElement.dataset.errorLogged) {
                Metrics.incrementErrors();
                charElement.dataset.errorLogged = 'true';
            }
            if (charElement) {
                this.shakeElement(charElement);
            }
            event.target.value = typedText.slice(0, -1);
        } else {
            // Correcto: marcar y avanzar
            UI.highlightChar(currentPosition, 'correct');
            const nextChar = UI.getCharElement(currentPosition + 1);
            if (nextChar) {
                UI.addCharClass(currentPosition + 1, 'current');
            }

            // Verificar si terminó el texto
            if (typedText.length === this.targetText.length) {
                this.finish();
            }
        }

        // Actualizar métricas
        Metrics.updateMetrics();
    },

    /**
     * Manejar tecla de retroceso
     * @param {number} currentLength - Longitud actual del texto escrito
     */
    handleBackspace(currentLength) {
        const pos = currentLength;
        const currentChar = UI.getCharElement(pos);
        const nextChar = UI.getCharElement(pos + 1);

        if (currentChar) {
            UI.highlightChar(pos, 'current');
        }
        if (nextChar) {
            UI.removeCharClass(pos + 1, 'current');
        }
    },

    /**
     * Validar si un carácter es correcto
     * @param {string} typedChar - Carácter escrito
     * @param {string} targetChar - Carácter objetivo
     * @param {number} position - Posición del carácter
     * @returns {boolean}
     */
    validateChar(typedChar, targetChar, position) {
        return typedChar === targetChar;
    },

    /**
     * Finalizar el test
     */
    finish() {
        //console.log('🎉 Test completado!');

        this.isFinished = true;
        this.stopAutoType(); // Detener auto-escritura
        Metrics.stopTimer();
        UI.disableInput();

        // Obtener estadísticas finales
        const finalStats = Metrics.getFinalStats();

        // Mostrar pantalla de finalización
        UI.showFinishScreen(finalStats);

        // Reactivar input para detectar Enter
        UI.enableInput();
    },

    /**
     * Resetear el juego
     */
    reset() {
        this.stopAutoType(); // Detener auto-escritura
        this.targetText = "";
        this.isFinished = false;
        this.textData = null;

        UI.clearInput();
        Metrics.reset();
    },

    /**
     * Aplicar animación de error a un elemento
     * @param {HTMLElement} element - Elemento a animar
     */
    shakeElement(element) {
        element.classList.remove('current');
        element.classList.add('shake-error');

        setTimeout(() => {
            element.classList.remove('shake-error');
            element.classList.add('current');
        }, 200);
    },

    // ============================================================
    // FUNCIONALIDAD DE AUTO-ESCRITURA (PARA PRUEBAS)
    // ============================================================

    /**
     * Activar/desactivar auto-escritura
     */
    toggleAutoType() {
        if (this.isAutoTyping) {
            this.stopAutoType();
        } else {
            this.startAutoType();
        }
    },

    /**
     * Iniciar auto-escritura
     */
    startAutoType() {
        if (this.isFinished || this.isAutoTyping) return;

        //console.log('🤖 Auto-escritura ACTIVADA (Ctrl+Shift+T para detener)');
        this.isAutoTyping = true;

        const userInput = UI.elements.userInput;

        this.autoTypeInterval = setInterval(() => {
            const currentLength = userInput.value.length;

            // Si ya terminó el texto, detener
            if (currentLength >= this.targetText.length) {
                this.stopAutoType();
                // Ocultar sección de control cuando termina
                if (App && App.toggleAutoTypeSection) {
                    App.toggleAutoTypeSection();
                }
                return;
            }

            // Añadir siguiente carácter
            const nextChar = this.targetText[currentLength];
            userInput.value += nextChar;

            // Simular evento de input
            const event = new Event('input', { bubbles: true });
            event.inputType = 'insertText';
            userInput.dispatchEvent(event);

        }, this.autoTypeSpeed);
    },

    /**
     * Detener auto-escritura
     */
    stopAutoType() {
        if (this.autoTypeInterval) {
            clearInterval(this.autoTypeInterval);
            this.autoTypeInterval = null;
            //console.log('🤖 Auto-escritura DESACTIVADA');
        }
        this.isAutoTyping = false;
    }
};