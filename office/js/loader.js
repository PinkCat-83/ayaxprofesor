// loader.js — punto de entrada único
// Carga jsPDF y Fuse.js desde CDN y luego importa los módulos de la aplicación en orden

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

(async () => {
    await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.0.0/fuse.min.js')
    ]);
    await import('./pdf-render.js');
    await import('./pdf-export.js');
    await import('./normalizetext.js');
    await import('./dictionary.js');
})();