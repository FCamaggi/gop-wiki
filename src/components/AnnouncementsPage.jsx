import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MarkdownContent from './MarkdownContent';

const NavigationHeader = () => (
  <nav className="bg-slate-100 border-b border-slate-200 py-4">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-6 overflow-x-auto">          {[
          { path: 'ayudantias', label: 'Ayudantías' },
          { path: 'casos', label: 'Casos' },
          { path: 'clases', label: 'Clases' },
          { path: 'documentos', label: 'Documentos' },
          { path: 'evaluaciones', label: 'Evaluaciones' },
          { path: 'guias', label: 'Guías' },
          { path: 'tareas', label: 'Tareas' },
          { path: 'otros', label: 'Otros' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={`/${path}`}
            className="text-slate-600 hover:text-slate-900 whitespace-nowrap transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

const AnnouncementBlock = ({ title, date, content }) => (
  <article className="bg-white rounded-lg border border-slate-200 mb-8 overflow-hidden">
    <header className="border-b border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center gap-2 text-slate-600 mb-2">
        <Calendar size={16} />
        <time dateTime={date} className="text-sm">
          {new Date(date).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </header>
    <div className="p-6">
      <div className="prose max-w-none">
        <MarkdownContent content={content} />
      </div>
    </div>
  </article>
);

AnnouncementBlock.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch('/content/content-map.json');
        if (!response.ok) throw new Error('Error cargando anuncios');

        const data = await response.json();
        const anuncios = data.anuncios || [];

        // Ordenar anuncios por fecha (más recientes primero)
        const sortedAnnouncements = anuncios.sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        });

        setAnnouncements(sortedAnnouncements);

        // Cargar el contenido de cada anuncio
        const contentsMap = {};
        await Promise.all(
          sortedAnnouncements.map(async (announcement) => {
            try {
              const contentResponse = await fetch(
                `/content/anuncios/${announcement.slug}.md`
              );
              if (!contentResponse.ok)
                throw new Error('Error cargando contenido');
              const content = await contentResponse.text();
              contentsMap[announcement.slug] = content;
            } catch (error) {
              console.error(
                `Error loading content for ${announcement.slug}:`,
                error
              );
              contentsMap[announcement.slug] = 'Error cargando el contenido';
            }
          })
        );

        setContents(contentsMap);
      } catch (error) {
        console.error('Error cargando anuncios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  if (loading) {
    return (
      <div>
        <NavigationHeader />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavigationHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Anuncios</h1>
          <p className="text-slate-600">
            Últimos anuncios y actualizaciones del curso
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            No hay anuncios disponibles
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map((announcement) => (
              <AnnouncementBlock
                key={announcement.slug}
                title={announcement.title}
                date={announcement.date}
                content={contents[announcement.slug] || 'Cargando...'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
