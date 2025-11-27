const LS_KEY = 'ocean-notes';

/**
 * Safely parse JSON.
 */
function safeParse(text, fallback) {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function loadNotes() {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
  const data = safeParse(raw, []);
  if (data.length === 0) {
    // seed with a welcome note
    const now = new Date().toISOString();
    return [
      {
        id: 'welcome',
        title: 'Welcome to Ocean Notes',
        content:
          'This is your personal notes app.\n\n- Create a new note with the + New button\n- Click a note to view it\n- Edit and save changes\n- Data is stored locally for now',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
  return data;
}

// PUBLIC_INTERFACE
export function persistNotes(notes) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LS_KEY, JSON.stringify(notes));
    }
  } catch {
    // ignore quota or access errors
  }
}
