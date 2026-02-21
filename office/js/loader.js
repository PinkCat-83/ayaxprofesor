// loader.js — punto de entrada único
// Carga jsPDF desde CDN y luego importa los módulos de la aplicación en orden

const jsPDFScript = document.createElement('script');
jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
jsPDFScript.onload = async () => {
    await import('./pdf-render.js');
    await import('./pdf-export.js');
    await import('./dictionary.js');
};
document.head.appendChild(jsPDFScript);