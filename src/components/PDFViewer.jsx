import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { PDF_VIEWER_CONFIG } from '../config/constants';
import { 
  processPdfPath, 
  cleanupPdfResourcesUtil, 
  isCancellationError, 
  createPdfAbortController 
} from '../utils/pdfUtils';
import { resetPdfWorker } from '../utils/pdfWorker';
import { Document, Page, pdfjs } from 'react-pdf';
import PropTypes from 'prop-types';
import { PDF_VIEWER_CONFIG } from '../config/constants';
import { 
  processPdfPath, 
  cleanupPdfResourcesUtil, 
  isCancellationError, 
  createPdfAbortController 
} from '../utils/pdfUtils';

// Inicialización del worker de PDF.js
const initPdfWorker = () => {
  if (pdfjs.GlobalWorkerOptions.workerPort) {
    try {
      // Si hay un worker existente, terminarlo
      pdfjs.GlobalWorkerOptions.workerPort.terminate();
      pdfjs.GlobalWorkerOptions.workerPort = null;
    } catch (err) {
      console.log('Error al terminar worker existente:', err);
    }
  }
  
  // Configurar nuevo worker
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_VIEWER_CONFIG.WORKER_URL;
};tate, useMemo, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PropTypes from 'prop-types';
import { PDF_VIEWER_CONFIG } from '../config/constants';
import { 
  processPdfPath, 
  cleanupPdfResources as cleanupPdfResourcesUtil, 
  isCancellationError, 
  createPdfAbortController 
} from '../utils/pdfUtils';

// Usar el worker local en lugar del CDN para evitar problemas de CORS
pdfjs.GlobalWorkerOptions.workerSrc = PDF_VIEWER_CONFIG.WORKER_URL;

const PDFViewer = ({ path, title }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(PDF_VIEWER_CONFIG.DEFAULT_SCALE);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const documentRef = useRef(null);
  const lastPathRef = useRef(path);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  
  // Función para limpiar recursos del PDF usando la utilidad
  const cleanupPdfResources = useCallback(() => {
    // Llamar a la función de utilidad para limpiar los recursos
    cleanupPdfResourcesUtil(documentRef, abortControllerRef.current);
    
    // Descargar el worker si es necesario para liberar memoria
    if (typeof pdfjs.workerSrc !== 'undefined' && pdfjs._worker) {
      try {
        pdfjs.getDocument({}).destroy();
      } catch (err) {
        console.log('Error al destruir documentos:', err);
      }
    }
    
    // Resetear la referencia del controlador
    abortControllerRef.current = null;
  }, []);
  
  // Cuando el path cambia, limpiamos el estado anterior
  useEffect(() => {
    if (lastPathRef.current !== path) {
      // Limpiar el estado anterior
      setNumPages(null);
      setLoadError(null);
      setIsLoading(true);
      
      // Limpiar recursos del PDF anterior y reiniciar el worker
      cleanupPdfResources();
      resetPdfWorker();
      
      // Crear un nuevo AbortController para la nueva solicitud
      abortControllerRef.current = createPdfAbortController();
      
      // Actualizar el path de referencia
      lastPathRef.current = path;
      
      // Pequeño retraso para asegurar que el worker esté listo
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(true);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [path, cleanupPdfResources]);
  
  // Efecto para limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      // Marcar el componente como desmontado
      isMountedRef.current = false;
      // Limpiar recursos al desmontar
      cleanupPdfResources();
    };
  }, [cleanupPdfResources]);
  
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    // Solo actualizar el estado si el componente sigue montado
    if (isMountedRef.current) {
      setIsLoading(false);
      setLoadError(null);
      setNumPages(numPages);
    }
  }, []);
  
  const onDocumentLoadError = useCallback((error) => {
    // Verificar si es un error de cancelación usando la utilidad
    const isCancel = isCancellationError(error);
      
    if (!isCancel) {
      console.error("Error loading PDF:", error);
    }
    
    // Solo actualizar el estado si el componente sigue montado
    if (isMountedRef.current) {
      setIsLoading(false);
      
      // No mostrar errores de cancelación al usuario
      if (!isCancel) {
        setLoadError(error);
      }
    }
  }, []);

  // Simplificar el manejo de rutas usando la utilidad
  const getFileUrl = useMemo(() => {
    if (!path) {
      console.error('Path is undefined in PDFViewer');
      return '';
    }
    
    return processPdfPath(path);
  }, [path]);
  
  // Opciones memorizadas para evitar recargas innecesarias
  const pdfOptions = useMemo(() => ({
    ...PDF_VIEWER_CONFIG.DEFAULT_OPTIONS,
    cMapUrl: PDF_VIEWER_CONFIG.CMAP_URL,
    standardFontDataUrl: PDF_VIEWER_CONFIG.STANDARD_FONTS_URL,
  }), []);

  // Si no hay ruta, mostrar un mensaje en lugar de intentar cargar el documento
  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
        <p className="text-slate-500 text-lg">No se ha seleccionado ningún documento PDF.</p>
      </div>
    );
  }

  // Si hay un error al cargar el PDF
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
        <p className="text-red-500 text-lg">Error al cargar el PDF. Por favor intente nuevamente.</p>
        <p className="text-sm text-slate-500 mt-2">{loadError.message || 'Error desconocido'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      {title && (
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{title}</h1>
      )}
      
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setScale((prev) => Math.max(prev - PDF_VIEWER_CONFIG.SCALE_STEP, PDF_VIEWER_CONFIG.MIN_SCALE))}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          title="Reducir zoom"
          disabled={isLoading}
        >
          -
        </button>
        
        <span className="text-sm text-slate-600 px-2 py-1">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={() => setScale((prev) => Math.min(prev + PDF_VIEWER_CONFIG.SCALE_STEP, PDF_VIEWER_CONFIG.MAX_SCALE))}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          title="Aumentar zoom"
          disabled={isLoading}
        >
          +
        </button>
      </div>
      
      <div className="pdf-container w-full overflow-y-auto border shadow-lg rounded-lg">
        <Document
          ref={documentRef}
          file={getFileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onLoadStart={() => {
            if (isMountedRef.current) {
              setIsLoading(true);
              setLoadError(null);
            }
          }}
          onSourceSuccess={() => {
            // Se ejecuta cuando el documento se ha cargado correctamente desde el servidor
            // pero antes de procesarlo completamente
            if (isMountedRef.current) {
              setLoadError(null);
            }
          }}
          loading={
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-2"></div>
              <p className="text-slate-600 text-sm">{PDF_VIEWER_CONFIG.MESSAGES.LOADING}</p>
            </div>
          }
          error={
            <div className="p-8 flex flex-col items-center justify-center">
              <p className="text-red-600 mb-2">{PDF_VIEWER_CONFIG.MESSAGES.ERROR}</p>
              <p className="text-sm text-slate-600">{PDF_VIEWER_CONFIG.MESSAGES.ERROR_DETAIL}</p>
            </div>
          }
          options={pdfOptions}
          externalLinkTarget="_blank"
          noData={<div className="p-4 text-slate-600">{PDF_VIEWER_CONFIG.MESSAGES.NO_DATA}</div>}
        >
          {!isLoading && numPages > 0 && Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              className="mb-4"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              error={<div className="p-2 text-red-500 text-sm">{`${PDF_VIEWER_CONFIG.MESSAGES.PAGE_ERROR} ${index + 1}`}</div>}
              loading={<div className="p-2 flex justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div></div>}
              onRenderSuccess={() => {
                // Controlamos las renderizaciones exitosas para posibles optimizaciones
              }}
              onRenderError={(err) => {
                if (!isCancellationError(err)) {
                  console.log(`Error al renderizar página ${index + 1}:`, err);
                }
              }}
              canvasRef={(canvas) => {
                // Acceso al canvas para mejorar accesibilidad
                if (canvas) {
                  canvas.setAttribute('role', 'img');
                  canvas.setAttribute('aria-label', `Página ${index + 1} del documento "${title || 'PDF'}"`);
                }
              }}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

PDFViewer.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string,
};

// Estilos específicos para el contenedor del PDF
const styles = `
  .pdf-container {
    max-height: calc(100vh - 250px);
    background-color: #f8f9fa;
  }
  
  .pdf-container .react-pdf__Page {
    margin: 0 auto;
    padding: 8px;
  }
  
  .pdf-container .react-pdf__Page canvas {
    display: block;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
  }
  
  /* Ocultar los elementos de texto que podrían causar el espacio extra */
  .pdf-container .textLayer {
    display: none;
  }
  
  .pdf-container .annotationLayer {
    display: none;
  }
`;

// Añadir estilos al DOM solo una vez
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('pdf-viewer-styles');
  if (!styleElement) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'pdf-viewer-styles';
    styleSheet.type = 'text/css';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

export default PDFViewer;
