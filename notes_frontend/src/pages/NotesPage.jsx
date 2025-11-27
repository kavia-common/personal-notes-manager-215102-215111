import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import NoteView from '../components/NoteView';
import { createNote, deleteNote as apiDelete, listNotes, updateNote as apiUpdate } from '../services/notes';

/**
 * PUBLIC_INTERFACE
 * NotesPage: orchestrates list + editor using Supabase-backed CRUD.
 * Falls back gracefully if errors occur, showing inline messages.
 */
export default function NotesPage() {
  const [theme, setTheme] = useState('light');

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrMsg('');
    listNotes()
      .then((data) => {
        if (!mounted) return;
        setNotes(data);
        setSelectedId(data[0]?.id || null);
      })
      .catch((e) => {
        if (!mounted) return;
        setErrMsg(e.message || 'Failed to load notes');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  async function handleCreate() {
    setErrMsg('');
    // optimistic: prepend a temp note
    const tempId = `tmp_${Date.now()}`;
    const now = new Date().toISOString();
    const optimistic = {
      id: tempId,
      title: 'Untitled note',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [optimistic, ...prev]);
    setSelectedId(tempId);
    setMode('edit');

    try {
      const created = await createNote({ title: optimistic.title, content: '' });
      setNotes((prev) => [created, ...prev.filter((n) => n.id !== tempId)]);
      setSelectedId(created.id);
    } catch (e) {
      setNotes((prev) => prev.filter((n) => n.id !== tempId));
      setErrMsg(e.message || 'Failed to create note');
    }
  }

  async function handleSave(id, patch) {
    setErrMsg('');
    // optimistic update
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n))
    );

    try {
      const updated = await apiUpdate(id, patch);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setMode('view');
    } catch (e) {
      setErrMsg(e.message || 'Failed to save note');
    }
  }

  async function handleDelete(id) {
    setErrMsg('');
    const backup = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (id === selectedId) {
      setSelectedId((prev) => (prev === id ? null : prev));
      setMode('view');
    }
    try {
      await apiDelete(id);
    } catch (e) {
      setErrMsg(e.message || 'Failed to delete note');
      setNotes(backup);
    }
  }

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div>
      <header className="topbar" role="banner" aria-label="Notes top bar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">Ocean Notes</span>
          <span className="env-pill" title="Supabase connected">Supabase</span>
        </div>
        <div className="topbar-actions">
          <button className="btn secondary" onClick={handleCreate} aria-label="Create new note">
            + New
          </button>
          <button className="btn subtle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {errMsg && (
        <div
          role="alert"
          style={{
            margin: '12px 16px 0',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#991b1b',
            borderRadius: 10,
            padding: '8px 10px',
          }}
        >
          {errMsg}
        </div>
      )}

      <div className="layout">
        <Sidebar
          notes={filteredNotes}
          allNotes={notes}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setMode('view');
          }}
          onCreate={handleCreate}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
        />

        <main className="main">
          {loading && (
            <div className="empty-state" role="status">
              <p>Loading notes…</p>
            </div>
          )}

          {!loading && !selectedNote && (
            <div className="empty-state" role="note">
              <p>No note selected</p>
              <button className="btn primary" onClick={handleCreate}>
                Create your first note
              </button>
            </div>
          )}

          {!loading && selectedNote && mode === 'view' && (
            <NoteView
              note={selectedNote}
              onEdit={() => setMode('edit')}
              onDelete={() => handleDelete(selectedNote.id)}
            />
          )}

          {!loading && selectedNote && mode === 'edit' && (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onCancel={() => setMode('view')}
              onSave={(data) => handleSave(selectedNote.id, data)}
            />
          )}
        </main>
      </div>

      <footer className="footer" role="contentinfo">
        <span>Ocean Professional theme • Supabase</span>
      </footer>
    </div>
  );
}
