import html2pdf from 'html2pdf.js';
import { marked } from 'marked';

const generateHTML = (markdown, title) => {
    const content = marked(markdown);
    return `
    <div class="markdown-pdf">
      <h1>${title}</h1>
      ${content}
    </div>
  `;
};

const pdfStyles = `
  <style>
    .markdown-pdf {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .markdown-pdf h1 {
      font-size: 2.5rem;
      color: #1a1a1a;
      margin-bottom: 2rem;
      border-bottom: 2px solid #eaeaea;
      padding-bottom: 0.5rem;
    }
    
    .markdown-pdf h2 {
      font-size: 1.8rem;
      color: #2c2c2c;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    
    .markdown-pdf h3 {
      font-size: 1.5rem;
      color: #3c3c3c;
      margin-top: 1.5rem;
    }
    
    .markdown-pdf p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .markdown-pdf ul, .markdown-pdf ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    
    .markdown-pdf li {
      margin-bottom: 0.5rem;
    }
    
    .markdown-pdf code {
      background-color: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
    }
    
    .markdown-pdf pre {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
    
    .markdown-pdf blockquote {
      border-left: 4px solid #e0e0e0;
      margin: 1rem 0;
      padding-left: 1rem;
      color: #666;
    }
    
    .markdown-pdf img {
      max-width: 100%;
      height: auto;
    }
    
    .markdown-pdf table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    
    .markdown-pdf th, .markdown-pdf td {
      border: 1px solid #e0e0e0;
      padding: 0.5rem;
      text-align: left;
    }
    
    .markdown-pdf th {
      background-color: #f5f5f5;
    }
  </style>
`;

export const convertMarkdownToPDF = async (markdown, title) => {
    try {
        const htmlContent = generateHTML(markdown, title);
        const container = document.createElement('div');
        container.innerHTML = pdfStyles + htmlContent;
        document.body.appendChild(container);

        const options = {
            margin: 10,
            filename: `${title}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        await html2pdf()
            .from(container)
            .set(options)
            .save();

        document.body.removeChild(container);
    } catch (error) {
        console.error('Error converting Markdown to PDF:', error);
        throw error;
    }
};

export const downloadPDF = async (url, filename) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
};

/**
 * Procesa una ruta de archivo PDF para asegurar el formato correcto
 * @param {string} path - Ruta original del archivo PDF
 * @returns {string} Ruta procesada para usar con el visor de PDF
 */
export const processPdfPath = (path) => {
  if (!path) return '';
  
  // Remover cualquier /content/ inicial para evitar duplicación
  const cleanPath = path.replace(/^\/?(content\/)+/, '');
  // Asegurar que la ruta comience con /content/
  return `/content/${cleanPath}`;
};

/**
 * Limpia los recursos del PDF para evitar fugas de memoria
 * @param {Object} documentRef - Referencia al componente Document de react-pdf
 * @param {Object} abortController - AbortController para cancelar solicitudes fetch
 */
export const cleanupPdfResources = (documentRef, abortController) => {
  // Cancelar tareas de renderizado
  if (documentRef?.current?.cancelRenderTasks) {
    try {
      documentRef.current.cancelRenderTasks();
    } catch (err) {
      console.log('Error al cancelar tareas de PDF:', err);
    }
  }
  
  // Cancelar solicitudes fetch pendientes
  if (abortController?.abort) {
    try {
      abortController.abort();
    } catch (err) {
      console.log('Error al cancelar solicitud:', err);
    }
  }
};

/**
 * Verifica si un error es por cancelación (normal durante navegación rápida)
 * @param {Error} error - El error a verificar
 * @returns {boolean} true si es un error por cancelación
 */
export const isCancellationError = (error) => {
  if (!error) return false;
  
  return (
    error.name === 'AbortError' || 
    error.message?.includes('aborted') ||
    error.message?.includes('terminated') ||
    error.message?.includes('destroyed') ||
    error.message?.includes('Worker was terminated')
  );
};

/**
 * Crea un nuevo AbortController para controlar solicitudes fetch
 * @returns {AbortController} Una nueva instancia de AbortController
 */
export const createPdfAbortController = () => {
  return typeof AbortController !== 'undefined' ? new AbortController() : null;
};

export { generateHTML, pdfStyles };