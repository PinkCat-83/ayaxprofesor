# 🎨 Design System — Ayax Profesor

> Visual reference for maintaining aesthetic consistency across all activities.  
> Based on **Gato Saltarín (Periféricos)** as the standard for interactive activities.  
> → [Presentation README](./README.md) · [Technical README](./README_TECH.md)

---

## Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;800&display=swap');
```

| Role | Font | Usage |
|-----|--------|-----|
| Display / Headings | `Fredoka One`, cursive | `h1`, `h2`, buttons, extension labels, level names |
| Body | `Nunito`, sans-serif | General text, descriptions, secondary buttons |

**Nunito weights used:** 400 (normal), 600 (semi), 800 (bold).

---

## Color palette

```css
:root {
  --pink-light:  #fce7f3;   /* hover backgrounds, soft fills */
  --pink:        #f9a8d4;   /* decorative, color shadows */
  --pink-mid:    #ec4899;   /* active borders, main accent */
  --pink-dark:   #be185d;   /* accent text, primary buttons */
  --rose:        #fb7185;   /* soft alerts */
  --sky:         #bae6fd;   /* blue accent, background gradient */
  --sky-dark:    #0369a1;   /* secondary buttons (e.g. Library) */
  --stone:       #78716c;   /* tertiary text, subtitles, placeholders */
  --gold:        #fcd34d;   /* optional highlights */
  --green:       #22c55e;   /* correct answers, success states */
  --green-light: #bbf7d0;   /* correct answer backgrounds */
  --red-light:   #fecaca;   /* error backgrounds */
  --text-dark:   #1e1b4b;   /* main text */
  --text-mid:    #4c1d95;   /* secondary text with personality */
}
```

---

## Backgrounds

### Page background (activities)
Fixed pastel gradient, identical across all activities:

```css
background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 60%, #bfdbfe 100%);
```

With a subtle radial layer overlaid via `::before`:

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

> Main content must carry `position: relative; z-index: 1` to render above the layer.

### Victory screen background
```css
background: linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0);
```

### Game over screen background
```css
background: linear-gradient(135deg, #fff1f2, #fce7f3, #bfdbfe);
```

### What NOT to use in activities
- Black or very dark backgrounds (reserved for `index.html` welcome screen).
- `backdrop-filter: blur` with dark semi-transparent backgrounds (glassmorphism/neon style).
- Saturated color gradients like `#667eea → #764ba2`.

---

## Spacing & Shape

```css
--radius-lg: 18px;   /* standard radius for cards, modals, large buttons */
--shadow:    0 8px 32px rgba(190, 24, 93, 0.18);  /* hover shadow */
```

Additional radii by context:

| Element | Border-radius |
|----------|---------------|
| Cards / panels | `18px` (`--radius-lg`) |
| Pill buttons (Back, Library, modal) | `50px` |
| Rectangular buttons (levels) | `--radius-lg` |
| Small list items | `10px` |
| Scrollbar thumb | `99px` |

---

## Components

### Headings `h1`
```css
font-family: 'Fredoka One', cursive;
font-size: clamp(2rem, 5vw, 3.2rem);
color: var(--pink-dark);
letter-spacing: 1px;
text-shadow: 3px 3px 0 #fbcfe8, 5px 5px 0 #f9a8d4;
```

### Primary button (main action)
Background `--pink-dark`, white text, pill border-radius:
```css
background: var(--pink-dark);
color: white;
border: none;
border-radius: 50px;
font-family: 'Fredoka One', cursive;
box-shadow: 0 4px 16px #be185d44;
transition: transform 0.15s, box-shadow 0.15s;
```
Hover: `translateY(-2px)` + stronger shadow. Active: `scale(0.96)`.

### Level / option button
White background, `--pink-mid` border, `--pink-dark` text:
```css
background: white;
border: 3px solid var(--pink-mid);
border-radius: var(--radius-lg);
color: var(--pink-dark);
font-family: 'Fredoka One', cursive;
box-shadow: 0 4px 16px #f9a8d455;
```
Hover: background `--pink-light`, `translateY(-3px) scale(1.02)`.

### Secondary button (Back, Library)
White background, accent-colored border:
```css
/* Back */
border: 2px solid var(--pink-mid);
color: var(--pink-dark);
border-radius: 50px;

/* Library / blue actions */
border: 2.5px solid var(--sky-dark);
color: var(--sky-dark);
border-radius: 50px;
```

### Card / panel
```css
background: white;
border: 2px solid var(--pink-light);
border-radius: var(--radius-lg);
box-shadow: 0 2px 12px #f9a8d433;
```
Active hover: border `--pink-mid` + `--shadow`.

### Correct / success state
```css
background: var(--green-light);  /* #bbf7d0 */
border-color: var(--green);      /* #22c55e */
```

### Incorrect / error state
```css
background: var(--red-light);    /* #fecaca */
border-color: var(--rose);       /* #fb7185 */
```

### Modal / overlay
```css
/* Overlay background */
background: rgba(190, 24, 93, 0.15);
backdrop-filter: blur(6px);

/* Content */
background: white;
border-radius: var(--radius-lg);
border: 3px solid var(--pink-light);
box-shadow: 0 16px 48px rgba(190, 24, 93, 0.2);
```

### Volume slider

Placed in the HUD inside `#hud-controls` (right side), next to the speaker icon. Does not use `Fredoka One` or text — purely visual.

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

#volume-slider:hover { width: 90px; }

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

#volume-slider::-webkit-slider-thumb:hover { transform: scale(1.25); }

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

JS (connect to the game's `Audio` objects):
```javascript
document.getElementById('volume-slider').addEventListener('input', (e) => {
  const vol = parseFloat(e.target.value);
  audioCorrect.volume = vol;
  audioIncorrect.volume = vol;
  audioEnd.volume = vol;
});
```

### Custom scrollbar
```css
scrollbar-width: thin;
scrollbar-color: var(--pink-mid) transparent;

::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--pink-mid); border-radius: 99px; }
```
For correct-state scrollbars, use `var(--green)` instead of `--pink-mid`.

### Question text (rosco-type activities)
Fredoka One with pink → purple text gradient:

```css
font-family: 'Fredoka One', cursive;
font-size: clamp(1.1rem, 3.5vw, 1.8rem);
background: linear-gradient(90deg, var(--pink-dark), var(--text-mid));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
filter: drop-shadow(0 1px 2px #fff8);
```

> The subtle white `drop-shadow` improves readability on light pastel backgrounds.  
> Use `display: inline-block` if the element is inline; not needed in flex containers.

---

## Mascot (`pet.png`)

The mascot appears in each activity's menu with a floating animation:

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

**Path:** `/pet.png` (project root, shared by all activities).

In the HTML, inside `#menu`, just below the `h1`:
```html
<img class="menu-pet" src="/pet.png" alt="Mascota">
```

---

## What NOT to do

- **No dark backgrounds** in activities (only in `index.html`).
- **No neon / glassmorphism** (glowing borders on black, dark `backdrop-filter`).
- **No saturated gradients** in activity backgrounds (`#667eea`, `#764ba2`, etc.).
- **Don't mix Fredoka One and Nunito without purpose:** Fredoka One is only for headings, names, and action buttons; Nunito for everything else.
- **Don't omit the mascot** from a new activity's menu.

---

## Checklist for a new activity

- [ ] Import `Fredoka One` + `Nunito` from Google Fonts
- [ ] Copy the `:root` variables block
- [ ] Apply the pastel gradient background on `body` + radial layer on `body::before`
- [ ] Add `position: relative; z-index: 1` to the main container
- [ ] Include `pet.png` in the menu with class `menu-pet`
- [ ] Use `--radius-lg: 18px` on cards and panels
- [ ] Primary buttons: pill `50px`, background `--pink-dark`
- [ ] Level buttons: `--radius-lg`, border `--pink-mid`, white background
- [ ] Correct/error states: `--green-light` / `--red-light`
- [ ] Custom scrollbar with `--pink-mid`
- [ ] Include mobile warning snippet
