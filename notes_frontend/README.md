# Personal Notes Manager - Frontend

A Vite-based web UI for creating, editing, viewing, and managing personal notes.

Features:
- List notes with search/filter
- Create, edit, and delete notes
- Persistent storage using localStorage
- Loading and error states for actions
- Clean, responsive, accessible UI
- Placeholder API layer ready for future backend integration

Getting started:
- Install dependencies: npm install
- Start dev server: npm run dev
- Build: npm run build
- Preview production build: npm run preview

Architecture:
- src/router.js: Minimal hash-based router for list/editor routes
- src/services/storage.js: LocalStorage CRUD wrapper
- src/services/api.js: Placeholder API client delegating to storage; replace internals with fetch calls when backend is available (uses VITE_API_BASE_URL)
- src/ui/appShell.js: App shell, layout, wiring of toolbar and routing
- src/ui/notesList.js: Sidebar list with filtering and actions
- src/ui/noteEditor.js: Create/Edit note editor with validation

Environment:
- Copy .env.example to .env and set VITE_API_BASE_URL when backend is ready.

Notes:
- No backend is required. Data persists in browser localStorage.
- All public functions are documented and marked with PUBLIC_INTERFACE comments per project requirements.
