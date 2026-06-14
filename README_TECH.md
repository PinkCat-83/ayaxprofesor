# 🔧 Technical README — Ayax Profesor

> Internal reference for development, debugging, and AI-assisted work.  
> → [Presentation README](./README.md) · [Design System](./DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

### Project context

- **Purpose:** Static educational web environment for IT classes. No server, no build step. Hosted via GitHub Pages at [ayaxprofesor.es](https://ayaxprofesor.es).
- **Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+). No framework, no bundler.
- **Audience:** Spanish primary/secondary school students. UI language is Spanish.
- **Status:** Active development.

### Code conventions

- UI text and comments: **Spanish**.
- Code (variables, functions, filenames): **English**.
- Each task is self-contained in its own folder under `tasks/`. Do not create cross-task dependencies.
- Shared components (foot, tinyfoot, mobile-warning, password) use absolute paths and work from any subfolder.
- Always use the design system defined in `DESIGN_SYSTEM.md` for any new visual component.

### What the AI MUST do

- Follow the Design System (`DESIGN_SYSTEM.md`) for all visual work — fonts, colors, spacing, components.
- Use absolute paths (`/css/`, `/js/`, `/layout/`) when referencing shared assets.
- Keep each task self-contained: its own `css/`, `js/`, `json/`, and a `README_TASK.md`.
- Include the `mobile-warning` snippet in every new task page.
- Include `pet.png` with class `menu-pet` in every new activity menu.
- Use the standard task folder structure (see below).

### What the AI MUST NOT do

- Do not add external dependencies or CDN libraries without asking first.
- Do not use dark backgrounds, neon/glassmorphism, or saturated gradients in activity pages — those are reserved for `index.html`.
- Do not create cross-task imports or shared JS logic outside of the root `js/` folder.
- Do not modify shared layout files (`foot.html`, `tinyfoot.html`) to fix task-specific issues.
- Do not use inline styles for anything covered by the design system.

---

## 1. Project Structure

```
ayaxprofesor/
├── css/
│   ├── cat-bouncing.css     # Bouncing cat animation (index.html)
│   ├── menu.css             # Main menu design
│   ├── foot.css             # Large footer styles
│   ├── tinyfoot.css         # Small footer + iframe/window styles
│   ├── redirect_css.css     # External redirect pages
│   ├── mobile-warning.css   # Overlay for screens < 1024px (shared)
│   └── password.css         # 🔑 Password modal styles (current term)
│
├── imgs/
│   ├── 🧨 icons/            # Program icons (to be moved to office/ later)
│   ├── 🧨 anne.png          # "The Voyage of the Marvelous Anne" image (to be relocated)
│   ├── pet.png              # Shared mascot
│   └── logo.png
│
├── js/
│   ├── iframeanimation.js   # Hide/show tinyfoot layout animation
│   ├── tinyfootlogic.js     # Tinyfoot internals: timer, progress bar, X button
│   ├── glitch.js            # Glitch animation for index.html
│   ├── textfit.js           # Font size management for index.html
│   ├── catwaiting.js        # Waiting cat animation
│   ├── cat-animation.js     # Bouncing cats animation (index.html)
│   ├── mobile-warning.js    # Small screen warning logic (shared)
│   └── password.js          # 🔑 Password modal logic (current term)
│
├── layout/
│   ├── foot.html            # Large footer layout
│   ├── tinyfoot.html        # Small footer layout (most used)
│   └── password.html        # 🔑 Password modal HTML (current term)
│
├── moodle/                  # Moodle HTML instructions (unrelated to the site itself)
├── office/                  # 🚧 In progress — office tools dictionary, JSON-driven
│
├── tasks/
│   ├── typing_task/         # ⌨ Typing activity (modular; needs mobile warning review)
│   ├── questions_task/      # 🐱 Gato Saltarín – peripheral classification game
│   ├── extensions_task/     # 🎯 File extensions challenge
│   ├── explorer_task/       # 🔍 File explorer with checklist
│   ├── word_task/           # 🆎 Word rosco – vocabulary level check
│   ├── dropimages_task/     # ⚓ Navegando – browser/search engine classification
│   └── 🧨 anne.html         # "The Voyage of the Marvelous Anne" solutions (needs modularization)
│
├── CNAME
├── favicon.ico
├── index.html               # Main page
├── ofimatica.html           # Office software types overview
├── DESIGN_SYSTEM.md         # Visual design reference
└── README.md                # Presentation README (Spanish)
```

> Files marked with 🧨 require modularization or relocation.

---

## 2. Standard Task Folder Structure

Each task must follow this structure:

```
tasks/
└── name_task/
    ├── audio/           # If the task requires it
    ├── img/             # If the task requires it
    ├── js/              # JavaScript modules
    ├── json/            # Data files
    ├── css/             # Task-specific styles
    ├── README_TASK.md   # Task-specific documentation
    └── name_task.html   # Entry point (same name as the folder)
```

Although styles are unified via the Design System, each task is intentionally self-contained due to the diversity of their purposes.

---

## 3. Shared Component Snippets

Quick reference for inserting shared components into a new page. All use absolute paths and work from any subfolder.

---

### 🦶 Large footer (`foot`)

```html
<!-- IFRAME at the end of BODY -->
<iframe src="/layout/foot.html" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 60px; border: none; z-index: 9999;"></iframe>
```

---

### 🐾 Small footer (`tinyfoot`)

```html
<!-- CSS in HEAD -->
<link rel="stylesheet" href="/css/tinyfoot.css">

<!-- IFRAME at the end of BODY -->
<iframe id="tinyfoot-iframe" class="tinyfoot-iframe" src="/layout/tinyfoot.html" scrolling="no"></iframe>
<!-- JS at the end of BODY -->
<script src="/js/iframeanimation.js"></script>
```

---

### 📵 Mobile warning overlay

Activates when screen width is below 1024px. Dismissed per session if the user chooses to continue anyway.

```html
<!-- CSS in HEAD -->
<link rel="stylesheet" href="/css/mobile-warning.css">

<!-- JS at the end of BODY -->
<script src="/js/mobile-warning.js"></script>
```

---

### 🔑 Password modal (`password`) — *temporary, per term*

Modal that appears on `index.html` when clicking "Curso Actual". On correct password, starts a 5-second countdown and redirects to a Google Drive folder. Configure the password and URL in the first two lines of `password.js`.

```html
<!-- CSS in HEAD -->
<link rel="stylesheet" href="/css/password.css">

<!-- Modal container, just before the final scripts -->
<div id="modal-curso-wrapper"></div>
<script>
  fetch('/layout/password.html')
    .then(r => r.text())
    .then(html => document.getElementById('modal-curso-wrapper').innerHTML = html);
</script>

<!-- JS at the end of BODY -->
<script src="/js/password.js"></script>
```

The button that opens the modal simply calls `abrirCurso()`:
```html
<button class="btn" onclick="abrirCurso()">...</button>
```

> **Note:** `window.open(_blank)` from a `setInterval` is blocked by browsers as an unsolicited popup. That's why the countdown uses `window.location.href` (same tab) and the "Go now" button uses `window.open` (new tab, allowed because it comes from a direct click).

---

## 4. Pending Tasks

- [ ] **Modularize `anne.html`** — Low priority. Move to `tasks/anne_task/` following the standard structure.
- [ ] **Relocate `imgs/icons/`** — Move to `office/` once that project matures.
- [ ] **Relocate `imgs/anne.png`** — Move to the future `anne_task/` folder.
- [ ] **Mobile warning in `typing_task`** — Needs review and integration.
- [ ] **`office/` project** — In-progress JSON-driven dictionary of office tool locations across different programs.

---
