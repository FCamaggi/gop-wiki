import { contentTypes } from '../../lib/constants';

class ContentService {
    async getContentFiles() {
        try {
            const response = await fetch('/content/content-map.json');
            if (!response.ok) throw new Error('Failed to fetch content map');
            return await response.json();
        } catch (error) {
            console.error('Error fetching content map:', error);
            return {
                classes: [],
                cases: [],
                tests: [],
                others: []
            };
        }
    }

    async getContent(section, slug) {
        if (!slug) return null;

        try {
            const response = await fetch(`/content/${section}/${slug}.md`);
            if (!response.ok) throw new Error('Failed to fetch content');
            return await response.text();
        } catch (error) {
            console.error('Error fetching content:', error);
            return null;
        }
    }

    getContentType(slug) {
        if (!slug) return null;
        return Object.entries(contentTypes.patterns).find(
            ([_, pattern]) => pattern.test(slug)
        )?.[0] || contentTypes.default;
    }

    getPDFPath(page) {
        if (!page || !page.isPdf) return null;
        const section = this.getContentType(page.slug);
        return `/content/${section}/${page.slug.replace('-md', '')}.pdf`;
    }
}

export default new ContentService();