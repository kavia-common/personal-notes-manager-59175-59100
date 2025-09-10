//
// Simple hash-based router for two views: list and editor
//

// PUBLIC_INTERFACE
export const router = {
  /**
   * Initialize router: attach event listeners and handle initial route.
   */
  init() {
    window.addEventListener('hashchange', this._onRouteChange.bind(this));
    this._onRouteChange();
  },

  /**
   * Navigate programmatically.
   * @param {string} path - e.g., "#/new" or "#/edit/<id>"
   */
  // PUBLIC_INTERFACE
  push(path) {
    window.location.hash = path;
  },

  _onRouteChange() {
    const hash = window.location.hash || '#/';
    const event = new CustomEvent('app:route', { detail: { hash } });
    window.dispatchEvent(event);
  },

  /**
   * Parse route parameters.
   * - "#/": list
   * - "#/new": create form
   * - "#/edit/:id": edit form
   */
  // PUBLIC_INTERFACE
  parse(hash) {
    const clean = (hash || '#/').replace(/^#/, '');
    const parts = clean.split('/').filter(Boolean);

    if (parts.length === 0) return { name: 'list', params: {} };
    if (parts[0] === 'new') return { name: 'new', params: {} };
    if (parts[0] === 'edit' && parts[1]) return { name: 'edit', params: { id: parts[1] } };

    return { name: 'list', params: {} };
  },
};
