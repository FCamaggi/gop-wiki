import { useState, useEffect } from 'react';

export function useHeadings(content) {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        if (!content) {
            setHeadings([]);
            return;
        }

        const lines = content.split('\n');
        const headingsData = [];
        let inCodeBlock = false;

        lines.forEach((line) => {
            // Detectar bloques de código
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                return;
            }

            // Ignorar líneas dentro de bloques de código
            if (inCodeBlock) return;

            const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();

                headingsData.push({
                    id: text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                    level,
                    text
                });
            }
        });

        setHeadings(headingsData);
    }, [content]);

    return headings;
}