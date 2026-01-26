// ============================================================
// js/metrics.js
// Gestiona WPM, PPM, errores, timer y estadísticas
// ============================================================

const Metrics = {
    // Estado del timer
    startTime: null,
    timerInterval: null,
    isTyping: false,

    // Contadores
    totalErrors: 0,

    /**
     * Iniciar cronómetro
     */
    startTimer() {
        if (this.isTyping) return;

        //console.log('⏱️ Timer iniciado');

        this.isTyping = true;
        this.startTime = Date.now();

        // Actualizar cada segundo
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    },

    /**
     * Detener cronómetro
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isTyping = false;

        //console.log('⏱️ Timer detenido');
    },

    /**
     * Actualizar solo el timer
     */
    updateTimer() {
        if (!this.startTime) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        UI.elements.timer.textContent = elapsed;
    },

    /**
     * Actualizar todas las métricas
     */
    updateMetrics() {
        if (!this.startTime) return;

        // Tiempo transcurrido en segundos
        const elapsedSeconds = (Date.now() - this.startTime) / 1000;

        // Contar caracteres correctos
        const correctChars = UI.countCharsWithClass('correct');

        // Calcular WPM (palabras por minuto)
        // Una "palabra" = 5 caracteres
        const wpm = elapsedSeconds > 0
            ? Math.round((correctChars / 5) / (elapsedSeconds / 60))
            : 0;

        // Calcular CPM (caracteres por minuto)
        const cpm = elapsedSeconds > 0
            ? Math.round(correctChars / (elapsedSeconds / 60))
            : 0;

        // Calcular porcentaje de errores
        const totalTyped = correctChars + this.totalErrors;
        const errorPercent = totalTyped > 0
            ? ((this.totalErrors / totalTyped) * 100).toFixed(1) + '%'
            : '0%';

        // Actualizar UI
        UI.updateMetricsDisplay({
            wpm: wpm,
            cpm: cpm,
            errors: this.totalErrors,
            errorPercent: errorPercent,
            time: Math.floor(elapsedSeconds)
        });

        // 🌟 NUEVO: Actualizar velocidad de estrellas según CPM
        if (typeof Distractors !== 'undefined' && Distractors.stars.enabled) {
            Distractors.stars.updateSpeed(cpm);
        }
    },

    /**
     * Incrementar contador de errores
     */
    incrementErrors() {
        this.totalErrors++;
        //console.log(`❌ Error #${this.totalErrors}`);
    },

    /**
     * Calcular WPM
     * @param {number} correctChars - Caracteres correctos
     * @param {number} elapsedSeconds - Segundos transcurridos
     * @returns {number}
     */
    calculateWPM(correctChars, elapsedSeconds) {
        if (elapsedSeconds === 0) return 0;
        return Math.round((correctChars / 5) / (elapsedSeconds / 60));
    },

    /**
     * Calcular CPM
     * @param {number} correctChars - Caracteres correctos
     * @param {number} elapsedSeconds - Segundos transcurridos
     * @returns {number}
     */
    calculateCPM(correctChars, elapsedSeconds) {
        if (elapsedSeconds === 0) return 0;
        return Math.round(correctChars / (elapsedSeconds / 60));
    },

    /**
     * Obtener estadísticas finales
     * @returns {Object} Estadísticas completas
     */
    getFinalStats() {
        const elapsedSeconds = this.startTime
            ? Math.floor((Date.now() - this.startTime) / 1000)
            : 0;

        const correctChars = UI.countCharsWithClass('correct');
        const totalTyped = correctChars + this.totalErrors;

        const wpm = this.calculateWPM(correctChars, elapsedSeconds);
        const cpm = this.calculateCPM(correctChars, elapsedSeconds);

        // Calcular precisión (accuracy)
        const accuracy = totalTyped > 0
            ? (100 - (this.totalErrors / totalTyped) * 100).toFixed(1) + '%'
            : '100%';

        return {
            wpm: wpm,
            cpm: cpm,
            errors: this.totalErrors,
            errorPercent: totalTyped > 0
                ? ((this.totalErrors / totalTyped) * 100).toFixed(1) + '%'
                : '0%',
            accuracy: accuracy,
            time: elapsedSeconds,
            correctChars: correctChars,
            totalTyped: totalTyped
        };
    },

    /**
     * Resetear todas las métricas
     */
    reset() {
        //console.log('🔄 Reseteando métricas');

        this.stopTimer();
        this.startTime = null;
        this.isTyping = false;
        this.totalErrors = 0;

        // Actualizar UI con valores en cero
        UI.updateMetricsDisplay({
            wpm: 0,
            cpm: 0,
            errors: 0,
            errorPercent: '0%',
            time: 0
        });

        // 🌟 NUEVO: Resetear velocidad de estrellas
        if (typeof Distractors !== 'undefined' && Distractors.stars.enabled) {
            Distractors.stars.updateSpeed(0);
        }
    }
};