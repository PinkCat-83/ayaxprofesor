# 🐱 Gato Saltarín – ¿Entrada o Salida?

Juego educativo sobre clasificación de periféricos de ordenador.

## Estructura de archivos

```
peripheral_task/
├── peripheral.html    ← Markup del escenario
├── audio/
│   ├── jump.mp3       ← Sonido de salto
│   ├── splash.mp3     ← Sonido de chapuzón
│   ├── gameover.mp3   ← Sonido de derrota
│   └── fanfare.mp3    ← Música de victoria (en bucle)
├── css/
│   ├── main.css           ← Punto de entrada (importa los otros tres)
│   ├── variables-base.css ← Variables CSS, reset y estilos base
│   ├── screens-hud.css    ← Pantallas, menú, HUD, rocas y pantallas finales
│   └── animations.css     ← Todas las animaciones y @keyframes
├── img/
│   ├── pinkcat_idle.png       ← Gato en reposo
│   ├── pinkcat_sjump.png      ← Gato al iniciar salto
│   ├── pinkcat_fjump.png      ← Gato al aterrizar
│   ├── pinkcat_fanfare.png    ← Gato celebrando (victoria)
│   ├── pinkcat_water.png      ← Gato en el agua (derrota)
│   ├── rock.png               ← Roca sobre la que saltar
│   ├── platform.png           ← Plataforma de inicio/meta
│   └── background.webp        ← Fondo animado con paralaje (1600 × 669 px)
├── js/
│   ├── constants.js   ← Constantes globales
│   ├── state-dom.js   ← Estado y referencias al DOM
│   ├── engine.js      ← Lógica del juego
│   └── main.js        ← Punto de entrada JS
└── json/
    └── perifericos.json   ← Preguntas y respuestas (editable)
```

## Añadir o editar periféricos

Edita `json/perifericos.json`. Cada entrada tiene este formato:

```json
{ "nombre": "Nombre del periférico", "respuesta": "Entrada|Salida|Ambas" }
```

Ejemplo:
```json
[
  { "nombre": "Teclado",     "respuesta": "Entrada" },
  { "nombre": "Monitor",     "respuesta": "Salida"  },
  { "nombre": "Auriculares", "respuesta": "Ambas"   }
]
```

Si el archivo no existe o falla la carga, el juego usa una lista de 8 periféricos de ejemplo.

## Imágenes

Las imágenes están en la subcarpeta `img/`. Dimensiones originales de referencia:

| Archivo                | Tamaño original |
|------------------------|-----------------|
| `pinkcat_*.png`        | 800 × 700 px    |
| `platform.png`         | 840 × 327 px    |
| `rock.png`             | 600 × 350 px    |
| `background.webp`      | 1600 × 669 px   |

El fondo aplica un efecto de paralaje automático: se desplaza suavemente de derecha a izquierda a lo largo de la partida, proporcional al número total de preguntas.

## Instrucciones para la IA

- Antes de proceder a realizar nada, pide los archivos necesarios para las modificaciones solicitadas.




## instrucciones personales que debe ignorar la IA

0- Importancia absoluta: Que el json sea dinámico:
   0.1 - Cada json en la carpeta json será un nivel
   0.2 - Cada Json incluirá una propiedad para Nombre del nivel, Vidas, 
   0.3 - Cada json también incluirá las opciones (ahora mismo está hardcodeado entrada, salida y ambos. Me gustaría que se leyera del json)
   0.4 - El menú será automático en relación al número de jsons que incluya. 


Agregar animación a la roca "mala" como que se rompe porque era inestable.
La música de "fanfare", debemos quitar el loop.
Todos los sonidos deben cortarse al volver al menú principal.
Quitar los fuegos artificiales por vector y añadir un gif animado delante de todo, que se quitará al ir al menú.