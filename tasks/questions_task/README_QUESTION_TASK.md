# 🐱 Gato Saltarín – ¿Entrada o Salida?

Juego educativo sobre clasificación de periféricos de ordenador.

## Estructura de archivos

```
question_task/
├── perifericos_game.html  ← Punto de entrada: redirige a game.html con su JSON
├── questions.html              ← Motor del juego (no editar)
├── audio/
│   ├── jump.mp3           ← Sonido de salto
│   ├── splash.mp3         ← Sonido de chapuzón
│   ├── gameover.mp3       ← Sonido de derrota
│   └── fanfare.mp3        ← Música de victoria (en bucle)
├── css/
│   ├── main.css           ← Punto de entrada CSS (importa los otros tres)
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
│   ├── platform.png           ← Plataforma intermedia
│   ├── platform_ground.png    ← Plataforma de inicio/meta
│   ├── background.webp        ← Fondo animado con paralaje (1600 × 669 px)
│   └── Periphericals/         ← Imágenes de las preguntas (1500 × 800 px)
│       ├── mouse.png
│       ├── keyboard.png
│       └── …
├── js/
│   ├── constants.js   ← Constantes globales
│   ├── state-dom.js   ← Estado y referencias al DOM
│   ├── engine.js      ← Flujo del juego: inicio, preguntas, clicks, HUD, victoria/gameover
│   ├── camera.js      ← Cámara, paralaje, layout del mundo
│   ├── cat.js         ← Estado del gato, animaciones de salto y caída
│   ├── fireworks.js   ← GIF de fuegos artificiales
│   └── main.js        ← Punto de entrada JS
└── json/
    └── perifericos.json  ← Configuración completa del juego (título, niveles y preguntas)
```

## Cómo funciona el sistema de juegos

Cada "juego" es un HTML propio (como `perifericos_game.html`) que redirige a `game.html` pasándole su JSON por parámetro:

```html
<meta http-equiv="refresh" content="0;url=questions.html?config=perifericos.json" />
```

Para crear un juego nuevo basta con:

1. Crear un JSON en `json/` con el formato descrito abajo.
2. Duplicar `perifericos_game.html` y cambiar el nombre del JSON en la línea de redirección.

`game.html` no hay que tocarlo nunca.

## Formato del JSON de configuración

Todo el contenido del juego vive en un único JSON. Ejemplo de estructura completa:

```json
{
  "pageTitle": "Título de la página",
  "pageSubtitle": "Subtítulo descriptivo",
  "imgfolder": "img/Periphericals",
  "niveles": [
    {
      "nombre": "Fácil",
      "icono": "🐟",
      "vidas": 3,
      "preguntas": [
        {
          "nombre": "Teclado",
          "respuesta": "Entrada",
          "opciones": ["Entrada", "Salida", "Ambas"],
          "img": "keyboard.png"
        }
      ]
    }
  ]
}
```

| Campo         | Descripción                                                                        |
|---------------|------------------------------------------------------------------------------------|
| `pageTitle`   | Título que aparece en el menú principal                                            |
| `pageSubtitle`| Subtítulo descriptivo bajo el título                                               |
| `imgfolder`   | Ruta a la carpeta de imágenes de las preguntas (relativa a la raíz del proyecto). Si se omite, no se muestra ninguna imagen. |
| `niveles`     | Array de niveles disponibles (aparecen como botones en el menú)                   |
| `nombre`      | Nombre del nivel o de la pregunta                                                  |
| `icono`       | Emoji que aparece en el botón del nivel en el menú                                 |
| `vidas`       | Número de vidas para ese nivel                                                     |
| `preguntas`   | Array de preguntas del nivel                                                       |
| `respuesta`   | Debe coincidir exactamente con uno de los valores de `opciones`                    |
| `opciones`    | Exactamente 3 opciones (siempre habrá 3 rocas)                                    |
| `img`         | Nombre del archivo de imagen para la pregunta (opcional). Se busca dentro de `imgfolder`. Si se omite en una pregunta concreta, no se muestra imagen para esa pregunta. |

### Imágenes de las preguntas

Las imágenes se muestran en la esquina superior derecha del escenario con un efecto de bamboleo flotante. Al cambiar de pregunta, la transición entre imágenes es pixelada: la imagen actual se pixela progresivamente y la nueva aparece despixelándose.

- Tamaño recomendado: **1500 × 800 px** (ratio 15:8)
- Formato recomendado: PNG con fondo transparente
- Se escalan automáticamente al tamaño del panel (≈110 px de ancho)
- Si una pregunta no tiene `img`, el panel desaparece suavemente

## Imágenes del escenario

Las imágenes del motor están en `img/`. Dimensiones originales de referencia:

| Archivo             | Tamaño original |
|---------------------|-----------------|
| `pinkcat_*.png`     | 800 × 700 px    |
| `platform*.png`     | 840 × 327 px    |
| `rock.png`          | 600 × 350 px    |
| `background.webp`   | 1600 × 669 px   |
| `fireworks.gif`     | 280 × 304 px    |

El fondo aplica un efecto de paralaje automático: se desplaza suavemente de derecha a izquierda a lo largo de la partida, proporcional al número total de preguntas.

## Sprites del gato

Los 5 sprites (`idle`, `sjump`, `fjump`, `fanfare`, `water`) están todos presentes en el DOM desde el inicio como elementos `<image>` independientes dentro de `#cat-rot`, con `display:none` salvo el activo. El cambio de sprite es un simple show/hide en CSS — no hay ningún cambio de `href` en tiempo de ejecución. Esto garantiza que el navegador tenga todos los sprites decodificados y compuestos en GPU antes de que el juego arranque, eliminando cualquier latencia de pintado al saltar.

## Interfaz de juego

El escenario agrupa dentro de su marco todos los elementos informativos:

- **Esquina superior izquierda** — vidas restantes (emojis 🐱/💀)
- **Centro superior** — nombre de la pregunta actual (fuente Fredoka One)
- **Esquina superior derecha** — imagen de la pregunta, con efecto de bamboleo flotante y transición pixelada entre preguntas
- **Barra superior (fuera del marco)** — progreso (`Pregunta X / N`), control de volumen y botón Menú

## Instrucciones para la IA

- El autor te dirá por mensaje directo qué hay que hacer.
- Antes de proceder a realizar nada, pide los archivos necesarios para las modificaciones solicitadas.
