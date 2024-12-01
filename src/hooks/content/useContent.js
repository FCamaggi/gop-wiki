import { useCallback, useState } from 'react';
import { useContentContext } from '@/contexts/ContentContext';
import { useNavigationContext } from '@/contexts/NavigationContext';
import contentService from '@/services/content/contentService';
import markdownService from '@/services/markdown/markdownService';

export function useContent() {
    const {
        currentContent,
        activePage,
        loading,
        error,
        loadContent
    } = useContentContext();

    const { navigation } = useNavigationContext();
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    const loadPageBySlug = useCallback(async (section, slug) => {
        setLocalLoading(true);
        setLocalError(null);

        try {
            const pages = navigation[section] || [];
            const page = pages.find(p => p.slug === slug);

            if (!page) {
                throw new Error('Página no encontrada');
            }

            await loadContent(page);
        } catch (err) {
            setLocalError(err.message);
            console.error('Error loading page:', err);
        } finally {
            setLocalLoading(false);
        }
    }, [navigation, loadContent]);

    const processContent = useCallback((rawContent) => {
        if (!rawContent) return null;

        try {
            return markdownService.processMarkdown(rawContent);
        } catch (err) {
            console.error('Error processing markdown:', err);
            return null;
        }
    }, []);

    const getPageMetadata = useCallback((page) => {
        if (!page) return null;

        const section = contentService.getContentType(page.slug);
        return {
            ...page,
            section,
            path: `/${section}/${page.slug}`,
            pdfPath: page.isPdf ? contentService.getPDFPath(page) : null
        };
    }, []);

    return {
        // Estado general
        currentContent,
        activePage,
        isLoading: loading || localLoading,
        error: error || localError,

        // Métodos
        loadPageBySlug,
        processContent,
        getPageMetadata,

        // Helpers
        pageMetadata: activePage ? getPageMetadata(activePage) : null,
        processedContent: currentContent ? processContent(currentContent) : null
    };
}