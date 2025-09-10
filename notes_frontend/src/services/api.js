/**
 * Placeholder API client for future backend integration.
 * Currently delegates to local storage to provide persistence.
 *
 * Configure backend by setting VITE_API_BASE_URL in .env (not committed).
 */

import { storage } from './storage.js';

// PUBLIC_INTERFACE
export const api = {
  /**
   * List notes (simulated request).
   * @returns {Promise<Array<{id:string,title:string,content:string,createdAt:number,updatedAt:number}>>}
   */
  async listNotes() {
    await delay(120);
    return storage.getAll();
  },

  /**
   * Get one note by id.
   * @param {string} id
   */
  async getNote(id) {
    await delay(80);
    return storage.get(id);
  },

  /**
   * Create a note.
   * @param {{title:string, content:string}} payload
   */
  async createNote(payload) {
    await delay(150);
    return storage.create(payload);
  },

  /**
   * Update a note.
   * @param {string} id
   * @param {{title:string, content:string}} payload
   */
  async updateNote(id, payload) {
    await delay(150);
    return storage.update(id, payload);
  },

  /**
   * Delete a note.
   * @param {string} id
   */
  async deleteNote(id) {
    await delay(100);
    return storage.remove(id);
  },
};

// PRIVATE helper; when backend exists, replace with fetch wrapper
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
