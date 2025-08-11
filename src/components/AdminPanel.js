import React, { useState } from 'https://esm.sh/react@18';

/**
 * AdminPanel provides a read‑only snapshot of student progress,
 * plus simple forms to upload new resources and broadcast announcements.
 * All interactions occur in the client only; no server storage.
 */
export default function AdminPanel({ subjects, language, t }) {
  // Sample students with mock progress per subject. In a full
  // implementation this data could be loaded from localStorage or an
  // external source. Here we hard‑code a few entries.
  const students = [
    { name: 'Ahmed Ali', chem: 65, bio: 45, eng: 78, points: 1250 },
    { name: 'Layla Hassan', chem: 80, bio: 72, eng: 85, points: 1890 },
    { name: 'Omar Khalid', chem: 45, bio: 58, eng: 62, points: 920 }
  ];

  // State for resource upload form
  const [uploadSubject, setUploadSubject] = useState(subjects[0]?.key || '');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // State for announcements
  const [announcement, setAnnouncement] = useState('');

  // Download student data as CSV. This constructs a CSV string and
  // triggers a download by creating a temporary link.
  function downloadCsv() {
    const header = ['Name', 'Chemistry', 'Biology', 'English', 'Points'];
    const rows = students.map((s) => [s.name, s.chem, s.bio, s.eng, s.points]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-progress.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  // Handle resource upload. For now we just show an alert; in a real
  // application you could add the file to localStorage or send to a
  // backend. Reset fields after uploading.
  function handleUpload(e) {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      alert('Please provide a title and select a file.');
      return;
    }
    alert(`Uploaded ${uploadTitle} for subject ${uploadSubject}.`);
    setUploadTitle('');
    setUploadFile(null);
    // Reset file input value by resetting the key
  }

  // Handle announcement submission. Shows a simple alert and clears the
  // input. In a future version this could append to a list of
  // announcements stored in localStorage.
  function sendAnnouncement() {
    if (!announcement.trim()) {
      alert('Enter a message before sending.');
      return;
    }
    alert(`Announcement sent: ${announcement}`);
    setAnnouncement('');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {t('admin.title')}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Student Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {t('admin.progressOverview')}
              </h3>
              <button
                onClick={downloadCsv}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm focus:outline-none focus:ring focus:ring-green-400"
              >
                CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 text-left">{language === 'en' ? 'Name' : 'الاسم'}</th>
                    <th className="py-2 text-left">{language === 'en' ? 'Chemistry' : 'كيمياء'}</th>
                    <th className="py-2 text-left">{language === 'en' ? 'Biology' : 'أحياء'}</th>
                    <th className="py-2 text-left">{language === 'en' ? 'English' : 'إنجليزي'}</th>
                    <th className="py-2 text-left">{t('common.points')}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="py-3 font-medium">{student.name}</td>
                      <td className="py-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${student.chem}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{student.chem}%</div>
                      </td>
                      <td className="py-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${student.bio}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{student.bio}%</div>
                      </td>
                      <td className="py-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${student.eng}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{student.eng}%</div>
                      </td>
                      <td className="py-3 font-medium">{student.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right: Resource upload and Announcement */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {t('admin.uploadResource')}
            </h3>
            <form className="space-y-3" onSubmit={handleUpload}>
              <select
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {subjects.map((s) => (
                  <option key={s.key} value={s.key}>
                    {language === 'en' ? s.name : s.arabic}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder={language === 'en' ? 'Resource title' : 'عنوان المورد'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-green-400"
              >
                {language === 'en' ? 'Upload' : 'تحميل'}
              </button>
            </form>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {t('admin.sendAnnouncement')}
            </h3>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder={language === 'en' ? 'Write an announcement...' : 'اكتب إعلاناً...'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white h-32"
            ></textarea>
            <button
              onClick={sendAnnouncement}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-blue-400"
            >
              {language === 'en' ? 'Send' : 'إرسال'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}