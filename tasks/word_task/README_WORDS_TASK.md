# 🎮 Word Task — Rosco de Palabras

"Pasapalabra"-style game for evaluating IT knowledge.

→ [Technical README](./README_WORDS_TECH.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## What is this?

Students answer one question per letter of the alphabet. They can answer or skip to the end of the queue. The game ends when all questions are answered correctly, lives run out, or time expires.

---

## File Structure

```
word_task/
├── word.html            # Main HTML file
├── css/
│   ├── main.css         # Main styles (header, letter strip, controls)
│   ├── animations.css   # Animations (shake, heart-falling)
│   ├── background.css   # Background animations
│   └── modal.css        # Results modal styles
├── js/
│   └── game.js          # Main game logic
└── json/
    └── words.json       # Words, questions and answers
```

---

## Game Flow

1. Player sees a question and a hint.
2. Player types an answer or skips to the next question.
3. On validation:
   - ✅ **Correct** — letter marked green, points added.
   - ❌ **Wrong** — letter marked red, points and a life lost.
   - ⏭️ **Skip** — question moved to the end of the queue.
4. Game ends when:
   - All questions answered correctly.
   - All 10 lives are lost.
   - 30-minute timer runs out.

---

## Adding or Editing Questions

Edit `json/words.json`:

```json
[
  {
    "letra": "A",
    "pregunta": "Your question here",
    "pista": "Empieza por A",
    "respuesta": ["answer1", "answer2"]
  }
]
```

Multiple values in `respuesta` allow for spelling variations. Answers are normalized automatically (accents removed, lowercased, trimmed).

---

## Deployment

Uses `fetch` to load `words.json` — must be served over HTTP. Does not work when opened directly as a local file (`file://`).

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
