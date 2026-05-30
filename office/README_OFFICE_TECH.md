# 🔧 Technical README — Office Guide Task

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_OFFICE_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Do not create new files or start from scratch without permission — the project already has a base. Ask for the relevant files before making any modifications.
- All code (variables, functions, IDs) is in English. User-visible text is in Spanish.
- All game content lives in JSON files — prefer data changes over code changes when adding programs or procedures.

---

## 1. Architecture

ES6 modules loaded dynamically by `loader.js`. No build step. Two CDN dependencies loaded by `loader.js`:

| Library | Version | Purpose |
|---|---|---|
| [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js) | 2.5.1 | PDF export |
| [Fuse.js](https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.0.0/fuse.min.js) | 7.0.0 | Fuzzy search |

> Unlike most other tasks in this project, this one **works with `file://`** (no HTTP server required), because it does not use `fetch` for JSON loading — modules handle it.

---

## 2. Module Responsibilities

| File | Responsibility |
|---|---|
| `loader.js` | Single script tag in HTML. Loads CDN libraries, imports all other modules. |
| `dictionary.js` | Main class: loads data, renders procedures, handles events. |
| `normalizetext.js` | Text normalization: removes accents, lowercases, strips plurals, gender variations, and irrelevant monosyllables. Applied to both user input and JSON fields before search. |
| `pdf-export.js` | PDF generation: layout, header, footer, page breaks. Configure `authorName` and logo path here. |
| `pdf-render.js` | Rich text renderer for PDF — handles the markup syntax (`**bold**`, `*italic*`, `>>`, `//`, etc.) inside jsPDF. |

---

## 3. Search System

Search pipeline before reaching Fuse.js:

1. User input passes through `normalizetext.js` — accents, case, plurals, gender variations, monosyllables all normalized.
2. JSON fields (`name`, `tags`, `desc`, etc.) are normalized the same way at load time.
3. Fuse.js performs fuzzy matching with typo tolerance.

When writing `tags`, no special formatting is needed — normalization handles accents, plurals, and casing automatically.

---

## 4. PDF Export

Configure in `js/pdf-export.js`:

- `authorName` — name shown in the page footer
- `../../imgs/logo_small.png` — logo path (recommended ~118 × 100 px)
- Colors, margins, and typography

> **Known limitation:** Emojis are not compatible with jsPDF's Helvetica font. They are replaced with `»` in the exported PDF.

---

## 5. Location Note

This task lives as a subdirectory inside the main Ayax Profesor repository. The entry point is `/office`. The repo root (where `imgs/logo_small.png` lives) is one level above.

---

## 6. Pending Tasks

- [ ] Split `dictionary.css` into partials for easier maintenance
- [ ] Dark mode
