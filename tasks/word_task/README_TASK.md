# 🎮 Word Task - Rosco de Palabras

Juego tipo "Pasapalabra" para evaluar conocimientos de informática.

## 📁 Estructura del Proyecto

```
word_task/
├── css/
│   ├── main.css         # Estilos principales (header, cinta, controles)
│   ├── animations.css   # Animaciones (shake, heart-falling)
│   ├── background.css   # Animaciones del fondo
│   └── modal.css        # Estilos del modal de resultados
├── js/
│   ├── data.js          # Datos: palabras, preguntas y respuestas
│   └── game.js          # Lógica principal del juego
└── word.html            # Archivo HTML principal
```

## 🎯 Características

- **Sistema de vidas**: 10 corazones, se pierde uno por cada error
- **Temporizador**: 15 minutos para completar el rosco (hay que cambiarlo a 30)
- **Puntuación dinámica**: 100 puntos máximo, con penalización por errores
- **Múltiples respuestas válidas**: Acepta variaciones ortográficas
- **Normalización de respuestas**: Ignora acentos y capitalización
- **Feedback visual**: Colores para aciertos (verde) y errores (rojo)
- **Resumen final**: Modal con estadísticas detalladas

## 🎮 Mecánica del Juego

1. El jugador ve una pregunta y una pista
2. Puede escribir la respuesta o pasar a la siguiente pregunta
3. Al validar:
   - ✅ **Acierto**: La letra se marca en verde, suma puntos
   - ❌ **Error**: La letra se marca en rojo, resta puntos y una vida
   - ⏭️ **Pasar**: La pregunta vuelve al final de la cola
4. El juego termina cuando:
   - Se responden todas las preguntas correctamente
   - Se agotan las 10 vidas
   - Se acaba el tiempo (15 minutos)

## 🔧 Personalización

### Añadir o Modificar Preguntas

Edita el archivo `js/data.js`:

```javascript
const palabras = [
    { 
        letra: 'A', 
        pregunta: 'Tu pregunta aquí', 
        pista: 'Empieza por A', 
        respuesta: ['respuesta1', 'respuesta2'] // O simplemente: 'respuesta'
    },
    // ... más preguntas
];
```

### Ajustar Configuración

En `js/game.js` puedes modificar:

```javascript
let lives = 10;              // Número de vidas iniciales
let seconds = 15 * 60;       // Tiempo en segundos (15 minutos)
```

### Personalizar Estilos

- **main.css**: Colores, tamaños, espaciados
- **animations.css**: Efectos y transiciones
- **modal.css**: Apariencia del modal de resultados

## 💡 Detalles Técnicos

### Sistema de Puntuación

```javascript
puntosPorAcierto = 100 / totalPreguntas
puntosPorError = -puntosPorAcierto / 3
puntuaciónFinal = max(0, (aciertos × puntosPorAcierto) + (errores × puntosPorError))
```

### Normalización de Respuestas

Las respuestas se normalizan para:
- Eliminar acentos (á → a)
- Convertir a minúsculas
- Quitar espacios adicionales

Ejemplo: "RATÓN" → "raton"

### Cinta de Letras

El rosco se desplaza automáticamente para centrar la pregunta actual:
- Letra actual: Escala 1.5x, brillo aumentado
- Letra correcta: Verde (#90EE90)
- Letra incorrecta: Rojo (#ff6b6b)
- Letras pendientes: Gris semitransparente

## 🎨 Esquema de Colores

- **Principal**: Rosa (#ffb3c1)
- **Aciertos**: Verde claro (#90EE90)
- **Errores**: Rojo (#ff6b6b)
- **Info**: Azul (#6495ED)
- **Fondo**: Negro (#000) con gradientes grises

## 🚀 Uso

1. Abre `word.html` en un navegador
2. Comienza a escribir para iniciar el temporizador
3. Usa los botones o pulsa Enter para validar
4. Haz clic en "PASAR" si no conoces la respuesta
5. Revisa tus resultados al finalizar

## 📝 Notas de Desarrollo

- **Modularización**: Código separado en archivos independientes para facilitar mantenimiento
- **Sin dependencias**: Vanilla JavaScript, sin librerías externas
- **Responsive**: Diseño adaptable (pendiente de optimización para móviles)
- **Accesibilidad**: Autofocus en el input, navegación por teclado

## 🔜 Mejoras Futuras

- [ ] Diseño responsive completo
        El modo responsive está casi completo. En móviles hace falta hacer los botones de pasar, validar y terminar más pequeños. Hacer que la cinta de letras se mueva hacia arriba. Y reducir y bajar la pista (descripción) de la palabra a averiguar.
        Además, ya que los móviles suelen mover el "textbox" a la parte superior al pulsar sobre este para escribir, lo ideal es que la descripción esté debajo, no arriba. Así siempre estará a la vista.
- [ ] Sonidos y efectos