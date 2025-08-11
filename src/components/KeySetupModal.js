import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { save, load, remove } from '../utils/storage.js';

/**
 * Modal dialog that prompts the user to enter their Google Gemini API key.
 * The key is stored in localStorage under `GEMINI_API_KEY`.  Clearing
 * the key will remove it from storage.  The modal respects keyboard
 * navigation and closes on escape.
 */
export default function KeySetupModal({ isOpen, onClose }) {
  const [keyValue, setKeyValue] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Google Gemini API Key</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Paste your API key below. It will be stored in your browser only. You
          can obtain a key from your Google Cloud console.
        </p>
        <input
          type="text"
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="AIza..."
        />
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => {
              remove('GEMINI_API_KEY');
              setKeyValue('');
              onClose();
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring focus:ring-gray-400"
          >
            Clear
          </button>
          <button
            onClick={() => {
              if (keyValue) {
                localStorage.setItem('GEMINI_API_KEY', keyValue);
              }
              onClose();
            }}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}