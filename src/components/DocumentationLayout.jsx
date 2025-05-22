import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Menu, X, AlignLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import TableOfContents from './TableOfContents';
import MarkdownContent from './MarkdownContent';
import useNavigation from '../hooks/useNavigation';
import PDFViewer from './PDFViewer';

const DocumentationLayout = ({ defaultSection = 'clases' }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [activePage, setActivePage] = useState(null);
  const [activeHeading, setActiveHeading] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const { tableOfContents, selectedInterrogaciones, setSelectedInterrogaciones, loading: navLoading } = useNavigation();
  const [currentContent, setCurrentContent] = useState(null);

  useEffect(() => {
    setActivePage(null);
    setCurrentContent(null);
    setActiveHeading(null);
  }, [activeSection]);

  useEffect(() => {
    if (!activePage) {
      setCurrentContent(null);
      return;
    }

    const loadContent = async () => {
      try {
        if (!activePage) {
          setCurrentContent(null);
          return;
        }

        const section = activeSection;
        const filePath = `/content/${section}/${activePage.slug}${
          activePage.isPdf ? '.pdf' : '.md'
        }`;

        if (activePage.isPdf) {
          setCurrentContent(filePath);
          return;
        }

        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Error loading content');

        const text = await response.text();
        setCurrentContent(text);
      } catch (error) {
        console.error('Error loading content:', error);
        setCurrentContent(null);
      }
    };

    loadContent();
  }, [activePage, activeSection]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header móvil */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className={`p-2 transition-colors ${
            isMobileNavOpen
              ? 'text-slate-900 bg-slate-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Toggle navegación"
        >
          <AlignLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">GOP Wiki</h1>
        {!activePage?.isPdf && currentContent && (
          <button
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className={`p-2 transition-colors ${
              isMobileTocOpen
                ? 'text-slate-900 bg-slate-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Toggle índice"
          >
            <Menu size={24} />
          </button>
        )}
      </header>

      {/* Layout principal */}
      <div className="lg:grid lg:grid-cols-[280px_1fr_280px] pt-16 lg:pt-0">
        {/* Sidebar de navegación */}
        <aside
          className={`
            fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out
            ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:block
            bg-white border-r border-slate-200 
            lg:sticky lg:top-0 lg:h-screen
          `}
        >
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-8 lg:sticky lg:top-0 bg-white z-10 pb-4">
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Ir a inicio"
                >
                  <Home size={20} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    GOP Wiki
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {activeSection === 'ayudantias' &&
                      'Ayudantías y material práctico'}
                    {activeSection === 'casos' && 'Casos de estudio'}
                    {activeSection === 'clases' && 'Material de clases'}
                    {activeSection === 'documentos' && 'Documentos del curso'}
                    {activeSection === 'evaluaciones' &&
                      'Evaluaciones y soluciones'}
                    {activeSection === 'guias' && 'Guías de ejercicios'}
                    {activeSection === 'tareas' && 'Tareas del curso'}
                    {activeSection === 'otros' && 'Otros recursos'}
                    {activeSection === 'anuncios' && 'Anuncios del curso'}
                  </p>
                </div>
              </div>
            </div>

            {navLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
              </div>
            ) : (
              <Navigation
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                activePage={activePage}
                onPageChange={(page) => {
                  setActivePage(page);
                  setIsMobileNavOpen(false);
                }}
                tableOfContents={tableOfContents}
                selectedInterrogaciones={selectedInterrogaciones}
                onInterrogacionesChange={setSelectedInterrogaciones}
              />
            )}
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="w-full px-4 py-6 lg:px-8 lg:py-12 overflow-x-hidden">
          <div className="max-w-4xl mx-auto">
            {activePage?.isPdf ? (
              <PDFViewer url={currentContent} title={activePage.title} />
            ) : (
              <MarkdownContent
                content={currentContent}
                currentPage={activePage}
              />
            )}
          </div>
        </main>

        {/* Tabla de contenidos */}
        {!activePage?.isPdf && currentContent && (
          <aside
            className={`
              fixed inset-y-0 right-0 w-[280px] bg-white border-l border-slate-200
              transform transition-transform duration-300 ease-in-out z-40
              ${isMobileTocOpen ? 'translate-x-0' : 'translate-x-full'}
              lg:relative lg:translate-x-0 lg:block
            `}
          >
            <div className="h-full overflow-y-auto p-6 pt-20 lg:pt-6">
              <button
                onClick={() => setIsMobileTocOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
              <TableOfContents
                content={currentContent}
                activeHeading={activeHeading}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Overlays móviles */}
      {(isMobileNavOpen || isMobileTocOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {
            setIsMobileNavOpen(false);
            setIsMobileTocOpen(false);
          }}
        />
      )}
    </div>
  );
};

DocumentationLayout.propTypes = {
  defaultSection: PropTypes.oneOf([
    'ayudantias',
    'casos',
    'clases',
    'documentos',
    'evaluaciones',
    'guias',
    'tareas',
    'otros',
    'anuncios',
  ]),
};

export default DocumentationLayout;
