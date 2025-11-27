# Ocean Notes – Lightweight React Notes UI

A simple notes application UI with a modern Ocean Professional theme (blue primary with amber accents), built with React and vanilla CSS.

## Features
- Sign up / Sign in / Sign out with Supabase Auth
- Create, view, edit, and delete notes (per-user, private via RLS)
- Sidebar with search and note list
- Responsive layout with smooth transitions and rounded corners
- Theme toggle (light/dark)

## Environment
The app uses the following variables if present:
- REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED
- Supabase:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY (preferred; REACT_APP_SUPABASE_KEY also supported as fallback)

Create a `.env` by copying `.env.example` and filling Supabase values:
```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## Supabase Notes Table (server side)
This app assumes a `notes` table with RLS enabled:
- Columns: id (uuid, pk, default gen_random_uuid()), user_id (uuid), title (text), content (text), created_at (timestamptz default now()), updated_at (timestamptz default now())
- RLS policies allow users to read/write rows where `user_id = auth.uid()`

Note: The app does not run SQL; configure the table and policies in Supabase.

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
