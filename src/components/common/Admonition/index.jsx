import React from 'react';
import { Info, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

const iconMap = {
  note: Info,
  warning: AlertTriangle,
  tip: CheckCircle2,
  example: BookOpen,
};

const styleMap = {
  note: {
    container: 'bg-blue-50 border-blue-500',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    content: 'text-blue-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-500',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    content: 'text-yellow-700',
  },
  tip: {
    container: 'bg-green-50 border-green-500',
    icon: 'text-green-500',
    title: 'text-green-800',
    content: 'text-green-700',
  },
  example: {
    container: 'bg-purple-50 border-purple-500',
    icon: 'text-purple-500',
    title: 'text-purple-800',
    content: 'text-purple-700',
  },
};

export default function Admonition({ children, type = 'note', title }) {
  const Icon = iconMap[type] || Info;
  const styles = styleMap[type] || styleMap.note;

  return (
    <div className={`rounded-lg p-4 my-6 border-l-4 ${styles.container}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={styles.icon}>
          <Icon className="w-5 h-5" />
        </span>
        <h5 className={`font-semibold text-sm uppercase ${styles.title}`}>
          {title || type}
        </h5>
      </div>
      <div className={`prose prose-sm max-w-none ${styles.content}`}>
        {children}
      </div>
    </div>
  );
}
