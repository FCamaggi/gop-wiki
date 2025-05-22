import { useState, useEffect } from 'react';

const useNavigation = () => {
    const [tableOfContents, setTableOfContents] = useState({
        classes: [],
        cases: [],
        tests: [],
        others: [],
    });
    const [selectedInterrogaciones, setSelectedInterrogaciones] = useState(['TODAS']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTableOfContents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/content/content-map.json');
                if (!response.ok) {
                    throw new Error('No se pudo cargar la tabla de contenidos');
                }
                const data = await response.json();

                // Asegurarse de que cada ítem tenga un ID único
                const processedData = Object.keys(data).reduce((acc, section) => {
                    acc[section] = data[section].map((item, index) => ({
                        ...item,
                        id: `${section}-${item.slug}-${index}` // Agregar un identificador único
                    }));
                    return acc;
                }, {});

                setTableOfContents(processedData);
            } catch (err) {
                console.error('Error cargando la tabla de contenidos:', err);
                setError('Error cargando la estructura de contenido');
            } finally {
                setLoading(false);
            }
        };

        loadTableOfContents();
    }, []);

    // Filtrar contenido basado en las interrogaciones seleccionadas
    const filteredTableOfContents = Object.keys(tableOfContents).reduce((acc, section) => {
        if (selectedInterrogaciones.includes('TODAS')) {
            // Si se selecciona "TODAS", mostrar todos los elementos
            acc[section] = tableOfContents[section];
        } else {
            // Filtrar elementos que coincidan con al menos una de las interrogaciones seleccionadas
            acc[section] = tableOfContents[section].filter((item) => {
                return item.interrogaciones && 
                       (item.interrogaciones.some(i => selectedInterrogaciones.includes(i)) ||
                        item.interrogaciones.includes('TODAS'));
            });
        }
        return acc;
    }, {});

    return { 
        tableOfContents: filteredTableOfContents, 
        allContents: tableOfContents,
        selectedInterrogaciones,
        setSelectedInterrogaciones,
        loading, 
        error 
    };
};

export default useNavigation;