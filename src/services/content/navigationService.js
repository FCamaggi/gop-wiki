import contentService from './contentService';
import { sections } from '../../lib/constants';

class NavigationService {
    async getNavigation() {
        const contentMap = await contentService.getContentFiles();
        return Object.entries(contentMap).reduce((acc, [section, items]) => {
            acc[section] = this.processItems(items, section);
            return acc;
        }, {});
    }

    processItems(items, section) {
        return items
            .map(item => ({
                ...item,
                section,
                title: this.formatTitle(item.slug, item.title),
                path: this.generatePath(section, item.slug)
            }))
            .sort((a, b) => a.order - b.order);
    }

    formatTitle(slug, title) {
        if (title) return title;
        return slug
            .replace(/-/g, ' ')
            .replace(/^(clase|caso|otros)\s*/i, '')
            .trim();
    }

    generatePath(section, slug) {
        return `/${section}/${slug}`;
    }

    getSectionLabel(section) {
        return sections[section]?.label || section;
    }
}

export default new NavigationService();