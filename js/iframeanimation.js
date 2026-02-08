window.addEventListener('load', function() {
    const iframe = document.getElementById('tinyfoot-iframe');
    
    if (iframe) {
        // Animar entrada
        setTimeout(function() {
            iframe.style.right = '10px';
        }, 300);
    }
});

// Escuchar mensaje del iframe para cerrar
window.addEventListener('message', function(event) {
    if (event.data === 'closeTinyfoot') {
        const iframe = document.getElementById('tinyfoot-iframe');
        iframe.style.right = '-600px';
        
        setTimeout(function() {
            iframe.style.display = 'none';
        }, 500);
    }
});