/**
 * NotesList component: renders sidebar list with search filtering.
 */

import { api } from '../services/api.js';
import { router } from '../router.js';

let hostEl = null;
let cache = [];
let isLoading = false;
let lastError = null;
let currentQuery = '';

async function loadNotes() {
  try {
    isLoading = true;
    lastError = null;
    render();
    cache = await api.listNotes();
  } catch (e) {
    console.error(e);
    lastError = 'Failed to load notes.';
  } finally {
    isLoading = false;
    render();
  }
}

function formatDate(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return '';
  }
}

function filteredNotes() {
  const q = (currentQuery || '').toLowerCase().trim();
  if (!q) return cache;
  return cache.filter(n =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q)
  );
}

// PUBLIC_INTERFACE
export const NotesList = {
  /** Mount the list onto a container element and load notes. */
  mount(container) {
    hostEl = container;
    loadNotes();
  },

  /** Refresh after create/update/delete or when search changes. */
  async refresh(query = currentQuery) {
    currentQuery = query;
    render();
  },

  /** Force reload from API (e.g., after editor saves). */
  async reload() {
    await loadNotes();
  },
};

function render() {
  if (!hostEl) return;
  if (isLoading) {
    hostEl.innerHTML = `<div class="empty"><span class="loader" aria-hidden="true"></span> Loading notes…</div>`;
    return;
  }
  if (lastError) {
    hostEl.innerHTML = `<div class="alert" role="alert">${lastError}</div>`;
    return;
  }
  const list = filteredNotes();

  if (!list.length) {
    hostEl.innerHTML = `<div class="empty">No notes found. Create your first note to get started.</div>`;
    return;
  }

  hostEl.innerHTML = list.map(n => `
    <div class="note-item" data-id="${n.id}">
      <div>
        <p class="note-item-title" title="${escapeAttr(n.title)}">${escapeHtml(n.title)}</p>
        <div class="note-item-meta">
          <span class="badge" title="Last updated">🕒 ${formatDate(n.updatedAt)}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="icon-btn" data-action="open" title="Open">✏️</button>
        <button class="icon-btn danger" data-action="delete" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');

  // Bind action buttons
  hostEl.querySelectorAll('.note-item').forEach(item => {
    const id = item.getAttribute('data-id');
    item.querySelector('[data-action="open"]').addEventListener('click', () => router.push(`#/edit/${id}`));
    item.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const ok = confirm('Delete this note? This cannot be undone.');
      if (!ok) return;
      try {
        await api.deleteNote(id);
        await loadNotes();
        if (location.hash === `#/edit/${id}`) {
          router.push('#/');
        }
      } catch {
        alert('Failed to delete note.');
      }
    });
  });
}

function escapeHtml(s) {
  return (s ?? '').toString()
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function escapeAttr(s) {
  return (s ?? '').toString().replaceAll('"', '&quot;');
}
