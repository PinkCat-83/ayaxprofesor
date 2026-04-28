let timer = null;
let isClosed = false;

function closeFooter() {
    if (isClosed) return; // 👈 evita cerrar si ya está cerrado
    clearInterval(timer);
    isClosed = true;
    window.parent.postMessage('closeTinyfoot', '*');
}

document.addEventListener('DOMContentLoaded', function () {
    const tinyfoot = document.getElementById('tinyfoot');
    const closeBtn = document.getElementById('close-btn');
    const progressBar = document.getElementById('progress-bar');

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeFooter();
    });

    tinyfoot.addEventListener('click', function () {
        if (isClosed) {
            // Está en modo pestaña, avisar al padre que reabra
            window.parent.postMessage('reopenFromInside', '*');
        } else {
            closeFooter();
        }
    });

    let timeLeft = 15000;
    const interval = 100;

    timer = setInterval(function () {
        timeLeft -= interval;
        const pct = (timeLeft / 15000) * 100;
        progressBar.style.width = pct + '%';

        if (timeLeft <= 0) {
            clearInterval(timer);
            closeFooter();
        }
    }, interval);

    window.addEventListener('message', function (event) {
        if (event.data === 'reopenTinyfoot') {
            clearInterval(timer);
            isClosed = false;
            progressBar.style.display = 'none';
        }
    });
});