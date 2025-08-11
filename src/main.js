// Entry point for the React application.
// This file uses the React 18 client API to create the root and render
// the top‑level App component.  It is imported from index.html with
// type="module" so that the browser can resolve ESM imports.

import React from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import App from './App.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);