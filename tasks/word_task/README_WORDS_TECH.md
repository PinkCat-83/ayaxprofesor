# 🔧 Technical README — Word Task (Rosco)

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_WORDS_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- Follow `DESIGN_SYSTEM.md` for all visual work.
- All game content lives in `json/words.json` — prefer data changes over code changes when adding or modifying questions.
- Game configuration (lives, timer) is set via variables at the top of `game.js` — see section 3.

---

## 1. Architecture

Single-file logic (`game.js`), no external dependencies, Vanilla JS. Questions loaded via `fetch` at startup — requires HTTP server.

---

## 2. Answer Normalization

All answers are normalized before comparison:
- Accents removed (`á → a`)
- Lowercased
- Extra whitespace trimmed

Example: `"RATÓN"` → `"raton"`

The `respuesta` array in each JSON entry allows multiple valid answers to handle spelling variations.

---

## 3. Game Configuration

Located at the top of `game.js`:

```javascript
let lives = 10;        // Initial lives
let seconds = 30 * 60; // Timer in seconds (30 minutes)
```

---

## 4. Letter Strip

The rosco strip scrolls automatically to center the current letter:

| State | Style |
|---|---|
| Current letter | Scale 1.4×, highlighted |
| Correct | Green (`--green`) |
| Incorrect | Red (`--rose`) |
| Pending | Semi-transparent |

The strip spans the full window width (`100vw`) with edge fade via `mask-image` to avoid hard cuts.

---

## 5. CSS Files

| File | Covers |
|---|---|
| `main.css` | Header, letter strip, controls, colors |
| `animations.css` | Shake effect, heart-falling animation |
| `background.css` | Background animations |
| `modal.css` | Results modal |

---

## 6. Pending Tasks

- [ ] **Audio** — three files needed in `audio/`: `correct.mp3`, `incorrect.mp3`, `end.mp3`.
  - `correct.mp3` → plays in `checkAnswer()` on correct answer
  - `incorrect.mp3` → plays in `checkAnswer()` on wrong answer, alongside the shake
  - `end.mp3` → plays in `endGame()` when modal opens; stops on "Play again"
- [ ] **Volume slider** — top-right corner, outside the stats header. Import design from another task (same style as the rest of the project).
- [ ] Add mobile warning (shared component from root `js/mobile-warning.js`)
