import './style.css';
import { router } from './router.js';
import { renderAppShell } from './ui/appShell.js';

// Initialize app shell and router
const root = document.getElementById('app');
renderAppShell(root);
router.init();
