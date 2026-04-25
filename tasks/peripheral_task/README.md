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
│   ├── fireworks.gif          ← Animación de fuegos artificiales cuando ganas
│   ├── pinkcat_sjump.png      ← Gato saltando
│   ├── pinkcat_fanfare.png    ← Gato celebrando (victoria)
│   ├── pinkcat_water.png      ← Gato en el agua (derrota)
│   ├── rock.png               ← Roca sobre la que saltar
│   ├── platform.png           ← Plataforma intermedias
│   ├── platform_ground.png    ← Plataforma de inicio/meta
│   └── background.webp        ← Fondo animado con paralaje (1600 × 669 px)
├── js/
│   ├── constants.js   ← Constantes globales
│   ├── state-dom.js   ← Estado y referencias al DOM
│   ├── engine.js      ← Flujo del juego: inicio, preguntas, clicks, HUD, victoria/gameover
│   ├── camera.js      ← Cámara, paralaje, layout del mundo
│   ├── cat.js         ← Estado del gato, animaciones de salto y caída
│   ├── fireworks.js   ← GIF de fuegos artificiales
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
| `platform*png`         | 840 × 327 px    |
| `rock.png`             | 600 × 350 px    |
| `background.webp`      | 1600 × 669 px   |
| `fireworks.gif`        | 280 × 304 px   |

El fondo aplica un efecto de paralaje automático: se desplaza suavemente de derecha a izquierda a lo largo de la partida, proporcional al número total de preguntas.

## Instrucciones para la IA

- El autor te dirá por mensaje directo qué hay que hacer.
- Antes de proceder a realizar nada, pide los archivos necesarios para las modificaciones solicitadas.







## mejoras importantes

0- Importancia absoluta: Que el json sea dinámico:
   0.1 - Cada json en la carpeta json será un nivel
   0.2 - Cada Json incluirá una propiedad para Nombre del nivel, Vidas, 
   0.3 - Cada json también incluirá las opciones (ahora mismo está hardcodeado entrada, salida y ambos. Me gustaría que se leyera del json)
   0.4 - El menú será automático en relación al número de jsons que incluya. 


## mejoras estéticas 

- Mp3 de ahogarse debe empezar antes
- Hacer que ya hayan cargado las siguientes rocas durante el scroll. Posiblemente la mejor solución será precargar la siguiente pregunta y así el scroll ya estaría preparado. Podemos usar las mismas "id" de rocas y plataformas mediante un sistema de par/impar
- Hacer que el salto dure menos si la roca/plataforma está más cerca.

Mp3 de ahogarse debe empezar antes — ahora el splash se lanza cuando el gato ya ha llegado al punto de caída. Habría que adelantarlo al inicio de animarCaida o incluso antes.

Precargar las rocas durante el scroll — actualmente resetWorldLayout y mostrarPregunta se ejecutan al terminar el scroll, por lo que las rocas aparecen de golpe. La idea par/impar que propones es buena: dos sets de rocas alternándose, de modo que al hacer scroll las siguientes ya están pintadas.

Salto más corto si la roca está más cerca — en cat.js la duración está fijada a 1000ms para todos los saltos. Habría que calcularla proporcionalmente a la distancia horizontal, algo como duracion = Math.max(400, distancia * 0.8).

## Comprobaciones a futuro

- Comprobar si el gato sigue saltando en idle