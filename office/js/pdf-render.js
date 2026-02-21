// pdf-render.js — Renderizador de descripciones enriquecidas para PDF
// Convierte HTML generado por parseDesc en texto formateado dentro de un documento jsPDF

// Renderiza HTML enriquecido en el PDF.
// Enfoque por segmentos: extrae fragmentos de texto con su estilo y los agrupa
// en párrafos para que el flujo sea natural, sin saltos artificiales entre etiquetas.
export function renderDesc(doc, html, x, startY, maxWidth, checkPageBreak) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let cy = startY;

    // Extraer segmentos: { text, bold, italic } o { br: true }
    const segments = [];
    const extractSegments = (node, bold = false, italic = false) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent
                .replace(/▶/g, '»')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ');
            if (text) segments.push({ text, bold, italic });
        } else if (node.nodeName === 'BR') {
            segments.push({ br: true });
        } else if (node.nodeName === 'STRONG') {
            node.childNodes.forEach(n => extractSegments(n, true, italic));
        } else if (node.nodeName === 'EM') {
            node.childNodes.forEach(n => extractSegments(n, bold, true));
        } else {
            node.childNodes.forEach(n => extractSegments(n, bold, italic));
        }
    };
    tmp.childNodes.forEach(n => extractSegments(n));

    // Agrupar segmentos en párrafos (separados por BR)
    const paragraphs = [[]];
    segments.forEach(seg => {
        if (seg.br) {
            paragraphs.push([]);
        } else {
            paragraphs[paragraphs.length - 1].push(seg);
        }
    });

    // Dibujar cada párrafo línea a línea
    paragraphs.forEach(para => {
        if (para.length === 0) {
            // Párrafo vacío = línea en blanco (salto explícito con //)
            cy += 4;
            return;
        }

        const lineHeight = 6;
        let currentLine = [];   // { word, bold, italic }
        let currentWidth = 0;

        const flushLine = (isLast) => {
            if (currentLine.length === 0) return;
            cy = checkPageBreak(cy, lineHeight + 2);
            let cursor = x;
            currentLine.forEach(({ word, bold, italic }) => {
                const style = bold ? 'bold' : italic ? 'italic' : 'normal';
                doc.setFont('helvetica', style);
                doc.text(word, cursor, cy);
                cursor += doc.getTextWidth(word);
            });
            doc.setFont('helvetica', 'normal');
            if (!isLast) cy += lineHeight;
        };

        para.forEach(({ text, bold, italic }) => {
            // Si el segmento empieza con espacio, añadirlo a la última palabra
            // del segmento anterior (que es donde pertenece visualmente)
            if (text.match(/^\s/) && currentLine.length > 0) {
                const last = currentLine[currentLine.length - 1];
                if (!last.word.endsWith(' ')) last.word += ' ';
            }
            const words = text.trimStart().match(/\S+\s*/g) || [];
            words.forEach(word => {
                const style = bold ? 'bold' : italic ? 'italic' : 'normal';
                doc.setFont('helvetica', style);
                const wordWidthFull = doc.getTextWidth(word);           // con espacio final
                const wordWidthTrim = doc.getTextWidth(word.trimEnd()); // sin espacio

                if (currentWidth + wordWidthTrim > maxWidth && currentLine.length > 0) {
                    flushLine(false);
                    currentLine = [];
                    currentWidth = 0;
                }
                currentLine.push({ word, bold, italic });
                currentWidth += wordWidthFull;
            });
        });

        flushLine(true);
        cy += lineHeight;
        doc.setFont('helvetica', 'normal');
    });

    return cy;
}
