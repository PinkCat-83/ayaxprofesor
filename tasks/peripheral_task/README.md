# 🐱 Gato Saltarín – ¿Entrada o Salida?

Juego educativo sobre clasificación de periféricos de ordenador.

## Estructura de archivos

```
gato-saltos/
├── peripheral.html    ← Markup del escenario
├── style.css          ← Estilos y animaciones CSS
├── game.js            ← Lógica del juego
├── perifericos.json   ← Preguntas y respuestas (editable)
├── img/
│   ├── pinkcat_idle.png       ← Gato en reposo
│   ├── pinkcat_sjump.png      ← Gato al iniciar salto
│   ├── pinkcat_fjump.png      ← Gato al aterrizar
│   ├── pinkcat_fanfare.png    ← Gato celebrando (victoria)
│   ├── pinkcat_water.png      ← Gato en el agua (derrota)
│   ├── rock.png               ← Roca sobre la que saltar
│   └── platform.png           ← Plataforma de inicio/meta
└── audio/
    ├── jump.mp3       ← Sonido de salto
    ├── victory.mp3    ← Sonido de victoria
    ├── splash.mp3     ← Sonido de chapuzón
    ├── gameover.mp3   ← Sonido de derrota
    └── fanfare.mp3    ← Música de victoria (en bucle)
```

## Cómo jugar

1. Abre `peripheral.html` en un navegador moderno (Chrome, Firefox, Edge).
2. Elige el nivel de dificultad:
   - **Nivel 1**: 1 vida (sin margen de error)
   - **Nivel 2**: 3 vidas
3. Aparecerá el nombre de un periférico en grande.
4. Haz clic en la roca con la etiqueta correcta: **Entrada**, **Salida** o **Ambas**.
5. Si aciertas, el gato salta a esa roca y luego a la plataforma de la derecha. La escena hace scroll y aparece la siguiente pregunta.
6. Si fallas, el gato cae al agua. En Nivel 2 puedes repetir la ronda.
7. Supera todos los periféricos para ganar.

## Controles del HUD

| Botón | Función |
|-------|---------|
| 🎞️   | Activa / desactiva las animaciones (respiración, polvo, fuegos artificiales). Útil en equipos lentos. |
| 🔊   | Activa / desactiva todo el audio. |
| Menú  | Vuelve al menú principal. |

## Estados del gato

| Imagen               | Cuándo aparece                                      | Efecto visual        |
|----------------------|-----------------------------------------------------|----------------------|
| `pinkcat_idle.png`   | Esperando en la plataforma                          | Respiración en bucle |
| `pinkcat_sjump.png`  | Al iniciar cada salto                               | Polvo de despegue    |
| `pinkcat_fjump.png`  | Al aterrizar en roca o plataforma                   | Polvo de aterrizaje  |
| `pinkcat_fanfare.png`| Durante la pantalla de victoria (4 segundos)        | Respiración + espejo |
| `pinkcat_water.png`  | Tras caer al agua                                   | Espejo + hundimiento |

## Añadir o editar periféricos

Edita `perifericos.json`. Cada entrada tiene este formato:

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

## Audio

Los archivos de audio están en la subcarpeta `audio/`. Si no existen, el juego funciona sin sonido.

| Archivo          | Cuándo suena                              |
|------------------|-------------------------------------------|
| `jump.mp3`       | Al saltar a la roca correcta              |
| `victory.mp3`    | Al completar todos los periféricos        |
| `splash.mp3`     | Al caer al agua                           |
| `gameover.mp3`   | Al perder todas las vidas                 |
| `fanfare.mp3`    | Música en bucle durante la fanfarria final|

## Imágenes

Las imágenes están en la subcarpeta `img/`. Dimensiones originales de referencia:

| Archivo                | Tamaño original | Tamaño de display |
|------------------------|-----------------|-------------------|
| `pinkcat_idle.png`     | 301 × 416 px    | 65 × 90 px        |
| `pinkcat_sjump.png`    | 716 × 503 px    | 128 × 90 px       |
| `pinkcat_fjump.png`    | 660 × 468 px    | 127 × 90 px       |
| `pinkcat_fanfare.png`  | 501 × 572 px    | 79 × 90 px        |
| `pinkcat_water.png`    | 369 × 476 px    | 70 × 90 px        |
| `platform.png`         | 840 × 327 px    | 90 × 35 px        |
| `rock.png`             | 763 × 645 px    | 80 × 68 px        |

Para cambiar el tamaño de display, edita las constantes `CAT_IMAGES` y las dimensiones de `<image>` en `peripheral.html`.

## Integración en proyecto principal

Esta carpeta es autocontenida. Enlázala desde el proyecto principal con:

```html
<a href="gato-saltos/peripheral.html">Jugar</a>
```

O incrústala en un `<iframe>`:

```html
<iframe src="gato-saltos/peripheral.html" width="100%" height="600px" frameborder="0"></iframe>
```


## cosas a mejorar




1- A pinkcat_fanfare.png hagámoslo un 15% más grande
2- A la misma imagen, hay que subirla un poco, está demasiado abajo
3- Sigue mostrando la iamgen idle al saltar en ocasiones. 

Antes de continuar, vamos a añadir unas aclaraciones para aputanrlas yo. ¿Podrías indicarme el proceso dentro del código? O sea, instrucción por instrucción? No con código, sino con la idea. Quiero saber si se está aplicando correctamente el orden y cuál mostrar.