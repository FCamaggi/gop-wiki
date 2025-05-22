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

function getContentFiles(dir) {
    const contentPath = resolve(__dirname, '../public/content', dir);
    try {
        return readdirSync(contentPath)
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
                    interrogaciones: [] // Categorización por interrogaciones
                };

                // Procesar anuncios (formato: YYYY-MM-DD-titulo.md)
                if (dir === 'anuncios') {
                    const dateMatch = baseName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
                    if (dateMatch) {
                        const [, year, month, day, title] = dateMatch;
                        return {
                            ...fileInfo,
                            title: title.replace(/-/g, ' '),
                            date: `${year}-${month}-${day}`,
                            order: -new Date(`${year}-${month}-${day}`).getTime() // Orden inverso por fecha
                        };
                    }
                }

                // Procesar clases, casos y evaluaciones
                const match = baseName.match(/^(clase|caso|evaluacion)-(\d+)-(.+)$/i);
                if (match) {
                    return {
                        ...fileInfo,
                        title: `${match[1].charAt(0).toUpperCase() + match[1].slice(1)} ${match[2]}: ${match[3].replace(/-/g, ' ')}`,
                        order: parseInt(match[2])
                    };
                }

                // Procesar contenido de la sección "otros"
                if (dir === 'otros' && baseName.toLowerCase().startsWith('otros -')) {
                    return {
                        ...fileInfo,
                        title: baseName.replace(/^otros -\s*/i, '').replace(/-/g, ' ')
                    };
                }

                // Categorizar por interrogación basado en el contenido
                const interrogaciones = [];

                // Extraer la información de los temarios para clasificación más precisa
                const i1Temas = [
                    'procesos', 'inventarios', 'deterministicos', 'variables', 'meta 1-15',
                    'morrison', 'goldratt cap 1', 'capitulo 1', 'cap 1-15', 'cap. 1-15',
                    'eoq', 'punto de reorden', 'stock de seguridad', 'nivel de servicio'
                ];
                
                const i2Temas = [
                    'pronosticos', 'planificacion', 'agregada', 'diseno', 'productos',
                    'mrp', 'pert', 'variabilidad', 'meta 16-26', 'sport obermeyer',
                    'easy flower', 'goldratt cap 16', 'capitulo 16', 'cap 16-26', 'cap. 16-26',
                    'calidad', 'lean', 'bodegas', 'centros de distribucion', 'cd'
                ];
                
                // Reglas simplificadas: asignar casos específicos directamente
                if (dir === 'casos') {
                    // Caso 1 es de la I1, casos 2 y 3 son de la I2
                    if (file.includes("caso-1") || file.includes("morrison") || file.includes("Morrison")) {
                        interrogaciones = ['I1'];  // Asignar explícitamente - sobrescribe el array
                    } else if (file.includes("caso-2") || file.includes("caso-3") || 
                              file.includes("obermeyer") || file.includes("Obermeyer") || 
                              file.includes("easy_flower") || file.includes("Easy")) {
                        interrogaciones = ['I2'];  // Asignar explícitamente - sobrescribe el array
                    }
                } 
                // Interrogación 1: Procesos, Inventarios Deterministicos, Inventarios Variables, La Meta 1-15
                else if (
                    (dir === 'clases' && /\b([1-4]|-0[1-4]|procesos|inventarios)\b/i.test(baseName)) ||
                    (dir === 'documentos' && /\b(formulario[-_]?i1)\b/i.test(baseName)) ||
                    (dir === 'evaluaciones' && (/\bi1\b/i.test(baseName) || /\b20(1[0-9]|2[0-3])[-_]i[_-]?1\b/i.test(baseName))) ||
                    (dir === 'otros' && (/\b(meta.*1-15|cap-1-15)\b/i.test(baseName) || i1Temas.some(tema => baseName.toLowerCase().includes(tema)))) ||
                    (dir === 'guias' && /\b(inventario|procesos|variabilidad)\b/i.test(baseName)) ||
                    (dir === 'ayudantias' && /\b(ayudantia-[1-3])\b/i.test(baseName)) ||
                    (dir === 'tareas' && /\b(tarea[-_]?1)\b/i.test(baseName))
                ) {
                    interrogaciones.push('I1');
                }

                // Interrogación 2: Pronósticos, Planificación Agregada, Diseño de Productos, MRP, PERT, La Meta 16-26
                if (
                    (dir === 'clases' && /\b([5-9]|1[0-9]|-0[5-9]|-1[0-9]|pronosticos|planificacion|diseno|mrp|pert|variabilidad|calidad|lean|cd|distribucion)\b/i.test(baseName)) ||
                    (dir === 'documentos' && /\b(formulario[-_]?i2)\b/i.test(baseName)) ||
                    (dir === 'evaluaciones' && (/\bi2\b/i.test(baseName) || /\b20(1[0-9]|2[0-3])[-_]i[_-]?2\b/i.test(baseName))) ||
                    (dir === 'otros' && (/\b(meta.*16-26|cap-16-26)\b/i.test(baseName) || i2Temas.some(tema => baseName.toLowerCase().includes(tema)))) ||
                    (dir === 'guias' && /\b(pert|planificacion|variabilidad|calidad|lean|bodegas|localizacion)\b/i.test(baseName)) ||
                    (dir === 'ayudantias' && /\b(ayudantia-[4-9])\b/i.test(baseName)) ||
                    (dir === 'tareas' && /\b(tarea[-_]?2)\b/i.test(baseName))
                ) {
                    interrogaciones.push('I2');
                }

                // Procesamiento especial para tareas
                if (dir === 'tareas') {
                    // Asignar a I1 o I2 según el número de la tarea
                    const tareaMatch = baseName.match(/tarea[-_]?(\d+)/i);
                    if (tareaMatch) {
                        const tareaNum = parseInt(tareaMatch[1]);
                        if (tareaNum === 1) {
                            interrogaciones.push('I1');
                        } else if (tareaNum === 2) {
                            interrogaciones.push('I2');
                        }
                    }
                }
                
                // Procesamiento especial para evaluaciones
                if (dir === 'evaluaciones') {
                    // Extraer el año de la evaluación para mejor organización
                    const yearMatch = baseName.match(/20(\d{2})/);
                    if (yearMatch) {
                        const year = `20${yearMatch[1]}`;
                        if (!fileInfo.year) {
                            fileInfo.year = year;
                        }
                    }
                }
                
                // Procesamiento especial para casos
                if (dir === 'casos') {
                    // Extraer el número del caso si existe
                    const casoMatch = baseName.match(/caso[-_]?(\d+)/i);
                    if (casoMatch) {
                        const casoNum = parseInt(casoMatch[1]);
                        fileInfo.casoNum = casoNum;
                    }
                }

                // No añadimos prefijos a los títulos, simplemente devolvemos la info
                return {
                    ...fileInfo,
                    interrogaciones: interrogaciones.length > 0 ? interrogaciones : ['TODAS']
                };
            })
            .sort((a, b) => a.order - b.order);
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
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
    acc[dir] = getContentFiles(dir);
    return acc;
}, {});

// Escribir el archivo JSON
writeFileSync(
    join(contentDirPath, 'content-map.json'),
    JSON.stringify(contentMap, null, 2)
);

console.log('Content map generated successfully!');