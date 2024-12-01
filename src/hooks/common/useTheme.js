import { useState, useEffect } from 'react';
import  useLocalStorage  from './useLocalStorage';
import { colorVariables } from '../../styles/theme/colors';
import { typographyVariables } from '../../styles/theme/typography';

export function useTheme() {
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [systemTheme, setSystemTheme] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    useEffect(() => {
        // Aplicar variables CSS al root
        Object.entries({ ...colorVariables, ...typographyVariables }).forEach(
            ([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            }
        );

        // Escuchar cambios en el tema del sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return {
        theme: theme === 'system' ? systemTheme : theme,
        setTheme,
        toggleTheme,
    };
}