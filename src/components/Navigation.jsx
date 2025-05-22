import { useMemo } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import { convertMarkdownToPDF, downloadPDF } from '../utils/pdfUtils';
import InterrogacionesSelector from './InterrogacionesSelector';

const Navigation = ({
  activeSection,
  setActiveSection,
  activePage,
  onPageChange,
  tableOfContents,
  selectedInterrogaciones,
  onInterrogacionesChange,
}) => {
  const sections = [
    { id: 'ayudantias', label: 'Ayudantías' },
    { id: 'casos', label: 'Casos de estudio' },
    { id: 'clases', label: 'Clases' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'evaluaciones', label: 'Evaluaciones' },
    { id: 'guias', label: 'Guías' },
    { id: 'tareas', label: 'Tareas' },
    { id: 'otros', label: 'Otros' },
  ];

  const currentSectionItems = useMemo(() => {
    const items = tableOfContents[activeSection] || [];
    return items.map((item) => ({
      ...item,
      key: item.id || `${activeSection}-${item.slug}`,
    }));
  }, [activeSection, tableOfContents]);

  const handleDownload = async (item) => {
    try {
      if (item.isPdf) {
        const pdfUrl = `/content/${activeSection}/${item.slug}.pdf`;
        await downloadPDF(pdfUrl, `${item.title}.pdf`);
      } else {
        const response = await fetch(
          `/content/${activeSection}/${item.slug}.md`
        );
        const markdown = await response.text();
        await convertMarkdownToPDF(markdown, item.title);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de interrogaciones */}
      {selectedInterrogaciones && onInterrogacionesChange && (
        <InterrogacionesSelector
          selectedInterrogaciones={selectedInterrogaciones}
          onSelectionChange={onInterrogacionesChange}
        />
      )}

      {/* Selector de sección */}
      <div className="relative">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full px-4 py-2.5 text-base rounded-lg bg-slate-100 border-none
                     appearance-none cursor-pointer focus:ring-2 focus:ring-slate-400
                     text-slate-900 font-medium hover:bg-slate-200 transition-colors"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg
            className="h-4 w-4"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Lista de páginas */}
      <div className="space-y-0.5">
        {currentSectionItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(item)}
              className={`
                flex-1 text-left px-4 py-2.5 rounded-lg
                transition-all duration-200 ease-in-out
                group flex items-center gap-3
               ${
                 activePage?.slug === item.slug
                   ? 'bg-slate-100 text-slate-900 font-medium'
                   : 'text-slate-600 hover:bg-slate-50'
               }
              `}
            >
              <ChevronRight
                size={16}
                className={`
                  transition-transform duration-200
                 ${activePage?.slug === item.slug ? 'rotate-90' : ''}
                  text-slate-400 group-hover:text-slate-600
                `}
              />
              <span className="text-sm">{item.title}</span>
            </button>

            <button
              onClick={() => handleDownload(item)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Descargar PDF"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
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
  }),
  onPageChange: PropTypes.func.isRequired,
  tableOfContents: PropTypes.object.isRequired,
  selectedInterrogaciones: PropTypes.array,
  onInterrogacionesChange: PropTypes.func,
};

export default Navigation;
