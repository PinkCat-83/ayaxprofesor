
// dictionary.js — Clase principal del diccionario ofimático
import { exportToPDF } from './pdf-export.js';

class DictionaryManager {
    constructor() {
        this.programs = [];
        this.procedures = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
    }

    async init() {
        await this.loadPrograms();
        await this.loadProcedures();
        this.renderProgramFilters();
        this.renderProcedures();
        this.setupEventListeners();
        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => exportToPDF(this));
        }
    }

    async loadPrograms() {
        try {
            const response = await fetch('json/programs.json');
            const data = await response.json();
            this.programs = data.programList;
        } catch (error) {
            console.error('Error cargando programas:', error);
        }
    }

    async loadProcedures() {
        try {
            // Cargar el índice de procedimientos (array simple)
            const loaderResponse = await fetch('json/loader.json');
            const fileList = await loaderResponse.json();

            // Cargar cada archivo individual (ruta completa desde json/)
            const procedurePromises = fileList.map(filepath =>
                fetch(`json/${filepath}`)
                    .then(response => response.json())
                    .catch(error => {
                        console.error(`Error cargando ${filepath}:`, error);
                        return null;
                    })
            );

            const procedures = await Promise.all(procedurePromises);
            this.procedures = procedures.filter(proc => proc !== null);

        } catch (error) {
            console.error('Error cargando procedimientos:', error);

            // Fallback: intentar cargar el archivo content.json antiguo
            try {
                const response = await fetch('json/content.json');
                const data = await response.json();
                this.procedures = data.procedures;
                console.log('Usando content.json como fallback');
            } catch (fallbackError) {
                console.error('Error en fallback:', fallbackError);
            }
        }
    }

    getProgramData(code) {
        return this.programs.find(p => p.code === code);
    }

    renderProgramFilters() {
        const filtersContainer = document.getElementById('program-filters');
        if (!filtersContainer) return;

        // Botón "Todos"
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'Todos';
        allButton.dataset.program = 'all';
        filtersContainer.appendChild(allButton);

        // Botón por cada programa
        this.programs.forEach(program => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.innerHTML = `
                <img src="imgs/${program.img}" alt="${program.realName}">
                <span>${program.realName}</span>
            `;
            button.dataset.program = program.code;
            filtersContainer.appendChild(button);
        });
    }

    renderProcedures() {
        const container = document.getElementById('procedures-container');
        if (!container) return;

        container.innerHTML = '';

        const filtered = this.getFilteredProcedures();

        if (filtered.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron procedimientos.</p>';
            return;
        }

        filtered.forEach(procedure => {
            const card = this.createProcedureCard(procedure);
            container.appendChild(card);
        });
    }

    getFilteredProcedures() {
        let filtered = this.procedures;

        // Filtrar por búsqueda
        if (this.searchTerm) {
            filtered = filtered.filter(proc =>
                proc.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Filtrar por programa
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(proc =>
                proc.list.some(item => item.program === this.currentFilter)
            );
        }

        return filtered;
    }

    createProcedureCard(procedure) {
        const card = document.createElement('div');
        card.className = 'procedure-card';
        card.id = `proc-${procedure.id}`;

        const title = document.createElement('h3');
        title.className = 'procedure-title';
        title.textContent = procedure.name;
        card.appendChild(title);

        const list = document.createElement('div');
        list.className = 'procedure-list';

        procedure.list.forEach(item => {
            if (this.currentFilter !== 'all' && item.program !== this.currentFilter) return;

            const programData = this.getProgramData(item.program);
            if (!programData) return;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'procedure-item';

            // Header: logo + nombre programa
            const header = document.createElement('div');
            header.className = 'procedure-item-header';
            header.innerHTML = `
                <img src="imgs/${programData.img}" alt="${programData.realName}">
                <strong>${programData.realName}</strong>
            `;
            itemDiv.appendChild(header);

            // Ruta (opcional)
            if (item.route) {
                const routeDiv = document.createElement('div');
                routeDiv.className = 'procedure-route';
                routeDiv.innerHTML = `<strong>Ruta:</strong> <code>${this.parseDesc(item.route)}</code>`;
                itemDiv.appendChild(routeDiv);
            }

            // Atajo de teclado (opcional) — admite string o array
            if (item.shortcut) {
                const shortcuts = Array.isArray(item.shortcut) ? item.shortcut : [item.shortcut];
                const shortcutDiv = document.createElement('div');
                shortcutDiv.className = 'procedure-shortcut';
                const codesHtml = shortcuts.map(s => `<code>${s}</code>`).join('');
                shortcutDiv.innerHTML = `<strong>Atajo de teclado:</strong> ${codesHtml}`;
                itemDiv.appendChild(shortcutDiv);
            }

            // Anotaciones: generaldesc + desc dentro de un cuadro con borde
            const hasGeneraldesc = procedure.generaldesc && procedure.generaldesc.trim();
            const hasDesc = item.desc && item.desc.trim();
            if (hasGeneraldesc || hasDesc) {
                const annotationsBox = document.createElement('div');
                annotationsBox.className = 'procedure-annotations';

                const annotationsTitle = document.createElement('div');
                annotationsTitle.className = 'procedure-annotations-title';
                annotationsTitle.textContent = 'Anotaciones';
                annotationsBox.appendChild(annotationsTitle);

                if (hasGeneraldesc) {
                    const generalDescDiv = document.createElement('div');
                    generalDescDiv.className = 'procedure-annotations-text';
                    generalDescDiv.innerHTML = this.parseDesc(procedure.generaldesc);
                    annotationsBox.appendChild(generalDescDiv);
                }

                if (hasDesc) {
                    const descDiv = document.createElement('div');
                    descDiv.className = 'procedure-annotations-text';
                    descDiv.innerHTML = this.parseDesc(item.desc);
                    annotationsBox.appendChild(descDiv);
                }

                itemDiv.appendChild(annotationsBox);
            }

            // Imágenes (opcional)
            if (item.imgs && item.imgs.length > 0) {
                const imgsContainer = document.createElement('div');
                imgsContainer.className = 'procedure-imgs';

                item.imgs.forEach(imgPath => {
                    const img = document.createElement('img');
                    img.src = `imgs/${imgPath}`;
                    img.alt = `Captura de ${programData.realName}`;
                    img.className = 'procedure-screenshot';
                    img.onclick = () => this.openImageModal(img.src);
                    imgsContainer.appendChild(img);
                });

                itemDiv.appendChild(imgsContainer);
            }

            list.appendChild(itemDiv);
        });

        card.appendChild(list);
        return card;
    }

    openImageModal(imgSrc) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        if (modal && modalImg) {
            modalImg.src = imgSrc;
            modal.style.display = 'flex';
        }
    }

    closeImageModal() {
        const modal = document.getElementById('image-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Parseador de simbología a código html, mezcla de md y preferencias personales
    // Se puede usar html directo en json si se prefiere
    parseDesc(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')    // **negrita**
            .replace(/\*(.*?)\*/g, '<em>$1</em>')                // *itálica*
            .replace(/__(.*?)__/g, '<u>$1</u>')                  // __subrayado__
            .replace(/>>/g, '▶')                                 // >> como ▶
            .replace(/->/g, '▶')                                 // -> como ▶
            .replace(/\/\//g, '<br>')                            // // como salto de línea
    }

    setupEventListeners() {
        // Filtros de programa
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.program;
                this.renderProcedures();
            });
        });

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.renderProcedures();
            });
        }

        // Botón borrar búsqueda
        const clearBtn = document.getElementById('clear-search-btn');
        if (clearBtn && searchInput) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchTerm = '';
                this.renderProcedures();
                searchInput.focus();
            });
        }
        const modal = document.getElementById('image-modal');
        const closeBtn = document.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeImageModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeImageModal();
                }
            });
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
const dictionary = new DictionaryManager();
dictionary.init();
