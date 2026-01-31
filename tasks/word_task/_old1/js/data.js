/**
 * CONFIGURACIÓN DEL JUEGO - PALABRAS Y PREGUNTAS
 * 
 * Cada palabra tiene:
 * - letra: La letra o símbolo que se muestra en el rosco
 * - pregunta: La pregunta que se muestra al jugador
 * - pista: Una pista opcional para ayudar al jugador
 * - respuesta: String o array de strings con respuestas válidas
 */

const palabras = [
    { letra: '💖', pregunta: 'Animal favorito del profesor', pista: 'Empieza por G', respuesta: ['gato', 'gatos', 'gata', 'gatas'] },
    { letra: 'A', pregunta: 'Sirve para almacenar información.', pista: 'Empieza por A', respuesta: ['archivo', 'archivos', 'archibo', 'archibos'] },
    { letra: 'B', pregunta: 'Acción que realizamos en Google cuando queremos información sobre algo.', pista: 'Empieza por B', respuesta: ['buscar', 'búsqueda', 'búsqueda', 'busqueda'] },
    { letra: 'C', pregunta: 'Lugar donde guardamos archivos y carpetas.', pista: 'Empieza por C', respuesta: ['carpeta', 'carpetas'] },
    { letra: 'D', pregunta: 'Nombre de la carpeta donde se almacena por defecto los archivos conseguidos de internet.', pista: 'Empieza por D', respuesta: ['descarga', 'descargas', 'descaga'] },
    { letra: 'E', pregunta: 'La primera pantalla que ves al entrar al Sistema Operativo, donde hay muchos iconos, archivos y carpetas que puedes organizar.', pista: 'Empieza por E', respuesta: ['escritorio'] },
    { letra: 'F', pregunta: 'Nombre genérico que engloba los distintos tipos de letras.', pista: 'Empieza por F', respuesta: ['fuente', 'fuentes'] },
    { letra: 'G', pregunta: 'Motor de búsqueda más usado mundialmente.', pista: 'Empieza por G', respuesta: ['google', 'guguel', 'gugel', 'gogle'] },
    { letra: 'H', pregunta: 'Componente del ordenador que puede tocarse con las manos.', pista: 'Empieza por H', respuesta: ['hardware'] },
    { letra: 'I', pregunta: 'Red global de ordenadores que permite comunicarnos e intercambiar información.', pista: 'Empieza por I', respuesta: ['internet'] },
    { letra: 'J', pregunta: 'Extensión típica de archivos de imagen.', pista: 'Empieza por J', respuesta: ['jpg', 'jpeg'] },
    { letra: 'K', pregunta: 'Unidad de medida de almacenamiento de datos que equivale a 1024 bytes.', pista: 'Empieza por K', respuesta: ['kilobyte', 'kb', 'kilobytes'] },
    { letra: 'L', pregunta: 'Sistema Operativo de código abierto muy usado a nivel profesional para servidores cuya mascota es un pingüino.', pista: 'Empieza por L', respuesta: ['linux'] },
    { letra: 'M', pregunta: 'Lista de opciones que aparece en pantalla para que el usuario elija la función que desea realizar', pista: 'Empieza por M', respuesta: ['menú', 'menu'] },
    { letra: 'N', pregunta: 'Nombre genérico que reciben los programas que usamos para movernos por internet, como Google Chrome o Firefox.', pista: 'Empieza por N', respuesta: ['navegador', 'navegadores'] },
    { letra: 'Ñ', pregunta: 'En un navegador, nombre genérico para la opción de tener varias páginas web abiertas a la vez.', pista: 'Contiene la Ñ', respuesta: ['pestaña', 'pestañas'] },
    { letra: 'O', pregunta: 'Equipo informático diseñado para procesar software, realizar tareas de ofimática y establecer conexiones a internet.', pista: 'Empieza por O', respuesta: ['ordenador'] },
    { letra: 'P', pregunta: 'Conjunto de instrucciones que realiza una tarea específica en un ordenador, como un procesador de texto, un navegador web o un juego.', pista: 'Empieza por P', respuesta: ['programa', 'programas'] },
    { letra: 'Q', pregunta: 'Imagen cuadrada con un patrón en blanco y negro que se escanea con dispositivos móviles para acceder rápidamente a información, enlaces web, texto u otros datos.', pista: 'Empieza por Q', respuesta: ['qr', 'qr código', 'qr (código)', 'código qr'] },
    { letra: 'R', pregunta: 'Dispositivo de entrada que se utiliza para interactuar con la interfaz gráfica, moviendo un puntero en la pantalla y haciendo clic en botones para realizar acciones.', pista: 'Empieza por R', respuesta: ['ratón', 'raton'] },
    { letra: 'S', pregunta: 'Software que gestiona los recursos del ordenador y proporciona servicios esenciales para que otros programas funcionen en un ordenador.', pista: 'Empieza por S', respuesta: ['sistema operativo', 'so', 'sistema'] },
    { letra: 'T', pregunta: 'Dispositivo de entrada que consiste en un conjunto de botones, utilizado para introducir datos en un ordenador como letras y números.', pista: 'Empieza por T', respuesta: ['teclado', 'teclados'] },
    { letra: 'U', pregunta: 'Conexión de entrada de periféricos que se ha convertido en un estándar en todos los ordenadores y la mayoría de periféricos.', pista: 'Empieza por U', respuesta: ['usb'] },
    { letra: 'V', pregunta: 'Área rectangular en la pantalla que puede mostrar, entre otras cosas, archivos y carpetas.', pista: 'Empieza por V', respuesta: ['ventana', 'vetana', 'ventanas', 'vetanas'] },
    { letra: 'W', pregunta: 'Se usa como término coloquial para referirse a páginas en línea: Página ...', pista: 'Empieza por W', respuesta: ['web'] },
    { letra: 'X', pregunta: 'Nombre de los caracteres que hay después del último punto del nombre de un archivo.', pista: 'Contiene la X', respuesta: ['extensión', 'extensiones'] },
    { letra: 'Y', pregunta: 'Red Social, la más famosa de su género, especializada en vídeos.', pista: 'Empieza por Y', respuesta: ['youtube', 'yotube', 'youtbe', 'yutub'] },
    { letra: 'Z', pregunta: 'Plataforma de videollamadas y conferencias en línea que permite a usuarios conectarse virtualmente para reuniones, clases o eventos.', pista: 'Empieza por Z', respuesta: ['zoom', 'zum'] }
];

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { palabras };
}
