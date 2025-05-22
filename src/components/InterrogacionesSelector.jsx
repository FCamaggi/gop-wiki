import PropTypes from 'prop-types';

/**
 * Componente para seleccionar las interrogaciones a filtrar
 */
const InterrogacionesSelector = ({ selectedInterrogaciones, onSelectionChange }) => {
  const interrogaciones = [
    { id: 'TODAS', label: 'Todas' },
    { id: 'I1', label: 'I1' },
    { id: 'I2', label: 'I2' },
  ];

  const handleChange = (value) => {
    if (value === 'TODAS') {
      // Si se selecciona "TODAS", deseleccionar las demás
      onSelectionChange(['TODAS']);
    } else {
      const newSelection = selectedInterrogaciones.includes(value)
        ? selectedInterrogaciones.filter((i) => i !== value)
        : [...selectedInterrogaciones.filter((i) => i !== 'TODAS'), value];
      
      // Si no queda nada seleccionado, seleccionar "TODAS"
      onSelectionChange(newSelection.length === 0 ? ['TODAS'] : newSelection);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-slate-900 mb-2">
          Filtrar por interrogación:
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {interrogaciones.map((interrogacion) => (
            <label
              key={interrogacion.id}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                cursor-pointer transition-colors
                ${
                  selectedInterrogaciones.includes(interrogacion.id)
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
              `}
            >
              <input
                type="checkbox"
                value={interrogacion.id}
                checked={selectedInterrogaciones.includes(interrogacion.id)}
                onChange={() => handleChange(interrogacion.id)}
                className="hidden"
              />
              {interrogacion.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

InterrogacionesSelector.propTypes = {
  selectedInterrogaciones: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default InterrogacionesSelector;
