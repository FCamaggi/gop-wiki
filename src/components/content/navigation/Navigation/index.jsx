import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigationContext } from '../../../../contexts/NavigationContext';
import { useContentContext } from '../../../../contexts/ContentContext';
import { SelectSection } from './SelectSection';
import { Button } from '../../../common/Button';

export function Navigation() {
  const { navigation, activeSection, setActiveSection, loading } =
    useNavigationContext();

  const { activePage, loadContent } = useContentContext();

  const handlePageChange = async (page) => {
    window.scrollTo({ top: 0 });
    await loadContent(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <nav className="space-y-6">
      <SelectSection value={activeSection} onChange={setActiveSection} />

      <div className="space-y-0.5">
        {navigation[activeSection]?.map((item) => (
          <Button
            key={item.slug}
            variant="ghost"
            onClick={() => handlePageChange(item)}
            className={`
              w-full text-left px-4 py-2.5 rounded-lg
              flex items-center gap-3
              ${
                activePage?.slug === item.slug
                  ? 'bg-slate-100 text-slate-900 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            <ChevronRight
              size={16}
              className={`
                transition-transform duration-200
                ${activePage?.slug === item.slug ? 'rotate-90' : ''}
                text-slate-400 group-hover:text-slate-600
              `}
            />
            <span className="text-sm truncate">{item.title}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
