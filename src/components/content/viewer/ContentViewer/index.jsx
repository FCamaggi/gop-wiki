// src/components/content/viewer/ContentViewer/index.jsx
import React from 'react';
import MarkdownViewer from '../MarkdownViewer';
import PDFViewer from '../PDFViewer';
import contentService from '../../../../services/content/contentService';

export const ContentViewer = ({ content, currentPage }) => {
  if (!currentPage) {
    return (
      <div className="text-center text-slate-500">
        <p>Selecciona una página para comenzar</p>
      </div>
    );
  }

  if (currentPage.isPdf) {
    const pdfPath = contentService.getPDFPath(currentPage);
    return <PDFViewer url={pdfPath} />;
  }

  return <MarkdownViewer content={content} />;
};
