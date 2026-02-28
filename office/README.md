# 📚 Diccionario Ofimático

Sistema modular para consultar procedimientos en diferentes programas ofimáticos.
Actualmente trabajando en **Procesadores de Texto**.

## 🗺 Ubicación del proyecto
El proyecto está estructurado como un subdirectorio dentro de un repositorio principal. El punto de entrada del subproyecto es la carpeta `/office`, mientras que el directorio raíz del workspace se encuentra un nivel por encima.

## 🎯 Características

- **Búsqueda rápida**: Encuentra procedimientos al instante, con botón para limpiar el buscador
- **Filtrado por programa**: Muestra solo los pasos del programa que te interesa
- **Imágenes de apoyo**: Capturas de pantalla cuando sea necesario
- **Exportación a PDF**: Genera un PDF con índice interactuable, encabezado, pie de página, formato enriquecido y bloques sin cortar entre páginas
- **Diseño responsive**: Funciona en móviles y ordenadores
- **Modular y escalable**: Fácil de expandir con nuevos contenidos

## 📂 Estructura

```
(raíz del repo)/
  └── imgs/
      └── logo_small.png           # Logo para el pie de página del PDF (118x100px)
  
office/
  ├── css/
  │   └── dictionary.css           # Estilos del diccionario
  |
  ├── js/
  │   ├── loader.js                # Único script en el HTML, carga jsPDF, fuse e importa los módulos
  │   ├── dictionary.js            # Clase principal: datos, renderizado y eventos
  │   ├── normalizetext.js         # Lógica de normalización exhaustiva de texto
  │   ├── pdf-export.js            # Lógica de exportación a PDF
  │   └── pdf-render.js            # Renderizador de texto enriquecido para PDF
  |
  ├── Readme.md                    # Este documento
  |
  └── text/                        # Carpeta del diccionario del Procesador de texto
      |
      ├── imgs/
      │   ├── wordlogo.png         # Logos de programas
      │   ├── GoogleDocs.png
      │   ├── LibreOffice.png
      │   └── file.png             # Capturas de pantalla opcionales
      |
      ├── json/
      │   ├── loader.json          # Lista de procedimientos que contendrá el diccionario
      │   ├── programs.json        # Lista de programas que se usarán dentro del procedimiento
      │   └── procedures/          # Carpeta que contendrá todos los json cargados en loader.json
      |
      └── dictionary.html          # Página principal
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

### 1. Añadir un nuevo procedimiento

Crea un archivo JSON en `json/procedures/` y añade su nombre a `json/loader.json`:

**Campos del procedimiento:**
- **id**: Identificador único (se puede usar para enlaces directos)
- **name**: Título que verá el usuario
- **category**: Categoría opcional (para futuras mejoras)
- **generaldesc**: *(opcional)* Descripción común a todos los programas. Aparece en la sección **Anotaciones** de cada bloque, antes de `desc`.
- **tags**: *(opcional)* Array de palabras clave para mejorar la búsqueda. No hace falta seguir ninguna convención especial; el sistema normaliza el texto automáticamente.
- **list**: Array con los pasos para cada programa

**Campos de cada paso** — solo `program` es obligatorio, el resto es opcional:
- **program**: Código del programa (debe coincidir con `programs.json`)
- **route**: Ruta de navegación por menús (admite simbología)
- **shortcut**: Atajo de teclado. Puede ser un string o un array de strings para múltiples atajos
- **desc**: Anotaciones específicas del programa (admite simbología)
- **imgs**: Array de nombres de imágenes

### 2. Simbología disponible en los campos de texto

Los campos `desc`, `generaldesc` y `route` admiten una mezcla de Markdown simplificado y HTML directo:

```
| Sintaxis     | Resultado
| `**texto**`  | **negrita**
| `*texto*`    | *itálica*
| `__texto__`  | subrayado
| `>>` o `->`  | ▶ (flecha de paso)
| `//`         | salto de línea
| HTML directo | cualquier etiqueta HTML válida
```

### 3. Añadir imágenes

1. Coloca los logos de programas en `/imgs/` con los nombres exactos especificados en `programs.json`
2. Para capturas de pantalla, súbelas a `/imgs/` y referéncialas en el campo `imgs` del procedimiento
3. El nombre de la imagen debe incluir su extensión.

## 💡 Ejemplos de uso

### Procedimiento completo

```json
{
  "id": "savefile",
  "name": "Cómo guardar tu documento",
  "category": "archivo",
  "generaldesc": "Guarda el documento en el disco local con el nombre y ubicación que elijas.",
  "tags": ["guardar", "salvar", "almacenar", "archivo"]
  "list": [
    {
      "program": "word",
      "route": "Archivo >> Guardar >> Examinar >> Selecciona en el **Explorador de Archivos** dónde guardarlo.",
      "shortcut": "Ctrl + G",
      "desc": "Es importante pulsar en *examinar* o puede que guardes el archivo en la nube.//Especialmente importante si usas una cuenta a la que podrías perder acceso.",
      "imgs": ["examinar.png"]
    },
    {
      "program": "googledocs",
      "desc": "Se guarda automáticamente, pero en la parte superior puedes cambiar el nombre.",
      "imgs": ["guardargoogle.png"]
    },
    {
      "program": "writer",
      "route": "Archivo >> Guardar",
      "shortcut": ["Ctrl + G", "Ctrl + S"]
    }
  ]
}
```


### 📕 Exportación a PDF

Edita `js/pdf-export.js` para personalizar:

- **`authorName`**: Nombre que aparece en el pie de página
- **`../../imgs/logo_small.png`**: Ruta al logo del pie de página (recomendado ~118x100px)
- Colores, márgenes y tipografía del PDF


## 🚀 Modificaciones necesarias

# En el PDF que se imprime
- [ ] Imágenes que son prácticamente cuadradas, un 50% más pequeñas.

## 🚀 Futuras mejoras no importantes

- [ ] Dividir el archivo `css` para un mejor mantenimiento
- [ ] Modo oscuro
- [ ] Sistema de categorías con navegación


## 🚀 Diccionarios futuros a añadir
- [ ] Versión para hojas de cálculo (`/office/calc/`)
- [ ] Versión para presentaciones (`/office/slides/`)


## 🔄 Adaptación a otros proyectos

Este mismo sistema podría usarse para:

1. **Diccionario de funciones**: Cambiar `programs.json` por una lista de lenguajes de programación
2. **Guías de software**: Cualquier comparativa de procedimientos entre programas
3. **Recetas**: Diferentes técnicas culinarias según el método/región
4. **Tutoriales**: Pasos diferentes según el sistema operativo

Solo necesitas adaptar los archivos JSON y los textos del HTML.

## 📝 Notas técnicas

- Todo el código (variables, funciones, IDs) está en inglés. O al menos, se ha intentado.
- Los textos visibles para el usuario están en español
- El sistema carga dinámicamente desde JSON (sin recargar página)
- Compatible con todos los navegadores modernos
- No requiere servidor (funciona con `file://`)
- El JS está dividido en módulos ES6 cargados dinámicamente por `loader.js`
- La exportación a PDF usa [jsPDF 2.5.1](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js) cargado desde CDN
- La búsqueda usa [Fuse.js 7.0.0](https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.0.0/fuse.min.js) cargado desde CDN, con búsqueda difusa (*fuzzy*) tolerante a errores tipográficos
- Antes de llegar a Fuse, el texto pasa por `normalizetext.js`, que elimina tildes, mayúsculas, plurales, variaciones de género y monosílabos irrelevantes. Esta normalización se aplica tanto al input del usuario como a los campos de los JSON, por lo que al redactar `tags` no hace falta preocuparse por tildes, plurales ni mayúsculas
- Los emojis no son compatibles con la fuente helvetica de jsPDF; en el PDF se sustituyen por `»`

## Notas para la IA
- No crees archivos nuevos sin permiso y no partas de cero. El proyecto ya tiene una base. Si se necesita alguna modificación, pide dichos archivos para trabajar sobre ellos.
