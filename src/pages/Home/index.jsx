import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { useNavigationContext } from '../../contexts/NavigationContext';

export default function HomePage() {
  const { navigation } = useNavigationContext();

  // Obtener las últimas entradas de cada sección
  const getRecentEntries = (section, limit = 5) => {
    if (!navigation[section]) return [];

    // Filtrar para mantener solo las versiones markdown (no PDF)
    const uniqueEntries = navigation[section].filter((entry) => !entry.isPdf);

    return uniqueEntries.slice(0, limit).map((entry) => ({
      ...entry,
      section,
    }));
  };

  const recentClasses = getRecentEntries('classes');
  const recentCases = getRecentEntries('cases');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        Bienvenido a GOP Wiki
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Últimas Clases */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Últimas Clases</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentClasses.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    to={`/class/${entry.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Últimos Casos */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Últimos Casos</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentCases.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    to={`/case/${entry.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
