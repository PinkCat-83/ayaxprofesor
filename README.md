# 🎓 Ayax Profesor

Un entorno educativo web diseñado para actividades de informática, completamente **libre de publicidad** y con todo a un solo clic.

![Ayax Logo](imgs/logo.png)

## ✨ Características

- **Sin distracciones**: Entorno limpio sin publicidad ni barreras
- **Acceso rápido**: Todas las actividades a un solo clic
- **Variedad de contenidos**: Desde mecanografía hasta ofimática
- **Actividades interactivas**: Juegos educativos y ejercicios prácticos

## 📚 Actividades Disponibles

### Principales
- **Mecanografía** - Práctica de escritura con múltiples textos temáticos.
- **Anne** - Actividad interactiva
- **Archivos** - Gestión de archivos, simulando el `explorador de archivos` en un entorno controlado.
- **Extensiones** - Aprendizaje sobre extensiones de archivo
- **Rosco** - Juego tipo pasapalabra pensado para determinar el nivel del alumnado.
- **Actividades con un '*'** - Son actividades externas, que aún no se han adaptado a un diseño propio.

### Enlaces Externos
- Recursos adicionales organizados

## 🚀 Acceso

Visita la web en: [ayaxprofesor.es]

## 🚧 En desarrollo activo 🚧

- Modularizar actividades individuales (actualmente en archivos únicos)
- Integrar actividades de periféricos (actualmente externas)

## 📁 Estructura del Proyecto

```
ayaxprofesor/
├── layout/
│   ├── foot.html            # layout para el pie de página grande. 
│   ├── tinyfoot.html        # layout para el pie de página grande. 
├── css/
│   ├── foot.css             # CSS para el pie de página grande.
│   ├── tinyfoot.css         # CSS para el pie de página pequeño.
│   └── redirect_css.css     # CSS para páginas de redirecciones externas (temporales generalmente)
├── imgs/
│   ├── fileexplorer5/       # Imágenes del ejercicio de explorador de archivos. (habrá que moverlas a su carpeta correcta más adelante)
│   ├── fileexplorer8/       # Imágenes del ejercicio de explorador de archivos. (habrá que moverlas a su carpeta correcta más adelante)
│   ├── anne.png             # Imagen para la actividad ""The Voyage of the Marvelous Anne" (habrá que moverla a su carpeta correcta más adelante)
│   ├── externallinks.png    
│   ├── logo.png
│   └── title.png
├── moodle/                 # Instrucciones para trabajar en Moodle, para no repetir código html en enunciados. Técnicamente, no tiene nada que ver con la página.
├── office/                 # Proyecto en pruebas, que será un "diccionario" de "dónde encotnrar tal herramienta en cada programa de ofimática". Modulable con json.
├── res/
│   ├── cat-animation.js    # Habrá que moverlo más adelante, cuando la página principal se modulice.
│   └── cat-bouncing.css    # Habrá que moverlo más adelante, cuando la página principal se modulice.
├── tasks/
│   ├── typing_task/         # Actividad de mecanografía (modular, pero requiere revisión para advertencia en páginas muy pequeñas.
│   ├── anne.html            # Página de soluciones al ejercicio "The Voyage of the Marvelous Anne" (Falta modular, poca prioridad)
│   ├── archivos.html        # Explorador de archivos con checklist (Falta modular)
│   ├── extensiones.html     # Unir extensión con su uso (Falta modular y adaptar diseño más específico a la página)
│   ├── ofimatica.html       # Explicación de los distintos tipos de programas de ofimática que existen (No es una actividad, hay que moverlo fuera)
│   └── word_task/           # Rosco de palabras para comprobar el nivel del alumnado (modular, pero requiere revisión para mejorar su uso en móviles.)
├── CNAME
├── favicon.ico
├── index.html               # Página principal
└── README.md
```

## DISCLAIMER de la estructura de archivos
Debido a la diversidad de diseños y propósitos de cada ejercicio interactivo, cada uno tendrá su propia estructura interna de carpetas:
```
\img
\css
\js
\json
```
Aunque, por ahora, no todas las tareas están separadas correctamente (hay mucho trabajo aún que aplicar).
Cada task tendrá su propio `README_TASK.md` que indicará todo lo relacionado con dicha tarea en concreto.



## 👨‍🏫 Propósito Educativo

Este proyecto nace con el objetivo de proporcionar un espacio seguro y accesible para el aprendizaje de informática, eliminando las distracciones típicas de internet y centrándose en la experiencia educativa.

---

Desarrollado con 😻 rosas para facilitar el aprendizaje en informática

## Cambios efectuados

08/02/2026 - Introducido foot.html y tinyfoot.html, restructuración de algunos archivos y carpetas. Estreno de esta sección.