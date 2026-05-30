# 📚 Office Guide Task — Diccionario Ofimático

Modular system for looking up procedures across different office software programs.

→ [Technical README](./README_OFFICE_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

A searchable dictionary of office software procedures. Each entry explains how to perform the same task across multiple programs (Word, Google Docs, LibreOffice Writer, etc.). Currently focused on **word processors**.

---

## File Structure

```
(repo root)/
└── imgs/
    └── logo_small.png              # Logo for PDF footer (118 × 100 px)

office/
├── css/
│   └── dictionary.css              # Dictionary styles
├── js/
│   ├── loader.js                   # Single script in HTML — loads jsPDF, Fuse and imports modules
│   ├── dictionary.js               # Main class: data, rendering and events
│   ├── normalizetext.js            # Exhaustive text normalization logic
│   ├── pdf-export.js               # PDF export logic
│   └── pdf-render.js               # Rich text renderer for PDF
└── text/                           # Word processor dictionary
    ├── imgs/
    │   ├── wordlogo.png
    │   ├── GoogleDocs.png
    │   ├── LibreOffice.png
    │   └── file.png                # Optional screenshots
    ├── json/
    │   ├── loader.json             # List of procedure files to load
    │   ├── programs.json           # List of programs used in procedures
    │   └── procedures/             # One JSON per procedure
    └── dictionary.html             # Main page
```

> This task lives as a subdirectory inside the main repository. The entry point is `/office`. The repo root is one level above.

---

## Adding a New Program

Edit `json/programs.json`:

```json
{
  "programList": [
    {
      "code": "excel",
      "realName": "Microsoft Office Excel 365",
      "img": "excellogo.png"
    }
  ]
}
```

- `code` — unique identifier (lowercase, no spaces)
- `realName` — full display name
- `img` — image filename (must be in `/imgs/`)

---

## Adding a New Procedure

Create a JSON in `json/procedures/` and add its filename to `json/loader.json`.

```json
{
  "id": "savefile",
  "name": "Cómo guardar tu documento",
  "category": "archivo",
  "generaldesc": "Guarda el documento en el disco local con el nombre y ubicación que elijas.",
  "tags": ["guardar", "salvar", "almacenar", "archivo"],
  "list": [
    {
      "program": "word",
      "route": "Archivo >> Guardar >> Examinar",
      "shortcut": "Ctrl + G",
      "desc": "Es importante pulsar en *examinar* o puede que guardes el archivo en la nube.",
      "imgs": ["examinar.png"]
    },
    {
      "program": "googledocs",
      "desc": "Se guarda automáticamente."
    },
    {
      "program": "writer",
      "route": "Archivo >> Guardar",
      "shortcut": ["Ctrl + G", "Ctrl + S"]
    }
  ]
}
```

| Field | Required | Description |
|---|---|---|
| `id` | ✓ | Unique identifier (usable for direct links) |
| `name` | ✓ | Title shown to the user |
| `category` | — | Optional category (for future use) |
| `generaldesc` | — | Description common to all programs, shown before `desc` |
| `tags` | — | Keywords for search (no special format needed — normalized automatically) |
| `list` | ✓ | Array of steps per program |
| `program` | ✓ | Program code (must match `programs.json`) |
| `route` | — | Menu navigation path |
| `shortcut` | — | Keyboard shortcut — string or array of strings |
| `desc` | — | Program-specific notes |
| `imgs` | — | Array of screenshot filenames |

### Text markup syntax

Available in `desc`, `generaldesc` and `route`:

| Syntax | Result |
|---|---|
| `**text**` | **bold** |
| `*text*` | *italic* |
| `__text__` | underline |
| `>>` or `->` | ▶ (step arrow) |
| `//` | line break |
| Direct HTML | any valid HTML tag |

---

## Future Dictionaries

- [ ] Spreadsheets (`/office/calc/`)
- [ ] Presentations (`/office/slides/`)
