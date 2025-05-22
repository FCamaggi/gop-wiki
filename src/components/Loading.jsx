import PropTypes from 'prop-types';

const Loading = ({ message = 'Cargando contenido...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
    {/* Spinner animado */}
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute top-0 w-16 h-16 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute top-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    {/* Mensaje de carga */}
    <p className="text-gray-600">{message}</p>
  </div>
);

Loading.propTypes = {
  message: PropTypes.string,
};

export default Loading;
