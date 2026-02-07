# 📋 Plantillas para añadir contenido

## Plantilla: Nuevo programa en programs.json

```json
{
  "code": "nombre-programa",
  "realName": "Nombre Completo del Programa",
  "img": "logo-programa.png"
}
```

**Ejemplo Excel:**
```json
{
  "code": "excel",
  "realName": "Microsoft Office Excel 365",
  "img": "excellogo.png"
}
```

---

## Plantilla: Procedimiento simple (sin imágenes)

```json
{
  "id": "identificador-unico",
  "name": "Título del procedimiento visible",
  "category": "nombre-categoria",
  "list": [
    {
      "program": "word",
      "desc": "Paso 1 → Paso 2 → Paso 3",
      "imgs": []
    },
    {
      "program": "googledocs",
      "desc": "Paso 1 → Paso 2 → Paso 3",
      "imgs": []
    },
    {
      "program": "libreoffice",
      "desc": "Paso 1 → Paso 2 → Paso 3",
      "imgs": []
    }
  ]
}
```

**Ejemplo real:**
```json
{
  "id": "change-font",
  "name": "Cambiar el tipo de fuente",
  "category": "formato",
  "list": [
    {
      "program": "word",
      "desc": "Seleccionar texto → Inicio → Fuente → Elegir tipo",
      "imgs": []
    },
    {
      "program": "googledocs",
      "desc": "Seleccionar texto → Barra de herramientas → Menú desplegable de fuentes",
      "imgs": []
    },
    {
      "program": "libreoffice",
      "desc": "Seleccionar texto → Formato → Carácter → Fuente",
      "imgs": []
    }
  ]
}
```

---

## Plantilla: Procedimiento con imágenes

```json
{
  "id": "identificador-unico",
  "name": "Título del procedimiento",
  "category": "nombre-categoria",
  "list": [
    {
      "program": "word",
      "desc": "Paso 1 → Paso 2 → Paso 3",
      "imgs": ["word-captura1.png", "word-captura2.png"]
    },
    {
      "program": "googledocs",
      "desc": "Paso 1 → Paso 2",
      "imgs": ["gdocs-captura1.png"]
    },
    {
      "program": "libreoffice",
      "desc": "Paso 1 → Paso 2 → Paso 3",
      "imgs": []
    }
  ]
}
```

**Ejemplo real:**
```json
{
  "id": "insert-table",
  "name": "Insertar una tabla",
  "category": "insertar",
  "list": [
    {
      "program": "word",
      "desc": "Insertar → Tabla → Insertar tabla → Configurar filas y columnas",
      "imgs": ["word-menu-tabla.png", "word-config-tabla.png"]
    },
    {
      "program": "googledocs",
      "desc": "Insertar → Tabla → Elegir dimensiones con el ratón",
      "imgs": ["gdocs-selector-tabla.png"]
    },
    {
      "program": "libreoffice",
      "desc": "Tabla → Insertar tabla → Configurar dimensiones",
      "imgs": []
    }
  ]
}
```

---

## Plantilla: Procedimiento no disponible en algún programa

```json
{
  "id": "identificador",
  "name": "Función específica",
  "category": "categoria",
  "list": [
    {
      "program": "word",
      "desc": "Paso 1 → Paso 2",
      "imgs": []
    },
    {
      "program": "googledocs",
      "desc": "No disponible de forma nativa. Alternativa: [explicar alternativa]",
      "imgs": []
    },
    {
      "program": "libreoffice",
      "desc": "Paso 1 → Paso 2",
      "imgs": []
    }
  ]
}
```

---

## 💡 Tips para crear buen contenido

### Descripciones claras
- Usa el símbolo → para separar pasos claramente
- Sé específico con los nombres de menús (usa los nombres exactos)
- Menciona atajos de teclado cuando sean útiles

**Bueno:** `Inicio → Párrafo → Alineación → Justificar (o Ctrl+J)`
**Malo:** `Alinear el texto`

### Imágenes útiles
- Solo añade capturas cuando realmente aporten valor
- Nombra las imágenes de forma descriptiva: `word-insertar-tabla.png`
- Optimiza el tamaño antes de subirlas (no más de 500KB cada una)

### IDs descriptivos
- Usa guiones para separar palabras: `insert-page-break`
- En inglés para mantener consistencia
- Que describan la acción: `change-font-size`, `add-header`

### Categorías sugeridas
- `formato` - Formateo de texto, párrafos, estilos
- `insertar` - Insertar elementos (imágenes, tablas, etc.)
- `diseño` - Diseño de página, márgenes, orientación
- `referencias` - Tablas de contenido, citas, bibliografía
- `revision` - Ortografía, cambios, comentarios
- `archivo` - Guardar, exportar, imprimir
- `vista` - Zoom, vistas del documento

---

## 🎯 Checklist antes de añadir contenido

- [ ] El ID es único y no existe ya
- [ ] El nombre es claro y descriptivo
- [ ] Todos los programas tienen su procedimiento (o se indica que no está disponible)
- [ ] Los pasos usan → para separar claramente
- [ ] Las imágenes están en la carpeta `/imgs/` si las hay
- [ ] Los nombres de archivo de imagen no tienen espacios ni caracteres especiales
- [ ] Las rutas en `"imgs"` son solo el nombre del archivo, no la ruta completa
- [ ] He probado que funciona antes de publicar

---

## 🚀 Flujo de trabajo recomendado

1. **Planifica**: Haz una lista de procedimientos que quieres añadir
2. **Captura**: Si necesitas imágenes, hazlas antes y nómbralas bien
3. **Escribe**: Abre `content.json` y añade el nuevo procedimiento
4. **Prueba**: Abre `dictionary.html` y verifica que se ve bien
5. **Ajusta**: Corrige descripciones si algo no queda claro
6. **Publica**: Sube los cambios a tu servidor

---

## 📝 Ejemplo completo listo para copiar

```json
{
  "id": "page-break",
  "name": "Insertar salto de página",
  "category": "insertar",
  "list": [
    {
      "program": "word",
      "desc": "Insertar → Salto de página (o Ctrl+Enter)",
      "imgs": []
    },
    {
      "program": "googledocs",
      "desc": "Insertar → Salto → Salto de página (o Ctrl+Enter)",
      "imgs": []
    },
    {
      "program": "libreoffice",
      "desc": "Insertar → Salto manual → Salto de página (o Ctrl+Enter)",
      "imgs": []
    }
  ]
}
```

¡Copia este bloque en el array `"procedures"` de tu `content.json` y ya está!
