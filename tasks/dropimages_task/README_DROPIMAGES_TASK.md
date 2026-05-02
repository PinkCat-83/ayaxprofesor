# ⚓ Drop Images — ¿Navegador o Buscador?

Juego educativo de drag & drop sobre clasificación de elementos web (navegadores, buscadores y páginas web). Motor modular configurable mediante JSON, con diseño homogéneo al resto de actividades del proyecto.

---

## Estructura de archivos

```
dropimages_task/
├── browser_game.html           ← Punto de entrada: redirige a dropimages.html con su JSON
├── dropimages.html             ← Motor del juego (no editar salvo cambios estructurales)
├── audio/
│   ├── correct.mp3             ← Sonido de acierto
│   ├── wrong.mp3               ← Sonido de fallo
│   ├── gameover.mp3            ← Sonido de derrota
│   └── fanfare.mp3             ← Música de victoria (en bucle)
├── css/
│   ├── main.css                ← Punto de entrada CSS (importa todos los parciales)
│   ├── variables-base.css      ← Variables CSS, reset y estilos base
│   ├── screens.css             ← Menú principal, botones de nivel, pantallas finales, loading
│   ├── hud.css                 ← Barra superior, slider de volumen, botón Menú
│   ├── stage.css               ← Escenario, capas de fondo, tarjeta, vidas, drop-zones
│   ├── components.css          ← Barra de progreso, feedback, modal, fuegos artificiales
│   └── animations.css          ← Todos los @keyframes
├── img/
│   ├── background.webp         ← Fondo del escenario (1408 × 768 px)
│   ├── fireworks.gif           ← Animación de fuegos artificiales
│   ├── dest_navigator.png      ← Zona de drop: Navegador    (1500 × 1100 px)
│   ├── dest_search.png         ← Zona de drop: Buscador     (1500 × 1100 px)
│   ├── dest_webpage.png        ← Zona de drop: Página web   (1500 × 1100 px)
│   ├── ok.png                  ← Imagen de feedback correcto (500 x 500 px)
│   ├── wrong.png               ← Imagen de feedback incorrecto (500 x 500 px)
│   ├── fanfare.png             ← Imagen de victoria (1376 × 768 px)
│   ├── gameover.png            ← Imagen de derrota (1376 × 768 px)
│   ├── progressbar_icon.png    ← Marcador móvil de la barra de progreso (500 × 500 px)
│   └── browser/                ← Logos de las preguntas (500 × 500 px, PNG transparente)
│       ├── chrome.png
│       ├── google.png
│       └── …
├── js/
│   ├── state-dom.js            ← Estado global y referencias al DOM
│   ├── engine.js               ← Flujo del juego: menú, preguntas, feedback, victoria/gameover
│   ├── drag.js                 ← Lógica de arrastrar la tarjeta y soltarla en zona
│   ├── fireworks.js            ← Fuegos artificiales de victoria
│   ├── clouds.js               ← Generador de nubes SVG vectoriales animadas
│   ├── seagulls.js             ← Generador de gaviotas SVG animadas
│   └── main.js                 ← Punto de entrada JS + precarga de imágenes estáticas
└── json/
    └── browser.json            ← Configuración completa del juego
```

---

## Cómo funciona el sistema de juegos

Cada "juego" es un HTML propio que redirige a `dropimages.html` pasándole su JSON por parámetro de URL:

```html
<meta http-equiv="refresh" content="0;url=dropimages.html?config=browser.json" />
```

Para crear un juego nuevo basta con:

1. Crear un JSON en `json/` con el formato descrito abajo.
2. Duplicar `browser_game.html` y cambiar el nombre del JSON en la línea de redirección.

`dropimages.html` no hay que tocarlo nunca.

---

## Formato del JSON de configuración

```json
{
  "pageTitle": "¿Navegador o Buscador?",
  "pageSubtitle": "Arrastra cada elemento a su categoría correcta",
  "imgfolder": "img/browser",

  "niveles": [
    {
      "nombre": "Fácil",
      "icono": "⚓",
      "vidas": 5,
      "preguntas": [
        { "nombre": "Google Chrome", "respuesta": "1", "img": "chrome.png"  },
        { "nombre": "Google",        "respuesta": "2", "img": "google.png"  },
        { "nombre": "YouTube",       "respuesta": "3", "img": "youtube.png" }
      ]
    }
  ]
}
```

| Campo          | Descripción |
|----------------|-------------|
| `pageTitle`    | Título que aparece en el menú principal |
| `pageSubtitle` | Subtítulo descriptivo bajo el título |
| `imgfolder`    | Ruta a la carpeta de imágenes de las preguntas (relativa a la raíz) |
| `niveles`      | Array de niveles disponibles (aparecen como botones en el menú) |
| `nombre`       | Nombre del nivel o de la pregunta |
| `icono`        | Emoji que aparece en el botón del nivel en el menú |
| `vidas`        | Número de vidas para ese nivel (se muestra en el botón del menú) |
| `preguntas`    | Array de preguntas del nivel |
| `respuesta`    | `"1"` = Navegador · `"2"` = Buscador · `"3"` = Página web |
| `img`          | Nombre del archivo de imagen para la tarjeta (buscado dentro de `imgfolder`) |

### Tamaños de imágenes

| Tipo | Tamaño | Notas |
|------|--------|-------|
| Logos de preguntas (`img/browser/`) | 500 × 500 px | PNG con fondo transparente |
| Zonas de drop (`dest_*.png`) | 1500 × 1100 px | PNG con fondo transparente (100px extra izquierda para sombras) |
| Feedback (`ok.png`, `wrong.png`, `fanfare.png`, `gameover.png`) | libre | Se usan como `background-image` del frame |
| Barra de progreso (`progressbar_icon.png`) | 500 × 500 px | PNG con fondo transparente |
| Fondo del escenario (`background.webp`) | 1408 × 768 px | |

---

## Diseño del escenario

### Orden de capas (z-index)

| z-index | Elemento | Descripción |
|---|---|---|
| 0 | `#sky-layer` | Cielo sólido `#7ec8e3` |
| 1 | `#clouds-layer` | 8 nubes SVG vectoriales (`clouds.js`) |
| 2 | `#stage-bg` | `background.webp`, sin zoom ni blur, anclado al top |
| 4 | `#seagulls-layer` | 5 gaviotas SVG (`seagulls.js`) |
| 10 | `#drop-zones-row` | Imágenes `dest_*` flotando en el mar |
| 20 | `#hud-lives`, `#drag-card`, `#btn-explain-game`, `#progress-bar-wrapper` | Primer plano |
| 50 | `#feedback-overlay` | Feedback dentro del tablero |
| 9999 | `#loading-overlay` | Pantalla de carga negra |

---

## Nubes (`clouds.js`)

8 nubes SVG vectoriales con 5 formas distintas (clásica, alargada, esponjosa, grande y plana, y muy grande con múltiples torres). Todas arrancan dentro del escenario en posición aleatoria — sin periodo en blanco. Al llegar al borde se reciclan inmediatamente sin pausa. Parámetros en `CLOUD_CONFIG`.

## Gaviotas (`seagulls.js`)

5 gaviotas SVG formadas por dos líneas `<line>`. Aleteo sinusoidal (`Math.sin`) y movimiento unificados en un único `requestAnimationFrame`. Efecto de alejamiento: el tamaño final es el 30% del inicial. Se reciclan sin pausa desde el lado contrario.

---

## Tarjeta arrastrable

- Dimensiones: `154 × 56px` con fondo rosa semitransparente `rgba(190, 24, 93, 0.35)`
- Icono siempre anclado a la izquierda (`flex-start`), texto centrado en el espacio restante (`flex: 1`)
- Texto en máximo 2 líneas (`max-height: 2.4em`), sin sombra
- Al arrastrar: clon con fondo rosa más opaco (`0.85`), mismo padding y layout que la original
- Al soltar fuera de zona: vuelve a su posición con `transform: translateX(-50%)`

---

## Animaciones de las zonas de drop

| Elemento | Animación |
|---|---|
| Barco (`#drop-navigator`) | Rotación suave ±3° (`animSail`, 4s, `transform-origin: bottom center`) |
| Mapa (`#drop-search`) | Flotado ±12px (`animMapFloat`, 3s) + sombra elíptica negra sincronizada (`animMapShadow`) |
| Embarcadero (`#drop-webpage`) | Sin animación (decisión de diseño) |

### Clases disponibles en `animations.css`

| Clase | Efecto |
|---|---|
| `anim-float` | Flotado vertical ±8px |
| `anim-shadow` | Sombra elíptica sincronizada |
| `anim-sway` / `anim-sway-mid` / `anim-sway-strong` | Balanceo ±3° / ±6° / ±12° |
| `anim-calm` | Aguas tranquilas |
| `anim-surge` | Marejada pronunciada |
| `anim-sail` | Rotación ±3° desde la base |

---

## Sistema de feedback y pantallas finales

El `#feedback-overlay` vive dentro del `#stage-frame` (`position: absolute`). La imagen es el `background-image` del frame rectangular. Dura **2.4 segundos** o hasta clic del usuario. Al fallar solo se marca en rojo la zona incorrecta.

| Estado | Clase CSS | Imagen | Sonido |
|--------|-----------|--------|--------|
| Correcto | `correct-fb` | `ok.png` | `correct.mp3` |
| Incorrecto | `incorrect-fb` | `wrong.png` | `wrong.mp3` |
| Victoria | `victory-fb` | `fanfare.png` | `fanfare.mp3` + fuegos artificiales |
| Derrota | `gameover-fb` | `gameover.png` | `gameover.mp3` |

En victoria y derrota, un clic vuelve al menú principal.

---

## Sistema de precarga de imágenes

**Fase 1 — al arrancar** (`main.js`): imágenes estáticas en paralelo sin bloquear el menú.

**Fase 2 — al iniciar nivel** (`engine.js`): logos del nivel con `Promise.allSettled()`. Pantalla de carga negra hasta que todas están listas.

---

## Barra de progreso

- `#progress-track` — carril rosa semitransparente
- `#progress-fill` — relleno que avanza con cada acierto
- `#progress-marker` (`progressbar_icon.png`) — flota ±4px (`progressBob`), avanza con `left: X%`

Al completar el nivel la barra llega al 100% antes de mostrar la victoria.

---

## Instrucciones para la IA

- El autor indicará por mensaje directo qué hay que hacer.
- Antes de proceder, pedir los archivos necesarios para las modificaciones solicitadas.
- Consultar el `DESIGN_SYSTEM.md` del proyecto para mantener coherencia visual.
- El CSS está dividido en 5 parciales — editar siempre el archivo correcto según la sección.

---

## ✅ Todo implementado

- [x] Tarjeta con icono fijo a la izquierda, texto centrado, fondo rosa semitransparente
- [x] Clon de arrastre con mismo layout y fondo más opaco
- [x] Feedback dura 2.4s o hasta clic
- [x] Victoria y derrota mediante overlay dentro del tablero
- [x] Barra de progreso con marcador flotante
- [x] Precarga en dos fases con pantalla de carga
- [x] Nubes SVG vectoriales (8 nubes, 5 formas)
- [x] Gaviotas SVG con aleteo sinusoidal y efecto de alejamiento
- [x] Barco con rotación suave, mapa con flotado y sombra
- [x] Halo de arrastre multicapa, sin pista verde al fallar
- [x] CSS dividido en 5 parciales
- [x] SVG de agua descartado definitivamente
- [x] Posición y tamaño de `dest_*` ajustados con imágenes definitivas
