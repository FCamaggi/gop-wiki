class MarkdownService {
    processMarkdown(content) {
        if (!content) return null;

        return {
            content: this.sanitizeContent(content),
            metadata: this.extractMetadata(content),
            headings: this.extractHeadings(content)
        };
    }

    sanitizeContent(content) {
        // Eliminar caracteres invisibles al inicio y final
        content = content.trim();

        // Asegurar saltos de línea consistentes
        content = content.replace(/\r\n/g, '\n');

        // Eliminar múltiples líneas vacías consecutivas
        content = content.replace(/\n{3,}/g, '\n\n');

        return content;
    }

    extractMetadata(content) {
        const metadata = {};
        const lines = content.split('\n');
        let inMetadata = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line === '---') {
                if (!inMetadata) {
                    inMetadata = true;
                    continue;
                } else {
                    break;
                }
            }

            if (inMetadata && line) {
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                if (key && value) {
                    metadata[key.trim()] = value;
                }
            }
        }

        return metadata;
    }

    extractHeadings(content) {
        const headings = [];
        const lines = content.split('\n');
        let inCodeBlock = false;

        lines.forEach((line) => {
            // Manejar bloques de código
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                return;
            }

            if (inCodeBlock) return;

            // Extraer headings
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                headings.push({
                    level: match[1].length,
                    text: match[2].trim(),
                    id: this.generateHeadingId(match[2])
                });
            }
        });

        return headings;
    }

    generateHeadingId(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    extractCodeBlocks(content) {
        const codeBlocks = [];
        const lines = content.split('\n');
        let currentBlock = null;

        lines.forEach((line) => {
            const codeBlockStart = line.match(/^```(\w+)?/);

            if (codeBlockStart) {
                if (currentBlock) {
                    codeBlocks.push(currentBlock);
                    currentBlock = null;
                } else {
                    currentBlock = {
                        language: codeBlockStart[1] || 'text',
                        content: []
                    };
                }
                return;
            }

            if (currentBlock) {
                currentBlock.content.push(line);
            }
        });

        return codeBlocks;
    }
}

export default new MarkdownService();