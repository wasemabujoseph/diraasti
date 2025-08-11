import React, { useState } from 'https://esm.sh/react@18';

/**
 * Login screen used when no user is present.  This is a mock login and
 * accepts any credentials.  It displays translated labels via the provided
 * translation function.
 */
export default function Login({ t, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: email.split('@')[0] || 'Student', email });
    setEmail('');
    setPassword('');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img src="assets/logo.svg" alt="Logo" className="mx-auto w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('auth.welcome')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('auth.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring focus:ring-blue-400"
          >
            {t('auth.signIn')}
          </button>
        </form>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">Demo credentials: any email and password.</p>
      </div>
    </div>
  );
}