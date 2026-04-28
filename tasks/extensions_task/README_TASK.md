# 🎯 El Desafío de las Extensiones

Juego educativo interactivo para aprender a identificar extensiones de archivo arrastrando cada extensión hasta su descripción correcta.

---

## 📁 Estructura del proyecto

```
extensions_task/
├── extensions.html       # Estructura principal de la aplicación
├── README_TASK.md
├── css/
│   └── extensions.css    # Estilos visuales del juego
├── js/
│   └── extensions.js     # Lógica del juego
└── json/
    └── data.json         # Extensiones, descripciones, enlaces y configuración
```

> Esta task usa recursos propios exclusivamente, más los recursos generales de la raíz del proyecto (`/imgs/pet.png`, `/css/tinyfoot.css`, `/layout/tinyfoot.html`, `/js/iframeanimation.js`).

---

## 🎮 Cómo funciona

El jugador selecciona un nivel de dificultad en el menú principal. En cada partida se presenta una columna de extensiones (`.PDF`, `.MP3`, etc.) y otra de descripciones desordenadas. El objetivo es unir cada extensión con su descripción correcta arrastrando desde una caja hasta la otra (compatible con ratón y pantalla táctil).

- ✅ **Acierto** → la pareja queda enlazada con una flecha verde y se añade al registro de acertadas.
- ❌ **Error** → aparece una flecha roja que se desvanece y se pierde una vida.
- 🏆 **Victoria** → al emparejar todas las parejas se muestra un modal con fuegos artificiales.
- 💀 **Game Over** → al agotar las vidas se muestra el modal de fin de partida.

---

## 🗂️ Niveles de dificultad

| Nivel | Nombre       | Parejas | Vidas | Extensiones nuevas mín. |
|-------|--------------|---------|-------|--------------------------|
| 1     | Básico       | 5       | 3     | 5                        |
| 2     | Intermedio   | 7       | 3     | 4                        |
| 3     | Avanzado     | 10      | 2     | 4                        |
| 4     | Power User   | 13      | 2     | 4                        |
| 5     | Developer    | 15      | 2     | 4                        |
| 6     | Legado Retro | 12      | 3     | 12                       |

Cada nivel incluye un mínimo de extensiones propias del nivel más extensiones repasadas de niveles anteriores.

---

## 📚 Biblioteca

Accesible desde el menú principal, muestra todas las extensiones organizadas por nivel con un enlace a su artículo de Wikipedia en español.

---

## 🔊 Sonido

El juego genera efectos de sonido mediante la **Web Audio API** (sin archivos de audio externos). Se puede activar o desactivar en cualquier momento con el botón 🔊 de la esquina superior derecha.

| Evento  | Sonido               |
|---------|----------------------|
| Click   | Tono corto agudo     |
| Acierto | Glissando ascendente |
| Error   | Tono grave breve     |

---

## 🏹 Flechas

Las flechas se dibujan sobre un `<canvas>` superpuesto al área de juego.

| Estado                  | Color                     | Grosor |
|-------------------------|---------------------------|--------|
| En arrastre / retroceso | Negro semitransparente    | 4 px   |
| Acierto (permanente)    | Verde (`#4CAF50`)         | 4 px   |
| Error (se desvanece)    | Rojo (`rgba(255,80,80,…)`)| 4 px   |

---

## 🗃️ Añadir o modificar extensiones

Todo el contenido del juego se gestiona en `json/data.json`, sin tocar el código JavaScript:

```json
{
  "levels": {
    "1": {
      "PDF": "Documento que se lee bien en cualquier dispositivo"
    }
  },
  "links": {
    "PDF": "https://es.wikipedia.org/wiki/PDF"
  },
  "config": {
    "1": { "pairs": 5, "lives": 3, "minNew": 5 }
  }
}
```

- **`levels`** — extensiones agrupadas por nivel con su descripción.
- **`links`** — URL de Wikipedia para cada extensión (usada en la Biblioteca).
- **`config`** — número de parejas, vidas y extensiones nuevas mínimas por nivel.

Para añadir un nivel nuevo basta con agregar una entrada en los tres objetos.

---

## 🖼️ Menú principal

El menú se compone de dos zonas:

- **Título** — centrado en la parte superior, a todo el ancho.
- **Cuerpo** — fila con la mascota a la izquierda y el selector de dificultad + botón Biblioteca a la derecha.

Al volver al menú (desde el juego o la Biblioteca) la página hace scroll automático al inicio para evitar desplazamientos visuales.

---

## 🚀 Despliegue

El proyecto es estático y no requiere backend ni dependencias. Al usar `fetch` para cargar `data.json`, necesita ser servido por HTTP (no funciona abriendo el HTML directamente desde el sistema de archivos).

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .
```

---

## 🛠️ Tecnologías

- **HTML5** — estructura semántica
- **CSS3** — diseño pastel, animaciones, responsive
- **JavaScript (Vanilla)** — lógica del juego, Canvas API, Web Audio API, Touch Events
