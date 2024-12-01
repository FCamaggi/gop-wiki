import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationContext } from '@/contexts/NavigationContext';
import navigationService from '@/services/content/navigationService';
import useLocalStorage from '@/hooks/common/useLocalStorage';

export function useNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [recentPages, setRecentPages] = useLocalStorage('recentPages', []);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    const {
        navigation,
        activeSection,
        setActiveSection,
        loading: contextLoading,
        error: contextError
    } = useNavigationContext();

    // Inferir la sección activa basada en la URL
    useEffect(() => {
        const path = location.pathname;
        const section = path.split('/')[1];
        if (section && navigation[section]) {
            setActiveSection(section);
        }
    }, [location, navigation, setActiveSection]);

    // Navegar a una página específica
    const navigateToPage = useCallback((page) => {
        if (!page) return;

        const section = navigationService.getContentType(page.slug);
        const path = `/${section}/${page.slug}`;

        // Actualizar páginas recientes
        setRecentPages(prev => {
            const newPages = prev.filter(p => p.slug !== page.slug);
            return [page, ...newPages].slice(0, 10);
        });

        navigate(path);
    }, [navigate, setRecentPages]);

    // Obtener las páginas de una sección
    const getSectionPages = useCallback((section, options = {}) => {
        const {
            limit,
            sortBy = 'order',
            sortDirection = 'asc',
            filter
        } = options;

        let pages = navigation[section] || [];

        if (filter) {
            pages = pages.filter(filter);
        }

        pages = pages.sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            return sortDirection === 'asc'
                ? valueA - valueB
                : valueB - valueA;
        });

        if (limit) {
            pages = pages.slice(0, limit);
        }

        return pages;
    }, [navigation]);

    // Buscar páginas en todas las secciones
    const searchPages = useCallback((query) => {
        if (!query) return [];

        const searchTerm = query.toLowerCase();
        const results = [];

        Object.entries(navigation).forEach(([section, pages]) => {
            pages.forEach(page => {
                if (
                    page.title.toLowerCase().includes(searchTerm) ||
                    page.slug.toLowerCase().includes(searchTerm)
                ) {
                    results.push({
                        ...page,
                        section
                    });
                }
            });
        });

        return results;
    }, [navigation]);

    return {
        // Estado
        navigation,
        activeSection,
        recentPages,
        isLoading: contextLoading || localLoading,
        error: contextError || localError,

        // Métodos de navegación
        navigateToPage,
        getSectionPages,
        searchPages,

        // Helpers
        getCurrentSection: () => navigationService.getSectionFromPath(location.pathname),
        getSectionLabel: navigationService.getSectionLabel
    };
}