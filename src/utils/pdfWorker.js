import { pdfjs } from 'react-pdf';

let workerInstance = null;

export const initPdfWorker = () => {
    if (workerInstance) {
        try {
            workerInstance.terminate();
        } catch (err) {
            console.log('Error al terminar worker existente:', err);
        }
    }

    try {
        // Intentar primero con el worker local
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
        
        // Si el worker local no está disponible, crear uno nuevo
        if (!pdfjs.GlobalWorkerOptions.workerPort) {
            workerInstance = new Worker(
                new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url),
                { type: 'module' }
            );
            pdfjs.GlobalWorkerOptions.workerPort = workerInstance;
        }
        
        // Verificar que el worker está funcionando
        if (!pdfjs.GlobalWorkerOptions.workerPort && !pdfjs.GlobalWorkerOptions.workerSrc) {
            throw new Error('No se pudo inicializar el worker de PDF');
        }
    } catch (err) {
        console.error('Error al inicializar worker:', err);
        // En caso de error, intentar una última vez con la CDN como fallback
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';
    }
};

export const destroyPdfWorker = () => {
    if (workerInstance) {
        try {
            workerInstance.terminate();
            workerInstance = null;
        } catch (err) {
            console.log('Error al destruir worker:', err);
        }
    }
};

// Inicializar el worker cuando se importa este módulo
initPdfWorker();

// Función para reiniciar el worker si es necesario
export const resetPdfWorker = () => {
    destroyPdfWorker();
    initPdfWorker();
};
