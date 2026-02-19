# Changelog

Historial de cambios del proyecto Ayax Profesor.

## 2026-02-08

### Añadido
- Layouts modulares para pies de página (`foot.html` y `tinyfoot.html`)
- Archivos CSS específicos para layouts de pie de página (`foot.css` y `tinyfoot.css`)

### Modificado
- Reestructuración de archivos y carpetas del proyecto.
- Actualización del `README.md` con estructura de proyecto detallada.

## 2026-02-19

### Modificaciones
- Actualizado el diseño de `index.html` para intentar estandarizarlo. Se añadió `menu.css`.
- Se movieron algunos archivos de carpetas para mantener una coherencia organizativa más estándar.
- Se añadió, además del diseño nuevo, un efecto de "glitch" para `index.html`.
- El layout `foot.html` aún no se le ha dado uso.
- Se agregó una carpeta `icons` dentro de `imgs` para hacer referencias.
- `js/glitch.js` — Efecto de "hackeo" periódico (cada 30-60 segundos) con cortes horizontales, ruido estático y barra de escáner. Configurable vía `window.GLITCH_CONFIG`. Expone `window.triggerGlitch()` para lanzarlo manualmente.
- `js/textfit.js` — Ajusta automáticamente el tamaño de fuente de los títulos de grupo y etiquetas de botón para que quepan en su contenedor sin truncarse. Se re-ejecuta al abrir grupos y al redimensionar la ventana.
