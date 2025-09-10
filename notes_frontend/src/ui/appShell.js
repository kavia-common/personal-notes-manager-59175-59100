/**
 * App shell: header, layout, and route handling.
 */

import { router } from '../router.js';
import { NotesList } from './notesList.js';
import { NoteEditor } from './noteEditor.js';

// PUBLIC_INTERFACE
export function renderAppShell(root) {
  /** Render static shell */
  root.innerHTML = `
    <div class="app-shell">
      <header class="header">
        <div class="brand">
          <div class="brand-badge" aria-hidden="true">N</div>
          <h1 class="brand-title">Personal Notes Manager</h1>
        </div>
        <div class="toolbar">
          <button class="primary-btn" id="new-note-btn" title="Create a new note">➕ New Note</button>
        </div>
      </header>

      <div class="layout">
        <aside class="panel" id="sidebar">
          <div class="search-row">
            <input id="search-input" class="input" placeholder="Search notes..." aria-label="Search notes" />
            <button id="clear-search" class="icon-btn" title="Clear search">✖</button>
          </div>
          <div id="notes-list" class="notes-list" aria-live="polite"></div>
        </aside>

        <main class="panel" id="main">
          <div id="route-container"></div>
        </main>
      </div>
    </div>
  `;

  // Event bindings
  const newBtn = root.querySelector('#new-note-btn');
  const searchInput = root.querySelector('#search-input');
  const clearSearch = root.querySelector('#clear-search');

  newBtn.addEventListener('click', () => router.push('#/new'));
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    NotesList.refresh('');
  });
  searchInput.addEventListener('input', (e) => NotesList.refresh(e.target.value || ''));

  // Render initial sidebar list
  NotesList.mount(root.querySelector('#notes-list'));

  // Route changes
  window.addEventListener('app:route', (ev) => {
    const { hash } = ev.detail;
    const { name, params } = router.parse(hash);
    const container = root.querySelector('#route-container');
    if (name === 'new') {
      NoteEditor.mount(container, { mode: 'create' });
    } else if (name === 'edit') {
      NoteEditor.mount(container, { mode: 'edit', id: params.id });
    } else {
      // default landing: hint
      NoteEditor.mount(container, { mode: 'welcome' });
    }
  });
}
