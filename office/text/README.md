# 📚 Diccionario Ofimático

Sistema modular para consultar procedimientos en diferentes programas ofimáticos.

## 🎯 Características

- **Búsqueda rápida**: Encuentra procedimientos al instante
- **Filtrado por programa**: Muestra solo los pasos del programa que te interesa
- **Imágenes de apoyo**: Capturas de pantalla cuando sea necesario
- **Diseño responsive**: Funciona en móviles y ordenadores
- **Modular y escalable**: Fácil de expandir con nuevos contenidos

## 📂 Estructura

```
office/text/
├── css/
│   └── dictionary.css          # Estilos del diccionario
├── js/
│   └── dictionary.js           # Lógica de la aplicación
├── json/
│   ├── programs.json           # Lista de programas disponibles
│   └── content.json            # Procedimientos y sus pasos
├── imgs/
│   ├── wordlogo.png           # Logos de programas
│   ├── GoogleDocs.png
│   ├── LibreOffice.png
│   └── [capturas]             # Capturas de pantalla opcionales
└── dictionary.html             # Página principal
```

## 🔧 Cómo añadir contenido

### 1. Añadir un nuevo programa

Edita `json/programs.json`:

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

- **code**: Identificador único (minúsculas, sin espacios)
- **realName**: Nombre completo para mostrar
- **img**: Nombre del archivo de imagen (debe estar en `/imgs/`)

### 2. Añadir un nuevo procedimiento

Edita `json/content.json`:

```json
{
  "procedures": [
    {
      "id": "mi-procedimiento",
      "name": "Título del procedimiento",
      "category": "categoria-opcional",
      "list": [
        {
          "program": "word",
          "desc": "Paso 1 → Paso 2 → Paso 3",
          "imgs": []
        },
        {
          "program": "googledocs",
          "desc": "Menú → Opción → Subopción",
          "imgs": ["captura1.png", "captura2.png"]
        }
      ]
    }
  ]
}
```

**Campos del procedimiento:**
- **id**: Identificador único (se puede usar para enlaces directos)
- **name**: Título que verá el usuario
- **category**: Categoría opcional (para futuras mejoras)
- **list**: Array con los pasos para cada programa

**Campos de cada paso:**
- **program**: Código del programa (debe coincidir con `programs.json`)
- **desc**: Descripción del procedimiento (usa → para separar pasos)
- **imgs**: Array de nombres de imágenes (opcional, pueden estar vacío: `[]`)

### 3. Añadir imágenes

1. Coloca los logos de programas en `/imgs/` con los nombres exactos especificados en `programs.json`
2. Para capturas de pantalla, súbelas a `/imgs/` y referéncialas en el campo `imgs` del procedimiento

## 💡 Ejemplos de uso

### Procedimiento simple (sin imágenes)

```json
{
  "id": "bold-text",
  "name": "Poner texto en negrita",
  "category": "formato",
  "list": [
    {
      "program": "word",
      "desc": "Seleccionar texto → Ctrl+B (o botón N en la barra)",
      "imgs": []
    },
    {
      "program": "googledocs",
      "desc": "Seleccionar texto → Ctrl+B",
      "imgs": []
    }
  ]
}
```

### Procedimiento con imágenes

```json
{
  "id": "insert-table",
  "name": "Insertar una tabla",
  "category": "insertar",
  "list": [
    {
      "program": "word",
      "desc": "Insertar → Tabla → Elegir filas y columnas",
      "imgs": ["word-tabla-menu.png", "word-tabla-selector.png"]
    }
  ]
}
```

## 🎨 Personalización

### Colores

Edita las variables CSS en `css/dictionary.css`:

```css
:root {
    --primary-color: #4a90e2;      /* Color principal */
    --secondary-color: #f39c12;     /* Color secundario */
    --background-color: #f5f7fa;    /* Fondo de página */
    --card-background: #ffffff;     /* Fondo de tarjetas */
}
```

## 🚀 Futuras mejoras

- [ ] Sistema de categorías con navegación
- [ ] Exportar a PDF
- [ ] Modo oscuro
- [ ] Favoritos del usuario (localStorage)
- [ ] Atajos de teclado
- [ ] Versión para hojas de cálculo (`/office/calc/`)
- [ ] Versión para presentaciones (`/office/slides/`)

## 🔄 Adaptación a otros proyectos

Este mismo sistema puede usarse para:

1. **Diccionario de funciones**: Cambiar `programs.json` por una lista de lenguajes de programación
2. **Guías de software**: Cualquier comparativa de procedimientos entre programas
3. **Recetas**: Diferentes técnicas culinarias según el método/región
4. **Tutoriales**: Pasos diferentes según el sistema operativo

Solo necesitas adaptar los archivos JSON y los textos del HTML.

## 📝 Notas técnicas

- Todo el código (variables, funciones, IDs) está en inglés
- Los textos visibles para el usuario están en español
- El sistema carga dinámicamente desde JSON (sin recargar página)
- Compatible con todos los navegadores modernos
- No requiere servidor (funciona con file://)
