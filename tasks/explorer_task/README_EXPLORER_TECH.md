# 🔧 Technical README — Explorer Task

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_EXPLORER_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- The simulator UI intentionally does **not** follow `DESIGN_SYSTEM.md` — it mimics Windows Explorer. Only the exercise selection menu uses the Design System.
- All logic currently lives in an inline `<script>` in `archivos.html`. The modularization target is `explorer.js` + JSON per exercise.
- Preserve all special-case logic documented in this file when migrating code.

---

## 1. JSON Exercise Format

```json
{
  "id": 1,
  "title": "Carpeta 01 - Viaje",
  "menuLabel": "📁 01 - Viaje",
  "menuDesc": "Organiza archivos de viajes",
  "description": "Coloca los archivos de cada viaje en la carpeta correspondiente.",
  "tasks": [
    "Mueve los 4 archivos de cada país a su carpeta correspondiente"
  ],
  "hints": [
    "Primero, haz clic en el archivo para seleccionarlo"
  ],
  "iconMode": "emoji",
  "icons": {},
  "initialFiles": {
    "Francia": { "type": "folder", "children": {} },
    "Francia 01.jpg": { "type": "file" }
  },
  "checklist": [
    {
      "text": "4 archivos en la carpeta Francia",
      "checkType": "filesInFolder",
      "folder": "Francia",
      "startsWith": "Francia",
      "count": 4
    }
  ],
  "validateRules": [
    {
      "type": "filesInFolder",
      "folder": "Francia",
      "startsWith": "Francia",
      "count": 4
    }
  ]
}
```

### `iconMode` values

| Value | Behaviour |
|---|---|
| `"emoji"` | Uses the `icons` map: `{ "filename": "🎵" }` |
| `"image"` | Uses the `icons` map: `{ "filename": "img/fileexplorer5/01.jpg" }` |
| `"auto"` | Generic folder/file icon based on type |

---

## 2. Global State

These variables must be kept in a module or closure in `explorer.js`:

| Variable | Description |
|---|---|
| `fileSystem` | In-memory file tree |
| `currentPath` | Array of folder names (current path) |
| `selectedItem` | Name of the currently selected item |
| `clipboard` | `{ name, path }` of the item in clipboard |
| `clipboardMode` | `'cut'` or `'copy'` |
| `currentExercise` | Active exercise number |
| `hintLevel` | Index of the current hint |
| `iconMapping` | Icon↔filename map after renames (critical for exercises 05 and 08) |

---

## 3. JS Functions (`explorer.js`)

| Function | Description |
|---|---|
| `startExercise(num)` | Loads an exercise and hides the menu |
| `backToMenu()` | Returns to the exercise selection menu |
| `initializeExercise(exercise)` | Initializes state from `initialFiles` |
| `render()` | Renders the current explorer view |
| `updateAddressBar()` | Updates the displayed path |
| `selectItem(name, event)` | Selects a file or folder |
| `openFolder(name)` | Navigates into a folder |
| `goBack()` | Goes up one level in the hierarchy |
| `updateButtons()` | Enables/disables toolbar buttons based on state |
| `createFolder()` | Creates a new folder |
| `cutItem()` | Cuts the selected item |
| `copyItem()` | Copies the selected item |
| `pasteItem()` | Pastes from clipboard |
| `renameItem()` | Renames the selected item |
| `deleteItem()` | Deletes the selected item |
| `showHint()` | Shows the next hint cyclically |
| `updateChecklist(exercise)` | Updates the checklist panel |
| `getCurrentFolder()` | Helper: returns the current folder object |

---

## 4. Special Cases to Preserve

These are exercise-specific behaviours that must be maintained during modularization:

**Exercise 01 — cut-to-root restriction**  
`pasteItem()` must not allow pasting at root level when `clipboardMode === 'cut'`. Document this as a named special case in `explorer.js`.

**Exercise 06 — copy enforcement**  
Validation must confirm that original files remain in the root. This forces students to use Copy instead of Cut.

**Exercises 03, 04, 07, 08 — regex validation**  
Checklist validation uses regex and accent normalization. When migrating to JSON, these rules must either use a declarative `checkType` or remain as named functions in `explorer.js` — never anonymous inline functions.

**`iconMapping` — rename persistence**  
`iconMapping` maintains the icon↔filename association after a rename. It is critical for exercises with real images (05, 08) and must be updated in every rename operation.

---

## 5. Shared Resources

| Resource | Path | Description |
|---|---|---|
| `tinyfoot.css` | `/css/tinyfoot.css` | Author footer iframe styles |
| `tinyfoot.html` | `/layout/tinyfoot.html` | Author footer layout |
| `iframeanimation.js` | `/js/iframeanimation.js` | Footer iframe animation |
| `favicon.ico` | `/favicon.ico` | Tab icon |

---

## 6. Pending Tasks

- [ ] **Modularize** — extract all inline `<script>` logic from `archivos.html` into `explorer.js`
- [ ] **Create JSON files** — one per exercise following the format above
- [ ] **Move images** — relocate `imgs/fileexplorer5/` and `imgs/fileexplorer8/` from project root to `tasks/explorer_task/img/`
- [ ] **Rename entry point** — `archivos.html` → `explorer.html`, move to `tasks/explorer_task/`
- [ ] **Migrate validation logic** — declarative `checkType` for exercises 03, 04, 07, 08 or named functions
- [ ] **Add mobile warning** — shared component from root `js/mobile-warning.js`
