import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-600">
          <p className="flex items-center gap-1">
            Creado con
            <Heart size={16} className="text-red-500 fill-current" />
            por Fabrizio Camaggi
          </p>
          <p>GOP PUC - {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
