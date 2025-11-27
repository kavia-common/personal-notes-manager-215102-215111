import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import NoteView from './components/NoteView';
import { loadNotes, persistNotes } from './utils/storage';
import { generateId, getEnvConfig } from './utils/utils';

// PUBLIC_INTERFACE
function App() {
  /**
   * Ocean Professional theme colors applied via CSS variables.
   * primary: #2563EB, secondary/success: #F59E0B, error: #EF4444
   */
  const [theme, setTheme] = useState('light');

  // Notes state
  const [notes, setNotes] = useState(() => loadNotes());
  const [selectedId, setSelectedId] = useState(() => (loadNotes()[0]?.id ?? null));
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'new'
  const [search, setSearch] = useState('');

  const { backendUrl, hasBackend } = useMemo(() => getEnvConfig(), []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist notes to local storage whenever they change
  useEffect(() => {
    persistNotes(notes);
  }, [notes]);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const createNote = () => {
    const newNote = {
      id: generateId(),
      title: 'Untitled note',
      content: '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setSelectedId(newNote.id);
    setMode('edit');
  };

  // PUBLIC_INTERFACE
  const updateNote = (id, patch) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, ...patch, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  // PUBLIC_INTERFACE
  const deleteNote = (id) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (id === selectedId) {
      setSelectedId(filtered[0]?.id ?? null);
      setMode('view');
    }
  };

  // PUBLIC_INTERFACE
  const saveNote = (id, data) => {
    updateNote(id, data);
    setMode('view');
  };

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'var(--surface-bg)' }}>
      <header className="topbar" role="banner" aria-label="Notes top bar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">Ocean Notes</span>
          {hasBackend ? (
            <span className="env-pill" title={`Backend: ${backendUrl}`}>Connected</span>
          ) : (
            <span className="env-pill warning" title="Using local storage">Local</span>
          )}
        </div>
        <div className="topbar-actions">
          <button
            className="btn secondary"
            onClick={createNote}
            aria-label="Create new note"
          >
            + New
          </button>
          <button
            className="btn subtle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="layout">
        <Sidebar
          notes={filteredNotes}
          allNotes={notes}
          selectedId={selectedId}
          onSelect={id => { setSelectedId(id); setMode('view'); }}
          onCreate={createNote}
          onDelete={deleteNote}
          search={search}
          setSearch={setSearch}
        />

        <main className="main">
          {!selectedNote && (
            <div className="empty-state" role="note">
              <p>No note selected</p>
              <button className="btn primary" onClick={createNote}>Create your first note</button>
            </div>
          )}

          {selectedNote && mode === 'view' && (
            <NoteView
              note={selectedNote}
              onEdit={() => setMode('edit')}
              onDelete={() => deleteNote(selectedNote.id)}
            />
          )}

          {selectedNote && mode === 'edit' && (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onCancel={() => setMode('view')}
              onSave={(data) => saveNote(selectedNote.id, data)}
            />
          )}
        </main>
      </div>

      <footer className="footer" role="contentinfo">
        <span>Ocean Professional theme</span>
      </footer>
    </div>
  );
}

export default App;
