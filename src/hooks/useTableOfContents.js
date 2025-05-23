import { useState, useEffect } from 'react';

// useTableOfContents.js
const useTableOfContents = (content) => {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const extractHeadings = () => {
            if (!content) return [];

            const lines = content.split('\n');
            const headingsData = [];
            let inCodeBlock = false;
            let previousHeadings = {};

            lines.forEach((line) => {
                // Detectar bloques de código
                if (line.trim().startsWith('```')) {
                    inCodeBlock = !inCodeBlock;
                    return;
                }

                // Ignorar líneas dentro de bloques de código
                if (inCodeBlock) return;

                // Expresión regular mejorada para headings - ahora soporta hasta 7 niveles
                const match = line.trim().match(/^(#{1,7})\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2].trim();

                    // Crear un ID único basado en el texto (slug), consistente con MarkdownContent.jsx
                    const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '') + `-h${level}-${text.length}`;

                    const heading = {
                        id,
                        level,
                        text,
                        children: []
                    };

                    // Encontrar el padre apropiado siguiendo la jerarquía exacta
                    let parentLevel = level - 1;
                    while (parentLevel > 0) {
                        const parent = previousHeadings[parentLevel];
                        if (parent) {
                            parent.children.push(heading);
                            break;
                        }
                        parentLevel--;
                    }

                    // Si no encontramos padre, añadir a la raíz
                    if (parentLevel === 0) {
                        headingsData.push(heading);
                    }

                    // Actualizar el tracking de headings
                    previousHeadings[level] = heading;

                    // Limpiar niveles posteriores
                    for (let i = level + 1; i <= 7; i++) {
                        delete previousHeadings[i];
                    }
                }
            });

            // Función para ordenar recursivamente los encabezados por su aparición en el documento
            const sortHeadingsByIndex = (headings) => {
                headings.forEach(heading => {
                    if (heading.children && heading.children.length > 0) {
                        heading.children = sortHeadingsByIndex(heading.children);
                    }
                });
                return headings;
            };

            return sortHeadingsByIndex(headingsData);
        };

        const newHeadings = extractHeadings();
        setHeadings(newHeadings);
    }, [content]);

    return headings;
};

export default useTableOfContents;