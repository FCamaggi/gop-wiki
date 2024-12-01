// useMarkdownComponents.jsx
import React from 'react';
import { generateHeadingId } from '../../lib/utils/formatters';

export function useMarkdownComponents({ renderers }) {
  return {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');

      if (match && match[1] === 'mermaid') {
        return renderers.mermaid(String(children));
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    blockquote: ({ children }) => {
      const firstChild = children[0]?.props?.children?.[0];

      if (typeof firstChild === 'string') {
        const match = firstChild.match(/^$$!(\w+)$$/);
        if (match) {
          const type = match[1].toLowerCase();
          const content = children.map((child, index) => {
            if (index === 0) {
              return React.cloneElement(child, {
                children: child.props.children[0].replace(/^$$!\w+$$\s*/, ''),
              });
            }
            return child;
          });

          return renderers.admonition(type, content);
        }
      }

      return <blockquote>{children}</blockquote>;
    },

    h1: ({ children }) => <h1 id={generateHeadingId(children)}>{children}</h1>,

    h2: ({ children }) => <h2 id={generateHeadingId(children)}>{children}</h2>,

    h3: ({ children }) => <h3 id={generateHeadingId(children)}>{children}</h3>,
  };
}
