/**
 * Local storage service for notes.
 * Uses a simple schema and provides CRUD operations.
 */

const STORAGE_KEY = 'pnm_notes_v1';

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

function saveAll(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// PUBLIC_INTERFACE
export const storage = {
  /** Get all notes sorted by updatedAt desc */
  getAll() {
    const notes = loadAll();
    return notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },

  /** Get a single note by id */
  get(id) {
    return loadAll().find(n => n.id === id) || null;
  },

  /** Create a note and return it */
  create({ title, content }) {
    const now = Date.now();
    const note = { id: genId(), title: title || 'Untitled', content: content || '', createdAt: now, updatedAt: now };
    const notes = loadAll();
    notes.push(note);
    saveAll(notes);
    return note;
  },

  /** Update a note by id */
  update(id, { title, content }) {
    const notes = loadAll();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const updated = { ...notes[idx], title, content, updatedAt: Date.now() };
    notes[idx] = updated;
    saveAll(notes);
    return updated;
  },

  /** Delete a note by id, returns true if removed */
  remove(id) {
    const before = loadAll();
    const after = before.filter(n => n.id !== id);
    saveAll(after);
    return after.length !== before.length;
  },
};
