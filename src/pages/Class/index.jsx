import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContentContext } from '../../contexts/ContentContext';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { ContentViewer } from '../../components/content/viewer/ContentViewer';
import { TableOfContents } from '../../components/content/navigation/TableOfContents';

export default function ClassPage() {
  const { slug } = useParams();
  const { navigation } = useNavigationContext();
  const { activePage, loadContent } = useContentContext();

  useEffect(() => {
    const currentClass = navigation.classes?.find((item) => item.slug === slug);

    if (currentClass && currentClass !== activePage) {
      loadContent(currentClass);
    }
  }, [slug, navigation, activePage, loadContent]);

  if (!activePage) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:grid lg:grid-cols-[1fr_280px] gap-8">
      <div className="prose max-w-none">
        <ContentViewer />
      </div>
      <div className="hidden lg:block">
        <TableOfContents />
      </div>
    </div>
  );
}
