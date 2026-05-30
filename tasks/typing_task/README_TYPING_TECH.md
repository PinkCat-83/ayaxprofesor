# 🔧 Technical README — Typing Task

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_TYPING_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- Follow `DESIGN_SYSTEM.md` for all visual work.
- Script load order in `typing.html` is strict and must be preserved: `textloader → metrics → ui → game → distractors → app`.
- Each distractor has its own independent animation loop. When modifying one, do not affect the others.

---

## 1. Initialization Flow

`App.init()` orchestrates startup in this order:

1. Load and cache all categories defined in `loader.json`.
2. Populate the category selector in the side panel.
3. Initialize the stars and wave distractors (disabled by default).
4. Load a random text from any category to start.

---

## 2. Game Flow

```
Text load → Character-by-character render → Student types
      ↓
Real-time validation (Game.handleInput)
      ↓
  Correct   → character marked green, advance to next
  Incorrect → shake animation, character NOT accepted (cannot advance with errors)
      ↓
Text complete → results screen → Enter restarts with new text
```

---

## 3. Anti-Cheat Input Restrictions

Always active on the typing area:

- **Backspace and Delete blocked** — typed text cannot be deleted.
- **Paste, copy, cut disabled.**
- **Context menu disabled.**
- **Navigation keys blocked** (arrows, Home, End, etc.).
- **Cursor always forced to end** of typed text.

---

## 4. Module Responsibilities

| File | Responsibility |
|---|---|
| `app.js` | Orchestrator: initialization, global events, keyboard shortcuts |
| `game.js` | Character validation, game flow, auto-typing mode |
| `metrics.js` | WPM, CPM, error count, timer calculation and updates |
| `ui.js` | DOM manipulation: text rendering, metrics display, screen transitions |
| `textloader.js` | JSON loading, category cache, random text selection |
| `distractors.js` | All distractor effects — each with its own independent animation loop |

---

## 5. Distractor System

Each distractor is independent with its own animation loop that stops cleanly on deactivation.

| Toggle ID | Level | Notes |
|---|---|---|
| `particles` | N1 | 30 colored bouncing dots |
| `wave` | N2 | Canvas wave, 3 rotating styles |
| `emojiRain` | N3 | Falling rotating animal emojis |
| `stars` | N4 | Three.js 5000-star field. Rotation speed scales with student CPM, maxing out at 80 CPM. |
| `storm` | N5 | Raindrop shower + random lightning + screen flash |
| `chaos` | N6 | All effects + explosive texts, spinning shapes, annoying messages, cursor trail, screen shake, color inversion, text walls |

All distractors are independent and can be combined freely.

---

## 6. Auto-Typing Mode (Internal)

Hidden shortcut: `Ctrl + Shift + T`. Completes the current text automatically. A speed slider (1–500 ms per character) appears in the side panel when active. Deactivated with the same shortcut or on text completion.

For development and testing only — not exposed to students under normal conditions.

---

## 7. Pending Tasks

- [ ] Add mobile warning (shared component from root `js/mobile-warning.js`)
- [ ] Review side panel behaviour on mobile (auto-collapse)
