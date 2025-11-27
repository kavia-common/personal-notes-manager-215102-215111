# Ocean Notes – Lightweight React Notes UI

A simple notes application UI with a modern Ocean Professional theme (blue primary with amber accents), built with React and vanilla CSS.

## Features
- Create, view, edit, and delete notes
- Sidebar with search and note list
- Local storage data layer (fallback when backend is not configured)
- Responsive layout with smooth transitions and rounded corners
- Theme toggle (light/dark)

## Environment
The app respects the following variables if present:
- REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED

When no backend is detected, the app uses browser localStorage. See `.env.example` for defaults.

## Scripts
- `npm start` – start dev server
- `npm test` – run tests
- `npm run build` – production build

## Styling
Ocean Professional theme is applied via CSS variables in `src/App.css`:
- primary: #2563EB
- secondary/success: #F59E0B
- error: #EF4444
- background/surface: subtle gradients with shadows and rounded corners
