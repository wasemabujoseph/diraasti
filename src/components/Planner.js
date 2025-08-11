import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { load, save } from '../utils/storage.js';
import { exportPlannerToPdf } from '../utils/export.js';

/**
 * Study Planner component.  Provides day/week views and allows users to
 * add simple tasks tied to subjects.  Tasks persist in localStorage.
 */
export default function Planner({ subjects, language, t }) {
  const [view, setView] = useState('week');
  const [tasks, setTasks] = useState(() => load('plannerTasks', []));
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  });

  useEffect(() => {
    save('plannerTasks', tasks);
  }, [tasks]);

  // Helper to add a new task via prompt (simple UX)
  function handleAddTask() {
    const subjectKey = prompt('Enter subject key (e.g. chemistry, biology)');
    const title = prompt('Enter task description');
    const date = prompt('Date (YYYY‑MM‑DD)', selectedDate);
    if (!subjectKey || !title || !date) return;
    const subject = subjects.find((s) => s.key === subjectKey);
    const color = subject ? subject.colorClass : 'bg-gray-500';
    const newTask = { id: Date.now(), subjectKey, title, date, color };
    setTasks([...tasks, newTask]);
  }

  // Filter tasks by selected date (for day view) or week (for week view)
  function tasksForDay(dateStr) {
    return tasks.filter((task) => task.date === dateStr);
  }

  function tasksForWeek() {
    const start = new Date(selectedDate);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() - start.getDay() + i); // start of week Sunday
      const iso = d.toISOString().substring(0, 10);
      week.push({ date: iso, tasks: tasksForDay(iso) });
    }
    return week;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('planner.title')}</h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {['day', 'week', 'month', 'year'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-blue-400 ${
                view === v
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t(`planner.${v}`)}
            </button>
          ))}
          <button
            onClick={() => exportPlannerToPdf('planner-container', 'diraasti-planner.pdf')}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-green-400"
          >
            {t('planner.export')}
          </button>
          <button
            onClick={handleAddTask}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-purple-400"
          >
            +
          </button>
        </div>
      </div>
      <div id="planner-container" className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm overflow-x-auto">
        {view === 'day' && (
          <div>
            <div className="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <label htmlFor="planner-date" className="text-sm font-medium">
                Date:
              </label>
              <input
                id="planner-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <ul className="space-y-2">
              {tasksForDay(selectedDate).map((task) => (
                <li
                  key={task.id}
                  className={`p-3 rounded text-white ${task.color} flex justify-between items-center`}
                >
                  <span>{task.title}</span>
                  <button
                    onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                    aria-label="Delete task"
                    className="ml-2 text-sm text-red-200 hover:text-red-50"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {tasksForDay(selectedDate).length === 0 && (
                <li className="text-gray-500 dark:text-gray-400 text-sm">No tasks for this day.</li>
              )}
            </ul>
          </div>
        )}
        {view === 'week' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 border border-gray-300 dark:border-gray-600">Date</th>
                  <th className="px-2 py-1 border border-gray-300 dark:border-gray-600">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {tasksForWeek().map(({ date, tasks: dayTasks }) => (
                  <tr key={date} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 font-mono">
                      {date}
                    </td>
                    <td className="px-2 py-1 border border-gray-300 dark:border-gray-600">
                      {dayTasks.length > 0 ? (
                        <ul className="space-y-1">
                          {dayTasks.map((task) => (
                            <li
                              key={task.id}
                              className={`inline-block px-2 py-1 text-xs text-white ${task.color} rounded`}
                            >
                              {task.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {view !== 'day' && view !== 'week' && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{view} view is under construction.</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{t('planner.dragHint')}</p>
      </div>
    </div>
  );
}