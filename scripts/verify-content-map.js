// Script de verificación para ejecutar manualmente
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyContentMap = () => {
    // Leer el content-map actual
    const contentMapPath = path.join(path.resolve(__dirname, '..'), 'public/content/content-map.json');
    const contentMap = JSON.parse(fs.readFileSync(contentMapPath, 'utf8'));

    // Contadores y colectores
    let totalFiles = 0;
    let wrongPaths = 0;
    const i1Inconsistencies = [];
    const i2Inconsistencies = [];

    console.log('=== Resumen de la Estructura ===\n');
    console.log('Categorías:', Object.keys(contentMap).join(', '));

    // Verificar rutas de archivos
    Object.entries(contentMap).forEach(([category, files]) => {
        files.forEach(file => {
            totalFiles++;

            // Verificar duplicación de 'content'
            const originalPath = path.join('public/content', file.path || `${category}/${file.originalName}`);
            const fixedPath = originalPath.replace('/content/content/', '/content/');

            if (originalPath !== fixedPath) {
                wrongPaths++;
            }

            // Verificar consistencia de interrogaciones
            if (file.path?.includes('I1/') && !file.interrogaciones.includes('I1')) {
                i1Inconsistencies.push(file.originalName);
            }
            if (file.path?.includes('I2/') && !file.interrogaciones.includes('I2')) {
                i2Inconsistencies.push(file.originalName);
            }
        });
    });

    console.log('\n=== Estadísticas Generales ===');
    console.log(`Total de archivos indexados: ${totalFiles}`);
    console.log(`Archivos con rutas incorrectas: ${wrongPaths} (${Math.round(wrongPaths / totalFiles * 100)}%)`);
    console.log(`Inconsistencias I1: ${i1Inconsistencies.length}`);
    console.log(`Inconsistencias I2: ${i2Inconsistencies.length}`);

    console.log('\n=== Problemas Encontrados ===');

    // 1. Rutas duplicadas
    console.log('\n1. Rutas con "content" duplicado:');
    console.log(`Se encontraron ${wrongPaths} archivos con "/content/content/" en su ruta`);

    // 2. Inconsistencias en interrogaciones
    if (i1Inconsistencies.length > 0) {
        console.log('\n2. Archivos en ruta I1/ sin interrogación "I1":');
        i1Inconsistencies.forEach(file => console.log(`  - ${file}`));
    }

    if (i2Inconsistencies.length > 0) {
        console.log('\n3. Archivos en ruta I2/ sin interrogación "I2":');
        i2Inconsistencies.forEach(file => console.log(`  - ${file}`));
    }

    console.log('\n=== Recomendaciones ===');
    console.log('1. Corregir las rutas duplicadas:');
    console.log('   - Buscar: /content/content/');
    console.log('   - Reemplazar por: /content/');
    console.log('\n2. Asegurar que los archivos en:');
    console.log('   - Ruta I1/ tengan interrogaciones: ["I1"]');
    console.log('   - Ruta I2/ tengan interrogaciones: ["I2"]');
};

verifyContentMap();