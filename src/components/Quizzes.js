import React, { useState } from 'https://esm.sh/react@18';
import { geminiQuiz } from '../ai/gemini.js';

/**
 * Quiz component that supports local sample quizzes and AI‑generated quizzes.
 * AI quizzes require a valid Gemini API key.  After submission the user
 * sees explanations for each question.  Results are not persisted in
 * this simplified implementation.
 */
export default function Quizzes({ subjects, language, t }) {
  const [subjectKey, setSubjectKey] = useState(subjects[0].key);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Sample local quiz questions.  Each question has translations for
  // English and Arabic, four options, a 0‑based correct index and
  // explanations in both languages.
  const localSamples = [
    {
      question: {
        en: 'What is the chemical formula for water?',
        ar: 'ما هو الصيغة الكيميائية للماء؟'
      },
      options: ['H₂O', 'CO₂', 'O₂', 'NaCl'],
      correct: 0,
      explanation: {
        en: 'Water consists of two hydrogen atoms and one oxygen atom.',
        ar: 'يتكون الماء من ذرتين من الهيدروجين وذرة واحدة من الأكسجين.'
      }
    },
    {
      question: {
        en: 'Which organelle is known as the powerhouse of the cell?',
        ar: 'أي عضيّة تُعرف بأنها محطة الطاقة للخلية؟'
      },
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'],
      correct: 1,
      explanation: {
        en: 'Mitochondria produce ATP through cellular respiration.',
        ar: 'الميتوكوندريا تنتج ATP من خلال التنفس الخلوي.'
      }
    },
    {
      question: {
        en: "Choose the correct passive voice: 'The book ___ by Sarah.'",
        ar: "اختر الصيغة المبنية للمجهول: 'الكتاب ___ بواسطة سارة.'"
      },
      options: ['was written', 'wrote', 'is writing', 'has wrote'],
      correct: 0,
      explanation: {
        en: "Passive voice uses 'be' + past participle.",
        ar: "المبني للمجهول يستخدم 'يكون' + اسم المفعول."
      }
    }
  ];

  function startLocalQuiz() {
    setQuestions(localSamples);
    setAnswers(new Array(localSamples.length).fill(null));
    setSubmitted(false);
    setCurrentIndex(0);
  }

  async function startAiQuiz() {
    setLoading(true);
    try {
      const result = await geminiQuiz({ subject: subjectKey, count: 5 });
      setQuestions(result);
      setAnswers(new Array(result.length).fill(null));
      setSubmitted(false);
      setCurrentIndex(0);
    } catch (err) {
      alert('Error generating quiz. Make sure your API key is set and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelect(index) {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  }

  function submitQuiz() {
    setSubmitted(true);
  }

  const currentQuestion = questions[currentIndex];
  // Determine if AI questions are plain strings or objects
  const isAiQuiz = questions.length > 0 && typeof currentQuestion?.question === 'string';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('quizzes.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold">{t('quizzes.generateQuiz')}</h3>
            <select
              value={subjectKey}
              onChange={(e) => setSubjectKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {subjects.map((s) => (
                <option key={s.key} value={s.key}>
                  {language === 'en' ? s.name : s.arabic}
                </option>
              ))}
            </select>
            <button
              onClick={startAiQuiz}
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-blue-400 disabled:opacity-50"
            >
              AI Quiz
            </button>
            <button
              onClick={startLocalQuiz}
              className="w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition focus:outline-none focus:ring focus:ring-gray-400"
            >
              Local Quiz
            </button>
          </div>
        </div>
        <div className="lg:col-span-3">
          {questions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold mb-2">{t('quizzes.noQuiz')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('quizzes.startQuiz')}</p>
              <button
                onClick={startLocalQuiz}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition focus:outline-none focus:ring focus:ring-blue-400"
              >
                {t('quizzes.startQuiz')}
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {currentIndex + 1} / {questions.length}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? subjects.find((s) => s.key === subjectKey).name : subjects.find((s) => s.key === subjectKey).arabic}
                </div>
              </div>
              <div>
                <p className="text-lg mb-4">
                  {isAiQuiz
                    ? currentQuestion.question
                    : language === 'en'
                    ? currentQuestion.question.en
                    : currentQuestion.question.ar}
                </p>
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                        submitted
                          ? idx === currentQuestion.correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : idx === answers[currentIndex]
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz"
                        checked={answers[currentIndex] === idx}
                        onChange={() => handleAnswerSelect(idx)}
                        disabled={submitted}
                        className="mr-3"
                      />
                      {opt}
                      {submitted && idx === currentQuestion.correct && (
                        <span className="ml-auto text-green-500 font-bold">✓</span>
                      )}
                      {submitted && idx === answers[currentIndex] && idx !== currentQuestion.correct && (
                        <span className="ml-auto text-red-500 font-bold">✗</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
              {submitted && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                    {t('common.explanation')}
                  </h4>
                  <p className="text-blue-700 dark:text-blue-400">
                    {isAiQuiz
                      ? currentQuestion.explanation
                      : language === 'en'
                      ? currentQuestion.explanation.en
                      : currentQuestion.explanation.ar}
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring focus:ring-gray-400"
                >
                  {t('common.previous')}
                </button>
                {!submitted ? (
                  currentIndex === questions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      disabled={answers[currentIndex] === null}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring focus:ring-green-400"
                    >
                      {t('common.submit')}
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                      disabled={answers[currentIndex] === null}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring focus:ring-blue-400"
                    >
                      {t('common.next')}
                    </button>
                  )
                ) : currentIndex === questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setQuestions([]);
                      setAnswers([]);
                      setSubmitted(false);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    {t('common.finish')}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    {t('common.next')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}