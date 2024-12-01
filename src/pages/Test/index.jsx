import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContentContext } from '../../contexts/ContentContext';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { ContentViewer } from '../../components/content/viewer/ContentViewer';
import { Card } from '../../components/common/Card';

export default function TestPage() {
  const { slug } = useParams();
  const { navigation } = useNavigationContext();
  const { activePage, loadContent } = useContentContext();

  useEffect(() => {
    const currentTest = navigation.tests?.find((item) => item.slug === slug);

    if (currentTest && currentTest !== activePage) {
      loadContent(currentTest);
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="prose max-w-none p-8">
          <ContentViewer />
        </div>
      </Card>
    </div>
  );
}
