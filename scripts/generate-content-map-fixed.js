import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function normalizeFileName(fileName) {
    // Primero paddeamos los números de clase para que tengan 2 dígitos (ej: 1-clase.pdf -> 01-clase.pdf)
    let normalizedName = fileName;

    // Buscar patrón de "número-" al inicio del nombre 
    const classNumberMatch = fileName.match(/^(\d{1})-/);
    if (classNumberMatch && classNumberMatch[1].length === 1) {
        const num = classNumberMatch[1];
        normalizedName = `0${num}${fileName.substring(num.length)}`;
    }

    return normalizedName
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
        .replace(/[^a-zA-Z0-9-_.]/g, '-') // Reemplazar caracteres especiales con guiones
        .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
        .toLowerCase(); // Convertir a minúsculas
}

/**
 * Obtiene los archivos de contenido tanto de la carpeta base como de las subcarpetas I1 e I2
 */
function getContentFilesWithI1I2(dir) {
    const contentPath = resolve(__dirname, '../public/content', dir);
    const i1Path = resolve(__dirname, '../public/content/I1', dir);
    const i2Path = resolve(__dirname, '../public/content/I2', dir);

    let files = [];

    // Obtener archivos de la carpeta base (si existe)
    if (existsSync(contentPath)) {
        try {
            const baseFiles = readdirSync(contentPath)
                .filter(file => file.endsWith('.md') || file.endsWith('.pdf'))
                .map(file => {
                    const extension = file.endsWith('.pdf') ? '.pdf' : '.md';
                    const baseName = file.slice(0, -extension.length);
                    const normalizedName = normalizeFileName(baseName);

                    let fileInfo = {
                        originalName: file,
                        slug: normalizedName,
                        title: baseName.replace(/-/g, ' '),
                        order: 0,
                        isPdf: file.endsWith('.pdf'),
                        interrogaciones: ['TODAS'] // Por defecto, los archivos base son para todas las interrogaciones
                    };

                    // Procesos específicos según la carpeta
                    if (dir === 'anuncios') {
                        processAnuncio(fileInfo, baseName);
                    } else if (dir === 'casos' || dir === 'clases' || dir === 'evaluaciones') {
                        processSpecialContentType(fileInfo, dir, baseName);
                    } else if (dir === 'otros') {
                        processOtros(fileInfo, baseName);
                    }

                    return fileInfo;
                });
            files = files.concat(baseFiles);
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }

    // Obtener archivos de la carpeta I1 (si existe)
    if (existsSync(i1Path)) {
        try {
            const i1Files = readdirSync(i1Path)
                .filter(file => file.endsWith('.md') || file.endsWith('.pdf'))
                .map(file => {
                    const extension = file.endsWith('.pdf') ? '.pdf' : '.md';
                    const baseName = file.slice(0, -extension.length);
                    const normalizedName = normalizeFileName(baseName);

                    let fileInfo = {
                        originalName: file,
                        slug: normalizedName,
                        title: baseName.replace(/-/g, ' '),
                        order: 0,
                        isPdf: file.endsWith('.pdf'),
                        interrogaciones: ['I1'], // Este archivo es específico para I1
                        path: `I1/${dir}/${file}`, // Ruta relativa completa incluyendo el archivo
                        sourceSection: dir // Sección original del archivo
                    };

                    // Procesos específicos según la carpeta
                    if (dir === 'casos' || dir === 'clases' || dir === 'evaluaciones') {
                        processSpecialContentType(fileInfo, dir, baseName);
                    }

                    return fileInfo;
                });
            files = files.concat(i1Files);
        } catch (error) {
            console.error(`Error reading directory I1/${dir}:`, error);
        }
    }

    // Obtener archivos de la carpeta I2 (si existe)
    if (existsSync(i2Path)) {
        try {
            const i2Files = readdirSync(i2Path)
                .filter(file => file.endsWith('.md') || file.endsWith('.pdf'))
                .map(file => {
                    const extension = file.endsWith('.pdf') ? '.pdf' : '.md';
                    const baseName = file.slice(0, -extension.length);
                    const normalizedName = normalizeFileName(baseName);

                    let fileInfo = {
                        originalName: file,
                        slug: normalizedName,
                        title: baseName.replace(/-/g, ' '),
                        order: 0,
                        isPdf: file.endsWith('.pdf'),
                        interrogaciones: ['I2'], // Este archivo es específico para I2
                        path: `I2/${dir}/${file}`, // Ruta relativa completa incluyendo el archivo
                        sourceSection: dir // Sección original del archivo
                    };

                    // Procesos específicos según la carpeta
                    if (dir === 'casos' || dir === 'clases' || dir === 'evaluaciones') {
                        processSpecialContentType(fileInfo, dir, baseName);
                    }

                    return fileInfo;
                });
            files = files.concat(i2Files);
        } catch (error) {
            console.error(`Error reading directory I2/${dir}:`, error);
        }
    }

    return files.sort((a, b) => a.order - b.order);
}

// Funciones auxiliares para procesar diferentes tipos de contenido
function processAnuncio(fileInfo, baseName) {
    const dateMatch = baseName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
    if (dateMatch) {
        const [, year, month, day, title] = dateMatch;
        fileInfo.title = title.replace(/-/g, ' ');
        fileInfo.date = `${year}-${month}-${day}`;
        fileInfo.order = -new Date(`${year}-${month}-${day}`).getTime(); // Orden inverso por fecha
    }

    // Tratar de determinar si el anuncio se refiere a una interrogación específica
    if (baseName.toLowerCase().includes('i1')) {
        fileInfo.interrogaciones = ['I1'];
    } else if (baseName.toLowerCase().includes('i2')) {
        fileInfo.interrogaciones = ['I2'];
    }
}

function processSpecialContentType(fileInfo, dir, baseName) {
    // Procesar clases, casos y evaluaciones
    let prefixPattern = '';
    if (dir === 'clases') prefixPattern = 'clase';
    if (dir === 'casos') prefixPattern = 'caso';
    if (dir === 'evaluaciones') prefixPattern = 'evaluacion';

    const match = baseName.match(new RegExp(`^(${prefixPattern})?[_-]?(\\d+)[_-](.+)$`, 'i'));
    if (match) {
        const orderNum = parseInt(match[2]);
        fileInfo.title = `${prefixPattern.charAt(0).toUpperCase() + prefixPattern.slice(1)} ${orderNum}: ${match[3].replace(/-/g, ' ')}`;
        fileInfo.order = orderNum;

        // Determinar la interrogación por el número
        if (dir === 'clases' || dir === 'ayudantias') {
            if (orderNum <= 4) {
                if (!fileInfo.interrogaciones.includes('I1')) {
                    fileInfo.interrogaciones.push('I1');
                }
            } else {
                if (!fileInfo.interrogaciones.includes('I2')) {
                    fileInfo.interrogaciones.push('I2');
                }
            }
        }

        // Para casos específicos
        if (dir === 'casos') {
            if (orderNum === 1 || baseName.toLowerCase().includes('morrison')) {
                if (!fileInfo.interrogaciones.includes('I1')) {
                    fileInfo.interrogaciones.push('I1');
                }
            } else if (orderNum >= 2 ||
                baseName.toLowerCase().includes('obermeyer') ||
                baseName.toLowerCase().includes('easy')) {
                if (!fileInfo.interrogaciones.includes('I2')) {
                    fileInfo.interrogaciones.push('I2');
                }
            }
        }
    }
}

function processOtros(fileInfo, baseName) {
    // Categorizar por interrogación basado en el contenido
    const i1Keywords = [
        'procesos', 'inventarios', 'deterministicos', 'variables', 'meta 1-15',
        'morrison', 'goldratt cap 1', 'capitulo 1', 'cap 1-15', 'cap. 1-15',
        'eoq', 'punto de reorden', 'stock de seguridad', 'nivel de servicio'
    ];

    const i2Keywords = [
        'pronosticos', 'planificacion', 'agregada', 'diseno', 'productos',
        'mrp', 'pert', 'variabilidad', 'meta 16-26', 'sport obermeyer',
        'easy flower', 'goldratt cap 16', 'capitulo 16', 'cap 16-26', 'cap. 16-26',
        'calidad', 'lean', 'bodegas', 'centros de distribucion', 'cd'
    ];

    const lowerTitle = baseName.toLowerCase();

    if (i1Keywords.some(keyword => lowerTitle.includes(keyword))) {
        fileInfo.interrogaciones = ['I1'];
    } else if (i2Keywords.some(keyword => lowerTitle.includes(keyword))) {
        fileInfo.interrogaciones = ['I2'];
    }
}

// Asegurarse de que los directorios existen
const contentDirPath = resolve(__dirname, '../public/content');
const directories = [
    'ayudantias',
    'casos',
    'clases',
    'documentos',
    'evaluaciones',
    'guias',
    'otros',
    'anuncios',
    'tareas'
];

// Crear directorios si no existen
directories.forEach(dir => {
    const dirPath = resolve(contentDirPath, dir);
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
});

// Generar el mapa de contenido
const contentMap = directories.reduce((acc, dir) => {
    acc[dir] = getContentFilesWithI1I2(dir);
    return acc;
}, {});

// Escribir el archivo JSON
writeFileSync(
    join(contentDirPath, 'content-map.json'),
    JSON.stringify(contentMap, null, 2)
);

console.log('Content map generated successfully with I1 and I2 content!');
