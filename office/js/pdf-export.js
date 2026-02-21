// pdf-export.js — Exportación a PDF del diccionario ofimático
// Depende de pdf-render.js (renderDesc) y de que window.jspdf esté disponible

import { renderDesc } from './pdf-render.js';

export async function exportToPDF(manager) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Título desde el h1 del documento
    const h1 = document.querySelector('h1');
    const baseTitle = h1 ? h1.textContent.trim() : 'Diccionario';

    // Filtro activo
    const filterBtn = document.querySelector('.filter-btn.active');
    const filterLabel = filterBtn?.textContent?.trim() || 'Todos';

    // Título del PDF
    const title = filterLabel === 'Todos'
        ? baseTitle
        : `${baseTitle} · ${filterLabel}`;

    const procedures = manager.getFilteredProcedures();
    const authorName = 'Ayax González Suárez';

    // Encabezado: listar programas presentes en los procedimientos visibles
    const programCodes = [...new Set(
        procedures.flatMap(proc => proc.list
            .filter(item => manager.currentFilter === 'all' || item.program === manager.currentFilter)
            .map(item => item.program)
        )
    )];
    const programNames = programCodes
        .map(code => manager.getProgramData(code)?.realName)
        .filter(Boolean);
    const headerText = programNames.length > 0
        ? `Procedimientos para: ${programNames.join(', ')}`
        : baseTitle;

    // ── Colores ──────────────────────────────────────────
    const blue  = [74, 144, 226];
    const gray  = [100, 100, 100];
    const light = [245, 247, 250];

    // ── Helpers ──────────────────────────────────────────
    const addHeader = () => {
        doc.setFillColor(...blue);
        doc.rect(0, 0, pageWidth, 18, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(headerText, margin, 12);
    };

    // Convierte una imagen a base64 mediante un canvas sin redimensionar
    // El tamaño en el PDF se controla al dibujarlo con addImage, no aquí
    const toBase64 = (url) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });

    // Cargar logo para el pie de página
    let logoBase64 = null;
    try {
        logoBase64 = await toBase64('../../imgs/logo_small.png');
    } catch {
        console.warn('No se pudo cargar el logo del pie de página');
    }

    const addFooter = (pageNum, totalPages) => {
        doc.setFillColor(...light);
        doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');

        // Logo a la izquierda
        if (logoBase64) {
            try {
                const logoH = 8;
                const logoProps = doc.getImageProperties(logoBase64);
                const logoW = (logoProps.width * logoH) / logoProps.height;
                doc.addImage(logoBase64, 'PNG', margin, pageHeight - 12, logoW, logoH);
            } catch { /* si falla no bloqueamos */ }
        }

        // Autor y página a la derecha
        doc.setTextColor(...gray);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`${authorName} || Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    };

    const checkPageBreak = (y, needed = 10) => {
        if (y + needed > pageHeight - 20) {
            doc.addPage();
            addHeader();
            return margin + 24;
        }
        return y;
    };

    // ── Página 1: Portada + Índice ────────────────────────
    addHeader();
    let y = 35;

    // Título principal
    doc.setTextColor(...blue);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    const cleanTitle = title.replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{25A0}-\u{25FF}]/gu, '').trim();
    const titleLines = doc.splitTextToSize(cleanTitle, contentWidth);
    titleLines.forEach(line => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 9;
    });

    // Subtítulo
    doc.setTextColor(...gray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${procedures.length} procedimientos`, pageWidth / 2, y, { align: 'center' });
    y += 14;

    // Línea separadora
    doc.setDrawColor(...blue);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Título índice
    doc.setTextColor(...blue);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Índice', margin, y);
    y += 8;

    // Entradas del índice (los links se actualizan después)
    const indexLinks = [];
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    procedures.forEach((proc, i) => {
        y = checkPageBreak(y, 8);
        doc.setTextColor(...gray);
        doc.text(`${i + 1}.`, margin, y);
        doc.setTextColor(0, 0, 0);
        indexLinks.push({ text: proc.name, x: margin + 8, y, i });
        doc.textWithLink(proc.name, margin + 8, y, { url: '' }); // placeholder, se sobreescribe luego
        y += 7;
    });

    // ── Páginas de contenido ──────────────────────────────
    const procPages = []; // guardará la página real de cada procedimiento

    for (const [idx, proc] of procedures.entries()) {
        doc.addPage();
        addHeader();
        const startPage = doc.getCurrentPageInfo().pageNumber;
        procPages.push(startPage);
        let cy = margin + 24;

        // Título procedimiento
        doc.setFillColor(...blue);
        doc.roundedRect(margin, cy - 6, contentWidth, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. ${proc.name}`, margin + 4, cy + 2);
        cy += 16;

        for (const item of proc.list) {
            if (manager.currentFilter !== 'all' && item.program !== manager.currentFilter) continue;

            const programData = manager.getProgramData(item.program);
            if (!programData) continue;

            const lineH = 6;
            const usableW = contentWidth - 8;
            const hasGeneraldesc = proc.generaldesc && proc.generaldesc.trim();
            const hasDesc = item.desc && item.desc.trim();

            // ── Pre-cargar imágenes para conocer su altura ────
            const imgData = [];
            if (item.imgs && item.imgs.length > 0) {
                for (const imgPath of item.imgs) {
                    try {
                        const b64 = await toBase64(`imgs/${imgPath}`);
                        const imgProps = doc.getImageProperties(b64);
                        const maxImgW = Math.min(usableW, 80);
                        const imgW = imgProps.width > imgProps.height ? maxImgW : maxImgW * 0.6;
                        const imgH = (imgProps.height * imgW) / imgProps.width;
                        imgData.push({ b64, imgW, imgH });
                    } catch { console.warn(`No se pudo cargar imagen: ${imgPath}`); }
                }
            }

            // ── Pre-calcular altura del bloque completo ───────
            doc.setFontSize(9);
            let blockH = 19; // cabecera programa

            if (item.route) {
                doc.setFont('helvetica', 'bold');
                const rutaLabelW = doc.getTextWidth('Ruta: ');
                doc.setFont('helvetica', 'normal');
                const routePlain = item.route.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1').replace(/>>/g,'»').replace(/->/g,'»');
                const routeLines = doc.splitTextToSize(routePlain, usableW - rutaLabelW - 4);
                blockH += routeLines.length * lineH + 10;
            }

            if (item.shortcut) {
                const shortcuts = Array.isArray(item.shortcut) ? item.shortcut : [item.shortcut];
                doc.setFont('helvetica', 'bold');
                const labelW = doc.getTextWidth('Atajo de teclado: ');
                doc.setFont('helvetica', 'normal');
                let curX = margin + 6 + labelW;
                let lines = 1;
                shortcuts.forEach((s, i) => {
                    const sw = doc.getTextWidth(s) + 8;
                    if (i > 0 && curX + sw + 3 > pageWidth - margin - 4) { lines++; curX = margin + 6 + labelW; }
                    curX += sw + 3;
                });
                blockH += lines * (lineH + 2) + 10;
            }

            if (hasGeneraldesc || hasDesc) {
                blockH += 10;
                if (hasGeneraldesc) {
                    doc.setFont('helvetica', 'normal');
                    const gPlain = proc.generaldesc.replace(/\/\//g,' ').replace(/<[^>]*>/g,'').replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1');
                    blockH += doc.splitTextToSize(gPlain, usableW).length * lineH + 4;
                }
                if (hasDesc) {
                    doc.setFont('helvetica', 'normal');
                    const dPlain = item.desc.replace(/\/\//g,' ').replace(/<[^>]*>/g,'').replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1');
                    blockH += doc.splitTextToSize(dPlain, usableW).length * lineH + 4;
                }
            }

            imgData.forEach(({ imgH }) => { blockH += imgH + 8; });

            // ── Saltar página si el bloque no cabe entero ─────
            if (cy + blockH > pageHeight - 20) {
                doc.addPage();
                addHeader();
                cy = margin + 24;
            }

            // ── Cabecera programa — esquinas redondeadas solo arriba ──
            const blockStartY = cy;
            const headerH = 11;
            const r = 3;
            // Fondo gris: roundedRect para las esquinas superiores, rect para cubrir la parte inferior
            doc.setFillColor(...light);
            doc.roundedRect(margin, cy, contentWidth, headerH, r, r, 'F');
            doc.rect(margin, cy + r, contentWidth, headerH - r, 'F'); // tapa esquinas inferiores
            // Borde izquierdo azul (también solo arriba redondeado)
            doc.setFillColor(...blue);
            doc.roundedRect(margin, cy, r * 2, headerH, r, r, 'F');
            doc.rect(margin, cy + r, r * 2, headerH - r, 'F');
            doc.rect(margin + r, cy, r, headerH, 'F'); // rellena el hueco entre curva y borde recto
            doc.setTextColor(...blue);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(programData.realName, margin + 10, cy + 7);

            cy += headerH + 3;

            // ── Ruta ──────────────────────────────────────────
            if (item.route) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                const rutaLabelW = doc.getTextWidth('Ruta: ');
                doc.setFont('helvetica', 'normal');
                const routeMaxW = contentWidth - 12 - rutaLabelW;
                const routePlain = item.route.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1').replace(/>>/g,'»').replace(/->/g,'»');
                const routeLines = doc.splitTextToSize(routePlain, routeMaxW);
                const routeBoxH = routeLines.length * lineH + 8;
                doc.setFillColor(232, 236, 240);
                doc.roundedRect(margin + 2, cy, contentWidth - 4, routeBoxH, 2, 2, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...gray);
                // Centro vertical: mitad del box + ajuste de línea base
                const routeTextStartY = cy + (routeBoxH - (routeLines.length - 1) * lineH) / 2 + 1.5;
                doc.text('Ruta:', margin + 6, routeTextStartY);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...blue);
                routeLines.forEach((line, i) => {
                    doc.text(line, margin + 6 + rutaLabelW, routeTextStartY + i * lineH);
                });
                cy += routeBoxH + 2;
            }

            // ── Atajos en línea con badges ────────────────────
            if (item.shortcut) {
                const shortcuts = Array.isArray(item.shortcut) ? item.shortcut : [item.shortcut];
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                const labelText = 'Atajo de teclado: ';
                const labelW = doc.getTextWidth(labelText);
                const badgePadX = 4;
                const badgeH = lineH + 2;
                const gap = 3;
                // Calcular altura del cuadro
                let curX = margin + 6 + labelW;
                let curY = cy + 7;
                shortcuts.forEach((s, i) => {
                    const sw = doc.getTextWidth(s) + badgePadX * 2;
                    if (i > 0 && curX + sw > pageWidth - margin - 4) { curX = margin + 6 + labelW; curY += badgeH + gap; }
                    curX += sw + gap;
                });
                const shortcutBoxH = (curY - (cy + 7)) + badgeH + 6;
                const shortcutLineCount = Math.round((shortcutBoxH - 6) / (badgeH + gap)) || 1;
                doc.setFillColor(232, 236, 240);
                doc.roundedRect(margin + 2, cy, contentWidth - 4, shortcutBoxH, 2, 2, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...gray);
                // Centro vertical primera línea
                const shortcutTextY = cy + shortcutBoxH / 2 - ((shortcutLineCount - 1) * (badgeH + gap)) / 2 + 1.5;
                doc.text(labelText, margin + 6, shortcutTextY);
                // Dibujar badges
                curX = margin + 6 + labelW;
                curY = shortcutTextY;
                doc.setFont('helvetica', 'normal');
                shortcuts.forEach((s, i) => {
                    const sw = doc.getTextWidth(s) + badgePadX * 2;
                    if (i > 0 && curX + sw > pageWidth - margin - 4) { curX = margin + 6 + labelW; curY += badgeH + gap; }
                    doc.setFillColor(255, 255, 255);
                    doc.setDrawColor(...blue);
                    doc.setLineWidth(0.3);
                    doc.roundedRect(curX, curY - lineH + 1, sw, badgeH, 1, 1, 'FD');
                    doc.setTextColor(...blue);
                    doc.text(s, curX + badgePadX, curY);
                    curX += sw + gap;
                });
                cy += shortcutBoxH + 2;
            }

            // ── Anotaciones ───────────────────────────────────
            if (hasGeneraldesc || hasDesc) {
                cy += 6; // espacio extra antes del título
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...blue);
                doc.text('Anotaciones', margin + 4, cy);
                cy += 6;

                if (hasGeneraldesc) {
                    const generalHtml = manager.parseDesc(proc.generaldesc).replace(/▶/g, '»');
                    doc.setTextColor(51, 51, 51);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    cy = renderDesc(doc, generalHtml, margin + 4, cy, usableW, checkPageBreak);
                    cy += 3;
                }

                if (hasDesc) {
                    const descHtml = manager.parseDesc(item.desc).replace(/▶/g, '»');
                    doc.setTextColor(51, 51, 51);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    cy = renderDesc(doc, descHtml, margin + 4, cy, usableW, checkPageBreak);
                }
                cy += 4;
            }

            // ── Imágenes ──────────────────────────────────────
            if (imgData.length > 0) {
                cy += 2;
                for (const { b64, imgW, imgH } of imgData) {
                    doc.setDrawColor(...blue);
                    doc.setLineWidth(0.4);
                    doc.roundedRect(margin + 3, cy, imgW + 2, imgH + 2, 2, 2, 'S');
                    doc.addImage(b64, 'PNG', margin + 4, cy + 1, imgW, imgH);
                    cy += imgH + 8;
                }
            }

            // ── Borde del bloque completo — al final para no tapar nada ──
            doc.setDrawColor(...blue);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, blockStartY, contentWidth, cy - blockStartY, 3, 3, 'S');

            // ── Separador de bloque ───────────────────────────
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.line(margin, cy + 2, pageWidth - margin, cy + 2);

            cy += 8;
        }
    }

    // ── Rellenar links del índice con páginas reales ──────
    const totalPages = doc.getNumberOfPages();

    indexLinks.forEach(({ x, y: iy, i }, idx) => {
        doc.setPage(1);
        doc.setTextColor(...blue);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.textWithLink(procedures[idx].name, x, iy, { pageNumber: procPages[idx] });
        doc.setTextColor(...gray);
        doc.text(`${procPages[idx]}`, pageWidth - margin, iy, { align: 'right' });
    });

    // ── Añadir footers a todas las páginas ────────────────
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        addFooter(p, totalPages);
    }

    // ── Guardar ───────────────────────────────────────────
    const safeName = title.replace(/\s+/g, '_').toLowerCase();
    doc.save(`${safeName}.pdf`);
}
