import React, { useEffect, useState } from 'react';
import { useHeadings } from '../../../../hooks/content/useHeadings';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';

export function TableOfContents({ content }) {
  const headings = useHeadings(content);
  const [activeId, setActiveId] = useState();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 100;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-medium text-sm text-slate-900">En esta página</h4>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <Button
            key={heading.id}
            variant="ghost"
            onClick={() => scrollToHeading(heading.id)}
            className={`
              w-full text-left py-1 px-3 text-sm
              ${
                activeId === heading.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }
              ${heading.level > 1 ? 'ml-' + (heading.level - 1) * 3 : ''}
            `}
          >
            {heading.text}
          </Button>
        ))}
      </nav>
    </Card>
  );
}
