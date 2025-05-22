import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],

  // Configuración del servidor de desarrollo
  server: {
    // Configurar middleware para manejar las rutas de archivos estáticos
    middlewares: [
      // Logging middleware para debug
      (req, res, next) => {
        if (req.url.startsWith('/content/')) {
          console.log('Static file request:', req.url);
        }
        next();
      }
    ],
    // Configuración para archivos estáticos
    fs: {
      strict: false,
      allow: ['..', './public']
    },
  },

  // Configuración de resolución de módulos y alias
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@content': resolve(__dirname, './public/content'),
      'pdfjs-dist': resolve(__dirname, './node_modules/pdfjs-dist'),
    }
  },

  // Configuración de optimización
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist']
  },

  // Configuración de build
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
    // Configuración de assets
    assetsDir: 'assets',
    // Asegurar que los archivos estáticos se copien
    copyPublicDir: true,
    // Manejar archivos grandes (PDFs)
    chunkSizeWarningLimit: 2000,
  }
});