//src/contexts/ContentContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import contentService from '../services/content/contentService';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [currentContent, setCurrentContent] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadContent = useCallback(async (page) => {
    if (!page) return;

    setLoading(true);
    setError(null);

    try {
      if (page.isPdf) {
        const pdfPath = contentService.getPDFPath(page);
        setCurrentContent(pdfPath);
      } else {
        const section = contentService.getContentType(page.slug);
        const content = await contentService.getContent(section, page.slug);
        setCurrentContent(content);
      }
      setActivePage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentContent,
    activePage,
    loading,
    error,
    loadContent,
    setActivePage,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}
