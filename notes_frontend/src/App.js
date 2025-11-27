import React from 'react';
import './App.css';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import NotesPage from './pages/NotesPage';

/**
 * AppShell decides whether to render Auth or the NotesPage based on session.
 */
function AppShell() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App" style={{ minHeight: '100vh', background: 'var(--surface-bg)' }}>
        <header className="topbar" role="banner" aria-label="Top bar">
          <div className="brand">
            <span className="brand-dot" />
            <span className="brand-name">Ocean Notes</span>
            <span className="env-pill warning">Sign in required</span>
          </div>
        </header>
        <Auth />
      </div>
    );
  }

  return <NotesPage />;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Ocean Professional theme colors applied via CSS variables.
   * primary: #2563EB, secondary/success: #F59E0B, error: #EF4444
   */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
