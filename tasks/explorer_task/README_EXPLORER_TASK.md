# 📁 explorer_task — Explorador de Archivos Simulado

Simulador interactivo de un explorador de archivos estilo Windows para practicar operaciones básicas de gestión de archivos: mover, copiar, renombrar, crear carpetas y borrar.

---

## 📌 Estado actual

> 🧨 **Pendiente de modularización** — actualmente existe como `archivos.html` en la raíz de `tasks/`. Este documento describe la estructura objetivo tras la modularización.

---

## 🎯 Descripción pedagógica

El alumnado interactúa con un explorador de archivos simulado (sin acceso al sistema real) y debe completar tareas de organización. Cada ejercicio introduce o refuerza una habilidad concreta del manejo de archivos.

**Habilidades trabajadas:**
- Cortar, copiar y pegar archivos
- Renombrar archivos
- Crear carpetas
- Navegar por la jerarquía de carpetas
- Clasificar por tipo, nombre o contenido visual

---

## 📂 Estructura de carpetas objetivo

```
tasks/explorer_task/
├── expolorer.html          # Punto de entrada principal (renombrado desde archivos.html)
├── css/
│   └── explorer.css        # Todos los estilos del simulador
├── js/
│   └── explorer.js         # Lógica del simulador (estado, render, operaciones)
├── json/
│   ├── exercise_01.json    # Ejercicio: Viaje (cortar/pegar)
│   ├── exercise_02.json    # Ejercicio: Otros destinos (renombrar + mover)
│   ├── exercise_03.json    # Ejercicio: Colores (crear carpetas + renombrar)
│   ├── exercise_04.json    # Ejercicio: Cosméticos (clasificar por categoría)
│   ├── exercise_05.json    # Ejercicio: Documentos (imágenes reales como iconos)
│   ├── exercise_06.json    # Ejercicio: Copias (copiar sin cortar)
│   ├── exercise_07.json    # Ejercicio: Estaciones (iconos emoji + renombrar)
│   ├── exercise_08.json    # Ejercicio: Películas (imágenes reales como iconos)
│   └── exercise_09.json    # Ejercicio: Extensiones (clasificar por tipo de archivo)
├── img/
│   ├── fileexplorer5/      # Imágenes para ejercicio 05 (documentos/facturas)
│   │   └── 01.jpg … 08.jpg
│   └── fileexplorer8/      # Imágenes para ejercicio 08 (películas/dibujos)
│       └── 01.jpg … 08.jpg
└── audio/                  # (reservado) Sin audio actualmente en esta task
```

> Las imágenes en `img/` se moverán desde `imgs/fileexplorer5/` e `imgs/fileexplorer8/` de la raíz del proyecto.

---

## 🧩 Ejercicios disponibles

| # | Nombre | Habilidad principal | Iconos |
|---|--------|--------------------|----|
| 01 | Viaje | Cortar y pegar | 🗺️ Emoji genérico de imagen |
| 02 | Otros destinos | Renombrar + mover | 🗺️ Emoji genérico de imagen |
| 03 | Colores | Crear carpetas + renombrar | Emoji de color (🔵🍋🍎🍀) |
| 04 | Cosméticos | Clasificar por categoría | Emoji de producto (💍👓⌚) |
| 05 | Documentos | Cortar/pegar con imagen real | Imagen real (fileexplorer5/) |
| 06 | Copias | Copiar (no cortar) | Emoji temático (⚽🏖️🦜) |
| 07 | Estaciones | Renombrar + clasificar | Emoji de estación (🌸☀️🍂❄️) |
| 08 | Películas | Clasificar con imagen real | Imagen real (fileexplorer8/) |
| 09 | Extensiones | Clasificar por tipo de archivo | Emoji por extensión (🎵🎬📄📷) |

---

## 🔧 Arquitectura de datos (JSON por ejercicio)

Cada `exercise_XX.json` define un ejercicio completo. Estructura objetivo:

```json
{
  "id": 1,
  "title": "Carpeta 01 - Viaje",
  "menuLabel": "📁 01 - Viaje",
  "menuDesc": "Organiza archivos de viajes",
  "description": "Coloca los archivos de cada viaje en la carpeta correspondiente.",
  "tasks": [
    "Mueve los 4 archivos de cada país a su carpeta correspondiente",
    "..."
  ],
  "hints": [
    "Primero, haz clic en el archivo para seleccionarlo",
    "..."
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

**`iconMode`** puede ser:
- `"emoji"` — usa el mapa de `icons: { "nombreArchivo": "🎵" }`
- `"image"` — usa el mapa de `icons: { "nombreArchivo": "img/fileexplorer5/01.jpg" }`
- `"auto"` — icono de carpeta/archivo genérico según tipo

**Nota sobre `checklist` y `validateRules`:** Las validaciones complejas (ej. normalización de tildes, regex de colores) que actualmente están en funciones JS inline deberán migrarse a tipos declarativos en JSON o mantenerse como funciones nombradas en `explorer.js`.

---

## ⚙️ Lógica JS (`explorer.js`)

Funciones principales a extraer del `<script>` inline actual:

| Función | Descripción |
|---------|-------------|
| `startExercise(num)` | Carga un ejercicio y oculta el menú |
| `backToMenu()` | Vuelve al menú de selección |
| `initializeExercise(exercise)` | Inicializa el estado con `initialFiles` |
| `render()` | Renderiza la vista actual del explorador |
| `updateAddressBar()` | Actualiza la ruta mostrada |
| `selectItem(name, event)` | Selecciona un archivo o carpeta |
| `openFolder(name)` | Navega dentro de una carpeta |
| `goBack()` | Sube un nivel en la jerarquía |
| `updateButtons()` | Activa/desactiva botones según estado |
| `createFolder()` | Crea una nueva carpeta |
| `cutItem()` | Corta el elemento seleccionado |
| `copyItem()` | Copia el elemento seleccionado |
| `pasteItem()` | Pega desde el portapapeles |
| `renameItem()` | Renombra el elemento seleccionado |
| `deleteItem()` | Elimina el elemento seleccionado |
| `showHint()` | Muestra la siguiente pista cíclica |
| `updateChecklist(exercise)` | Actualiza el panel de checklist |
| `getCurrentFolder()` | Helper: devuelve el objeto de la carpeta actual |

**Estado global** (variables a mantener en módulo o closure):
- `fileSystem` — árbol de archivos en memoria
- `currentPath` — array de nombres de carpeta (ruta actual)
- `selectedItem` — nombre del elemento seleccionado
- `clipboard` — `{ name, path }` del elemento en portapapeles
- `clipboardMode` — `'cut'` o `'copy'`
- `currentExercise` — número del ejercicio activo
- `hintLevel` — índice de la pista actual
- `iconMapping` — mapa de rutas a iconos tras renombrar

---

### Decisión de diseño para la modularización

Este simulador tiene dos capas visuales diferenciadas:

1. **Menú de selección de ejercicios** — debe adaptarse al Design System (fondo degradado pastel, Fredoka One, `--pink-dark`, mascota `pet.png`).
2. **Simulador en sí** — debe mantener la estética de Windows Explorer (fondo blanco/gris, tipografía de sistema, toolbar con iconos SVG) para que el alumnado reconozca el entorno real. No se aplica el Design System aquí.

### Aclaración sobre estética
- Debido a que la idea del ejercicio es que se parezca lo más posible al **Explorador de Archivos** de *Windows*, la estética es claramente distinta a lo acordado en DESIGN_SYSTEM.md

---

## 🔗 Recursos compartidos usados

| Recurso | Ruta | Descripción |
|---------|------|-------------|
| `tinyfoot.css` | `/css/tinyfoot.css` | Estilos del iframe de autor |
| `tinyfoot.html` | `/layout/tinyfoot.html` | Layout del pie de autor |
| `iframeanimation.js` | `/js/iframeanimation.js` | Animación del iframe |
| `favicon.ico` | `/favicon.ico` | Icono de pestaña |

## 📝 Notas adicionales

- Las funciones de validación de los ejercicios 3, 4, 7 y 8 usan expresiones regulares y normalización de tildes. Al migrar a JSON, estas reglas deben representarse con `checkType` declarativo o mantenerse como funciones nombradas en `explorer.js`.
- El ejercicio 1 tiene una restricción especial en `pasteItem()`: no permite pegar en la raíz si el modo es `cut`. Esta lógica debe preservarse en `explorer.js` como caso especial documentado.
- El ejercicio 6 tiene validación de que los archivos originales permanezcan en la raíz (para forzar el uso de Copiar en lugar de Cortar).
- `iconMapping` es el mecanismo que mantiene la asociación icono↔archivo tras un renombrado; es crítico para los ejercicios con imágenes reales (05, 08).
