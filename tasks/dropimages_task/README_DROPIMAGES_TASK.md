# ⚓ Drop Images — ¿Navegador o Buscador?

Juego educativo de drag & drop sobre clasificación de elementos web (navegadores, buscadores y páginas web). Motor modular configurable mediante JSON, con diseño homogéneo al resto de actividades del proyecto.

---

## Estructura de archivos

```
dropimages_task/
├── browser_game.html           ← Punto de entrada: redirige a dropimages.html con su JSON
├── dropimages.html             ← Motor del juego (no editar salvo cambios estructurales)
├── audio/
│   ├── correct.mp3             ← Sonido de acierto        🧨 placeholder
│   ├── wrong.mp3               ← Sonido de fallo           🧨 placeholder
│   ├── gameover.mp3            ← Sonido de derrota         🧨 placeholder
│   └── fanfare.mp3             ← Música de victoria        🧨 placeholder
├── css/
│   ├── main.css                ← Punto de entrada CSS (importa los otros tres)
│   ├── variables-base.css      ← Variables CSS, reset y estilos base
│   ├── screens-hud.css         ← Pantallas, menú, HUD, escenario y pantallas finales
│   └── animations.css          ← Todas las animaciones y @keyframes
├── img/
│   ├── background.webp         ← Fondo del escenario (1600 × 669 px)    🧨 placeholder
│   ├── fireworks.gif           ← Animación de fuegos artificiales
│   ├── dest_navigator.png      ← Zona de drop: Navegador                 🧨 placeholder
│   ├── dest_search.png         ← Zona de drop: Buscador                  🧨 placeholder
│   ├── dest_webpage.png        ← Zona de drop: Página web                🧨 placeholder
│   ├── ok.png                  ← Imagen de feedback correcto              🧨 placeholder
│   ├── wrong.png               ← Imagen de feedback incorrecto            🧨 placeholder
│   ├── fanfare.png             ← Imagen de victoria                       🧨 placeholder
│   ├── gameover.png            ← Imagen de derrota                        🧨 placeholder
│   ├── progressbar_icon.png    ← Marcador móvil de la barra de progreso   🧨 placeholder
│   ├── progressbar_victory.png ← Icono flotante al final de la barra      🧨 placeholder
│   └── browser/                ← Logos de las preguntas (500 × 500 px)
│       ├── chrome.png
│       ├── google.png
│       └── …
├── js/
│   ├── state-dom.js            ← Estado global y referencias al DOM
│   ├── engine.js               ← Flujo del juego: menú, preguntas, feedback, victoria/gameover
│   ├── drag.js                 ← Lógica de arrastrar la tarjeta y soltarla en zona
│   ├── fireworks.js            ← Fuegos artificiales de victoria (reutilizado del gato saltarín)
│   └── main.js                 ← Punto de entrada JS + precarga de imágenes estáticas
└── json/
    └── browser.json            ← Configuración completa del juego
```

Los archivos marcados con 🧨 son placeholders que requieren sus assets definitivos.

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
| Zonas de drop (`dest_*.png`) | 1400 × 1100 px 🧨 | Por confirmar |
| Feedback (`ok.png`, `wrong.png`, `fanfare.png`, `gameover.png`) | 1000 × 1000 px 🧨 | Por confirmar |
| Barra de progreso (`progressbar_*.png`) | libre | PNG con fondo transparente |

---

## Diseño del escenario

El escenario replica visualmente el estilo del **Gato Saltarín**, con estas equivalencias:

| Gato Saltarín | Drop Images |
|---|---|
| `#svg-wrapper` + `#stage-svg` | `#stage-frame` (div con `aspect-ratio: 800/320`) |
| `<image href="background.webp">` con blur | `#stage-bg` con `filter: blur(3px)`, zoom 1.1 |
| `<rect fill="#7ec8e3">` cielo | `#sky-layer` |
| `#wave1` + `#wave2` (SVG paths) | `#sea-back` + `#sea-svg` (dos SVGs separados) |
| `#hud-lives` (absoluto, esquina superior izquierda) | Idéntico |
| `#peripheral-label` (centrado en top) | `#drag-card` (centrado en top, misma posición) |

### Orden de capas dentro del escenario (z-index)

| z-index | Elemento | Descripción |
|---|---|---|
| 0 | `#sky-layer` | Cielo sólido `#7ec8e3` |
| 1 | `#clouds-layer` | Nubes animadas |
| 2 | `#stage-bg` | `background.webp` con `blur(3px)`, zoom 1.1 |
| 3 | `#seagulls-layer` | Gaviotas generadas por JS |
| 5 | `#sea-back` | Agua trasera: rect + wave1 |
| 10 | `#drop-zones-row` | Imágenes `dest_*` flotando entre las capas de agua |
| 15 | `#sea-svg` | Agua frontal: wave2 + capa semitransparente |
| 20 | `#hud-lives`, `#drag-card`, `#btn-explain-game`, `#progress-bar-wrapper` | Primer plano |
| 9999 | `#loading-overlay` | Pantalla de carga negra |

---

## Sistema de feedback y pantallas finales

Victoria y derrota no tienen pantallas propias — ambas usan el `#feedback-overlay`, igual que el feedback de correcto/incorrecto. Un clic en cualquier punto del overlay vuelve al menú principal.

| Estado | Clase CSS | Imagen | Sonido |
|--------|-----------|--------|--------|
| Correcto | `correct-fb` | `ok.png` | `correct.mp3` |
| Incorrecto | `incorrect-fb` | `wrong.png` | `wrong.mp3` |
| Victoria | `victory-fb` | `fanfare.png` | `fanfare.mp3` + fuegos artificiales |
| Derrota | `gameover-fb` | `gameover.png` | `gameover.mp3` |

---

## Sistema de precarga de imágenes

Para evitar el efecto de "popping" (imágenes que aparecen tardíamente), el juego precarga en dos fases:

**Fase 1 — al arrancar** (`main.js`): las imágenes estáticas (`ok.png`, `wrong.png`, `fanfare.png`, `gameover.png`, `dest_*.png`, iconos de barra) se lanzan en paralelo sin bloquear el arranque del menú.

**Fase 2 — al iniciar nivel** (`engine.js`): los logos de las preguntas del nivel seleccionado se precargan con `Promise.allSettled()`. Durante este proceso se muestra una **pantalla de carga negra** con texto pulsante. El juego arranca cuando todas están listas (o han fallado sin bloquear).

---

## Tarjeta arrastrable

La tarjeta tiene **ancho y alto fijos** (`200 × 60px`) para que no cambie de tamaño según el nombre. El texto admite hasta 2 líneas (`-webkit-line-clamp: 2`) y está centrado. El fondo es completamente transparente — solo se ven la imagen y el texto (blanco con sombra para legibilidad).

Al soltar fuera de una zona válida, la tarjeta vuelve a su posición original con animación suave restaurando el `transform: translateX(-50%)` correcto.

---

## Barra de progreso

La barra usa colores rosas del Design System y contiene:

- `#progress-track` — carril de fondo semitransparente
- `#progress-fill` — relleno animado que avanza con cada acierto
- `#progress-marker` (`progressbar_icon.png`) — icono que avanza sobre la barra
- `#progress-victory` (`progressbar_victory.png`) — icono flotante fijo al final con animación `petBob`

Al completar el nivel la barra llega al 100% antes de mostrar la pantalla de victoria.

---

## Halo de arrastre

Al arrastrar la tarjeta sobre una zona destino, se aplica un `drop-shadow` multicapa sobre la imagen:

```css
filter:
  drop-shadow(0 0  3px rgba(236, 72, 153, 0.9))   /* contorno nítido */
  drop-shadow(0 0  8px rgba(236, 72, 153, 0.55))  /* difuminado medio */
  drop-shadow(0 0 18px rgba(236, 72, 153, 0.25)); /* halo exterior suave */
```

El efecto sigue exactamente la silueta de la imagen. Los estados de correcto (verde) e incorrecto (rojo) usan el mismo sistema de capas.

---

## Instrucciones para la IA

- El autor indicará por mensaje directo qué hay que hacer.
- Antes de proceder, pedir los archivos necesarios para las modificaciones solicitadas.
- Consultar el `DESIGN_SYSTEM.md` del proyecto para mantener coherencia visual.
- Tomar como referencia el **Gato Saltarín** (`question_task`) para cualquier duda de estructura o estilo.

---

## 🧨 Pendiente de implementar

### Assets

- [ ] Imágenes definitivas de zonas de drop (`dest_navigator.png`, `dest_search.png`, `dest_webpage.png`) — tamaño tentativo 1400 × 1100 px
- [ ] Imágenes de logos en `img/browser/` — tamaño 500 × 500 px
- [ ] `background.webp` definitivo — 1600 × 669 px
- [ ] Audios definitivos (`correct.mp3`, `wrong.mp3`, `gameover.mp3`, `fanfare.mp3`)
- [ ] `ok.png`, `wrong.png`, `fanfare.png`, `gameover.png` — tentativo 1000 × 1000 px
- [ ] `progressbar_icon.png`, `progressbar_victory.png`

### Funcionalidad

- [x] Tarjeta al soltar fuera de zona vuelve desplazada — corregido en `drag.js`
- [x] Tarjeta de ancho fijo con texto en máximo 2 líneas
- [x] Victoria y derrota mediante overlay en lugar de pantalla propia
- [x] Barra de progreso integrada y visible por encima del agua
- [x] Halo de arrastre sutil con `drop-shadow` multicapa
- [x] Precarga de imágenes en dos fases con pantalla de carga negra
- [x] Imágenes `dest_*` entre las dos capas de agua (z-index 10)
- [x] Barra llega al 100% antes de mostrar la victoria
- [ ] Ajustar posición y tamaño de las imágenes `dest_*` con los assets definitivos

### Animaciones pendientes

- [ ] **Sombra** — efecto de sombra proyectada bajo los elementos flotantes
- [ ] **Balanceo** — oscilación lateral suave (3 intensidades)
- [ ] **Flotando** — ya implementada en `#btn-explain-game` (`petBob`), reutilizar para `dest_*`
- [ ] **Marejada** — movimiento ondulante más pronunciado
- [ ] **Aguas tranquilas** — movimiento suave del agua; revisar si existe en otro proyecto
- [ ] **Nubes** — sistema dinámico con al menos 3 tamaños, más activo que en el gato saltarín
