import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigation } from '../../../components/content/navigation/Navigation';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import useMediaQuery from '../../../hooks/common/useMediaQuery';

export default function Sidebar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="fixed top-4 left-4 z-50"
        >
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}

      <Card
        className={`
          fixed inset-0 z-40 
          transform transition-transform duration-200
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:block
          lg:sticky lg:top-0 lg:h-screen
          bg-white border-r border-slate-200
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          <Navigation />
        </div>
      </Card>
    </>
  );
}
