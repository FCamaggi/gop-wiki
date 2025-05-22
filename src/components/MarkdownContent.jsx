import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import MermaidDiagram from './MermaidDiagram';
import Admonition from './Admonition';
import '../styles/markdown.css';

// Usar parámetros por defecto en la función en lugar de defaultProps
const MarkdownContent = ({ content = null, currentPage = null }) => {
  // Si hay currentPage y es PDF, mostrar el visor de PDF
  if (currentPage?.isPdf) {
    // Determinar la sección basada en el slug y título
    const section = currentPage.slug.toLowerCase().startsWith('caso')
      ? 'casos'
      : currentPage.slug.toLowerCase().startsWith('i') ||
        currentPage.slug.toLowerCase().startsWith('examen')
      ? 'evaluaciones'
      : currentPage.slug.toLowerCase().startsWith('otros')
      ? 'otros'
      : currentPage.slug.toLowerCase().startsWith('tarea')
      ? 'tareas'
      : 'clases';

    return (
      <div className="w-full h-screen">
        <iframe
          src={`/content/${section}/${currentPage.slug}.pdf`}
          className="w-full h-full"
          title={currentPage.title}
          onError={(e) => {
            console.error('Error loading PDF:', e);
          }}
        />
      </div>
    );
  }

  // Si no hay contenido, mostrar mensaje
  if (!content) {
    return (
      <div className="text-center text-slate-500">
        <p>No hay contenido disponible</p>
      </div>
    );
  }

  const components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match && match[1] === 'mermaid') {
        return <MermaidDiagram content={String(children)} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children }) => {
      // Buscar el texto del admonition en el primer hijo
      const firstChild = children[0];
      if (!firstChild) return <blockquote>{children}</blockquote>;

      // Intentar encontrar el tipo de admonition
      const text = firstChild.props?.children?.[0];
      if (typeof text !== 'string') return <blockquote>{children}</blockquote>;

      const match = text.match(/^$$!(\w+)$$/);
      if (!match) return <blockquote>{children}</blockquote>;

      const type = match[1].toLowerCase();

      // Procesar el contenido del admonition
      const content = children.map((child, index) => {
        if (index === 0) {
          // Remover el [!type] del primer elemento
          const newContent = child.props.children[0].replace(
            /^$$!\w+$$\s*/,
            ''
          );
          return React.cloneElement(child, {
            children: newContent,
          });
        }
        return child;
      });

      return <Admonition type={type}>{content}</Admonition>;
    },
    h1: ({ children }) => {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return <h3 id={id}>{children}</h3>;
    },
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownContent.propTypes = {
  content: PropTypes.string,
  currentPage: PropTypes.shape({
    isPdf: PropTypes.bool,
    slug: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default MarkdownContent;
