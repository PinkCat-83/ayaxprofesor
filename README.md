## Descripción

Proyecto orientado a alumnos que están empezando con la informática.  
Incluye actividades interactivas **sin publicidad**, diseñadas específicamente para mis clases y adaptadas a mi metodología de enseñanza.

---

## Tareas por realizar

La página está actualmente mal estructurada, ya que **no sigue la convención estándar de separar HTML, CSS y JavaScript**.

Por tanto, quedan pendientes las siguientes tareas:

- Separar lógicas (HTML / CSS / JS)
- Unificar el diseño visual de todas las actividades

📝 TODO List - Organización del Proyecto
📁 Estructura de carpetas a crear

 Crear carpeta raíz del proyecto
 Crear /css/ para estilos compartidos
 Crear /js/ para scripts compartidos (opcional)
 Crear /assets/ para recursos globales (logos, iconos)
 Crear /tasks/ para los ejercicios
 Crear /tasks/archivos/ para el ejercicio actual
 Crear /tasks/archivos/imgs/ para las imágenes del ejercicio

🎨 CSS y Recursos Compartidos

 Crear css/shared.css con:

Variables CSS (colores, fuentes)
Estilos de botones comunes
Navegación/layouts comunes


 Añadir Tailwind CDN a ejercicios nuevos: <script src="https://cdn.tailwindcss.com"></script>
 Copiar favicon.ico a la raíz

🏠 Página Principal

 Crear index.html con menú de ejercicios
 Diseñar con Tailwind
 Añadir enlaces a cada ejercicio (/tasks/[nombre]/index.html)

📂 Migrar Ejercicio de Archivos

 Mover archivos.html a /tasks/archivos/index.html
 Mover imágenes a /tasks/archivos/imgs/
 Actualizar rutas de imágenes en el HTML
 Actualizar ruta del favicon: ../../favicon.ico
 Añadir enlace "Volver al inicio" que apunte a ../../index.html
 (Opcional) Separar CSS y JS en archivos independientes

🔧 Ajustes Finales

 Verificar que todos los enlaces funcionen
 Probar navegación entre páginas
 Verificar que las imágenes carguen correctamente
 Documentar estructura en README.md (opcional)

🚀 Para Ejercicios Futuros

 Crear nueva carpeta en /tasks/[nombre]/
 Incluir Tailwind CDN + shared.css
 Crear estructura: index.html, style.css (si necesario), script.js
 Añadir al menú principal


Estructura final esperada:
proyecto/
├── index.html
├── favicon.ico
├── css/shared.css
├── assets/
└── tasks/
    └── archivos/
        ├── index.html
        └── imgs/


---

## Nuevas actividades

Las actividades marcadas con un `*` son actividades que se espera **modificar en un futuro cercano**, sustituyendo el uso de páginas externas por un **diseño propio**.
