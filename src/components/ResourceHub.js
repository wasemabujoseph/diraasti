import React, { useState } from 'https://esm.sh/react@18';
import { save, load } from '../utils/storage.js';

/**
 * Resource Hub displays official subject PDFs and allows users to
 * upload their own files for quick access.  It also includes a search
 * section and an AI assistant teaser.  Only static embedding of PDFs is
 * supported; AI calls to summarise PDFs occur in the AI tab.
 */
export default function ResourceHub({ subjects, language, t }) {
  // Manage uploaded files locally
  const [uploads, setUploads] = useState(() => load('userUploads', []));
  const [previewUrl, setPreviewUrl] = useState(null);
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const newFile = { name: file.name, id: Date.now() };
      const updated = [...uploads, newFile];
      setUploads(updated);
      save('userUploads', updated);
    }
  }
  function removeUpload(id) {
    const updated = uploads.filter((f) => f.id !== id);
    setUploads(updated);
    save('userUploads', updated);
  }
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('resources.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: uploads and files */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{t('resources.uploadResources')}</h3>
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer">
                {t('common.uploadFile')}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
            </div>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-gray-600 dark:text-gray-400">
              {t('resources.uploadResources')} ({t('common.uploadFile')})
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">{t('resources.yourFiles')}</h3>
            {uploads.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No files uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {uploads.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">PDF</span>
                      </div>
                      <span className="font-medium truncate" title={file.name}>{file.name}</span>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => alert('Previewing local uploads is not implemented.')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                      >
                        {t('common.preview')}
                      </button>
                      <button
                        onClick={() => removeUpload(file.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Right column: AI assistant and search */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">{t('resources.aiAssistant')}</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-4">
              Select text in a PDF and use the AI tab to ask for explanations.
            </div>
            <button
              onClick={() => alert('Use the AI tab to ask questions about files.')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-purple-400"
            >
              Ask AI About File
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">{t('resources.searchResources')}</h3>
            <div className="space-y-3">
              <select
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
                placeholder="Search for topics..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-green-400">
                {t('common.search')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Subject PDF cards */}
      <div className="space-y-4">
        {subjects.map((subj) => (
          <div key={subj.key} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
              {language === 'en' ? subj.name : subj.arabic}
            </h3>
            <div className="space-y-2">
              {subj.pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 dark:border-gray-700 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {language === 'en' ? pdf.titleEn : pdf.titleAr}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex space-x-2 rtl:space-x-reverse">
                    {pdf.comingSoon ? (
                      <span className="italic text-gray-500 dark:text-gray-400 text-sm">
                        {t('common.comingSoon')}
                      </span>
                    ) : (
                      <>
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          {t('common.open')}
                        </a>
                        <button
                          onClick={() => setPreviewUrl(previewUrl === pdf.url ? null : pdf.url)}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
                        >
                          {t('common.preview')}
                        </button>
                        <a
                          href={pdf.url}
                          download
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        >
                          {t('common.download')}
                        </a>
                      </>
                    )}
                  </div>
                  {/* PDF Preview */}
                  {previewUrl === pdf.url && (
                    <div className="mt-4 w-full h-64">
                      <iframe
                        src={pdf.url}
                        title={pdf.titleEn}
                        className="w-full h-full border border-gray-200 dark:border-gray-700 rounded"
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}