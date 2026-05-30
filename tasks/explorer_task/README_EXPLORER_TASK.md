# 📁 Explorer Task — Simulated File Explorer

Interactive simulator of a Windows-style file explorer for practising basic file management operations: move, copy, rename, create folders, and delete.

→ [Technical README](./README_EXPLORER_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## Current Status

> 🧨 **Pending modularization** — currently exists as `archivos.html` in the `tasks/` root. This document describes the target structure after modularization.

---

## What is this?

Students interact with a simulated file explorer (no access to the real system) and must complete file organization tasks. Each exercise introduces or reinforces a specific file management skill.

**Skills covered:**
- Cut, copy and paste files
- Rename files
- Create folders
- Navigate folder hierarchies
- Sort by type, name or visual content

---

## File Structure

```
tasks/explorer_task/
├── explorer.html           # Main entry point (renamed from archivos.html)
├── css/
│   └── explorer.css        # All simulator styles
├── js/
│   └── explorer.js         # Simulator logic (state, render, operations)
├── json/
│   ├── exercise_01.json    # Exercise: Trip (cut/paste)
│   ├── exercise_02.json    # Exercise: Other destinations (rename + move)
│   ├── exercise_03.json    # Exercise: Colors (create folders + rename)
│   ├── exercise_04.json    # Exercise: Cosmetics (classify by category)
│   ├── exercise_05.json    # Exercise: Documents (real images as icons)
│   ├── exercise_06.json    # Exercise: Copies (copy without cutting)
│   ├── exercise_07.json    # Exercise: Seasons (emoji icons + rename)
│   ├── exercise_08.json    # Exercise: Films (real images as icons)
│   └── exercise_09.json    # Exercise: Extensions (classify by file type)
├── img/
│   ├── fileexplorer5/      # Images for exercise 05 (documents/invoices)
│   │   └── 01.jpg … 08.jpg
│   └── fileexplorer8/      # Images for exercise 08 (films/cartoons)
│       └── 01.jpg … 08.jpg
└── audio/                  # Reserved — no audio currently in this task
```

> Images in `img/` will be moved from `imgs/fileexplorer5/` and `imgs/fileexplorer8/` in the project root.

---

## Available Exercises

| # | Name | Main skill | Icons |
|---|---|---|---|
| 01 | Trip | Cut and paste | 🗺️ Generic image emoji |
| 02 | Other destinations | Rename + move | 🗺️ Generic image emoji |
| 03 | Colors | Create folders + rename | Color emoji (🔵🍋🍎🍀) |
| 04 | Cosmetics | Classify by category | Product emoji (💍👓⌚) |
| 05 | Documents | Cut/paste with real image | Real image (fileexplorer5/) |
| 06 | Copies | Copy (not cut) | Thematic emoji (⚽🏖️🦜) |
| 07 | Seasons | Rename + classify | Season emoji (🌸☀️🍂❄️) |
| 08 | Films | Classify with real image | Real image (fileexplorer8/) |
| 09 | Extensions | Classify by file type | Extension emoji (🎵🎬📄📷) |

---

## Design Note

This task intentionally uses two distinct visual layers:

1. **Exercise selection menu** — follows the Design System (pastel gradient, Fredoka One, `--pink-dark`, `pet.png` mascot).
2. **Simulator itself** — mimics Windows Explorer (white/grey background, system font, SVG toolbar icons). The Design System does **not** apply here — the goal is for students to recognize a familiar real-world interface.
