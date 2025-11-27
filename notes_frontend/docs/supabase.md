# Supabase Integration

This app uses Supabase for authentication and per-user private notes.

## Environment variables

Create `.env` in the `notes_frontend` directory using `.env.example`:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- (optional) REACT_APP_FRONTEND_URL

The Supabase client is initialized in `src/lib/supabaseClient.js` and read by:
- `src/context/AuthContext.jsx`
- `src/services/notes.js`

Note: If your environment provides `REACT_APP_SUPABASE_KEY` instead of `REACT_APP_SUPABASE_ANON_KEY`, the client will accept it as a fallback, but using `REACT_APP_SUPABASE_ANON_KEY` is recommended.

Example:
```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
REACT_APP_FRONTEND_URL=http://localhost:3000
```

Start the app:
```
npm install
npm start
```

## Supabase schema (configure in your Supabase project)

- Table: `notes`
  - id uuid primary key default gen_random_uuid()
  - user_id uuid not null
  - title text not null default ''
  - content text not null default ''
  - created_at timestamptz not null default now()
  - updated_at timestamptz not null default now()

- Row Level Security (RLS):
  - Enable RLS on `notes`.
  - Policies (examples):
    - Select: using (user_id = auth.uid())
    - Insert: with check (user_id = auth.uid())
    - Update: using (user_id = auth.uid())
    - Delete: using (user_id = auth.uid())

The client uses only Supabase APIs; no custom backend is required.
