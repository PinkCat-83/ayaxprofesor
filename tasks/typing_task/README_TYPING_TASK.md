# ⌨️ Typing Task — Mecanografía

Interactive typing exercise with themed texts, real-time metrics, and configurable visual distraction effects.

→ [Technical README](./README_TYPING_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

Students type out a text displayed on screen. The exercise measures speed and accuracy in real time. The teacher can activate visual distractor effects from a side panel to progressively increase the difficulty of concentration.

---

## File Structure

```
typing_task/
├── typing.html           # Main activity page
├── css/
│   ├── main.css          # Variables, main layout, character states, end screen
│   ├── controls.css      # Side panel, toggles, selector, buttons
│   └── effects.css       # Distractor animations and CSS effects
├── js/
│   ├── app.js            # Orchestrator: initialization, global events, keyboard shortcuts
│   ├── game.js           # Game logic: character validation, flow, auto-typing
│   ├── metrics.js        # WPM, CPM, errors and timer calculation
│   ├── ui.js             # DOM manipulation: text rendering, metrics, screens
│   ├── textloader.js     # Category and text loading from JSON, cache, random selection
│   └── distractors.js    # Visual distractor effects
└── json/
    ├── loader.json        # List of available category JSON files
    └── Group_*.json       # One file per text category
```

> ⚠️ Script load order in `typing.html` matters: `textloader → metrics → ui → game → distractors → app`.

---

## Adding Text Categories

Each category is a `Group_*.json` file:

```json
{
  "class": "Category name",
  "option": [
    {
      "id": "unique_id",
      "title": "Text title",
      "text": "Full text content the student will type."
    }
  ]
}
```

`loader.json` lists the category files to load:

```json
["Group_Pelis.json", "Group_OtraCategoria.json"]
```

To add a new category: create its `Group_*.json` and add the filename to `loader.json`. No JS or HTML changes needed.

---

## Metrics

The timer starts on the first keystroke. All metrics update in real time.

| Metric | Description |
|---|---|
| **WPM** | `(correct characters / 5) / elapsed minutes` |
| **CPM** | `correct characters / elapsed minutes` |
| **Errors** | Total accumulated incorrect keystrokes |
| **Error %** | `errors / (correct + errors) × 100` |
| **Time** | Seconds since first keystroke |

**Accuracy** (`100% - error %`) is shown on the results screen.

---

## Distractor Effects

Activated from the teacher side panel. Designed to progressively challenge student concentration.

| Toggle | Level | Description |
|---|---|---|
| 🎉 Particles | N1 | 30 colored dots bouncing around the screen |
| 🌊 Wave | N2 | Animated canvas wave crossing the screen (3 rotating styles) |
| 🐱 Animals | N3 | Animal emojis falling and rotating across the screen |
| 🌟 Stars | N4 | 5000-star 3D field (Three.js) — rotation speed increases with student CPM |
| ⚡ Storm | N5 | Raindrop shower + random lightning with screen flash |
| 😈 Total Chaos | N6 | All effects combined plus: explosive texts, spinning shapes, annoying messages, cursor trail, screen shake, color inversion, and text walls |

Distractors are independent and can be freely combined.
