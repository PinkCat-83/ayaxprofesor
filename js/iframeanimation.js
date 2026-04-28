let isOpen = true;

window.addEventListener('load', function () {
    const iframe = document.getElementById('tinyfoot-iframe');

    if (iframe) {
        setTimeout(function () {
            iframe.style.right = '10px';
        }, 300);

        iframe.addEventListener('click', function () {
            if (!isOpen) {
                isOpen = true;
                iframe.style.right = '10px';
                iframe.contentWindow.postMessage('reopenTinyfoot', '*');
            }
        });
    }
});

window.addEventListener('message', function (event) {
    const iframe = document.getElementById('tinyfoot-iframe');

    if (event.data === 'closeTinyfoot') {
        isOpen = false;
        iframe.style.right = '-430px';
    }

    if (event.data === 'reopenFromInside') {
        isOpen = true;
        iframe.style.right = '10px';
        iframe.contentWindow.postMessage('reopenTinyfoot', '*');
    }
});