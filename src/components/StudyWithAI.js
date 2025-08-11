import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18';
import { geminiChat } from '../ai/gemini.js';

/**
 * AI chat interface.  Allows students to ask questions and get
 * contextual answers from Google Gemini.  Requires a valid API key.
 */
export default function StudyWithAI({ language, t }) {
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  async function sendMessage() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const newHistory = [...history, { sender: 'user', text: trimmed }];
    setHistory(newHistory);
    setInputText('');
    setLoading(true);
    try {
      const reply = await geminiChat(newHistory);
      setHistory([...newHistory, { sender: 'ai', text: reply }]);
    } catch (err) {
      setHistory([...newHistory, { sender: 'ai', text: 'An error occurred. Please check your key.' }]);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    language === 'en' ? 'Explain stoichiometry concepts' : 'اشرح مفاهيم الكيمياء الحسابية',
    language === 'en' ? 'Help with essay structure' : 'ساعد في بنية المقال',
    language === 'en' ? 'Review cell biology' : 'راجع بيولوجيا الخلية',
    language === 'en' ? 'Practice past paper questions' : 'تدرب على أسئلة سابقة'
  ];

  const weakPoints = [
    language === 'en' ? 'Chemistry: Thermodynamics' : 'الكيمياء: الديناميكا الحرارية',
    language === 'en' ? 'Biology: Genetics' : 'الأحياء: الوراثة',
    language === 'en' ? 'English: Essay conclusion' : 'الإنجليزية: خاتمة المقال'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('ai.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4" id="chat-area">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>{t('ai.askAnything')}</p>
                </div>
              ) : (
                history.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white self-start'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              <div ref={chatEndRef}></div>
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder={language === 'en' ? 'Ask anything...' : 'اسأل أي شيء...'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring focus:ring-blue-400 disabled:opacity-50"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(action)}
                  className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition focus:outline-none focus:ring focus:ring-gray-400"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">{language === 'en' ? 'Your Weak Points' : 'نقاط ضعفك'}</h3>
            <div className="space-y-2 text-sm">
              {weakPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}