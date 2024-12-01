export const colors = {
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },
    slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },
    // Colores para los admonitions
    admonition: {
        note: {
            bg: 'var(--color-primary-50)',
            border: 'var(--color-primary-500)',
            text: 'var(--color-primary-900)',
        },
        warning: {
            bg: '#fff7ed',
            border: '#f97316',
            text: '#7c2d12',
        },
        tip: {
            bg: '#f0fdf4',
            border: '#22c55e',
            text: '#14532d',
        },
        example: {
            bg: '#faf5ff',
            border: '#a855f7',
            text: '#581c87',
        },
    },
};

// Convertir colores a variables CSS
export const colorVariables = Object.entries(colors).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([shade, color]) => {
            acc[`--color-${key}-${shade}`] = color;
        });
    }
    return acc;
}, {});