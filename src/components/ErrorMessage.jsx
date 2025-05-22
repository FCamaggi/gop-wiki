import PropTypes from 'prop-types';

const ErrorMessage = ({
  error,
  onRetry,
  title = 'Error al cargar el contenido',
}) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
    {/* Icono de error */}
    <div className="w-16 h-16 mb-4 text-red-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    {/* Título del error */}
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    {/* Mensaje de error */}
    <p className="text-gray-600 text-center mb-4">
      {error?.message || 'Ha ocurrido un error inesperado'}
    </p>
    {/* Botón de reintentar */}
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func,
  title: PropTypes.string,
};

export default ErrorMessage;
