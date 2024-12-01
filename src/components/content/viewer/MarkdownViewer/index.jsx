import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MermaidDiagram } from '../MermaidDiagram';
import { useMarkdownComponents } from '../../../../hooks/content/useMarkdownComponents';

export default function MarkdownViewer({ content }) {
  const customComponents = useMarkdownComponents({
    renderers: {
      mermaid: (content) => <MermaidDiagram content={content} />,
    },
  });

  if (!content) return null;

  return (
    <article className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
