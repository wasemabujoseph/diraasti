import React, { useState, useEffect } from 'https://esm.sh/react@18';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import Planner from './components/Planner.js';
import ResourceHub from './components/ResourceHub.js';
import Quizzes from './components/Quizzes.js';
import StudyWithAI from './components/StudyWithAI.js';
import RevisionMode from './components/RevisionMode.js';
import AdminPanel from './components/AdminPanel.js';
import KeySetupModal from './components/KeySetupModal.js';
import { i18n } from './data/i18n.js';
import { subjects } from './data/subjects.js';
import { load, save, remove } from './utils/storage.js';

/**
 * Top‑level application component.  Manages global state such as
 * language, theme, logged‑in user and current tab.  Persists state
 * across sessions via localStorage and handles RTL layout.
 */
export default function App() {
  // Load persisted settings or apply defaults
  const [darkMode, setDarkMode] = useState(() => load('darkMode', false));
  const [language, setLanguage] = useState(() => load('language', 'en'));
  const [user, setUser] = useState(() => load('user', null));
  const [activeTab, setActiveTab] = useState(() => load('activeTab', 'dashboard'));
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Update HTML dir and lang attributes based on language
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Persist dark mode, language, user and active tab to localStorage
  useEffect(() => {
    save('darkMode', darkMode);
  }, [darkMode]);
  useEffect(() => {
    save('language', language);
  }, [language]);
  useEffect(() => {
    save('user', user);
  }, [user]);
  useEffect(() => {
    save('activeTab', activeTab);
  }, [activeTab]);

  // Apply Tailwind dark mode class to <html>.  Tailwind uses the
  // presence of a `dark` class to switch variants.  We toggle this
  // class whenever darkMode changes.
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Translation helper: given a dotted key path, return the string
  // from the i18n dictionary for the current language.  Falls back to
  // English if a key is missing.  If no translation exists, returns
  // the key itself.
  function t(path) {
    const parts = path.split('.');
    let current = i18n[language];
    let fallback = i18n.en;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = undefined;
      }
      if (fallback && typeof fallback === 'object' && part in fallback) {
        fallback = fallback[part];
      } else {
        fallback = undefined;
      }
    }
    return current ?? fallback ?? path;
  }

  // Toggle language between English and Arabic
  function toggleLanguage() {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  }

  // Toggle dark mode
  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  // Handle user login.  Determine role based on email: if the email
  // contains "admin" then grant admin privileges; otherwise student.
  function handleLogin(userInfo) {
    const role = userInfo.email && userInfo.email.toLowerCase().includes('admin') ? 'admin' : 'student';
    const newUser = { ...userInfo, role };
    setUser(newUser);
    setActiveTab('dashboard');
  }

  // Logout resets user state and returns to login tab
  function handleLogout() {
    setUser(null);
    remove('user');
    setActiveTab('dashboard');
  }

  // Determine navigation items.  Admin tab is shown only for users
  // whose role is 'admin'.  Icons use simple emoji for clarity.
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: '📊' },
    { id: 'planner', label: t('nav.planner'), icon: '📅' },
    { id: 'resources', label: t('nav.resources'), icon: '📚' },
    { id: 'quizzes', label: t('nav.quizzes'), icon: '📝' },
    { id: 'ai', label: t('nav.ai'), icon: '🤖' },
    { id: 'revision', label: t('nav.revision'), icon: '🔁' }
  ];
  if (user && user.role === 'admin') {
    navItems.push({ id: 'admin', label: t('nav.admin'), icon: '👨‍🏫' });
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Outer container ensures min‑height and background */}
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <Header
          language={language}
          toggleLanguage={toggleLanguage}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={user}
          onLogin={() => setActiveTab('login')}
          onLogout={handleLogout}
          onShowKeyModal={() => setShowKeyModal(true)}
          t={t}
        />
        {/* Main content: login or application */}
        {!user ? (
          <Login t={t} onSubmit={handleLogin} />
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar for navigation */}
            <Sidebar navItems={navItems} activeTab={activeTab} onSelect={setActiveTab} />
            {/* Page content */}
            <main className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'dashboard' && <Dashboard subjects={subjects} language={language} t={t} />}
              {activeTab === 'planner' && <Planner subjects={subjects} language={language} t={t} />}
              {activeTab === 'resources' && <ResourceHub subjects={subjects} language={language} t={t} />}
              {activeTab === 'quizzes' && <Quizzes subjects={subjects} language={language} t={t} />}
              {activeTab === 'ai' && <StudyWithAI language={language} t={t} />}
              {activeTab === 'revision' && <RevisionMode language={language} t={t} />}
              {activeTab === 'admin' && user.role === 'admin' && (
                <AdminPanel subjects={subjects} language={language} t={t} />
              )}
            </main>
          </div>
        )}
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Diraasti – Tawjihi Generation 2008 | AI‑Powered Study Platform
            </div>
          </div>
        </footer>
        {/* Gemini key setup modal */}
        <KeySetupModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
      </div>
    </div>
  );
}