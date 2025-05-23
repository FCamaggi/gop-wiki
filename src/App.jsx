import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import DocumentationLayout from './components/DocumentationLayout';
import AnnouncementsPage from './components/AnnouncementsPage';
import ErrorBoundary from './components/ErrorBoundary';

const sections = [
  { path: 'ayudantias', label: 'Ayudantías' },
  { path: 'casos', label: 'Casos' },
  { path: 'clases', label: 'Clases' },
  { path: 'documentos', label: 'Documentos' },
  { path: 'evaluaciones', label: 'Evaluaciones' },
  { path: 'guias', label: 'Guías' },
  { path: 'otros', label: 'Otros' },
  { path: 'anuncios', label: 'Anuncios' },
];

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Página principal de anuncios */}
          <Route path="/" element={<AnnouncementsPage />} />

          {/* Rutas de secciones */}
          {sections.map(({ path }) => (
            <Route
              key={path}
              path={`/${path}/*`}
              element={<DocumentationLayout defaultSection={path} />}
            />
          ))}

          {/* Ruta de redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
