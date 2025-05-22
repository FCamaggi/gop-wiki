import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixContentMap = () => {
    // Leer el content-map actual
    const contentMapPath = path.join(__dirname, '../public/content/content-map.json');
    const contentMap = JSON.parse(fs.readFileSync(contentMapPath, 'utf8'));
    let fixCount = 0;

    // Corregir rutas en cada categoría
    Object.entries(contentMap).forEach(([category, files]) => {
        contentMap[category] = files.map(file => {
            if (file.path) {
                // Eliminar '/content/' duplicado
                if (file.path.startsWith('/content/content/')) {
                    fixCount++;
                    file.path = file.path.replace('/content/content/', '/content/');
                } else if (file.path.startsWith('content/content/')) {
                    fixCount++;
                    file.path = file.path.replace('content/content/', 'content/');
                }
            } else {
                // Asegurar que las rutas nuevas tengan el formato correcto
                const interrogacion = file.interrogaciones?.[0];
                if (interrogacion === 'I1' || interrogacion === 'I2') {
                    file.path = `content/${interrogacion}/${category}/${file.originalName}`;
                } else {
                    file.path = `content/${category}/${file.originalName}`;
                }
                fixCount++;
            }
            return file;
        });
    });

    // Guardar el content-map corregido
    fs.writeFileSync(
        contentMapPath,
        JSON.stringify(contentMap, null, 2)
    );

    console.log(`Corregidas ${fixCount} rutas en el content-map.`);
    console.log('Contenido actualizado guardado en:', contentMapPath);
};

fixContentMap();