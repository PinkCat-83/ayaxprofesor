/**
 * ROSCO DE PALABRAS - LÓGICA PRINCIPAL
 */

// Variables globales del juego
let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let lives = 10;
let gameStarted = false;
let timerInterval;
let seconds = 15 * 60; // 15 minutos en segundos
let pendingQuestions = new Set();
const answeredQuestions = {}; // Para guardar el historial de respuestas

/**
 * Crear la cinta de letras del rosco
 */
function createBelt() {
    const belt = document.getElementById('belt');

    palabras.forEach((palabra, index) => {
        const circle = document.createElement('div');
        circle.className = 'letra';
        circle.textContent = palabra.letra;
        circle.id = `letra-${index}`;
        circle.dataset.originalIndex = index;
        belt.appendChild(circle);
    });

    // Inicializar el set de preguntas pendientes
    pendingQuestions = new Set(Array.from({ length: palabras.length }, (_, i) => i));

    // Inicializar los contadores
    document.getElementById('pending').textContent = palabras.length;
    document.getElementById('total').textContent = palabras.length;

    updateBeltPosition();
}

/**
 * Actualizar la posición de la cinta para centrar la letra actual
 */
function updateBeltPosition() {
    const belt = document.getElementById('belt');
    const circles = belt.querySelectorAll('.letra');

    circles.forEach((circle) => {
        circle.classList.remove('current');
        const index = parseInt(circle.dataset.originalIndex);
        
        if (index === currentIndex) {
            circle.classList.add('current');
        }
    });

    // Calcular el desplazamiento para centrar la letra actual
    // Valores responsive según el ancho de pantalla
    let letterWidth = 130;
    let gapWidth = 120;
    
    // Ajustar valores según breakpoints del CSS
    if (window.innerWidth <= 768) {
        letterWidth = 70;   // Móvil
        gapWidth = 60;
    } else if (window.innerWidth <= 1024) {
        letterWidth = 110;  // Tablet
        gapWidth = 100;
    }
    
    const totalWidthPerLetter = letterWidth + gapWidth;
    
    // La cinta tiene left: 50% en CSS, así que ya empieza centrada
    // Solo necesitamos mover según el índice y centrar la letra actual
    const offset = -(currentIndex * totalWidthPerLetter) - (letterWidth / 2);
    
    belt.style.transform = `translateX(${offset}px)`;
}

/**
 * Iniciar el temporizador del juego
 */
function startTimer() {
    timerInterval = setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            clearInterval(timerInterval);
            endGame(false, true); // timeout
            return;
        }

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Cambiar color cuando quedan menos de 2 minutos
        if (seconds <= 120) {
            const timerElement = document.getElementById('timer');
            timerElement.style.color = '#ff6b6b';
            timerElement.style.textShadow = '0 2px 8px rgba(255, 107, 107, 0.6)';
        }
    }, 1000);
}

/**
 * Actualizar el contador de vidas
 */
function updateLives() {
    const livesContainer = document.getElementById('livesContainer');
    const hearts = livesContainer.querySelectorAll('.heart');

    if (hearts.length > lives) {
        const lastHeart = hearts[hearts.length - 1];
        lastHeart.classList.add('heart-falling');

        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);

        setTimeout(() => {
            lastHeart.remove();
        }, 1000);
    }
}

/**
 * Actualizar el contador de preguntas pendientes
 */
function updatePendingCounter() {
    document.getElementById('pending').textContent = pendingQuestions.size;
    document.getElementById('total').textContent = palabras.length;
}

/**
 * Actualizar la visualización de los aciertos
 */
function updateCorrectCount() {
    document.getElementById('score').textContent = `${correctCount}/${palabras.length}`;
}

/**
 * Ajustar el tamaño de fuente de la pregunta según su longitud
 */
function adjustQuestionFontSize() {
    const questionBox = document.getElementById('question');
    const text = questionBox.textContent;

    if (text.length < 50) {
        questionBox.style.fontSize = '35px';
    } else if (text.length < 80) {
        questionBox.style.fontSize = '28px';
    } else if (text.length < 120) {
        questionBox.style.fontSize = '24px';
    } else {
        questionBox.style.fontSize = '20px';
    }
}

/**
 * Mostrar la siguiente pregunta
 */
function showQuestion() {
    if (pendingQuestions.size === 0) {
        endGame(true);
        return;
    }

    const indices = Array.from(pendingQuestions);
    currentIndex = indices[0];

    updateBeltPosition();
    document.getElementById('question').textContent = palabras[currentIndex].pregunta;
    document.getElementById('pista').textContent = palabras[currentIndex].pista || '';
    adjustQuestionFontSize();
    updatePendingCounter();
}

/**
 * Normalizar una respuesta (eliminar acentos, espacios y convertir a minúsculas)
 */
function normalizeAnswer(answer) {
    return answer.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Comprobar si la respuesta del usuario es correcta
 */
function checkAnswer() {
    const userAnswer = normalizeAnswer(document.getElementById('answerInput').value);

    if (!userAnswer) return;

    const correctAnswers = Array.isArray(palabras[currentIndex].respuesta)
        ? palabras[currentIndex].respuesta
        : [palabras[currentIndex].respuesta];

    const isCorrect = correctAnswers.some(answer =>
        normalizeAnswer(answer) === userAnswer
    );

    if (isCorrect) {
        correctCount++;
        answeredQuestions[currentIndex] = { correct: true, userAnswer };
        document.getElementById(`letra-${currentIndex}`).classList.add('correct');
        pendingQuestions.delete(currentIndex);
    } else {
        incorrectCount++;
        lives--;
        answeredQuestions[currentIndex] = { correct: false, userAnswer };
        updateLives();
        document.getElementById(`letra-${currentIndex}`).classList.add('incorrect');
        pendingQuestions.delete(currentIndex);

        if (lives === 0) {
            endGame(false);
            return;
        }
    }

    updateCorrectCount();
    document.getElementById('answerInput').value = '';
    showQuestion();
}

/**
 * Pasar a la siguiente pregunta sin responder
 */
function passQuestion() {
    if (!gameStarted) {
        startGame();
    }

    pendingQuestions.delete(currentIndex);
    pendingQuestions.add(currentIndex);

    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    showQuestion();
}

/**
 * Iniciar el juego
 */
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startTimer();
    showQuestion();
}

/**
 * Finalizar el juego y mostrar resultados
 */
function endGame(won, timeout = false) {
    clearInterval(timerInterval);
    document.getElementById('answerInput').disabled = true;

    const modal = document.getElementById('endModal');
    const modalTitle = document.getElementById('modalTitle');

    if (timeout) {
        modalTitle.textContent = '¡TIEMPO AGOTADO!';
    } else if (won) {
        modalTitle.textContent = '¡ENHORABUENA!';
    } else {
        modalTitle.textContent = 'GAME OVER';
    }

    // Calcular estadísticas finales
    const unanswered = pendingQuestions.size;

    document.getElementById('finalScore').textContent = `${correctCount}/${palabras.length}`;
    document.getElementById('incorrectAnswers').textContent = incorrectCount;
    document.getElementById('unansweredQuestions').textContent = unanswered;
    document.getElementById('totalQuestions').textContent = palabras.length;

    // Generar lista de respuestas
    generateAnswersList();

    modal.style.display = 'flex';
}

/**
 * Generar la lista detallada de respuestas para el modal final
 */
function generateAnswersList() {
    const answersList = document.getElementById('answersList');
    answersList.innerHTML = '';

    palabras.forEach((palabra, index) => {
        const item = document.createElement('div');
        item.className = 'answer-item';

        const correctAnswers = Array.isArray(palabra.respuesta)
            ? palabra.respuesta.join(' / ')
            : palabra.respuesta;

        if (answeredQuestions[index]) {
            if (answeredQuestions[index].correct) {
                item.classList.add('correct');
                item.innerHTML = `
                    <strong>${palabra.letra}:</strong> ${palabra.pregunta}<br>
                    <span class="correct-answer">✓ ${answeredQuestions[index].userAnswer}</span>
                `;
            } else {
                item.classList.add('incorrect');
                item.innerHTML = `
                    <strong>${palabra.letra}:</strong> ${palabra.pregunta}<br>
                    Tu respuesta: ${answeredQuestions[index].userAnswer}<br>
                    <span class="correct-answer">Correcta: ${correctAnswers}</span>
                `;
            }
        } else {
            item.classList.add('unanswered');
            item.innerHTML = `
                <strong>${palabra.letra}:</strong> ${palabra.pregunta}<br>
                <span class="correct-answer">Respuesta: ${correctAnswers}</span>
            `;
        }

        answersList.appendChild(item);
    });
}

/**
 * Alternar la visibilidad de la lista de respuestas
 */
function toggleAnswers() {
    const answersList = document.getElementById('answersList');
    answersList.classList.toggle('show');

    const button = document.querySelector('.details-toggle');
    if (answersList.classList.contains('show')) {
        button.textContent = 'Ocultar preguntas y respuestas';
    } else {
        button.textContent = 'Ver todas las preguntas y respuestas';
    }
}

/**
 * Inicializar eventos del DOM
 */
function initializeEvents() {
    // Auto-iniciar el juego cuando el usuario empiece a escribir
    document.getElementById('answerInput').addEventListener('input', (e) => {
        if (!gameStarted && e.target.value.length > 0) {
            startGame();
        }
    });

    // Validar respuesta con Enter
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && gameStarted) {
            checkAnswer();
        }
    });

    // Botones de control
    document.getElementById('passBtn').addEventListener('click', passQuestion);
    document.getElementById('validateBtn').addEventListener('click', checkAnswer);
    document.getElementById('endBtn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres terminar el intento? Se mostrarán los resultados actuales.')) {
            endGame(false);
        }
    });
}

/**
 * Inicializar el juego cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    createBelt();
    initializeEvents();
    showQuestion(); // Mostrar la primera pregunta al cargar
    
    // Recalcular posición al redimensionar ventana
    window.addEventListener('resize', () => {
        updateBeltPosition();
    });
});