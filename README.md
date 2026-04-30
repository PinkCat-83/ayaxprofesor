# 🎓 Ayax Profesor

Un entorno educativo web diseñado para actividades de informática, completamente **libre de publicidad** y con todo a un solo clic.

<p align="center">
  <img src="imgs/logo.png" width="200" alt="Ayax Logo">
</p>

## ✨ Características

- **Sin distracciones**: Entorno limpio sin publicidad ni barreras
- **Acceso rápido**: Todas las actividades a un solo clic
- **Variedad de contenidos**: Desde mecanografía hasta ofimática
- **Actividades interactivas**: Juegos educativos y ejercicios prácticos

## 📚 Actividades Disponibles

### Principales
- **Mecanografía** - Práctica de escritura con múltiples textos temáticos.
- **Anne** - Actividad interactiva (actividad secreta basada en una historia).
- **Archivos** - Gestión de archivos, simulando el `explorador de archivos` en un entorno controlado.
- **Extensiones** - Aprendizaje sobre extensiones de archivo
- **Rosco** - Juego tipo pasapalabra pensado para determinar el nivel del alumnado.
- **Gato Saltarín** - Juego educativo sobre clasificación de periféricos (entrada/salida). Motor modular configurable mediante JSON.

## 🚀 Acceso

Visita la web en: [ayaxprofesor.es](https://ayaxprofesor.es)

## 🚧 En desarrollo activo 🚧

- Modularizar actividades individuales (actualmente en archivos únicos)

## 📁 Estructura del Proyecto

```
ayaxprofesor/
├── css/
│   ├── cat-bouncing.css     # CSS usado en los gatos revotando?
│   ├── menu.css             # Diseño a implementar en el menú principal.
│   ├── foot.css             # CSS para el pie de página grande.
│   ├── tinyfoot.css         # CSS para el pie de página pequeño (incluye estilos del iframe y la ventana)
│   ├── redirect_css.css     # CSS para páginas de redirecciones externas (temporales generalmente)
│   └── mobile-warning.css   # Overlay de aviso para pantallas < 1024px (compartido)
│
├── imgs/
│   ├── 🧨icons/             # Carpeta contenedora de iconos de programas (habrá que moverla a Office más adelante)
│   ├── 🧨anne.png           # Imagen para la actividad ""The Voyage of the Marvelous Anne" (habrá que moverla a su carpeta correcta más adelante)
│   ├── pet.png
│   └── logo.png
│
├── js/
│   ├── iframeanimation.js   # Animación para esconder el layout tinyfoot.html
│   ├── tinyfootlogic.js     # Lógica interna del tinyfoot: temporizador, barra de progreso, botón X y reapertura
│   ├── glitch.js            # Animación de "glitch" para index.html
│   ├── textfit.js           # Script para manejar el tamaño de la fuente en index.html
│   ├── catwaiting.js        # Animación de un gato esperando.
│   ├── cat-animation.js     # Animación de gatos revotando de index.html
│   └── mobile-warning.js    # Lógica del aviso de pantalla pequeña (compartido)
│
├── layout/
│   ├── foot.html            # layout para el pie de página grande. 
│   └── tinyfoot.html        # layout para el pie de página pequeño (el más usado). 
|
├── moodle/                  # Instrucciones para trabajar en Moodle, para no repetir código html en enunciados. Técnicamente, no tiene nada que ver con la página.
|
├── office/[...]             # Proyecto en pruebas, que será un "diccionario" de "dónde encontrar tal herramienta en cada programa de ofimática". Modulable con json.
|
├── tasks/
│   ├── typing_task/[...]       # ⌨ Actividad de mecanografía (modular, pero requiere revisión para advertencia en páginas muy pequeñas. (ver README_Tasks.md)
│   ├── questions_task/[...]    # 🐱 Gato Saltarín – juego modular de clasificación de periféricos (ver README_Tasks.md)
│   ├── extensions_task/[...]   # 🎯 El Desafío de las Extensiones – juego modular de extensiones de archivo (ver README_TASK.md)
│   ├── explorer_task/[...]     # 🔍 Explorador de archivos con checklist (ver README_TASK.md)
│   ├── word_task/[...]         # 🆎 Rosco de palabras para comprobar el nivel del alumnado (ver README_Tasks.md)
│   ├── 🧨 dropimages_task/[...]   # Falta por realizar
│   └── 🧨 anne.html            # Página de soluciones al ejercicio "The Voyage of the Marvelous Anne" (Falta modular, poca prioridad)
|
├── CNAME
├── favicon.ico
├── index.html               # Página principal
├── ofimatica.html           # Explicación de los distintos tipos de programas de ofimática que existen
├── DESIGN_SYSTEM.md         # Diccionario de estilos decididos para un diseño homogéneo
└── README.md
```

## DISCLAIMER de la estructura de archivos
Aunque se ha conseguido unificar los estilos, la diversidad de propósito de cada ejercicio hace que sea más práctico que cada *tarea* mantenga su propia estructura de archivos siendo estas:

```
├── tasks/
│   ├── name_task/
│   │     ├── audio/           # Si la tarea lo requiere.
│   │     ├── img/             # Si la tarea lo requiere.
│   │     ├── js/              # Módulos javascript.
│   │     ├── json/            # Archivos json.
│   │     ├── css/             # Archivos css de estilos.
│   │     ├── README_TASK      # Archivo README de la tarea en concreto, que explica la tarea y su funcionamiento y estructura.
│   │     └── name_task.html   # Archivo de entrada estándar para el proyecto. Suele tener el mismo nombre de la actividad.
```


## Los archivos marcados con 🧨 significa que requieren modulación y actualización de archivos o diseño.


---

## 🧩 Snippets — Insertar componentes compartidos en una página nueva

Referencia rápida para no tener que buscar en archivos sueltos. Todos usan rutas absolutas y funcionan desde cualquier subcarpeta del proyecto.

---

### 🦶 Pie de página grande (`foot`)

Pie de página completo con información del autor. Se incrusta como `iframe` fijo en la parte inferior.

```html
<!-- IFRAME al final de BODY para el FOOT grande -->
<iframe src="/layout/foot.html" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 60px; border: none; z-index: 9999;"></iframe>
```

---

### 🐾 Pie de página pequeño (`tinyfoot`)

Versión compacta del pie, con animación de entrada/salida. Requiere su CSS en el `<head>` y su script al final del `<body>`.

```html
<!-- CSS en el HEAD para el TINYFOOT -->
<link rel="stylesheet" href="/css/tinyfoot.css">

<!-- IFRAME al final de BODY para el TINYFOOT -->
<iframe id="tinyfoot-iframe" class="tinyfoot-iframe" src="/layout/tinyfoot.html" scrolling="no"></iframe>
<!-- JS al final de BODY para la animación del TINYFOOT -->
<script src="/js/iframeanimation.js"></script>
```

---

### 📵 Aviso de pantalla pequeña (`mobile-warning`)

Overlay que se activa cuando la pantalla es inferior a 1024px. Se descarta por sesión si el usuario elige entrar igualmente.

```html
<!-- CSS en el HEAD para el warning de móviles -->
<link rel="stylesheet" href="/css/mobile-warning.css">

<!-- JS al final de BODY para el warning de móviles -->
<script src="/js/mobile-warning.js"></script>
```

---



## Cuestiones a preguntarse a futuro

- ¿Es mejor unificar todos los CSS ahora que tienen un diseño parecido o mejor lo dejamos como está?


## 👨‍🏫 Propósito Educativo

Este proyecto nace con el objetivo de proporcionar un espacio seguro y accesible para el aprendizaje de informática, eliminando las distracciones típicas de internet y centrándose en la experiencia educativa.


## Despedida
Desarrollado con `gatitos rosas` para facilitar el aprendizaje en informática básica.
