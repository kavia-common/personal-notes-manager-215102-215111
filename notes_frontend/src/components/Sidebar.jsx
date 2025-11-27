import React from 'react';

/**
 * Sidebar component: renders search, actions, and list of notes.
 * Ocean Professional theme with smooth transitions, rounded corners, and minimal design.
 */
// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  allNotes,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  search,
  setSearch
}) {
  return (
    <aside className="sidebar" aria-label="Notes list">
      <div className="sidebar-header">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="input search"
          aria-label="Search notes"
        />
        <button className="btn primary" onClick={onCreate} aria-label="Create note">
          + New
        </button>
      </div>

      <div className="sidebar-meta" aria-live="polite">
        <span>{notes.length} / {allNotes.length} notes</span>
      </div>

      <ul className="note-list" role="list">
        {notes.map(note => (
          <li
            key={note.id}
            className={`note-list-item ${selectedId === note.id ? 'active' : ''}`}
          >
            <button
              className="note-list-button"
              onClick={() => onSelect(note.id)}
              aria-current={selectedId === note.id ? 'true' : 'false'}
            >
              <div className="note-title">{note.title || 'Untitled'}</div>
              <div className="note-snippet">
                {(note.content || '').slice(0, 80) || 'No content'}
              </div>
              <div className="note-updated">
                {new Date(note.updatedAt).toLocaleString()}
              </div>
            </button>
            <button
              className="icon-btn danger"
              onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
              aria-label={`Delete note ${note.title || 'Untitled'}`}
              title="Delete"
            >
              🗑️
            </button>
          </li>
        ))}
        {notes.length === 0 && (
          <li className="note-empty">No notes found</li>
        )}
      </ul>
    </aside>
  );
}
