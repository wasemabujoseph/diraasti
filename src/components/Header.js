import React from 'https://esm.sh/react@18';

/**
 * Top navigation bar for the application.  Shows the logo, title,
 * language and theme toggles, user account and a key setup button for
 * Gemini API.  All buttons are keyboard accessible and include
 * descriptive aria labels.
 */
export default function Header({
  language,
  toggleLanguage,
  darkMode,
  toggleDarkMode,
  user,
  onLogin,
  onLogout,
  onShowKeyModal,
  t
}) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="assets/logo.svg" alt="Diraasti logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Diraasti</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tawjihi 2008</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 lg:mt-0">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
            aria-label="Change language"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              // Sun icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={onShowKeyModal}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm focus:outline-none focus:ring focus:ring-purple-300"
          >
            Gemini Key
          </button>
          {user ? (
            <div className="relative group">
              <button
                className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring focus:ring-blue-400"
              >
                <span>{user.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-all z-10">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring focus:ring-blue-400"
            >
              {t('auth.signIn')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}