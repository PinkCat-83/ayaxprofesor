# 🔧 Technical README — Password Security Calculator

> Internal reference for development, debugging, and AI-assisted work.  
> → [Presentation README](./README_PASS_PRES.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- All logic, styles, and markup live in a single `numberofpass.html` file — no build step, no dependencies except Chart.js via CDN.
- All number math is done in **log₁₀ space** to avoid JavaScript `Infinity` with large exponents. Never pass raw combination counts to Chart.js.
- The character set definitions live in the `SETS` array at the top of the `<script>` block — prefer data changes there over touching rendering logic.

---

## 1. Architecture

Single self-contained HTML file. Vanilla JS, no framework. Layout is CSS Grid (two columns). Chart rendered with Chart.js 4.4.1 via cdnjs.

---

## 2. Character Sets (`SETS` array)

| Index | ID | Label | Count |
|---|---|---|---|
| 0 | `num` | Números | 10 |
| 1 | `low` | Minúsculas | 26 |
| 2 | `up` | Mayúsculas | 26 |
| 3 | `sym` | Símbolos ASCII | 32 |
| 4 | `uni` | Unicode estándar | 162 |
| 5 | `unic` | Unicode completo | 154.742 |

To add or modify a level, edit only the `SETS` array. The card DOM, toggle logic, chart, and result display all derive from it automatically.

---

## 3. State

No external state module. All state is held in two local variables:

| Variable | Type | Description |
|---|---|---|
| `state` | `{ [id]: boolean }` | Whether each level is active |
| `chartInst` | `Chart \| null` | Current Chart.js instance (destroyed and recreated on config change) |

The slider value is read directly from `#slider` on every `update()` call.

---

## 4. Key Functions

| Function | Responsibility |
|---|---|
| `buildLevels()` | Creates all `.level-card` DOM elements from `SETS`; called once on load |
| `toggle(id)` | Flips `state[id]`, updates card classes, calls `update()` |
| `update()` | Reads active sets + slider; updates result display and calls `drawChart()` |
| `drawChart(chars, currentLen)` | Builds Chart.js config and updates or recreates `chartInst` |
| `bigNumFromLog(log10val)` | Converts a log₁₀ value to a Spanish-language number string (millones, billones…) |
| `sciStrFromLog(log10val)` | Returns scientific notation string with Unicode superscripts |
| `tickLabel(lv)` | Converts a log₁₀ axis value to a short readable label for Chart.js ticks |
| `logComb(chars, len)` | Returns `len × log₁₀(chars)` — the only place raw math is done |

---

## 5. Chart

- **Library:** Chart.js 4.4.1 (UMD, cdnjs)
- **Type:** Line chart
- **X axis:** Length 1–15 (fixed)
- **Y axis:** log₁₀ of combination count — **dynamically scaled** to the current selection's max (`Math.ceil(15 × log₁₀(chars)) + 1`)
- **Y tick step:** auto-selected: 1 / 2 / 5 / 10 depending on range
- **Current length point:** highlighted white fill, pink border, radius 6px vs 3px for rest
- **Tooltip:** shows human-readable Spanish number on hover

Chart is updated in-place (`chartInst.update('active')`) when only data changes, and fully recreated (`destroy()` + `new Chart()`) when the axis range changes.

---

## 6. CSS Architecture

All styles are inline in `<style>`. Design tokens are in `:root`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d080d` | Page background |
| `--surface` | `#170f17` | Card backgrounds |
| `--pink` | `#ec609b` | Primary accent |
| `--rose` | `#f9a8d4` | Secondary accent (sci notation) |
| `--mono` | JetBrains Mono | Numbers, formulas, chart labels |
| `--sans` | Inter | All UI text |

Layout uses `grid-template-columns: 1fr 1fr` with `grid-template-rows: auto auto`. Left column spans both rows (`grid-row: 1 / 3`).

---
