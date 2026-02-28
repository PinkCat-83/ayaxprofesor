// normalizetext.js — Normalización de texto para búsquedas del diccionario ofimático

const STOPWORDS = new Set(['el', 'la', 'lo', 'los', 'las', 'de', 'que']);
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * Normaliza un texto para comparación en búsquedas.
 * Se aplica tanto al input del usuario como a los campos de los JSON.
 *
 * Pasos:
 *   1. Minúsculas + eliminar tildes y caracteres especiales
 *   2. Eliminar plurales (>=4 letras): quita "es" o "s" final
 *   3. Eliminar última vocal (>=4 letras): controla masculino/femenino
 *   4. Eliminar monosílabos: el, la, lo, los, las, de, que
 *
 * @param {string} text
 * @returns {string} texto normalizado, palabras separadas por espacio
 */
export function normalizeText(text) {
    if (!text) return '';

    // Paso 1: minúsculas + quitar tildes + quitar caracteres no alfanuméricos ni espacios
    const step1 = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // elimina diacríticos (tildes, etc.)
        .replace(/[^a-z0-9\s]/g, ' ')      // caracteres especiales → espacio
        .trim();

    const words = step1.split(/\s+/).filter(w => w.length > 0);

    const normalized = words
        // Paso 4: eliminar monosílabos específicos (antes de recortar, para no crear nuevos)
        .filter(word => !STOPWORDS.has(word))

        // Pasos 2 y 3
        .map(word => {
            // Paso 2: despluralar (solo si >= 4 letras)
            if (word.length >= 4) {
                if (word.endsWith('es')) {
                    word = word.slice(0, -2);
                } else if (word.endsWith('s')) {
                    word = word.slice(0, -1);
                }
            }

            // Paso 3: eliminar última vocal para controlar género (solo si >= 4 letras)
            if (word.length >= 4 && VOWELS.has(word[word.length - 1])) {
                word = word.slice(0, -1);
            }

            return word;
        })

        // Descartar palabras que hayan quedado vacías tras los recortes
        .filter(word => word.length > 0);

    return normalized.join(' ');
}
