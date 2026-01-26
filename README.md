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

### Enlaces Externos
- Recursos adicionales organizados

## 🚀 Acceso

Visita la web en: [ayaxprofesor.es]

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript Vanilla
- JSON para gestión de contenidos

## 📋 Estado del Proyecto

**En desarrollo activo** 🚧

### Completadas ✅
- Sistema de mecanografía modular
- Múltiples actividades interactivas
- Diseño responsive

### Pendientes 📝
- Modularizar actividades individuales (actualmente en archivos únicos)
- Centralizar estilos CSS
- Integrar actividades de periféricos (actualmente externas)

*Nota: Las actividades marcadas con asterisco (*) en la web están en periodo de adaptación*

## 📁 Estructura del Proyecto

```
ayaxprofesor/
├── css/
│   └── redirect_css.css     # CSS para páginas de redirecciones externas (temporales generalmente)
├── imgs/
│   ├── fileexplorer5/       # Imágenes del ejercicio de explorador de archivos.
│   │   ├── 01.jpg - 08.jpg
│   ├── fileexplorer8/       # Imágenes del ejercicio de explorador de archivos.
│   │   ├── 01.jpg - 08.jpg
│   ├── anne.png
│   ├── externallinks.png
│   ├── logo.png
│   └── title.png
├── res/
│   ├── cat-animation.js
│   └── cat-bouncing.css
├── tasks/
│   ├── typing_task/         # Actividad de mecanografía (modular)
│   │   ├── css/
│   │   │   ├── controls.css
│   │   │   ├── effects.css
│   │   │   └── main.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── distractors.js
│   │   │   ├── game.js
│   │   │   ├── metrics.js
│   │   │   ├── textloader.js
│   │   │   ├── ui.js
│   │   │   └── zoom-controls.js
│   │   ├── json/            # Textos temáticos curados
│   │   │   ├── Group_Astronomia.json
│   │   │   ├── Group_Ayax.json
│   │   │   ├── Group_Curiosidades.json
│   │   │   ├── Group_Historias_IA.json
│   │   │   ├── Group_Informatica.json
│   │   │   ├── Group_Pelis.json
│   │   │   ├── Group_Randoms.json
│   │   │   ├── Group_Tramposos.json
│   │   │   └── loader.json
│   │   └── typing.html
│   ├── anne.html            # Página de soluciones al ejercicio "The Voyage of the Marvelous Anne"
│   ├── archivos.html        # Explorador de archivos con checklist
│   ├── extensiones.html     # Unir extensión con su uso
│   ├── ofimatica.html       # Explicación de los distintos tipos de programas de ofimática que existen
│   └── rosco.html           # Rosco de palabras para comprobar el nivel del alumnado
├── CNAME
├── favicon.ico
├── index.html               # Página principal
└── README.md
```

## 👨‍🏫 Propósito Educativo

Este proyecto nace con el objetivo de proporcionar un espacio seguro y accesible para el aprendizaje de informática, eliminando las distracciones típicas de internet y centrándose en la experiencia educativa.

---

Desarrollado con 😻 rosas para facilitar el aprendizaje en informática