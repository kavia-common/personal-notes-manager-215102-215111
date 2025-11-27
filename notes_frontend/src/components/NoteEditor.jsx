import React, { useEffect, useState } from 'react';

/**
 * NoteEditor provides controlled inputs for title and content.
 * Includes Save and Cancel actions. Emits data via onSave.
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(title !== (note.title || '') || content !== (note.content || ''));
  }, [title, content, note]);

  const handleSave = () => {
    onSave({
      title: title.trim() || 'Untitled note',
      content,
    });
  };

  return (
    <section className="editor" aria-label="Edit note">
      <div className="editor-actions">
        <button className="btn subtle" onClick={onCancel}>Cancel</button>
        <button className="btn success" onClick={handleSave} disabled={!isDirty}>
          Save
        </button>
      </div>
      <input
        className="input title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        aria-label="Note title"
      />
      <textarea
        className="textarea content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        rows={16}
        aria-label="Note content"
      />
    </section>
  );
}
