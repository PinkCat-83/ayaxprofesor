# 🔧 Technical README — Question Task (Gato Saltarín)

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_QUESTION_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- Follow `DESIGN_SYSTEM.md` for all visual work (menu, HUD, end screens).
- CSS is split into 3 partials — always edit the correct file:

| File | Covers |
|---|---|
| `variables-base.css` | CSS variables, reset, base styles |
| `screens-hud.css` | Screens, menu, HUD, rocks, end screens |
| `animations.css` | All `@keyframes` |

---

## 1. Architecture

Data-driven engine. `questions.html` reads a JSON config from the `?config=` URL parameter and builds the entire game from it. Entry point HTMLs are thin redirects with no game logic.

---

## 2. Cat Sprites

All 5 sprites (`idle`, `sjump`, `fjump`, `fanfare`, `water`) are present in the DOM from the start as independent `<image>` elements inside `#cat-rot`, all with `display:none` except the active one. Sprite switching is a pure CSS show/hide — no `href` changes at runtime.

This guarantees all sprites are decoded and composited in GPU before the game starts, eliminating any paint latency on jump.

| Sprite | State |
|---|---|
| `pinkcat_idle.png` | Resting on platform |
| `pinkcat_sjump.png` | Jumping |
| `pinkcat_fanfare.png` | Victory celebration |
| `pinkcat_water.png` | Fell in water (game over) |

---

## 3. Stage & World Layout

| File | Responsibility |
|---|---|
| `camera.js` | Camera positioning, parallax, world layout calculation |
| `cat.js` | Cat state machine, jump arc, fall detection |
| `engine.js` | Full game flow: menu → question → answer → feedback → next question / end |

**Parallax background:** `background.webp` scrolls smoothly right-to-left throughout the game, proportional to the total number of questions.

**Stage image sizes (reference):**

| File | Original size |
|---|---|
| `pinkcat_*.png` | 800 × 700 px |
| `platform*.png` | 840 × 327 px |
| `rock.png` | 600 × 350 px |
| `background.webp` | 1600 × 669 px |
| `fireworks.gif` | 280 × 304 px |

---

## 4. HUD Layout

All informational elements live inside the stage frame:

- **Top-left** — remaining lives (🐱/💀 emojis)
- **Top-center** — current question name (Fredoka One font)
- **Top-right** — question image with floating sway and pixelation transition between questions

Outside the frame (top bar): question progress (`Question X / N`), volume control, Menu button.

---

## 5. Pending Tasks

- [ ] Add mobile warning (shared component from root `js/mobile-warning.js`)
