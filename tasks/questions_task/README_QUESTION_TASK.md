# 🐱 Question Task — Gato Saltarín

Educational game about computer peripheral classification. The cat jumps between rocks based on the player's answers.

→ [Technical README](./README_QUESTION_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

A question-and-answer game where a cat jumps to the rock matching the correct answer. The engine is fully data-driven: creating a new game only requires a new JSON file and an entry HTML. The engine itself (`questions.html`) is never modified.

---

## File Structure

```
question_task/
├── perifericos_game.html       ← Entry point: redirects to questions.html with its JSON
├── questions.html              ← Game engine (do not edit)
├── audio/
│   ├── jump.mp3
│   ├── splash.mp3
│   ├── gameover.mp3
│   └── fanfare.mp3             ← Victory music (looped)
├── css/
│   ├── main.css                ← CSS entry point (imports the other three)
│   ├── variables-base.css      ← CSS variables, reset and base styles
│   ├── screens-hud.css         ← Screens, menu, HUD, rocks and end screens
│   └── animations.css          ← All animations and @keyframes
├── img/
│   ├── pinkcat_idle.png
│   ├── pinkcat_sjump.png
│   ├── pinkcat_fanfare.png
│   ├── pinkcat_water.png
│   ├── fireworks.gif
│   ├── rock.png
│   ├── platform.png
│   ├── platform_ground.png
│   ├── background.webp         ← Parallax background (1600 × 669 px)
│   └── Periphericals/          ← Question images (1500 × 800 px)
│       ├── mouse.png
│       ├── keyboard.png
│       └── …
├── js/
│   ├── constants.js            ← Global constants
│   ├── state-dom.js            ← State and DOM references
│   ├── engine.js               ← Game flow: start, questions, clicks, HUD, victory/gameover
│   ├── camera.js               ← Camera, parallax, world layout
│   ├── cat.js                  ← Cat state, jump and fall animations
│   ├── fireworks.js            ← Victory fireworks GIF
│   └── main.js                 ← JS entry point
└── json/
    └── perifericos.json        ← Full game configuration (title, levels, questions)
```

---

## How to Create a New Game

Each game is a standalone HTML that redirects to `questions.html` with its JSON as a URL parameter:

```html
<meta http-equiv="refresh" content="0;url=questions.html?config=perifericos.json" />
```

To create a new game:

1. Create a JSON in `json/` following the format below.
2. Duplicate `perifericos_game.html` and change the JSON name in the redirect line.

Never edit `questions.html`.

---

## JSON Configuration Format

```json
{
  "pageTitle": "Título de la página",
  "pageSubtitle": "Subtítulo descriptivo",
  "imgfolder": "img/Periphericals",
  "niveles": [
    {
      "nombre": "Fácil",
      "icono": "🐟",
      "vidas": 3,
      "preguntas": [
        {
          "nombre": "Teclado",
          "respuesta": "Entrada",
          "opciones": ["Entrada", "Salida", "Ambas"],
          "img": "keyboard.png"
        }
      ]
    }
  ]
}
```

| Field | Description |
|---|---|
| `pageTitle` | Title shown in the main menu |
| `pageSubtitle` | Descriptive subtitle below the title |
| `imgfolder` | Path to the question images folder (relative to project root). If omitted, no image is shown. |
| `niveles` | Array of available levels (rendered as buttons in the menu) |
| `nombre` | Level or question name |
| `icono` | Emoji shown on the level button in the menu |
| `vidas` | Number of lives for that level |
| `preguntas` | Array of questions for the level |
| `respuesta` | Must match exactly one value from `opciones` |
| `opciones` | Exactly 3 options (there are always 3 rocks) |
| `img` | Question image filename (optional). Looked up inside `imgfolder`. If omitted for a specific question, no image is shown for that question. |

### Question image specs

- Recommended size: **1500 × 800 px** (15:8 ratio)
- Recommended format: PNG with transparent background
- Displayed in the top-right corner of the stage with a floating sway effect
- Transition between questions: pixelation effect (current image pixelates out, new one pixelates in)
- If a question has no `img`, the panel fades out smoothly
