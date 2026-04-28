/* ============================================================
   explorer.js — Lógica del Simulador de Explorador de Archivos
   Parte de: tasks/explorer_task/js/explorer.js

   ARQUITECTURA:
   Los ejercicios se cargan desde JSON externos (json/exercise_XX.json)
   al arrancar la página. Las funciones de validación (checklist y
   validate) que no pueden expresarse de forma declarativa se definen
   en EXERCISE_VALIDATORS más abajo y se inyectan tras la carga del JSON.

   ESTADO GLOBAL:
   - fileSystem     — árbol de archivos en memoria
   - currentPath    — array de nombres de carpeta (ruta actual)
   - selectedItem   — nombre del elemento seleccionado (o null)
   - clipboard      — { name, path } del elemento en portapapeles
   - clipboardMode  — 'cut' | 'copy' | null
   - currentExercise — número del ejercicio activo (o null)
   - hintLevel      — índice de la pista actual (ciclo)
   - iconMapping    — mapa ruta→icono, se reconstruye en cada render
   - exercises      — objeto con todos los ejercicios cargados
   ============================================================ */


/* ------------------------------------------------------------
   ESTADO GLOBAL
   ------------------------------------------------------------ */

let fileSystem     = {};
let currentPath    = [];
let selectedItem   = null;
let clipboard      = null;
let clipboardMode  = null;
let currentExercise = null;
let hintLevel      = 0;
let iconMapping    = {};
let exercises      = {};


/* ------------------------------------------------------------
   MAPAS DE ICONOS POR EJERCICIO
   Clave: nombre original del archivo. Valor: emoji o ruta de imagen.
   Se usan en buildIconMapping() para poblar iconMapping al iniciar
   cada ejercicio. Son necesarios aquí (y no solo en JSON) porque
   iconMapping debe sobrevivir a renombrados.
   ------------------------------------------------------------ */

const EXERCISE_ICONS = {
    3: {
        mode: 'emoji',
        map: {
            'Foto1.jpg':  '🔵',  // Círculo azul
            'Foto2.jpg':  '🐬',  // Delfín azul
            'Foto3.jpg':  '👖',  // Pantalones azul
            'Foto4.jpg':  '🐟',  // Pez azul
            'Foto5.jpg':  '🍋',  // Limón amarillo
            'Foto6.jpg':  '⭐',  // Estrella amarilla
            'Foto7.jpg':  '🌻',  // Girasol amarillo
            'Foto8.jpg':  '🐥',  // Pollito amarillo
            'Foto9.jpg':  '🍎',  // Manzana roja
            'Foto10.jpg': '🌹',  // Rosa roja
            'Foto11.jpg': '❤️',  // Corazón rojo
            'Foto12.jpg': '🍓',  // Fresa roja
            'Foto13.jpg': '🍀',  // Trébol verde
            'Foto14.jpg': '🐸',  // Rana verde
            'Foto15.jpg': '🌲',  // Árbol verde
            'Foto16.jpg': '🍏'   // Manzana verde
        }
    },
    4: {
        mode: 'emoji',
        map: {
            'Producto1.jpg': '💍',  // Anillo 1
            'Producto2.jpg': '💎',  // Anillo 2
            'Producto3.jpg': '👑',  // Anillo 3
            'Producto4.jpg': '👓',  // Gafas 1
            'Producto5.jpg': '🕶️',  // Gafas 2
            'Producto6.jpg': '🥽',  // Gafas 3
            'Producto7.jpg': '⌚',  // Reloj 1
            'Producto8.jpg': '⏰',  // Reloj 2
            'Producto9.jpg': '⏱️'   // Reloj 3
        }
    },
    5: {
        mode: 'image',
        map: {
            'Doc1.jpg': 'img/fileexplorer5/01.jpg',
            'Doc2.jpg': 'img/fileexplorer5/02.jpg',
            'Doc3.jpg': 'img/fileexplorer5/03.jpg',
            'Doc4.jpg': 'img/fileexplorer5/04.jpg',
            'Doc5.jpg': 'img/fileexplorer5/05.jpg',
            'Doc6.jpg': 'img/fileexplorer5/06.jpg',
            'Doc7.jpg': 'img/fileexplorer5/07.jpg',
            'Doc8.jpg': 'img/fileexplorer5/08.jpg'
        }
    },
    6: {
        mode: 'emoji',
        map: {
            'IMG_001.jpg': '⚽',  // Fútbol
            'IMG_002.jpg': '🏖️',  // Playa
            'IMG_003.jpg': '🦜',  // Loro/Guacamayo
            'IMG_004.jpg': '🌴',  // Palmera
            'IMG_005.jpg': '🎭'   // Carnaval
        }
    },
    7: {
        mode: 'emoji',
        map: {
            'Imagen1.jpg': '🌸',  // Primavera - Flores
            'Imagen2.jpg': '🦋',  // Primavera - Mariposa
            'Imagen3.jpg': '☀️',  // Verano - Sol
            'Imagen4.jpg': '🏖️',  // Verano - Playa
            'Imagen5.jpg': '🍂',  // Otoño - Hojas
            'Imagen6.jpg': '🍁',  // Otoño - Hoja de arce
            'Imagen7.jpg': '❄️',  // Invierno - Nieve
            'Imagen8.jpg': '⛄'   // Invierno - Muñeco de nieve
        }
    },
    8: {
        mode: 'image',
        map: {
            'qwe.jpg': 'img/fileexplorer8/01.jpg',
            'asd.jpg': 'img/fileexplorer8/02.jpg',
            'zxc.jpg': 'img/fileexplorer8/03.jpg',
            'wer.jpg': 'img/fileexplorer8/04.jpg',
            'sdf.jpg': 'img/fileexplorer8/05.jpg',
            'xcv.jpg': 'img/fileexplorer8/06.jpg',
            '123.jpg': 'img/fileexplorer8/07.jpg',
            '234.jpg': 'img/fileexplorer8/08.jpg'
        }
    },
    // Ejercicio 9: iconos por extensión, gestionados directamente
    // en buildIconMapping() y getIconForFile()
};

// Extensiones del ejercicio 9
const EXT_ICONS = {
    '.mp3': { type: 'emoji', value: '🎵' },
    '.mp4': { type: 'emoji', value: '🎬' },
    '.pdf': { type: 'emoji', value: '📄' },
    '.jpg': { type: 'emoji', value: '📷' }
};


/* ------------------------------------------------------------
   VALIDADORES DE EJERCICIOS
   Las funciones check() de checklist y validate() no se pueden
   serializar en JSON. Se definen aquí y se inyectan sobre el
   objeto del ejercicio después de cargarlo.
   ------------------------------------------------------------ */

// Helper reutilizable: quita tildes y pasa a minúsculas
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const EXERCISE_VALIDATORS = {
    1: {
        checklist: [
            {
                text: "4 archivos en la carpeta Francia",
                check: (fs) => Object.keys(fs['Francia']?.children || {}).filter(k => k.startsWith('Francia')).length === 4
            },
            {
                text: "4 archivos en la carpeta Italia",
                check: (fs) => Object.keys(fs['Italia']?.children || {}).filter(k => k.startsWith('Italia')).length === 4
            },
            {
                text: "4 archivos en la carpeta Japón",
                check: (fs) => Object.keys(fs['Japón']?.children || {}).filter(k => k.startsWith('Japón')).length === 4
            }
        ],
        validate: (fs) => {
            const franciaCount = Object.keys(fs['Francia']?.children || {}).filter(k => k.startsWith('Francia')).length;
            const italiaCount  = Object.keys(fs['Italia']?.children  || {}).filter(k => k.startsWith('Italia')).length;
            const japonCount   = Object.keys(fs['Japón']?.children   || {}).filter(k => k.startsWith('Japón')).length;
            return franciaCount === 4 && italiaCount === 4 && japonCount === 4;
        }
    },
    2: {
        checklist: [
            {
                text: "3 archivos renombrados con 'Grecia'",
                check: (fs) => {
                    let count = 0;
                    for (let name in fs) {
                        if (fs[name].type === 'file' && name.toLowerCase().includes('grecia')) count++;
                    }
                    for (let folder in fs) {
                        if (fs[folder].type === 'folder') {
                            for (let file in fs[folder].children) {
                                if (file.toLowerCase().includes('grecia')) count++;
                            }
                        }
                    }
                    return count === 3;
                }
            },
            {
                text: "3 archivos en la carpeta Estados Unidos",
                check: (fs) => Object.keys(fs['Estados Unidos']?.children || {}).filter(k => k.includes('Estados Unidos')).length === 3
            },
            {
                text: "3 archivos en la carpeta Grecia",
                check: (fs) => Object.keys(fs['Grecia']?.children || {}).filter(k => k.toLowerCase().includes('grecia')).length === 3
            },
            {
                text: "3 archivos en la carpeta Polo Norte",
                check: (fs) => Object.keys(fs['Polo Norte']?.children || {}).filter(k => k.includes('Polo Norte')).length === 3
            }
        ],
        validate: (fs) => {
            const eeuuCount  = Object.keys(fs['Estados Unidos']?.children || {}).filter(k => k.includes('Estados Unidos')).length;
            const poloCount  = Object.keys(fs['Polo Norte']?.children     || {}).filter(k => k.includes('Polo Norte')).length;
            const greciaCount = Object.keys(fs['Grecia']?.children        || {}).filter(k => k.toLowerCase().includes('grecia')).length;
            return eeuuCount === 3 && poloCount === 3 && greciaCount === 3;
        }
    },
    3: {
        checklist: [
            {
                text: "Carpeta 'Azul' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && /azul(es)?/.test(norm(n)))
            },
            {
                text: "4 archivos azules renombrados y en carpeta Azul",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && /azul(es)?/.test(norm(fn))) {
                            return Object.keys(fs[fn].children).filter(k => /azul(es)?/.test(norm(k))).length === 4;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Amarillo' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && /amarill(o|a|os|as)/.test(norm(n)))
            },
            {
                text: "4 archivos amarillos renombrados y en carpeta Amarillo",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && /amarill(o|a|os|as)/.test(norm(fn))) {
                            return Object.keys(fs[fn].children).filter(k => /amarill(o|a|os|as)/.test(norm(k))).length === 4;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Rojo' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && /roj(o|a|os|as)/.test(norm(n)))
            },
            {
                text: "4 archivos rojos renombrados y en carpeta Rojo",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && /roj(o|a|os|as)/.test(norm(fn))) {
                            return Object.keys(fs[fn].children).filter(k => /roj(o|a|os|as)/.test(norm(k))).length === 4;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Verde' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && /verde(s)?/.test(norm(n)))
            },
            {
                text: "4 archivos verdes renombrados y en carpeta Verde",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && /verde(s)?/.test(norm(fn))) {
                            return Object.keys(fs[fn].children).filter(k => /verde(s)?/.test(norm(k))).length === 4;
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            const contieneColor = (texto, color) => {
                const t = norm(texto);
                if (color === 'azul')     return /azul(es)?/.test(t);
                if (color === 'amarillo') return /amarill(o|a|os|as)/.test(t);
                if (color === 'rojo')     return /roj(o|a|os|as)/.test(t);
                if (color === 'verde')    return /verde(s)?/.test(t);
                return false;
            };
            const colores = ['azul', 'amarillo', 'rojo', 'verde'];
            for (let color of colores) {
                let folder = null;
                for (let fn in fs) {
                    if (fs[fn].type === 'folder' && contieneColor(fn, color)) {
                        folder = fs[fn];
                        break;
                    }
                }
                if (!folder) return false;
                const count = Object.keys(folder.children).filter(k => contieneColor(k, color)).length;
                if (count !== 4) return false;
            }
            return true;
        }
    },
    4: {
        checklist: [
            {
                text: "Carpeta 'Anillos' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('anillo'))
            },
            {
                text: "3 archivos en la carpeta Anillos",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('anillo')) {
                            return Object.keys(fs[fn].children).length === 3;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Gafas' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('gafa'))
            },
            {
                text: "3 archivos en la carpeta Gafas",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('gafa')) {
                            return Object.keys(fs[fn].children).length === 3;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Relojes' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('reloj'))
            },
            {
                text: "3 archivos en la carpeta Relojes",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('reloj')) {
                            return Object.keys(fs[fn].children).length === 3;
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            const categorias = ['anillo', 'gafa', 'reloj'];
            for (let cat of categorias) {
                let folder = null;
                for (let fn in fs) {
                    if (fs[fn].type === 'folder' && norm(fn).includes(cat)) {
                        folder = fs[fn];
                        break;
                    }
                }
                if (!folder || Object.keys(folder.children).length !== 3) return false;
            }
            return true;
        }
    },
    5: {
        checklist: [
            {
                text: "Carpeta 'Facturas' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('factura'))
            },
            {
                text: "4 archivos en carpeta Facturas",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('factura')) {
                            return Object.keys(fs[fn].children).length === 4;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Contratos' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('contrato'))
            },
            {
                text: "4 archivos en carpeta Contratos",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('contrato')) {
                            return Object.keys(fs[fn].children).length === 4;
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            let facturas = null, contratos = null;
            for (let fn in fs) {
                if (fs[fn].type === 'folder') {
                    if (norm(fn).includes('factura'))  facturas  = fs[fn];
                    if (norm(fn).includes('contrato')) contratos = fs[fn];
                }
            }
            if (!facturas || !contratos) return false;
            return Object.keys(facturas.children).length === 4 &&
                   Object.keys(contratos.children).length === 4;
        }
    },
    6: {
        checklist: [
            {
                text: "5 archivos renombrados con 'Brasil'",
                check: (fs) => {
                    let count = 0;
                    for (let name in fs) {
                        if (fs[name].type === 'file' && norm(name).includes('brasil')) count++;
                    }
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder') {
                            for (let f in fs[fn].children) {
                                if (norm(f).includes('brasil')) count++;
                            }
                        }
                    }
                    return count >= 5;
                }
            },
            {
                text: "Carpeta 'Copia para Andrea' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && n.toLowerCase().includes('andrea'))
            },
            {
                text: "5 archivos de Brasil en carpeta de Andrea",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && fn.toLowerCase().includes('andrea')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().includes('brasil')).length === 5;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Copia para Carlos' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && n.toLowerCase().includes('carlos'))
            },
            {
                text: "5 archivos de Brasil en carpeta de Carlos",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && fn.toLowerCase().includes('carlos')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().includes('brasil')).length === 5;
                        }
                    }
                    return false;
                }
            },
            {
                // Valida que se usó Copiar y no Cortar
                text: "Archivos originales siguen en la raíz (usaste COPIAR)",
                check: (fs) => Object.keys(fs).filter(k => fs[k].type === 'file').length >= 5
            }
        ],
        validate: (fs) => {
            let andreaFolder = null, carlosFolder = null;
            for (let fn in fs) {
                if (fs[fn].type === 'folder') {
                    if (fn.toLowerCase().includes('andrea')) andreaFolder = fs[fn];
                    if (fn.toLowerCase().includes('carlos')) carlosFolder = fs[fn];
                }
            }
            if (!andreaFolder || !carlosFolder) return false;
            const andreaFiles = Object.keys(andreaFolder.children).filter(n => n.toLowerCase().includes('brasil')).length;
            const carlosFiles = Object.keys(carlosFolder.children).filter(n => n.toLowerCase().includes('brasil')).length;
            const rootFiles   = Object.keys(fs).filter(k => fs[k].type === 'file').length;
            return andreaFiles === 5 && carlosFiles === 5 && rootFiles >= 5;
        }
    },
    7: {
        checklist: [
            {
                text: "Carpeta 'Primavera' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('primavera'))
            },
            {
                text: "2 archivos de primavera renombrados y en carpeta",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('primavera')) {
                            return Object.keys(fs[fn].children).filter(k => norm(k).includes('primavera')).length === 2;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Verano' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('verano'))
            },
            {
                text: "2 archivos de verano renombrados y en carpeta",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('verano')) {
                            return Object.keys(fs[fn].children).filter(k => norm(k).includes('verano')).length === 2;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Otoño' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('otono'))
            },
            {
                text: "2 archivos de otoño renombrados y en carpeta",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('otono')) {
                            return Object.keys(fs[fn].children).filter(k => norm(k).includes('otono')).length === 2;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Invierno' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('invierno'))
            },
            {
                text: "2 archivos de invierno renombrados y en carpeta",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('invierno')) {
                            return Object.keys(fs[fn].children).filter(k => norm(k).includes('invierno')).length === 2;
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            const estaciones = ['primavera', 'verano', 'otono', 'invierno'];
            for (let est of estaciones) {
                let folder = null;
                for (let fn in fs) {
                    if (fs[fn].type === 'folder' && norm(fn).includes(est)) {
                        folder = fs[fn];
                        break;
                    }
                }
                if (!folder) return false;
                if (Object.keys(folder.children).filter(k => norm(k).includes(est)).length !== 2) return false;
            }
            return true;
        }
    },
    8: {
        checklist: [
            {
                text: "Carpeta 'Peliculas' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('pelicula'))
            },
            {
                text: "4 archivos renombrados (sin nombres basura) en Peliculas",
                check: (fs) => {
                    const garbage = ['qwe.jpg','asd.jpg','zxc.jpg','wer.jpg','sdf.jpg','xcv.jpg','123.jpg','234.jpg'];
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('pelicula')) {
                            const files = Object.keys(fs[fn].children);
                            return files.length === 4 && !files.some(f => garbage.includes(f));
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Dibujos' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('dibujo'))
            },
            {
                text: "4 archivos renombrados (sin nombres basura) en Dibujos",
                check: (fs) => {
                    const garbage = ['qwe.jpg','asd.jpg','zxc.jpg','wer.jpg','sdf.jpg','xcv.jpg','123.jpg','234.jpg'];
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('dibujo')) {
                            const files = Object.keys(fs[fn].children);
                            return files.length === 4 && !files.some(f => garbage.includes(f));
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            const garbage = ['qwe.jpg','asd.jpg','zxc.jpg','wer.jpg','sdf.jpg','xcv.jpg','123.jpg','234.jpg'];
            let peliculas = null, dibujos = null;
            for (let fn in fs) {
                if (fs[fn].type === 'folder') {
                    if (norm(fn).includes('pelicula')) peliculas = fs[fn];
                    if (norm(fn).includes('dibujo'))   dibujos   = fs[fn];
                }
            }
            if (!peliculas || !dibujos) return false;
            const pelFiles = Object.keys(peliculas.children);
            const dibFiles = Object.keys(dibujos.children);
            return pelFiles.length === 4 && !pelFiles.some(f => garbage.includes(f)) &&
                   dibFiles.length === 4 && !dibFiles.some(f => garbage.includes(f));
        }
    },
    9: {
        checklist: [
            {
                text: "Carpeta 'Música' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('musica'))
            },
            {
                text: "3 archivos .mp3 en carpeta Música",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('musica')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().endsWith('.mp3')).length === 3;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Video' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('video'))
            },
            {
                text: "3 archivos .mp4 en carpeta Video",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('video')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().endsWith('.mp4')).length === 3;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Documento' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('documento'))
            },
            {
                text: "3 archivos .pdf en carpeta Documento",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('documento')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().endsWith('.pdf')).length === 3;
                        }
                    }
                    return false;
                }
            },
            {
                text: "Carpeta 'Foto' creada",
                check: (fs) => Object.keys(fs).some(n => fs[n].type === 'folder' && norm(n).includes('foto'))
            },
            {
                text: "3 archivos .jpg en carpeta Foto",
                check: (fs) => {
                    for (let fn in fs) {
                        if (fs[fn].type === 'folder' && norm(fn).includes('foto')) {
                            return Object.keys(fs[fn].children).filter(k => k.toLowerCase().endsWith('.jpg')).length === 3;
                        }
                    }
                    return false;
                }
            }
        ],
        validate: (fs) => {
            // Este ejercicio valida explícitamente por extensión (es el objetivo didáctico)
            const categorias = {
                'musica':    { ext: '.mp3', count: 0 },
                'video':     { ext: '.mp4', count: 0 },
                'documento': { ext: '.pdf', count: 0 },
                'foto':      { ext: '.jpg', count: 0 }
            };
            for (let fn in fs) {
                if (fs[fn].type === 'folder') {
                    const fnNorm = norm(fn);
                    for (let cat in categorias) {
                        if (fnNorm.includes(cat)) {
                            for (let file in fs[fn].children) {
                                if (file.toLowerCase().endsWith(categorias[cat].ext)) {
                                    categorias[cat].count++;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            return categorias.musica.count    === 3 &&
                   categorias.video.count     === 3 &&
                   categorias.documento.count === 3 &&
                   categorias.foto.count      === 3;
        }
    }
};


/* ------------------------------------------------------------
   CARGA DE EJERCICIOS DESDE JSON
   ------------------------------------------------------------ */

async function loadExercises() {
    const total = 9;
    const promises = [];

    for (let i = 1; i <= total; i++) {
        const num = String(i).padStart(2, '0');
        promises.push(
            fetch(`json/exercise_${num}.json`)
                .then(r => r.json())
                .then(data => {
                    // Inyectar validadores JS sobre los datos del JSON
                    const validators = EXERCISE_VALIDATORS[i];
                    if (validators) {
                        data.checklist = validators.checklist;
                        data.validate  = validators.validate;
                    }
                    exercises[i] = data;
                })
                .catch(err => console.error(`Error cargando exercise_${num}.json:`, err))
        );
    }

    await Promise.all(promises);
    renderMenu();
}


/* ------------------------------------------------------------
   MENÚ DE SELECCIÓN
   ------------------------------------------------------------ */

function renderMenu() {
    const grid = document.getElementById('exerciseGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const ex = exercises[i];
        if (!ex) continue;
        const btn = document.createElement('button');
        btn.className = 'exercise-btn';
        btn.innerHTML = `<strong>${ex.menuLabel}</strong>${ex.menuDesc}`;
        btn.addEventListener('click', () => startExercise(i));
        grid.appendChild(btn);
    }
}

function startExercise(num) {
    currentExercise = num;
    hintLevel = 0;
    document.getElementById('exerciseMenu').style.display = 'none';
    initializeExercise(exercises[num]);
}

function backToMenu() {
    document.getElementById('exerciseMenu').style.display = 'flex';
    currentExercise = null;
    hintLevel = 0;
    document.getElementById('hintText').textContent = '';
    document.getElementById('completedText').textContent = '';
}


/* ------------------------------------------------------------
   INICIALIZACIÓN DE EJERCICIO
   ------------------------------------------------------------ */

function initializeExercise(exercise) {
    fileSystem    = JSON.parse(JSON.stringify(exercise.initialFiles));
    currentPath   = [];
    selectedItem  = null;
    clipboard     = null;
    clipboardMode = null;

    iconMapping = {};
    buildIconMapping(fileSystem, []);

    updateTaskDescription(exercise);
    updateChecklist(exercise);
    render();
}

function buildIconMapping(folder, path) {
    const exerciseIconSet = EXERCISE_ICONS[currentExercise];

    for (let name in folder) {
        if (folder[name].type === 'file') {
            const fullPath = [...path, name].join('/');

            if (exerciseIconSet) {
                const iconValue = exerciseIconSet.map[name];
                if (iconValue) {
                    iconMapping[fullPath] = { type: exerciseIconSet.mode, value: iconValue };
                }
            } else if (currentExercise === 9) {
                const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
                if (EXT_ICONS[ext]) iconMapping[fullPath] = EXT_ICONS[ext];
            }

        } else if (folder[name].type === 'folder') {
            buildIconMapping(folder[name].children, [...path, name]);
        }
    }
}

function getIconForFile(name, path) {
    const fullPath = [...path, name].join('/');

    // 1. Buscar por ruta completa (nombre actual)
    if (iconMapping[fullPath]) return iconMapping[fullPath];

    // 2. Buscar por extensión en el mismo directorio (resiste renombrados)
    const currentPathStr = path.join('/');
    for (let key in iconMapping) {
        const parts      = key.split('/');
        const origName   = parts[parts.length - 1];
        const keyPathStr = parts.slice(0, -1).join('/');

        if (keyPathStr === currentPathStr) {
            const ext1 = origName.substring(origName.lastIndexOf('.'));
            const ext2 = name.substring(name.lastIndexOf('.'));
            if (ext1 === ext2 && !iconMapping[fullPath]) {
                iconMapping[fullPath] = iconMapping[key];
                return iconMapping[key];
            }
        }
    }

    // 3. Ejercicio 9: fallback por extensión
    if (currentExercise === 9) {
        const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
        if (EXT_ICONS[ext]) return EXT_ICONS[ext];
    }

    return null;
}


/* ------------------------------------------------------------
   RENDER
   ------------------------------------------------------------ */

function render() {
    const currentFolder = getCurrentFolder();
    const grid = document.getElementById('fileGrid');
    grid.innerHTML = '';

    // Separar y ordenar: primero carpetas, luego archivos (alfabético)
    const folders = [];
    const files   = [];
    for (let name in currentFolder) {
        (currentFolder[name].type === 'folder' ? folders : files).push(name);
    }
    folders.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    for (let name of [...folders, ...files]) {
        const item     = currentFolder[name];
        const fileItem = document.createElement('div');
        fileItem.className  = 'file-item';
        fileItem.dataset.name = name;

        // Efecto visual de "cortado"
        if (clipboard && clipboardMode === 'cut' &&
            clipboard.name === name && arraysEqual(clipboard.path, currentPath)) {
            fileItem.classList.add('cut');
        }

        if (item.type === 'folder') {
            fileItem.innerHTML = `
                <svg class="file-icon" viewBox="0 0 24 24" fill="#ffd700" stroke="#f0c000" stroke-width="1">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <div class="file-name">${name}</div>
            `;
            fileItem.addEventListener('dblclick', () => openFolder(name));
        } else {
            const icon = getIconForFile(name, currentPath);
            let iconHTML;

            if (icon?.type === 'emoji') {
                iconHTML = `<div class="file-icon">${icon.value}</div>`;
            } else if (icon?.type === 'image') {
                iconHTML = `<div class="file-icon"><img src="${icon.value}" alt="${name}"></div>`;
            } else {
                iconHTML = `
                    <svg class="file-icon" viewBox="0 0 24 24" fill="#fff" stroke="#0067C0" stroke-width="1.5">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                    </svg>
                `;
            }

            fileItem.innerHTML = `${iconHTML}<div class="file-name">${name}</div>`;
        }

        fileItem.addEventListener('click', (e) => selectItem(name, e));
        grid.appendChild(fileItem);
    }

    updateAddressBar();
    updateButtons();

    if (currentExercise) {
        updateChecklist(exercises[currentExercise]);
    }
}

function updateAddressBar() {
    const el = document.getElementById('currentPath');
    el.textContent = currentPath.length === 0
        ? 'Este equipo'
        : 'Este equipo > ' + currentPath.join(' > ');
}

function updateTaskDescription(exercise) {
    const el = document.getElementById('taskDescription');
    let html = `<h3>${exercise.title}</h3>`;
    html += `<p><strong>${exercise.description}</strong></p><ul>`;
    exercise.tasks.forEach(t => { html += `<li>${t}</li>`; });
    html += '</ul>';
    el.innerHTML = html;
}

function updateChecklist(exercise) {
    const el = document.getElementById('taskChecklist');
    if (!exercise.checklist) { el.innerHTML = ''; return; }

    let html = '<h3>✓ Progreso</h3><div class="checklist-grid">';
    exercise.checklist.forEach(item => {
        const done  = item.check(fileSystem);
        const icon  = done ? '✅' : '⬜';
        const cls   = done ? 'completed' : '';
        html += `
            <div class="checklist-item ${cls}">
                <span class="checklist-icon">${icon}</span>
                <span class="checklist-text">${item.text}</span>
            </div>
        `;
    });
    html += '</div>';
    el.innerHTML = html;
}


/* ------------------------------------------------------------
   SELECCIÓN Y NAVEGACIÓN
   ------------------------------------------------------------ */

function selectItem(name, event) {
    if (event) event.stopPropagation();
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
    selectedItem = name;
    document.querySelectorAll('.file-item').forEach(el => {
        if (el.dataset.name === name) el.classList.add('selected');
    });
    updateButtons();
}

function openFolder(name) {
    if (getCurrentFolder()[name]?.type === 'folder') {
        currentPath.push(name);
        selectedItem = null;
        render();
    }
}

function goBack() {
    if (currentPath.length > 0) {
        currentPath.pop();
        selectedItem = null;
        render();
    }
}

function updateButtons() {
    const hasSel  = selectedItem !== null;
    const hasClip = clipboard !== null;
    const canBack = currentPath.length > 0;

    document.getElementById('backBtn').disabled   = !canBack;
    document.getElementById('cutBtn').disabled    = !hasSel;
    document.getElementById('copyBtn').disabled   = !hasSel;
    document.getElementById('pasteBtn').disabled  = !hasClip;
    document.getElementById('renameBtn').disabled = !hasSel;
    document.getElementById('deleteBtn').disabled = !hasSel;
}


/* ------------------------------------------------------------
   OPERACIONES DE ARCHIVOS
   ------------------------------------------------------------ */

function createFolder() {
    const currentFolder = getCurrentFolder();
    let folderName = 'Nueva carpeta';
    let counter = 1;
    while (currentFolder[folderName]) {
        folderName = `Nueva carpeta (${counter++})`;
    }
    currentFolder[folderName] = { type: 'folder', children: {} };
    render();
}

function cutItem() {
    if (!selectedItem) return;
    clipboard     = { name: selectedItem, path: [...currentPath] };
    clipboardMode = 'cut';
    render();
    updateButtons();
}

function copyItem() {
    if (!selectedItem) return;
    clipboard     = { name: selectedItem, path: [...currentPath] };
    clipboardMode = 'copy';
    render();
    updateButtons();
}

function pasteItem() {
    if (!clipboard) return;

    const currentFolder = getCurrentFolder();

    // CASO ESPECIAL ejercicio 1: no se puede pegar en la raíz con cortar
    if (currentExercise === 1 && currentPath.length === 0 && clipboardMode === 'cut') {
        alert('Debes ENTRAR en una carpeta para pegar el archivo cortado');
        return;
    }

    // Obtener la carpeta de origen
    let sourceFolder = fileSystem;
    for (let name of clipboard.path) {
        sourceFolder = sourceFolder[name].children;
    }

    const item = sourceFolder[clipboard.name];
    if (!item) return;

    // Resolver colisión de nombre en el destino
    let targetName = clipboard.name;
    let counter = 1;
    while (currentFolder[targetName]) {
        const nameParts = clipboard.name.split('.');
        if (nameParts.length > 1) {
            const ext = nameParts.pop();
            targetName = `${nameParts.join('.')} (${counter}).${ext}`;
        } else {
            targetName = `${clipboard.name} (${counter})`;
        }
        counter++;
    }

    // Copiar el ítem al destino
    currentFolder[targetName] = JSON.parse(JSON.stringify(item));

    // Mantener iconMapping con la nueva ruta
    const oldPath = [...clipboard.path, clipboard.name].join('/');
    const newPath = [...currentPath, targetName].join('/');
    if (iconMapping[oldPath]) {
        iconMapping[newPath] = iconMapping[oldPath];
    }

    // Si es cortar, eliminar el original
    if (clipboardMode === 'cut') {
        delete sourceFolder[clipboard.name];
        delete iconMapping[oldPath];
        clipboard     = null;
        clipboardMode = null;
    }

    render();
}

function renameItem() {
    if (!selectedItem) return;

    const currentFolder = getCurrentFolder();
    const oldName = selectedItem;

    const lastDot = oldName.lastIndexOf('.');
    let nameWithoutExt = oldName;
    let extension = '';
    if (lastDot > 0 && currentFolder[oldName].type === 'file') {
        nameWithoutExt = oldName.substring(0, lastDot);
        extension      = oldName.substring(lastDot);
    }

    const newBase = prompt('Nuevo nombre (sin extensión):', nameWithoutExt);
    if (!newBase || newBase === nameWithoutExt) return;

    const newName = newBase + extension;
    if (currentFolder[newName]) {
        alert('Ya existe un archivo con ese nombre');
        return;
    }

    // Actualizar iconMapping
    const oldPath = [...currentPath, oldName].join('/');
    const newPath = [...currentPath, newName].join('/');
    if (iconMapping[oldPath]) {
        iconMapping[newPath] = iconMapping[oldPath];
        delete iconMapping[oldPath];
    }

    currentFolder[newName] = currentFolder[oldName];
    delete currentFolder[oldName];
    selectedItem = null;
    render();
}

function deleteItem() {
    if (!selectedItem) return;
    if (confirm(`¿Estás seguro de que quieres eliminar "${selectedItem}"?`)) {
        const currentFolder = getCurrentFolder();
        delete currentFolder[selectedItem];
        selectedItem = null;
        render();
    }
}


/* ------------------------------------------------------------
   PISTAS
   ------------------------------------------------------------ */

function showHint() {
    const exercise = exercises[currentExercise];
    if (!exercise) return;

    const hintText = document.getElementById('hintText');
    if (hintLevel >= exercise.hints.length) hintLevel = 0;

    hintText.textContent = `Pista ${hintLevel + 1}/${exercise.hints.length}: ${exercise.hints[hintLevel]}`;
    hintLevel++;
}


/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */

function getCurrentFolder() {
    let folder = fileSystem;
    for (let name of currentPath) {
        folder = folder[name].children;
    }
    return folder;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}


/* ------------------------------------------------------------
   EVENTOS GLOBALES
   ------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    // Deseleccionar al hacer clic en el área vacía
    document.getElementById('fileGrid').addEventListener('click', (e) => {
        if (e.target.id === 'fileGrid') {
            selectedItem = null;
            document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
            updateButtons();
        }
    });

    // Cargar ejercicios desde JSON
    loadExercises();
});
