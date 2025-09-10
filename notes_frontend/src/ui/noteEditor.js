/**
 * NoteEditor component.
 * Modes:
 * - welcome: landing placeholder
 * - create: new note form
 * - edit: edit existing note by id
 */

import { api } from '../services/api.js';
import { router } from '../router.js';
import { NotesList } from './notesList.js';

let hostEl = null;
let state = {
  mode: 'welcome',
  id: null,
  title: '',
  content: '',
  loading: false,
  error: '',
  saving: false,
};

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

// PUBLIC_INTERFACE
export const NoteEditor = {
  /**
   * Mount editor into container.
   * @param {HTMLElement} container
   * @param {{mode:'welcome'|'create'|'edit', id?:string}} options
   */
  async mount(container, options) {
    hostEl = container;
    setState({ mode: options.mode, id: options.id || null, title: '', content: '', error: '' });

    if (options.mode === 'edit' && options.id) {
      await loadNote(options.id);
    } else if (options.mode === 'create') {
      render();
      // Focus title
      queueMicrotask(() => {
        const el = hostEl.querySelector('#note-title');
        if (el) el.focus();
      });
    } else {
      render();
    }
  },
};

async function loadNote(id) {
  try {
    setState({ loading: true, error: '' });
    const note = await api.getNote(id);
    if (!note) {
      setState({ error: 'Note not found.', loading: false });
      return;
    }
    setState({ title: note.title || '', content: note.content || '', loading: false });
  } catch (e) {
    console.error(e);
    setState({ error: 'Failed to load note.', loading: false });
  }
}

function validate() {
  const title = state.title.trim();
  if (!title) return 'Title is required.';
  return '';
}

async function onSave() {
  const err = validate();
  if (err) {
    setState({ error: err });
    return;
  }
  try {
    setState({ saving: true, error: '' });
    if (state.mode === 'create') {
      const created = await api.createNote({ title: state.title.trim(), content: state.content });
      await NotesList.reload();
      router.push(`#/edit/${created.id}`);
    } else if (state.mode === 'edit' && state.id) {
      await api.updateNote(state.id, { title: state.title.trim(), content: state.content });
      await NotesList.reload();
    }
  } catch (e) {
    console.error(e);
    setState({ error: 'Failed to save note.' });
  } finally {
    setState({ saving: false });
  }
}

function onCancel() {
  router.push('#/');
}

function render() {
  if (!hostEl) return;

  if (state.mode === 'welcome') {
    hostEl.innerHTML = `
      <div class="empty">
        Select a note from the left or create a new one to begin.
      </div>
    `;
    return;
  }

  if (state.loading) {
    hostEl.innerHTML = `<div class="empty"><span class="loader" aria-hidden="true"></span> Loading…</div>`;
    return;
  }

  hostEl.innerHTML = `
    ${state.error ? `<div class="alert" role="alert">${state.error}</div>` : ''}

    <div class="editor-header">
      <input
        id="note-title"
        class="title-input"
        placeholder="Note title"
        value="${escapeAttr(state.title)}"
        aria-label="Note title"
      />
      <div style="display:flex; gap:8px;">
        <button id="cancel-btn" class="icon-btn ghost" title="Cancel">↩ Cancel</button>
        <button id="save-btn" class="primary-btn" title="Save note" ${state.saving ? 'disabled' : ''}>
          ${state.saving ? '<span class="loader" aria-hidden="true"></span>' : '💾'} Save
        </button>
      </div>
    </div>

    <textarea id="note-content" class="textarea" placeholder="Write your note here..." aria-label="Note content">${escapeHtml(state.content)}</textarea>
    <div class="helper-row">
      <span>${state.mode === 'create' ? 'Creating a new note' : 'Editing existing note'}</span>
      <span>${(state.content || '').length} chars</span>
    </div>
  `;

  hostEl.querySelector('#note-title').addEventListener('input', (e) => setState({ title: e.target.value }));
  hostEl.querySelector('#note-content').addEventListener('input', (e) => setState({ content: e.target.value }));
  hostEl.querySelector('#save-btn').addEventListener('click', onSave);
  hostEl.querySelector('#cancel-btn').addEventListener('click', onCancel);
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
  // basic attribute quote escaping
  return (s ?? '').toString().replaceAll('"', '&quot;');
}
