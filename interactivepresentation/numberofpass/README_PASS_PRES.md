# 🔐 Password Security Calculator — ¿Por qué importa una contraseña segura?

Interactive exercise to understand exponential growth in password combinations.

→ [Technical README](./README_PASS_TECH.md)

---

## What is this?

A visual, hands-on calculator that lets students discover for themselves why password complexity matters. By unlocking security levels one at a time and adjusting the length slider, they watch the number of possible combinations grow from thousands to numbers that have no name in everyday language.


---

## Security Levels

| Level | Name | Characters added |
|---|---|---|
| 1 | Números | 10 |
| 2 | Minúsculas | 26 |
| 3 | Mayúsculas | 26 |
| 4 | Símbolos ASCII | 32 |
| 5 | Unicode estándar | 162 |
| 6 | Unicode completo | 154.742 |

Levels are **independent** — they can be activated in any order and deactivated at any time. The total character pool is the sum of all active levels.

---

## How It Works

1. All six levels start **hidden** — each card only shows "Nivel de seguridad X".
2. The student presses a card to **unlock** it: the level name, character count, and an example appear in place (the card does not resize).
3. The **length slider** (1–15 characters) adjusts the password length.
4. The **result panel** on the right shows:
   - The total number of possible combinations in plain Spanish (millones, billones, trillones…)
   - Scientific notation with the number of zeros, for very large numbers
   - The underlying formula: `N caracteres ^ L posiciones`
5. The **chart** shows how combinations grow as length increases from 1 to 15, with the current slider position highlighted as a glowing dot on the curve.

---

## Key Didactic Moments

- **Level 1 alone (numbers only, 8 characters):** ~100 million combinations. Sounds like a lot — a modern computer cracks it in under a second.
- **Adding lowercase (level 2):** jumps to ~218 billion. Already 2,000× harder.
- **Adding uppercase (level 3):** the character pool reaches 62 — combinations exceed 200 trillion at 8 characters.
- **Adding ASCII symbols (level 4):** pool reaches 94 — now we're in the quadrillions.
- **Unicode standard (level 5):** 256 characters — the curve on the chart visibly steepens.
- **Unicode complete (level 6):** 154,906 characters — the Y axis of the chart rescales completely; numbers enter territory with no common name.

The chart makes the exponential nature visceral: each new level shifts the entire curve upward, and each additional character multiplies the total by the full character pool size.

---

## Classroom Use

- Start with **all levels hidden** and ask students to guess: "How many combinations does a 4-digit PIN have?"
- Unlock **level 1 only**, set length to 4 — confirm the answer (10,000).
- Ask: "What happens if we use letters too?" — unlock level 2, watch the number change.
- Use the **length slider** to show that length matters as much as character variety.
- End with **all levels active, length 15** — let the number speak for itself.
