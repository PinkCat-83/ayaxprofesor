# 🎨 Design System — Ayax Profesor

Referencia estética para mantener coherencia visual entre todas las actividades del proyecto.
Basado en el diseño de **Gato Saltarín (Periféricos)** como estándar para actividades interactivas.

---

## Fuentes

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;800&display=swap');
```

| Rol | Fuente | Uso |
|-----|--------|-----|
| Display / Títulos | `Fredoka One`, cursive | `h1`, `h2`, botones, etiquetas de extensión, nombres de nivel |
| Cuerpo | `Nunito`, sans-serif | Texto general, descripciones, botones secundarios |

**Pesos de Nunito usados:** 400 (normal), 600 (semi), 800 (bold).

---

## Paleta de colores

```css
:root {
  --pink-light:  #fce7f3;   /* fondo de hover, rellenos suaves */
  --pink:        #f9a8d4;   /* decorativo, sombras de color */
  --pink-mid:    #ec4899;   /* bordes activos, acento principal */
  --pink-dark:   #be185d;   /* texto de acento, botones primarios */
  --rose:        #fb7185;   /* alertas suaves */
  --sky:         #bae6fd;   /* acento azul, degradado de fondo */
  --sky-dark:    #0369a1;   /* botones secundarios (ej. Biblioteca) */
  --stone:       #78716c;   /* texto terciario, subtítulos, placeholders */
  --gold:        #fcd34d;   /* destacados opcionales */
  --green:       #22c55e;   /* aciertos, estados correctos */
  --green-light: #bbf7d0;   /* fondo de aciertos */
  --red-light:   #fecaca;   /* fondo de errores */
  --text-dark:   #1e1b4b;   /* texto principal */
  --text-mid:    #4c1d95;   /* texto secundario con personalidad */
}
```

---

## Fondos

### Fondo de página (actividades)
Degradado pastel fijo, igual en todas las actividades:

```css
background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 60%, #bfdbfe 100%);
```

Con capa de radiales sutiles superpuesta mediante `::before`:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, #f9a8d470 0%, transparent 45%),
    radial-gradient(circle at 80% 70%, #bae6fd80 0%, transparent 45%);
  pointer-events: none;
  z-index: 0;
}
```

> El contenido principal debe llevar `position: relative; z-index: 1` para quedar por encima.

### Fondo de pantalla de victoria
```css
background: linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0);
```

### Fondo de pantalla de game over
```css
background: linear-gradient(135deg, #fff1f2, #fce7f3, #bfdbfe);
```

### Lo que NO se usa en actividades
- Fondos negros o muy oscuros (reservado para la pantalla de bienvenida `index.html`).
- `backdrop-filter: blur` con fondos semitransparentes oscuros (estilo glassmorphism/neón).
- Gradientes de colores saturados tipo `#667eea → #764ba2`.

---

## Espaciado y forma

```css
--radius-lg: 18px;   /* radio estándar para tarjetas, modales, botones grandes */
--shadow:    0 8px 32px rgba(190, 24, 93, 0.18);  /* sombra hover */
```

Radios adicionales por contexto:

| Elemento | Border-radius |
|----------|---------------|
| Tarjetas / paneles | `18px` (`--radius-lg`) |
| Botones pill (Volver, Biblioteca, modal) | `50px` |
| Botones rectangulares (niveles) | `--radius-lg` |
| Items de lista pequeños | `10px` |
| Scrollbar thumb | `99px` |

---

## Componentes

### Títulos `h1`
```css
font-family: 'Fredoka One', cursive;
font-size: clamp(2rem, 5vw, 3.2rem);
color: var(--pink-dark);
letter-spacing: 1px;
text-shadow: 3px 3px 0 #fbcfe8, 5px 5px 0 #f9a8d4;
```

### Botón primario (acción principal)
Fondo `--pink-dark`, texto blanco, border-radius pill:
```css
background: var(--pink-dark);
color: white;
border: none;
border-radius: 50px;
font-family: 'Fredoka One', cursive;
box-shadow: 0 4px 16px #be185d44;
transition: transform 0.15s, box-shadow 0.15s;
```
Hover: `translateY(-2px)` + sombra más intensa. Active: `scale(0.96)`.

### Botón de nivel / opción
Fondo blanco, borde `--pink-mid`, texto `--pink-dark`:
```css
background: white;
border: 3px solid var(--pink-mid);
border-radius: var(--radius-lg);
color: var(--pink-dark);
font-family: 'Fredoka One', cursive;
box-shadow: 0 4px 16px #f9a8d455;
```
Hover: fondo `--pink-light`, `translateY(-3px) scale(1.02)`.

### Botón secundario (Volver, Biblioteca)
Fondo blanco, borde del color de acento correspondiente:
```css
/* Volver */
border: 2px solid var(--pink-mid);
color: var(--pink-dark);
border-radius: 50px;

/* Biblioteca / acciones azules */
border: 2.5px solid var(--sky-dark);
color: var(--sky-dark);
border-radius: 50px;
```

### Tarjeta / panel
```css
background: white;
border: 2px solid var(--pink-light);
border-radius: var(--radius-lg);
box-shadow: 0 2px 12px #f9a8d433;
```
Hover activo: borde `--pink-mid` + `--shadow`.

### Estado correcto / acertado
```css
background: var(--green-light);  /* #bbf7d0 */
border-color: var(--green);      /* #22c55e */
```

### Estado incorrecto / error
```css
background: var(--red-light);    /* #fecaca */
border-color: var(--rose);       /* #fb7185 */
```

### Modal / overlay
```css
/* Fondo del overlay */
background: rgba(190, 24, 93, 0.15);
backdrop-filter: blur(6px);

/* Contenido */
background: white;
border-radius: var(--radius-lg);
border: 3px solid var(--pink-light);
box-shadow: 0 16px 48px rgba(190, 24, 93, 0.2);
```

### Slider de volumen

Se coloca en el HUD, dentro de `#hud-controls` (zona derecha), junto al icono de altavoz. No usa `Fredoka One` ni texto, es puramente visual.

HTML:
```html
<span class="volume-icon">🔊</span>
<input type="range" id="volume-slider" min="0" max="1" step="0.01" value="0.7">
```

CSS:
```css
.volume-icon {
  font-size: 1rem;
  line-height: 1;
  user-select: none;
}

#volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 72px;
  height: 5px;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--pink-dark) 0%, var(--pink-mid) 100%);
  outline: none;
  cursor: pointer;
  transition: width 0.2s;
}

#volume-slider:hover {
  width: 90px;
}

#volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--pink-dark);
  border: 2px solid white;
  box-shadow: 0 1px 4px #be185d55;
  cursor: pointer;
  transition: transform 0.15s;
}

#volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.25);
}

#volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--pink-dark);
  border: 2px solid white;
  box-shadow: 0 1px 4px #be185d55;
  cursor: pointer;
}
```

JS (conectar a los objetos `Audio` del juego):
```javascript
document.getElementById('volume-slider').addEventListener('input', (e) => {
  const vol = parseFloat(e.target.value);
  audioCorrect.volume = vol;
  audioIncorrect.volume = vol;
  audioEnd.volume = vol;
});
```

### Scrollbar personalizada
```css
scrollbar-width: thin;
scrollbar-color: var(--pink-mid) transparent;

::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--pink-mid); border-radius: 99px; }
```
Para scrollbars de estado correcto usar `var(--green)` en lugar de `--pink-mid`.

---

## Mascota (`pet.png`)

La mascota aparece en el menú de cada actividad con animación de flotación:

```css
.menu-pet {
  width: 140px;
  height: auto;
  filter: drop-shadow(0 4px 12px #f9a8d4aa);
  animation: petBob 2.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes petBob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
```

**Ruta:** `/pet.png` (raíz del proyecto, compartida por todas las actividades).

En el HTML, dentro del `#menu`, justo debajo del `h1`:
```html
<img class="menu-pet" src="/pet.png" alt="Mascota">
```

---

## Qué no hacer

- **No usar fondos negros** en actividades (solo en `index.html`).
- **No usar neón / glassmorphism** (bordes brillantes sobre negro, `backdrop-filter` oscuro).
- **No usar gradientes saturados** en fondos de actividad (`#667eea`, `#764ba2`, etc.).
- **No mezclar Fredoka One y Nunito sin criterio**: Fredoka One es solo para títulos, nombres y botones de acción; Nunito para el resto.
- **No omitir la mascota** en el menú de una actividad nueva.

---

## Checklist para una actividad nueva

- [ ] Importar `Fredoka One` + `Nunito` desde Google Fonts
- [ ] Copiar el bloque de variables `:root`
- [ ] Aplicar el fondo degradado pastel en `body` + capa radial en `body::before`
- [ ] Añadir `position: relative; z-index: 1` al contenedor principal
- [ ] Incluir `pet.png` en el menú con la clase `menu-pet`
- [ ] Usar `--radius-lg: 18px` en tarjetas y paneles
- [ ] Botones primarios: pill `50px`, fondo `--pink-dark`
- [ ] Botones de nivel: `--radius-lg`, borde `--pink-mid`, fondo blanco
- [ ] Estados correcto/error: `--green-light` / `--red-light`
- [ ] Scrollbar personalizada con `--pink-mid`

### Texto de pregunta (actividades tipo rosco)
Usado para mostrar el enunciado de la pregunta actual. Fredoka One con gradiente de texto rosa → morado:

```css
font-family: 'Fredoka One', cursive;
font-size: clamp(1.1rem, 3.5vw, 1.8rem);
background: linear-gradient(90deg, var(--pink-dark), var(--text-mid));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
filter: drop-shadow(0 1px 2px #fff8);
```

> El `drop-shadow` blanco sutil mejora la legibilidad sobre fondos pastel claros.
> Usar `display: inline-block` si el elemento es inline; en flex containers no es necesario.
