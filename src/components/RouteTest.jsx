import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RouteTest = () => {
  const [routes, setRoutes] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    const testRoutes = async () => {
      // Obtener lista de rutas del content-map
      const response = await fetch('/content/content-map.json');
      const contentMap = await response.json();

      const allRoutes = [];

      // Construir lista de rutas a probar
      Object.entries(contentMap).forEach(([category, files]) => {
        files.forEach((file) => {
          const path = file.path || `${category}/${file.originalName}`;
          allRoutes.push({
            title: file.title || file.originalName,
            path,
            category,
            type: file.isPdf ? 'PDF' : 'Markdown',
          });
        });
      });

      setRoutes(allRoutes);

      // Probar cada ruta
      const testResults = {};
      for (const route of allRoutes) {
        try {
          const response = await fetch(`/content/${route.path}`);
          testResults[route.path] = response.ok;
        } catch {
          testResults[route.path] = false;
        }
      }

      setResults(testResults);
    };

    testRoutes();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba de Rutas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <div
            key={route.path}
            className={`p-4 rounded-lg border ${
              results[route.path]
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            <h3 className="font-bold mb-2">{route.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Categoría: {route.category}
            </p>
            <p className="text-sm text-gray-600 mb-2">Tipo: {route.type}</p>
            <p className="text-sm mb-2">Ruta: {route.path}</p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  results[route.path] ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {results[route.path] ? 'Accesible' : 'No accesible'}
              </span>
            </div>
            {results[route.path] && (
              <Link
                to={`/${route.path}`}
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                Abrir
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteTest;
