#!/bin/bash

# Crear directorios principales
mkdir -p src/{api,components/{common,layout,content/{viewer,navigation}},contexts,hooks/{content,common},lib/utils,services/{content,markdown},styles/theme,pages}

# Crear archivos principales
touch src/api/{contentApi.js,types.d.ts}

# Crear componentes comunes
mkdir -p src/components/common/{Button,Card,Icons}
touch src/components/common/{Button,Card,Icons}/index.jsx

# Crear componentes de layout
mkdir -p src/components/layout/{Sidebar,Header,Footer}
touch src/components/layout/{Sidebar,Header,Footer}/index.jsx

# Crear componentes de contenido
mkdir -p src/components/content/viewer/{PDFViewer,MarkdownViewer}
mkdir -p src/components/content/navigation/{TableOfContents,Navigation}
touch src/components/content/viewer/{PDFViewer,MarkdownViewer}/index.jsx
touch src/components/content/navigation/{TableOfContents,Navigation}/index.jsx

# Crear contextos
touch src/contexts/{ContentContext.jsx,NavigationContext.jsx}

# Crear hooks
touch src/hooks/content/{useContent.js,useNavigation.js}
touch src/hooks/common/{useMediaQuery.js,useLocalStorage.js}

# Crear utilidades
touch src/lib/{constants.js}
touch src/lib/utils/{formatters.js,validators.js,parsers.js}

# Crear servicios
touch src/services/content/{contentService.js,navigationService.js}
touch src/services/markdown/markdownService.js

# Crear estilos
touch src/styles/{global.css}
touch src/styles/theme/{colors.js,typography.js}

# Crear páginas
mkdir -p src/pages/{Home,Class,Case,Test}
touch src/pages/{Home,Class,Case,Test}/index.jsx

# Dar permisos de ejecución si es necesario
chmod +x create-structure.sh