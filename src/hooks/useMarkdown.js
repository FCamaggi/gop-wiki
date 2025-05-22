import { useState, useEffect } from 'react';

const useMarkdown = (path) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                // Simplificar el manejo de rutas
                const cleanPath = path.replace(/^\/?(content\/)+/, '');
                const url = `/content/${cleanPath}`;

                console.log('Markdown path:', { original: path, processed: url });

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error al cargar el markdown: ${response.status}`);
                }

                const text = await response.text();
                setContent(text);
            } catch (err) {
                console.error('Error al cargar markdown:', err);
                setError(err.message);
            }
        };

        if (path) {
            fetchMarkdown();
        }
    }, [path]);

    return { content, error };
};

export default useMarkdown;