import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const testRoutes = async () => {
    console.log('Iniciando pruebas de rutas...\n');

    // Cargar el content-map
    const contentMapPath = join(__dirname, '../public/content/content-map.json');
    const contentMap = JSON.parse(readFileSync(contentMapPath, 'utf8'));

    const results = {
        total: 0,
        accessible: 0,
        inaccessible: [],
        routes: []
    };

    // Verificar cada ruta en el content-map
    for (const [category, files] of Object.entries(contentMap)) {
        console.log(`\nVerificando categoría: ${category}`);

        for (const file of files) {
            results.total++;

            // Construir y verificar la ruta
            const filePath = join(__dirname, '../public', file.path || `content/${category}/${file.originalName}`);
            let exists = false;

            try {
                readFileSync(filePath);
                exists = true;
                results.accessible++;

                // Generar URL para el navegador
                const browserPath = file.path || `${category}/${file.originalName}`;
                results.routes.push({
                    title: file.title,
                    path: browserPath,
                    fullPath: filePath,
                    category,
                    type: file.isPdf ? 'PDF' : 'Markdown'
                });

            } catch (err) {
                results.inaccessible.push({
                    path: filePath,
                    error: err.message
                });
            }

            console.log(`- ${file.originalName}: ${exists ? '✅' : '❌'}`);
        }
    }

    // Imprimir resumen
    console.log('\n=== Resumen de Pruebas ===');
    console.log(`Total de archivos: ${results.total}`);
    console.log(`Archivos accesibles: ${results.accessible}`);
    console.log(`Archivos inaccesibles: ${results.inaccessible.length}`);

    if (results.inaccessible.length > 0) {
        console.log('\nArchivos inaccesibles:');
        results.inaccessible.forEach(({ path, error }) => {
            console.log(`- ${path}\n  Error: ${error}`);
        });
    }

    // Guardar rutas para pruebas en el navegador
    const routesPath = join(__dirname, '../tests/routes.json');
    const routesJson = JSON.stringify(results.routes, null, 2);
    try {
        writeFileSync(routesPath, routesJson);
        console.log(`\nRutas guardadas en ${routesPath}`);
    } catch (err) {
        console.error('Error al guardar rutas:', err);
    }
};

testRoutes().catch(console.error);