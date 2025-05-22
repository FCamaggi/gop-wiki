import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
    <Link
      to={ROUTES.HOME}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
