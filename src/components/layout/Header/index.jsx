import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationContext } from '../../../contexts/NavigationContext';
import { useTheme } from '../../../hooks/common/useTheme';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export function Header() {
  const { getSectionLabel } = useNavigationContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-slate-900 hover:text-slate-700"
        >
          GOP Wiki
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="p-2"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
