// ============================================================
// js/textLoader.js
// Responsable de cargar y gestionar los textos desde JSON
// ============================================================

const TextLoader = {
  // Datos cargados
  categories: [],
  currentCategoryData: null,
  allCategoriesData: {}, // 🎲 NUEVO: Cache de todas las categorías
  
  // 🔧 NUEVO: Configurar base path según el entorno
  basePath: (() => {
    // Detectar si estamos en la carpeta typing_task o en raíz
    const currentPath = window.location.pathname;
    if (currentPath.includes('/typing_task/')) {
      return './json/'; // Ruta relativa desde typing.html
    } else if (currentPath.includes('/tasks/')) {
      return './typing_task/json/'; // Ruta desde carpeta tasks
    } else {
      return './json/'; // Default
    }
  })(),
  
  /**
   * Cargar la lista de archivos JSON disponibles desde loader.json
   * @returns {Promise<Array>} Array con nombres de archivos
   */
  async loadFileList() {
    //console.log('📋 Cargando lista de archivos desde loader.json...');
    
    try {
      const response = await fetch(this.basePath + 'loader.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - No se pudo cargar loader.json desde ${this.basePath}loader.json`);
      }
      
      const fileList = await response.json();
      
      if (!Array.isArray(fileList) || fileList.length === 0) {
        throw new Error('loader.json está vacío o no es un array');
      }
      
      console.log(`✅ ${fileList.length} archivos encontrados en loader.json desde ${this.basePath}`);
      return fileList;
      
    } catch (error) {
      console.error('❌ Error al cargar loader.json:', error);
      console.error('Ruta intentada:', this.basePath + 'loader.json');
      throw error;
    }
  },
  
  /**
   * Cargar todas las categorías disponibles
   * @returns {Promise<Array>} Array con nombres de categorías
   */
  async loadCategories() {
    //console.log('📚 Cargando categorías...');
    this.categories = [];
    
    try {
      // Primero obtenemos la lista de archivos
      const fileList = await this.loadFileList();
      
      // Luego cargamos cada archivo
      for (const fileName of fileList) {
        try {
          const response = await fetch(this.basePath + fileName);
          
          if (!response.ok) {
            console.warn(`⚠️ No se pudo cargar ${this.basePath}${fileName} (HTTP ${response.status})`);
            continue;
          }
          
          const data = await response.json();
          
          // Validar estructura
          if (!data.class || !Array.isArray(data.option)) {
            //console.warn(`⚠️ ${fileName} tiene estructura inválida. Se esperaba: { class: "...", option: [...] }`);
            continue;
          }
          
          if (data.option.length === 0) {
            //console.warn(`⚠️ ${fileName} no tiene textos (option está vacío)`);
            continue;
          }
          
          this.categories.push({
            fileName: fileName,
            className: data.class,
            textCount: data.option.length
          });
          
          // 🎲 NUEVO: Guardar datos completos en cache
          this.allCategoriesData[fileName] = data;
          
          //console.log(`✅ Cargado: "${data.class}" (${data.option.length} textos) desde ${fileName}`);
          
        } catch (error) {
          //console.error(`❌ Error al cargar ${fileName}:`, error);
        }
      }
      
      if (this.categories.length === 0) {
        throw new Error('No se pudo cargar ninguna categoría válida');
      }
      
      //console.log(`✅ Total: ${this.categories.length} categorías cargadas correctamente`);
      return this.categories;
      
    } catch (error) {
      //console.error('❌ Error crítico al cargar categorías:', error);
      throw error;
    }
  },
  
  /**
   * Cargar datos completos de una categoría específica
   * @param {string} fileName - Nombre del archivo JSON
   * @returns {Promise<Object>} Datos de la categoría
   */
  async loadCategoryData(fileName) {
    //console.log(`📖 Cargando categoría: ${fileName}`);
    
    try {
      // Si ya está en cache, usarla
      if (this.allCategoriesData[fileName]) {
        this.currentCategoryData = this.allCategoriesData[fileName];
        //console.log(`✅ Categoría cargada desde cache: "${this.currentCategoryData.class}"`);
        return this.currentCategoryData;
      }
      
      // Si no, cargarla
      const response = await fetch(this.basePath + fileName);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} desde ${this.basePath}${fileName}`);
      }
      
      const data = await response.json();
      
      // Validar estructura
      if (!data.class || !Array.isArray(data.option) || data.option.length === 0) {
        throw new Error('Estructura de datos inválida o sin textos');
      }
      
      this.currentCategoryData = data;
      this.allCategoriesData[fileName] = data; // Guardar en cache
      //console.log(`✅ Categoría cargada: "${data.class}" con ${data.option.length} textos`);
      
      return data;
      
    } catch (error) {
      //console.error(`❌ Error al cargar ${fileName}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtener un texto específico por ID
   * @param {string} textId - ID del texto
   * @returns {Object|null} Objeto con el texto o null si no existe
   */
  getTextById(textId) {
    if (!this.currentCategoryData) {
      //console.warn('⚠️ No hay categoría cargada');
      return null;
    }
    
    const found = this.currentCategoryData.option.find(item => item.id === textId);
    
    if (!found) {
      //console.warn(`⚠️ Texto con ID "${textId}" no encontrado`);
      return null;
    }
    
    return {
      id: found.id,
      title: found.title,
      text: found.text,
      category: this.currentCategoryData.class
    };
  },
  
  /**
   * Obtener un texto aleatorio de la categoría actual
   * @returns {Object|null} Objeto con texto aleatorio
   */
  getRandomText() {
    if (!this.currentCategoryData) {
      //console.warn('⚠️ No hay categoría cargada');
      return null;
    }
    
    const options = this.currentCategoryData.option;
    
    if (options.length === 0) {
      //console.warn('⚠️ La categoría no tiene textos');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * options.length);
    const selected = options[randomIndex];
    
    //console.log(`🎲 Texto aleatorio seleccionado: ${selected.id} - "${selected.title}"`);
    
    return {
      id: selected.id,
      title: selected.title,
      text: selected.text,
      category: this.currentCategoryData.class
    };
  },
  
  /**
   * 🎲 NUEVO: Obtener un texto aleatorio de CUALQUIER categoría
   * @returns {Object|null} Objeto con texto aleatorio de cualquier categoría
   */
  getRandomTextFromAll() {
    if (Object.keys(this.allCategoriesData).length === 0) {
      //console.warn('⚠️ No hay categorías cargadas');
      return null;
    }
    
    // Obtener todas las categorías disponibles
    const categoryFiles = Object.keys(this.allCategoriesData);
    
    // Seleccionar categoría aleatoria
    const randomCategoryFile = categoryFiles[Math.floor(Math.random() * categoryFiles.length)];
    const categoryData = this.allCategoriesData[randomCategoryFile];
    
    // Seleccionar texto aleatorio de esa categoría
    const options = categoryData.option;
    const randomIndex = Math.floor(Math.random() * options.length);
    const selected = options[randomIndex];
    
    //console.log(`🎲 Texto aleatorio GLOBAL: "${selected.title}" de categoría "${categoryData.class}"`);
    
    // Actualizar currentCategoryData para reflejar la nueva categoría
    this.currentCategoryData = categoryData;
    
    return {
      id: selected.id,
      title: selected.title,
      text: selected.text,
      category: categoryData.class,
      categoryFile: randomCategoryFile
    };
  },
  
  /**
   * Obtener información de la categoría actual
   * @returns {Object|null} Info de la categoría
   */
  getCurrentCategoryInfo() {
    if (!this.currentCategoryData) {
      return null;
    }
    
    return {
      name: this.currentCategoryData.class,
      textCount: this.currentCategoryData.option.length
    };
  }
};