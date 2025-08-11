import React from 'https://esm.sh/react@18';

/**
 * Sidebar component listing navigation tabs.  Active tab is highlighted
 * and clicking on a tab will trigger a change via onSelect callback.  The
 * caller decides which tabs to render (e.g. hide admin for non‑admins).
 */
export default function Sidebar({ navItems, activeTab, onSelect }) {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-right px-4 py-3 rounded-lg flex items-center space-x-3 rtl:space-x-reverse transition focus:outline-none focus:ring focus:ring-blue-400 ${
              activeTab === item.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}