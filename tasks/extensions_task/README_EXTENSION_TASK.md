# 🎯 Extensions Task — The Extension Challenge

Interactive educational game for learning to identify file extensions by dragging each extension to its correct description.

→ [Technical README](./README_EXTENSION_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

The player selects a difficulty level from the main menu. Each round presents a column of extensions (`.PDF`, `.MP3`, etc.) and a shuffled column of descriptions. The goal is to match each extension to its correct description by dragging from one box to the other (mouse and touch compatible).

- ✅ **Correct** — the pair is linked with a green arrow and added to the solved list.
- ❌ **Wrong** — a red arrow fades out and a life is lost.
- 🏆 **Victory** — all pairs matched; a modal with fireworks is shown.
- 💀 **Game Over** — no lives remaining; end-of-game modal is shown.

---

## File Structure

```
extensions_task/
├── extensions.html       # Main application structure
├── css/
│   └── extensions.css    # Game visual styles
├── js/
│   └── extensions.js     # Game logic
└── json/
    └── data.json         # Extensions, descriptions, links and config
```

> This task uses only its own resources plus shared project assets (`/imgs/pet.png`, `/css/tinyfoot.css`, `/layout/tinyfoot.html`, `/js/iframeanimation.js`).

---

## Difficulty Levels

| Level | Name | Pairs | Lives | Min. new extensions |
|---|---|---|---|---|
| 1 | Basic | 5 | 3 | 5 |
| 2 | Intermediate | 7 | 3 | 4 |
| 3 | Advanced | 10 | 2 | 4 |
| 4 | Power User | 13 | 2 | 4 |
| 5 | Developer | 15 | 2 | 4 |
| 6 | Retro Legacy | 12 | 3 | 12 |

Each level includes a minimum of level-specific extensions plus extensions reviewed from previous levels.

---

## Library

Accessible from the main menu. Shows all extensions organized by level with a link to their Wikipedia article (in Spanish).

---

## Adding or Editing Extensions

All game content is managed in `json/data.json` — no JavaScript changes needed:

```json
{
  "levels": {
    "1": {
      "PDF": "Documento que se lee bien en cualquier dispositivo"
    }
  },
  "links": {
    "PDF": "https://es.wikipedia.org/wiki/PDF"
  },
  "config": {
    "1": { "pairs": 5, "lives": 3, "minNew": 5 }
  }
}
```

To add a new level, add an entry in all three objects (`levels`, `links`, `config`).

---

## Deployment

This task is static and requires no backend or dependencies. Because it uses `fetch` to load `data.json`, it must be served over HTTP — it does not work when opened directly from the filesystem.

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
