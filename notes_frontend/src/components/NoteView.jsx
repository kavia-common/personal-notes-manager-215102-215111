import React from 'react';

/**
 * NoteView displays note content with Edit and Delete actions.
 */
// PUBLIC_INTERFACE
export default function NoteView({ note, onEdit, onDelete }) {
  return (
    <article className="viewer" aria-label="View note">
      <div className="viewer-actions">
        <button className="btn warning" onClick={onEdit}>Edit</button>
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
      <h1 className="viewer-title">{note.title || 'Untitled'}</h1>
      <div className="viewer-meta">
        Last updated {new Date(note.updatedAt).toLocaleString()}
      </div>
      <div className="viewer-content">
        {note.content ? note.content.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        )) : <p className="muted">No content</p>}
      </div>
    </article>
  );
}
