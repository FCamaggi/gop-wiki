import React from 'react';
import { Hash } from 'lucide-react';
import useTableOfContents from '../hooks/useTableOfContents';

const TableOfContents = ({ content, activeHeading }) => {
  const headings = useTableOfContents(content);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Obtener la posición del elemento relativa al viewport
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;

      // Scroll suave a la posición del elemento con un pequeño offset
      window.scrollTo({
        top: absoluteTop - 100, // 100px de offset para mejor visibilidad
        behavior: 'smooth',
      });
    }
  };

  // Función para determinar el estilo según el nivel del encabezado
  const getHeadingStyle = (level) => {
    // Configuraciones por nivel
    const configurations = {
      1: { fontSize: '14px', fontWeight: 600, opacity: 1.0, indent: 0, isUppercase: true },
      2: { fontSize: '13px', fontWeight: 500, opacity: 0.95, indent: 0.5, isUppercase: false },
      3: { fontSize: '13px', fontWeight: 500, opacity: 0.9, indent: 1.0, isUppercase: false },
      4: { fontSize: '12px', fontWeight: 400, opacity: 0.85, indent: 1.5, isUppercase: false },
      5: { fontSize: '12px', fontWeight: 400, opacity: 0.8, indent: 2.0, isUppercase: false },
      6: { fontSize: '11px', fontWeight: 400, opacity: 0.75, indent: 2.5, isUppercase: false },
      7: { fontSize: '11px', fontWeight: 300, opacity: 0.7, indent: 3.0, isUppercase: false }
    };
    
    // Obtener configuración para este nivel o usar la del nivel máximo definido
    const config = configurations[level] || configurations[7];
    
    return {
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      opacity: config.opacity,
      paddingLeft: `${config.indent}rem`,
      textTransform: config.isUppercase ? 'uppercase' : 'none',
      letterSpacing: config.isUppercase ? '0.05em' : 'normal'
    };
  };

  // Determinar el nivel visual de un encabezado en el ToC
  const getVisualLevel = (heading, depth) => {
    // Para niveles principales (H1, H2) no mostramos el icono
    if (heading.level <= 2) {
      return false;
    }
    
    // Para subencabezados anidados o profundos, mostramos icono
    return depth > 0 || heading.level > 2;
  };

  const renderHeading = (heading, depth = 0) => (
    <div key={heading.id}>
      <button
        onClick={(e) => {
          e.preventDefault();
          scrollToHeading(heading.id);
        }}
        className={`
          w-full text-left 
          flex items-center gap-2 
          py-1 px-2
          rounded-md
          transition-colors
          my-0.5
         ${
           activeHeading === heading.id
             ? 'bg-slate-100 text-slate-900 font-medium'
             : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
         }
        `}
        style={getHeadingStyle(heading.level)}
      >
        {getVisualLevel(heading, depth) && (
          <Hash 
            size={heading.level <= 3 ? 14 : 12} 
            className="opacity-50 flex-shrink-0" 
            strokeWidth={heading.level <= 3 ? 2 : 1.5}
          />
        )}
        <span className="truncate">{heading.text}</span>
      </button>

      {heading.children.length > 0 && (
        <div className={`ml-1 ${heading.level < 3 ? 'mt-1 mb-2' : 'my-0.5'}`}>
          {heading.children.map((child) => renderHeading(child, depth + 1))}
        </div>
      )}
    </div>
  );

  if (!headings.length) return null;

  return (
    <div className="py-3 sticky top-0 h-full flex flex-col max-h-screen">
      <h4 className="font-medium text-sm text-slate-900 mb-3 px-3 sticky top-0 bg-white pb-2 border-b border-slate-100 flex-shrink-0 z-10">
        En esta página
      </h4>
      <div 
        className="flex-grow overflow-y-auto pr-1 pb-16 
          scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent 
          hover:scrollbar-thumb-slate-300
          custom-scrollbar" // Clase personalizada para compatibilidad cross-browser
      >
        <nav className="space-y-0.5">
          {headings.map((heading) => renderHeading(heading))}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
