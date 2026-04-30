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
│   └── game.js          # Lógica principal del juego
├── json/
│   └── words.json       # Datos: palabras, preguntas y respuestas
└── word.html            # Archivo HTML principal
```

## 🎯 Características

- **Sistema de vidas**: 10 corazones, se pierde uno por cada error
- **Temporizador**: 30 minutos para completar el rosco
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
   - Se acaba el tiempo (30 minutos)

## 🔧 Personalización

### Añadir o Modificar Preguntas

Edita el archivo `json/words.json`:

```json
[
    {
        "letra": "A",
        "pregunta": "Tu pregunta aquí",
        "pista": "Empieza por A",
        "respuesta": ["respuesta1", "respuesta2"]
    }
]
```

### Ajustar Configuración

En `js/game.js` puedes modificar:

```javascript
let lives = 10;              // Número de vidas iniciales
let seconds = 30 * 60;       // Tiempo en segundos (30 minutos)
```

### Personalizar Estilos

- **main.css**: Colores, tamaños, espaciados
- **animations.css**: Efectos y transiciones
- **modal.css**: Apariencia del modal de resultados

## 💡 Detalles Técnicos

### Carga de datos

Las preguntas se cargan desde `json/words.json` mediante `fetch` al iniciar el juego. Esto requiere que el archivo se sirva desde un servidor HTTP — no funcionará abriendo el HTML directamente como archivo local (`file://`).

### Normalización de Respuestas

Las respuestas se normalizan para:
- Eliminar acentos (á → a)
- Convertir a minúsculas
- Quitar espacios adicionales

Ejemplo: "RATÓN" → "raton"

### Cinta de Letras

El rosco se desplaza automáticamente para centrar la letra actual:
- Letra actual: Escala 1.4x, resaltada
- Letra correcta: Verde (`--green`)
- Letra incorrecta: Rojo (`--rose`)
- Letras pendientes: Semitransparentes

La cinta ocupa el ancho completo de la ventana (`100vw`) con un desvanecimiento en los bordes mediante `mask-image`, evitando cortes bruscos.

## 🎨 Esquema de Colores

Basado en el **Design System — Ayax Profesor**. Ver `DESIGN_SYSTEM.md` para la referencia completa.

- **Principal**: `--pink-dark` (#be185d)
- **Aciertos**: `--green` (#22c55e)
- **Errores**: `--rose` (#fb7185)
- **Info / pista**: `--sky-dark` (#0369a1)
- **Fondo**: Degradado pastel `#fdf4ff → #fce7f3 → #bfdbfe`

## 🚀 Uso

1. Sirve el proyecto desde un servidor HTTP
2. Abre `word.html` en un navegador
3. Comienza a escribir para iniciar el temporizador
4. Usa los botones o pulsa Enter para validar
5. Haz clic en "PASAR" si no conoces la respuesta
6. Revisa tus resultados al finalizar

## 📝 Notas de Desarrollo

- **Modularización**: Código separado en archivos independientes para facilitar mantenimiento
- **Sin dependencias**: Vanilla JavaScript, sin librerías externas
- **Accesibilidad**: Autofocus en el input, navegación por teclado

## 🔜 Mejoras Futuras

- [ ] Sonidos y efectos

---

## 🔊 Sonidos (pendiente de implementar)

### Archivos de audio

Tres archivos `.mp3` en la carpeta `audio/`:

```
word_task/
└── audio/
    ├── correct.mp3    # Sonido de acierto
    ├── incorrect.mp3  # Sonido de fallo
    └── end.mp3        # Música tranquila al finalizar el intento
```

### Integración en el juego

- **`correct.mp3`** — se reproduce en `checkAnswer()` al acertar
- **`incorrect.mp3`** — se reproduce en `checkAnswer()` al fallar, junto al shake
- **`end.mp3`** — se reproduce en `endGame()` al abrir el modal; se detiene al pulsar "Jugar de nuevo"

### Control de volumen

Slider de volumen importado y colocado en la esquina superior derecha de la página, fuera del header de estadísticas.
Se importará de otro proyecto para realizar mismo diseño.
