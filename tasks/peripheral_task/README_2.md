## Integración del CSS en el HTML

Solo es necesario enlazar `main.css`, que se encarga de importar los parciales:

```html
<link rel="stylesheet" href="css/main.css">
```



## Integración en proyecto principal

Esta carpeta es autocontenida. Enlázala desde el proyecto principal con:

```html
<a href="gato-saltos/peripheral.html">Jugar</a>
```

O incrústala en un `<iframe>`:

```html
<iframe src="gato-saltos/peripheral.html" width="100%" height="600px" frameborder="0"></iframe>