import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Download, FileText, FileCode } from 'lucide-react';
import { convertMarkdownToPDF, downloadPDF } from '../utils/pdfUtils';

const Navigation = ({
  activeSection,
  setActiveSection,
  activePage,
  onPageChange,
  tableOfContents,
}) => {
  const sections = [
    { id: 'ayudantias', label: 'Ayudantías' },
    { id: 'casos', label: 'Casos de estudio' },
    { id: 'clases', label: 'Clases' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'evaluaciones', label: 'Evaluaciones' },
    { id: 'guias', label: 'Guías' },
    { id: 'otros', label: 'Otros' },
  ];

  // Creamos un objeto con las secciones y sus contenidos
  const allSections = useMemo(() => {
    return sections.map((section) => {
      const items = tableOfContents[section.id] || [];
      const mappedItems = items.map((item) => ({
        ...item,
        section: section.id,
        key: item.id || `${section.id}-${item.slug}`,
      }));

      return {
        ...section,
        items: mappedItems,
        isOpen: section.id === activeSection, // Solo mostrar contenido de la sección activa
      };
    });
  }, [tableOfContents, activeSection]);

  const handleDownload = async (item, section) => {
    try {
      if (item.isPdf) {
        const pdfUrl = `/content/${section}/${item.slug}.pdf`;
        await downloadPDF(pdfUrl, `${item.title}.pdf`);
      } else {
        const response = await fetch(`/content/${section}/${item.slug}.md`);
        const markdown = await response.text();
        await convertMarkdownToPDF(markdown, item.title);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de secciones */}
      <div className="mb-6">
        <label
          htmlFor="section-select"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Sección
        </label>
        <select
          id="section-select"
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      {/* Navegación por documentos de la sección activa */}
      <div>
        <h3 className="font-medium text-sm text-slate-900 mb-2 px-2 pb-1 border-b border-slate-100">
          {sections.find((s) => s.id === activeSection)?.label || 'Documentos'}
        </h3>

        <div className="space-y-0.5">
          {allSections
            .find((section) => section.id === activeSection)
            ?.items.map((item) => (
              <div key={item.key} className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onPageChange(item);
                  }}
                  className={`
                    flex-1 text-left px-3 py-1.5 rounded-lg
                    transition-all duration-200 ease-in-out
                    group flex items-center gap-2
                   ${
                     activePage?.slug === item.slug
                       ? 'bg-slate-100 text-slate-900 font-medium'
                       : 'text-slate-600 hover:bg-slate-50'
                   }
                  `}
                  title={item.title}
                >
                  {item.isPdf ? (
                    <FileText
                      size={16}
                      className="text-red-500 flex-shrink-0"
                    />
                  ) : (
                    <FileCode
                      size={16}
                      className="text-blue-500 flex-shrink-0"
                    />
                  )}
                  <span className="text-sm truncate max-w-full">
                    {item.title}
                  </span>
                </button>

                <button
                  onClick={() => handleDownload(item, activeSection)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  title="Descargar PDF"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Navigation.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  activePage: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    isPdf: PropTypes.bool,
  }),
  onPageChange: PropTypes.func.isRequired,
  tableOfContents: PropTypes.object.isRequired,
};

export default Navigation;
