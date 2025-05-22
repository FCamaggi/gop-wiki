export const INTERROGACIONES = {
    TODAS: 'TODAS',
    I1: 'I1',
    I2: 'I2'
};

export const ROUTES = {
    HOME: '/',
    TEST: '/test',
    CONTENT: '/content',
    I1: '/I1',
    I2: '/I2'
};

export const FILE_TYPES = {
    PDF: 'PDF',
    MARKDOWN: 'MARKDOWN'
};

export const PDF_VIEWER_CONFIG = {
    // Configuraciones generales
    DEFAULT_SCALE: 1.0,
    MIN_SCALE: 0.5,
    MAX_SCALE: 2.0,
    SCALE_STEP: 0.1,
    
    // URLs para recursos del visor de PDF
    WORKER_URL: new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).href,
    CMAP_URL: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    STANDARD_FONTS_URL: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
    
    // Mensajes de error y carga
    MESSAGES: {
        LOADING: 'Cargando documento...',
        ERROR: 'Error al cargar el PDF',
        ERROR_DETAIL: 'Intente recargar la página o seleccione otro documento',
        NO_DATA: 'No hay datos disponibles',
        PAGE_LOADING: 'Cargando página',
        PAGE_ERROR: 'Error al cargar la página'
    },
    
    // Opciones por defecto para la carga de PDF
    DEFAULT_OPTIONS: {
        cMapPacked: true,
        disableTextLayer: true,
        disableAnnotations: true,
        isEvalSupported: false,
        enableXfa: false,
        renderInteractiveForms: false,
        stopAtErrors: false,
        withCredentials: false
    }
};