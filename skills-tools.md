# Skills & Tools Inventory

This document lists the key development resources used in this project, categorized by type.

---

## Libraries
- **React**: UI library for building user interfaces
- **Next.js**: React framework for server-side rendering and routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: Promise-based HTTP client for browser and Node.js
- **docx**: Library for creating and editing DOCX files in JavaScript/TypeScript
- **pdf2json**: PDF parsing library for extracting content from PDF files

## Frameworks
- **Next.js**: Full-stack React framework (App Router architecture)
- **Jest**: JavaScript testing framework

## Modules
- **app/hooks/useFileUpload.tsx**: Custom React hook for file upload and conversion
- **app/Main/Dropzone.tsx**: Drag-and-drop file upload component
- **app/components/ui/Button.tsx**: Reusable button UI component
- **app/components/ui/card.tsx**: Card UI component
- **app/utils/IndexedDB.ts**: IndexedDB utility for client-side storage
- **app/store/data.ts**: Data store module
- **app/store/mockUploads.ts**: Mock data for uploads

## Packages
- **react-dropzone**: File drag-and-drop for React
- **postcss**: Tool for transforming CSS with JavaScript
- **autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes
- **eslint**: Linter for JavaScript and TypeScript
- **jest**: Testing framework
- **@types/**: TypeScript type definitions for various packages

## Tools
- **VS Code**: Code editor
- **ESLint**: Linting and code quality
- **Jest**: Unit testing
- **Tailwind CLI**: Utility for building Tailwind CSS
- **PostCSS CLI**: CSS processing
- **Git**: Version control
- **npm**: Package manager

---

## Notes
- The project uses a modular folder structure under `app/` for features and UI components.
- TypeScript is used throughout for type safety.
- The backend API is expected to handle file conversion and return either file URLs or binary data.
- See `README.md` and `INTEGRATION.md` for more details on usage and integration.
