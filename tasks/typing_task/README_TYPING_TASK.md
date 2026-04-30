# ⌨️ Tarea: Mecanografía

Ejercicio interactivo de mecanografía con textos temáticos, métricas en tiempo real y efectos visuales de distracción configurables por el profesor.

---

## 📁 Estructura de archivos

```
typing_task/
├── css/
│   ├── main.css          # Variables, layout principal, estados de caracteres, pantalla de fin
│   ├── controls.css      # Panel lateral, toggles, selector, botones
│   └── effects.css       # Animaciones de distractores y efectos CSS
│
├── js/
│   ├── app.js            # Orquestador: inicialización, eventos globales, atajos de teclado
│   ├── game.js           # Lógica del juego: validación de caracteres, flujo, auto-escritura
│   ├── metrics.js        # Cálculo y actualización de WPM, CPM, errores, timer
│   ├── ui.js             # Manipulación del DOM: renderizado de texto, métricas, pantallas
│   ├── textloader.js     # Carga de categorías y textos desde JSON, caché, selección aleatoria
│   └── distractors.js    # Efectos visuales de distracción (estrellas, partículas, onda, tormenta, caos)
│
├── json/
│   ├── loader.json       # Lista de archivos JSON de categorías disponibles
│   └── Group_*.json      # Un archivo por categoría de textos (ver estructura más abajo)
│
└── typing.html           # Página principal de la actividad
```

> ⚠️ El orden de carga de scripts en `typing.html` es importante: `textloader → metrics → ui → game → distractors → app`.

---

## 📋 Estructura de los archivos JSON

Cada categoría de textos se define en un archivo `Group_*.json` independiente con esta estructura:

```json
{
  "class": "Nombre de la categoría",
  "option": [
    {
      "id": "identificador_unico",
      "title": "Título del texto",
      "text": "Contenido completo del texto que el alumno deberá escribir."
    }
  ]
}
```

El archivo `loader.json` simplemente lista los nombres de los JSON de categorías que deben cargarse:

```json
["Group_Pelis.json", "Group_OtraCategoria.json"]
```

Para **añadir una nueva categoría**, basta con crear su `Group_*.json` y añadir su nombre al `loader.json`. No hay que tocar ningún archivo JS ni HTML.

---

## ⚙️ Funcionamiento general

Al cargar la página, `App.init()` orquesta la inicialización en este orden:

1. Se cargan y cachean todas las categorías definidas en `loader.json`.
2. Se puebla el selector de categoría del panel lateral.
3. Se inicializan los distractores de estrellas y onda (desactivados por defecto).
4. Se carga un texto aleatorio de cualquier categoría para empezar.

### Flujo de una partida

```
Carga de texto → Renderizado carácter a carácter → El alumno escribe
      ↓
Validación en tiempo real (Game.handleInput)
      ↓
  Correcto → carácter marcado en verde, avance al siguiente
  Incorrecto → animación de shake, el carácter NO se acepta (no se puede avanzar con errores)
      ↓
Al completar el texto → pantalla de resultados → Enter reinicia con texto nuevo
```

### Restricciones de entrada (anti-trampa)

El área de escritura tiene varias restricciones activas de forma permanente:

- **Backspace y Delete bloqueados**: no se puede borrar lo escrito.
- **Pegar, copiar y cortar deshabilitados**.
- **Menú contextual deshabilitado**.
- **Teclas de navegación bloqueadas** (flechas, Home, End, etc.).
- **Cursor forzado siempre al final** del texto escrito.

---

## 📊 Métricas

Se muestran en tiempo real en la parte superior de la pantalla. El timer arranca con la primera pulsación.

| Métrica | Descripción |
|---|---|
| **WPM** (Palabras/min) | `(caracteres correctos / 5) / minutos transcurridos` |
| **CPM** (Pulsaciones/min) | `caracteres correctos / minutos transcurridos` |
| **Errores** | Total de pulsaciones incorrectas acumuladas |
| **% Errores** | `errores / (correctos + errores) × 100` |
| **Tiempo** | Segundos desde la primera pulsación |

Al finalizar se muestra también la **Precisión** (`100% - % errores`).

> Las estrellas 3D (distractor N4) aumentan su velocidad de rotación de forma proporcional al CPM del alumno, con velocidad máxima a 80 CPM.

---

## 🎨 Distractores

El profesor puede activar los efectos visuales desde el panel lateral. Están pensados para dificultar progresivamente la concentración del alumno.

| Toggle | ID interno | Nivel | Descripción |
|---|---|---|---|
| 🎉 Partículas | `particles` | N1 | 30 puntos de colores que rebotan por la pantalla |
| 🌊 Onda | `wave` | N2 | Onda animada en canvas que atraviesa la pantalla, con 3 estilos rotatorios |
| 🐱 Animales | `emojiRain` | N3 | Emojis de animales que caen y rotan por la pantalla |
| 🌟 Estrellas | `stars` | N4 | Campo de 5000 estrellas 3D (Three.js) cuya velocidad sube con el CPM |
| ⚡ Tormenta | `storm` | N5 | Lluvia de gotas + relámpagos aleatorios con flash de pantalla |
| 😈 Caos Total | `chaos` | N6 | Combinación de todos los efectos anteriores más: textos explosivos, formas giratorias, mensajes molestos, rastro de cursor, sacudida de pantalla, inversión de colores y paredes de texto |

Los distractores son **independientes entre sí** y se pueden combinar libremente. Cada uno tiene su propio bucle de animación que se detiene limpiamente al desactivarse.

---

## 🤖 Auto-escritura (uso interno)

Atajo oculto para pruebas: `Ctrl + Shift + T`. Al activarse, completa el texto automáticamente. Al activarlo aparece en el panel lateral un slider para ajustar la velocidad (1–500 ms entre caracteres). Se desactiva con el mismo atajo o al completar el texto.

> Este modo está pensado únicamente para el desarrollo y pruebas. No está expuesto al alumno en condiciones normales.

---

## 🚧 Pendiente

- Advertencia al entrar desde pantallas muy pequeñas (móvil).
- Revisar comportamiento del panel en móvil (auto-colapso).
