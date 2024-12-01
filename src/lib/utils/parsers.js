export function parseMarkdownMetadata(content) {
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

export function parseMarkdownHeadings(content) {
    const headings = [];
    const lines = content.split('\n');
    let inCodeBlock = false;

    lines.forEach((line) => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }

        if (!inCodeBlock) {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                headings.push({
                    level: match[1].length,
                    text: match[2].trim()
                });
            }
        }
    });

    return headings;
}

export function parseMarkdownLinks(content) {
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        links.push({
            text: match[1],
            url: match[2],
            isExternal: /^(https?:)?\/\//.test(match[2])
        });
    }

    return links;
}

export function parseAdmonitions(content) {
    const admonitions = [];
    const lines = content.split('\n');
    let currentAdmonition = null;

    lines.forEach((line) => {
        const admonitionStart = line.match(/^>\s*\$\$!(\w+)\$\$/);

        if (admonitionStart) {
            currentAdmonition = {
                type: admonitionStart[1].toLowerCase(),
                content: []
            };
            return;
        }

        if (currentAdmonition && line.startsWith('>')) {
            currentAdmonition.content.push(line.slice(1).trim());
        } else if (currentAdmonition) {
            admonitions.push(currentAdmonition);
            currentAdmonition = null;
        }
    });

    if (currentAdmonition) {
        admonitions.push(currentAdmonition);
    }

    return admonitions;
}