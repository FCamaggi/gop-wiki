export const typography = {
    fonts: {
        sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
    },
    weights: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeights: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },
};

// Convertir tipografía a variables CSS
export const typographyVariables = {
    ...Object.entries(typography.sizes).reduce((acc, [key, value]) => {
        acc[`--font-size-${key}`] = value;
        return acc;
    }, {}),
    ...Object.entries(typography.weights).reduce((acc, [key, value]) => {
        acc[`--font-weight-${key}`] = value;
        return acc;
    }, {}),
    ...Object.entries(typography.lineHeights).reduce((acc, [key, value]) => {
        acc[`--line-height-${key}`] = value;
        return acc;
    }, {}),
    '--font-sans': typography.fonts.sans,
    '--font-mono': typography.fonts.mono,
};