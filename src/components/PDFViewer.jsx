import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PropTypes from 'prop-types';

// Configuración del worker desde CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ path }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Simplificar el manejo de rutas
  const getFileUrl = () => {
    // Remover cualquier /content/ inicial para evitar duplicación
    const cleanPath = path.replace(/^\/?(content\/)+/, '');
    // Asegurar que la ruta comience con /content/
    return `/content/${cleanPath}`;
  };

  console.log('PDF path:', { original: path, processed: getFileUrl() });

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Document
        file={getFileUrl()}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Cargando PDF...</div>}
        error={<div>Error al cargar el PDF. Por favor intente nuevamente.</div>}
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          className="page border shadow-lg"
        />
      </Document>

      {numPages && (
        <div className="flex flex-col items-center gap-4 my-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {pageNumber} de {numPages}
            </span>

            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber >= numPages}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Siguiente
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>

            <span className="text-sm">Zoom: {Math.round(scale * 100)}%</span>

            <button
              onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

PDFViewer.propTypes = {
  path: PropTypes.string.isRequired,
};

export default PDFViewer;
