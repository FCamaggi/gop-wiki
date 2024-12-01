export function isValidSlug(slug) {
    if (!slug) return false;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function isValidSection(section, allowedSections) {
    if (!section || !allowedSections) return false;
    return allowedSections.includes(section);
}

export function isValidMarkdown(content) {
    if (!content) return false;

    // Verificar estructura básica
    const hasValidHeadings = /^#{1,6}\s+.+$/m.test(content);
    const hasValidContent = content.trim().length > 0;

    return hasValidHeadings && hasValidContent;
}

export function isValidPDFPath(path) {
    if (!path) return false;
    return path.endsWith('.pdf') && /^\/content\/(classes|cases|tests|others)\//.test(path);
}

export function isExternalLink(url) {
    if (!url) return false;
    return /^(https?:)?\/\//.test(url);
}