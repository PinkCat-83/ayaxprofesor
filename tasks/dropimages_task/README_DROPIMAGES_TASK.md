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
│   ├── ok.png                  ← Imagen de feedback correcto
│   ├── wrong.png               ← Imagen de feedback incorrecto
│   ├── fanfare.png             ← Imagen de victoria
│   ├── gameover.png            ← Imagen de derrota
│   ├── progressbar_icon.png    ← Marcador móvil de la barra de progreso (500 × 500 px)
│   └── browser/                ← Logos de las preguntas (500 × 500 px, PNG transparente)
│       ├── chrome.png
│       ├── google.png
│       └── …
├── js/
│   ├── state-dom.js            ← Estado global y referencias al DOM
│   ├── engine.js               ← Flujo del juego: menú, preguntas, feedback, victoria/gameover
│   ├── drag.js                 ← Lógica de arrastrar la tarjeta y soltarla en zona
│   ├── fireworks.js            ← Fuegos artificiales de victoria (reutilizado del gato saltarín)
│   ├── clouds.js               ← Generador de nubes SVG vectoriales animadas
│   ├── seagulls.js             ← Generador de gaviotas SVG animadas
│   └── main.js                 ← Punto de entrada JS + precarga de imágenes estáticas
└── json/
    └── browser.json            ← Configuración completa del juego
```

> El antiguo `screens-hud.css` ha sido dividido en `screens.css`, `hud.css`, `stage.css` y `components.css` para facilitar el mantenimiento.

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
| Zonas de drop (`dest_*.png`) | 1500 × 1100 px | PNG con fondo transparente (100px extra izquierda) |
| Feedback (`ok.png`, `wrong.png`, `fanfare.png`, `gameover.png`) | libre | Se usan como `background-image` del frame |
| Barra de progreso (`progressbar_icon.png`) | 500 × 500 px | PNG con fondo transparente |
| Fondo del escenario (`background.webp`) | 1408 × 768 px | |

---

## Diseño del escenario

### Orden de capas dentro del escenario (z-index)

| z-index | Elemento | Descripción |
|---|---|---|
| 0 | `#sky-layer` | Cielo sólido `#7ec8e3` |
| 1 | `#clouds-layer` | 8 nubes SVG vectoriales generadas por `clouds.js` |
| 2 | `#stage-bg` | `background.webp`, sin zoom ni blur, anclado al top |
| 4 | `#seagulls-layer` | 5 gaviotas SVG generadas por `seagulls.js` |
| 10 | `#drop-zones-row` | Imágenes `dest_*` flotando en el mar |
| 20 | `#hud-lives`, `#drag-card`, `#btn-explain-game`, `#progress-bar-wrapper` | Primer plano |
| 50 | `#feedback-overlay` | Feedback dentro del tablero |
| 9999 | `#loading-overlay` | Pantalla de carga negra |

---

## Nubes (`clouds.js`)

8 nubes SVG vectoriales con 5 formas distintas (clásica, alargada, esponjosa, grande y plana, y **muy grande con múltiples torres**). Cada nube arranca en una posición aleatoria dentro del escenario para que no haya periodo sin nubes. Al llegar al borde se recicla inmediatamente desde el lado contrario con nuevos parámetros (escala, opacidad, velocidad, altura). No hay pausas entre ciclos.

Parámetros configurables en `CLOUD_CONFIG` (dentro de `clouds.js`): zona vertical, número de nubes, velocidad mínima/máxima, opacidad.

---

## Gaviotas (`seagulls.js`)

5 gaviotas SVG, cada una formada por dos líneas `<line>` que simulan las alas. El aleteo y el movimiento están unificados en un único `requestAnimationFrame` — el aleteo usa `Math.sin` para una oscilación continua y suave. Conforme avanzan se van haciendo más pequeñas (efecto de alejamiento: el tamaño final es el 30% del inicial). Al llegar al borde se reciclan desde el lado contrario sin pausa.

---

## Animaciones de las zonas de drop

### Barco (`#drop-navigator`)
Rotación suave ±3° con `transform-origin: bottom center` (`animSail`, 4s).

### Mapa (`#drop-search`)
Flotado vertical ±12px (`animMapFloat`, 3s) con sombra elíptica negra sólida sincronizada (`animMapShadow`): se encoge cuando el mapa sube y se expande cuando baja.

### Embarcadero (`#drop-webpage`)
Sin animación — elemento fijo anclado al mar (decisión de diseño).

### Clases de animación disponibles

| Clase | Efecto |
|---|---|
| `anim-float` | Flotado vertical suave ±8px |
| `anim-shadow` | Sombra elíptica sincronizada con flotado |
| `anim-sway` | Balanceo suave ±3° |
| `anim-sway-mid` | Balanceo medio ±6° |
| `anim-sway-strong` | Balanceo fuerte ±12° |
| `anim-calm` | Aguas tranquilas — ondulación muy suave |
| `anim-surge` | Marejada — movimiento irregular pronunciado |
| `anim-sail` | Barco — rotación ±3° desde la base |

---

## Sistema de feedback y pantallas finales

El `#feedback-overlay` vive **dentro del `#stage-frame`** (`position: absolute`). La imagen es el `background-image` del frame rectangular. Dura 4.4 segundos o hasta clic del usuario. Al fallar solo se marca en rojo la zona incorrecta — sin pista verde de la correcta.

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

**Fase 2 — al iniciar nivel** (`engine.js`): logos del nivel con `Promise.allSettled()`. Muestra pantalla de carga negra hasta que todas están listas.

---

## Tarjeta arrastrable

Ancho y alto fijos (`200 × 60px`), fondo transparente, texto blanco con sombra, máximo 2 líneas. Al soltar fuera de zona vuelve a su posición con `transform: translateX(-50%)` correcto.

---

## Zonas de drop (`dest_*`)

Dimensiones estándar **1500 × 1100 px**. Fondo inferior desvanecido con `mask-image`. Halo de arrastre con `drop-shadow` multicapa — el buscador tiene halo más potente.

---

## Barra de progreso

- `#progress-track` — carril rosa semitransparente
- `#progress-fill` — relleno que avanza con cada acierto
- `#progress-marker` (`progressbar_icon.png`) — flota suavemente ±4px (`progressBob`), avanza con `left: X%`

Al completar el nivel la barra llega al 100% antes de mostrar la victoria.

---

## Instrucciones para la IA

- El autor indicará por mensaje directo qué hay que hacer.
- Antes de proceder, pedir los archivos necesarios para las modificaciones solicitadas.
- Consultar el `DESIGN_SYSTEM.md` del proyecto para mantener coherencia visual.
- Tomar como referencia el **Gato Saltarín** (`question_task`) para cualquier duda de estructura o estilo.
- El CSS está dividido en 5 parciales — editar siempre el archivo correcto según la sección.

---

## ✅ Implementado

- [x] Tarjeta al soltar fuera de zona vuelve a su posición correcta
- [x] Tarjeta de ancho fijo con texto en máximo 2 líneas
- [x] Victoria y derrota mediante overlay dentro del tablero
- [x] Barra de progreso integrada y visible
- [x] Halo de arrastre sutil con `drop-shadow` multicapa
- [x] Precarga de imágenes en dos fases con pantalla de carga negra
- [x] Feedback dura 4.4s o hasta clic del usuario
- [x] Barra llega al 100% antes de mostrar la victoria
- [x] CSS dividido en 5 parciales
- [x] Nubes SVG vectoriales animadas (`clouds.js`) — 8 nubes, 5 formas, sin huecos
- [x] Gaviotas SVG animadas (`seagulls.js`) — aleteo sinusoidal + efecto de alejamiento
- [x] Barco con rotación suave ±3°
- [x] Mapa con flotado y sombra sincronizada
- [x] Al fallar no se muestra pista verde de la zona correcta

## 🧨 Pendiente

- [ ] Ajustar posición final de `dest_*` con imágenes definitivas
- [ ] SVG de agua — comentado temporalmente; decidir si se reactiva o elimina definitivamente
