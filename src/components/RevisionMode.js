import React, { useState } from 'https://esm.sh/react@18';

/**
 * Revision Mode provides flashcards and a spaced repetition schedule.
 * Users can flip through cards and mark them as learned.  A static
 * schedule gives an example of spaced repetition.
 */
export default function RevisionMode({ language, t }) {
  const [flashcards, setFlashcards] = useState([
    {
      front: { en: "Avogadro's Number", ar: 'عدد أفوجادرو' },
      back: { en: '6.022 × 10²³ particles per mole', ar: '6.022 × 10²³ جسيم لكل مول' }
    },
    {
      front: { en: 'Photosynthesis Equation', ar: 'معادلة البناء الضوئي' },
      back: { en: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', ar: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' }
    },
    {
      front: { en: 'Passive Voice Structure', ar: 'تركيب المبني للمجهول' },
      back: { en: 'Subject + be + past participle', ar: 'المفعول به + الفعل المساعد + اسم المفعول' }
    }
  ]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  function nextCard() {
    setFlipped(false);
    setIndex((index + 1) % flashcards.length);
  }
  function prevCard() {
    setFlipped(false);
    setIndex((index - 1 + flashcards.length) % flashcards.length);
  }
  function shuffleCards() {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setIndex(0);
    setFlipped(false);
  }
  const card = flashcards[index];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('revision.title')}</h2>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <button
          onClick={prevCard}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-400"
        >
          ←
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition focus:outline-none focus:ring focus:ring-blue-400"
        >
          {flipped ? (language === 'en' ? 'Hide Card' : 'إخفاء البطاقة') : language === 'en' ? 'Show Card' : 'إظهار البطاقة'}
        </button>
        <button
          onClick={nextCard}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-400"
        >
          →
        </button>
        <button
          onClick={shuffleCards}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
        >
          ⟳
        </button>
      </div>
      {flipped && (
        <div className="flex justify-center">
          <div className="flashcard w-full max-w-md cursor-pointer" onClick={() => setFlipped(!flipped)}>
            <div className="flashcard-inner">
              <div className="flashcard-front"></div>
              <div className="flashcard-back"></div>
            </div>
          </div>
        </div>
      )}
      {/* Simple representation of card content */}
      {!flipped ? (
        <div className="text-center p-6 bg-blue-500 text-white rounded-xl">
          <h3 className="text-xl font-bold mb-2">{language === 'en' ? 'Term' : 'مصطلح'}</h3>
          <p className="text-lg">{language === 'en' ? card.front.en : card.front.ar}</p>
        </div>
      ) : (
        <div className="text-center p-6 bg-green-500 text-white rounded-xl">
          <h3 className="text-xl font-bold mb-2">{language === 'en' ? 'Definition' : 'تعريف'}</h3>
          <p className="text-lg">{language === 'en' ? card.back.en : card.back.ar}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-4">Spaced Repetition Schedule</h3>
          <div className="space-y-3 text-sm">
            {[
              { subject: 'Chemistry', topic: 'Thermodynamics', due: language === 'en' ? 'Today' : 'اليوم' },
              { subject: 'Biology', topic: 'Genetics', due: language === 'en' ? 'Tomorrow' : 'غداً' },
              { subject: 'English', topic: 'Essay writing', due: language === 'en' ? 'In 3 days' : 'بعد 3 أيام' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? item.subject : item.subject}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.topic}</div>
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.due}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-4">Weekly Revision Plan</h3>
          <div className="space-y-2 text-sm">
            {[
              { day: language === 'en' ? 'Monday' : 'الاثنين', plan: language === 'en' ? 'Chemistry Ch 3–4' : 'كيمياء 3–4' },
              { day: language === 'en' ? 'Tuesday' : 'الثلاثاء', plan: language === 'en' ? 'Biology Ch 5–6' : 'أحياء 5–6' },
              { day: language === 'en' ? 'Wednesday' : 'الأربعاء', plan: language === 'en' ? 'English Essay Practice' : 'اللغة الإنجليزية: ممارسة المقالة' },
              { day: language === 'en' ? 'Friday' : 'الجمعة', plan: language === 'en' ? 'Full Mock Exam' : 'اختبار تجريبي كامل' }
            ].map((item, i) => (
              <div key={i} className={`flex justify-between p-2 rounded ${
                i === 0
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : i === 1
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : i === 2
                  ? 'bg-purple-50 dark:bg-purple-900/20'
                  : 'bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <span>{item.day}</span>
                <span>{item.plan}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}