import React, { useEffect, useState } from 'https://esm.sh/react@18';
import { daysUntil, getCurrentTime } from '../utils/dates.js';

/**
 * Dashboard shows exam countdowns, progress bars and gamification stats.
 * Progress values are mock values; in a real application they would
 * reflect the student’s actual progress stored in localStorage.
 */
export default function Dashboard({ subjects, language, t }) {
  // Show a clock that updates every second
  const [clock, setClock] = useState(getCurrentTime(language === 'en' ? 'en-US' : 'ar-SA'));
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getCurrentTime(language === 'en' ? 'en-US' : 'ar-SA'));
    }, 1000);
    return () => clearInterval(timer);
  }, [language]);

  // Mock motivational quote
  const quote =
    language === 'en'
      ? 'Success is the journey, not the destination.'
      : 'النجاح هو الرحلة، وليس الوجهة.';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('dashboard.title')}</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {clock} | {quote}
        </div>
      </div>
      {/* Exam Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subj) => {
          const days = daysUntil(subj.examDate);
          return (
            <div
              key={subj.key}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-2"
              aria-label={`${subj.name} countdown`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${subj.colorClass}`}
                >
                  {language === 'en' ? subj.name : subj.arabic}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {days} {t('common.daysLeft')}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{days}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('common.daysUntilExam')}
              </div>
            </div>
          );
        })}
      </div>
      {/* Subject Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subj) => {
          // Derive a mock progress percentage based on subject index
          const progress = 40 + subjects.indexOf(subj) * 15;
          const topics = 10 + subjects.indexOf(subj) * 2;
          const completed = Math.floor((progress / 100) * topics);
          const papers = 3 + subjects.indexOf(subj);
          const points = progress * 10;
          return (
            <div key={subj.key} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {language === 'en' ? subj.name : subj.arabic}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white ${subj.colorClass}`}
                >
                  {language === 'en' ? subj.arabic : subj.name}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${subj.colorClass} h-2 rounded-full`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {completed}/{topics}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{language === 'en' ? 'Topics' : 'موضوعات'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{papers}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{language === 'en' ? 'Papers' : 'أوراق'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{points}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('common.points')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Gamification summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('dashboard.yourProgress')}</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1230</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('common.points')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">🔥 5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('common.streak')}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['First Quiz', 'Streak 3 Days', '1000 Points'].map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium"
              >
                🏆 {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}