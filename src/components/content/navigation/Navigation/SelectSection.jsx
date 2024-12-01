import React from 'react';
import { sections } from '../../../../lib/constants';

export function SelectSection({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-2.5 text-base rounded-lg
          bg-slate-100 border-none appearance-none cursor-pointer
          focus:ring-2 focus:ring-slate-400
          text-slate-900 font-medium hover:bg-slate-200 
          transition-colors
        "
      >
        {Object.values(sections).map((section) => (
          <option key={section.id} value={section.id}>
            {section.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg
          className="h-4 w-4"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
