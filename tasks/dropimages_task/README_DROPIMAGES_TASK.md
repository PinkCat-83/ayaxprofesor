# ⚓ Drop Images Task — Browser or Search Engine?

Educational drag & drop game about web element classification (browsers, search engines, and websites). Modular engine configurable via JSON, visually consistent with the rest of the project.

→ [Technical README](./README_DROPIMAGES_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

Students drag image cards into one of three drop zones — Browser, Search Engine, or Website — to classify web elements correctly. The game has multiple difficulty levels, a life system, sound effects, and victory/defeat screens.

The engine is fully data-driven: creating a new game only requires a new JSON file and an entry HTML. The engine itself (`dropimages.html`) is never modified.

---

## File Structure

```
dropimages_task/
├── browser_game.html           ← Entry point: redirects to dropimages.html with its JSON
├── dropimages.html             ← Game engine (do not edit unless structural changes needed)
├── audio/
│   ├── correct.mp3
│   ├── wrong.mp3
│   ├── gameover.mp3
│   └── fanfare.mp3             ← Victory music (looped)
├── css/
│   ├── main.css                ← CSS entry point (imports all partials)
│   ├── variables-base.css      ← CSS variables, reset and base styles
│   ├── screens.css             ← Main menu, level buttons, end screens, loading
│   ├── hud.css                 ← Top bar, volume slider, Menu button
│   ├── stage.css               ← Stage, background layers, card, lives, drop-zones
│   ├── components.css          ← Progress bar, feedback, modal, fireworks
│   └── animations.css          ← All @keyframes
├── img/
│   ├── background.webp         ← Stage background (1408 × 768 px)
│   ├── fireworks.gif
│   ├── dest_navigator.png      ← Drop zone: Browser    (1500 × 1100 px)
│   ├── dest_search.png         ← Drop zone: Search     (1500 × 1100 px)
│   ├── dest_webpage.png        ← Drop zone: Website    (1500 × 1100 px)
│   ├── ok.png                  ← Correct feedback image (500 × 500 px)
│   ├── wrong.png               ← Incorrect feedback image (500 × 500 px)
│   ├── fanfare.png             ← Victory image (1376 × 768 px)
│   ├── gameover.png            ← Game over image (1376 × 768 px)
│   ├── progressbar_icon.png    ← Progress bar moving marker (500 × 500 px)
│   └── browser/                ← Question logos (500 × 500 px, transparent PNG)
│       ├── chrome.png
│       ├── google.png
│       └── …
├── js/
│   ├── state-dom.js            ← Global state and DOM references
│   ├── engine.js               ← Game flow: menu, questions, feedback, victory/gameover
│   ├── drag.js                 ← Card drag and drop logic
│   ├── fireworks.js            ← Victory fireworks
│   ├── clouds.js               ← Animated SVG cloud generator
│   ├── seagulls.js             ← Animated SVG seagull generator
│   └── main.js                 ← JS entry point + static image preloading
└── json/
    └── browser.json            ← Full game configuration
```

---

## How to Create a New Game

Each game is a standalone HTML that redirects to `dropimages.html` with its JSON as a URL parameter:

```html
<meta http-equiv="refresh" content="0;url=dropimages.html?config=browser.json" />
```

To create a new game:

1. Create a JSON in `json/` following the format below.
2. Duplicate `browser_game.html` and change the JSON name in the redirect line.

Never edit `dropimages.html`.

---

## JSON Configuration Format

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

| Field | Description |
|---|---|
| `pageTitle` | Title shown in the main menu |
| `pageSubtitle` | Descriptive subtitle below the title |
| `imgfolder` | Path to the question images folder (relative to root) |
| `niveles` | Array of available levels (rendered as buttons in the menu) |
| `nombre` | Level or question name |
| `icono` | Emoji shown on the level button in the menu |
| `vidas` | Number of lives for that level (shown on the menu button) |
| `preguntas` | Array of questions for the level |
| `respuesta` | `"1"` = Browser · `"2"` = Search Engine · `"3"` = Website |
| `img` | Image filename for the card (looked up inside `imgfolder`) |

### Image Sizes

| Type | Size | Notes |
|---|---|---|
| Question logos (`img/browser/`) | 500 × 500 px | PNG with transparent background |
| Drop zones (`dest_*.png`) | 1500 × 1100 px | PNG with transparent background (100px extra left for shadows) |
| Feedback images | free | Used as `background-image` of the frame |
| Progress bar marker (`progressbar_icon.png`) | 500 × 500 px | PNG with transparent background |
| Stage background (`background.webp`) | 1408 × 768 px | |
