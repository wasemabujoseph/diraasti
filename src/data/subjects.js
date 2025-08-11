// List of subjects, their names, colours and official PDF resources.
// Each PDF entry includes both English and Arabic titles and the URL to the
// official PDF.  If `comingSoon` is true, the PDF has not yet been
// published (as of 2025‑08‑09) and the UI will display "Coming Soon".

export const subjects = [
  {
    key: 'biology',
    name: 'Biology',
    arabic: 'أحياء',
    color: 'green',
    colorClass: 'bg-green-500',
    examDate: '2025-06-15',
    pdfs: [
      {
        id: 'bio-1',
        titleEn: 'Biology Part 1',
        titleAr: 'الفصل الأول',
        url:
          'https://www.nccd.gov.jo/EBV4.0/Root_Storage/AR/Science/2025/G12/1/%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%AA%D9%8A%D8%A9%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A%20%D8%B9%D8%B4%D8%B1%20%D8%AC%D8%B2%D8%A1%20%D8%A3%D9%88%D9%84%20%D8%AC%D8%AF%D9%8A%D8%AF.pdf',
        comingSoon: false
      },
      {
        id: 'bio-2',
        titleEn: 'Biology Part 2',
        titleAr: 'الفصل الثاني',
        url:
          'https://nccd.gov.jo/EBV4.0/Root_Storage/AR/Science/part%20%282%29%2010.12.2024/%D8%AB%D8%A7%D9%86%D9%8A%20%D8%B9%D8%B4%D8%B1/%20%D8%B9%D9%84%D9%88%D9%85%20%D8%AD%D9%8A%D8%A7%D8%AA%D9%8A%D8%A9%2012%20%D8%B7%D8%A7%D9%84%D8%A8%20%D8%AC%D9%A2%20.pdf',
        comingSoon: false
      }
    ]
  },
  {
    key: 'chemistry',
    name: 'Chemistry',
    arabic: 'كيمياء',
    color: 'blue',
    colorClass: 'bg-blue-500',
    examDate: '2025-06-10',
    pdfs: [
      {
        id: 'chem-1',
        titleEn: 'Chemistry Part 1',
        titleAr: 'الفصل الأول',
        url:
          'https://nccd.gov.jo/EBV4.0/Root_Storage/AR/Science/2025/G12/1/%D9%83%D9%8A%D9%85%D9%8A%D8%A7%D8%A1%20%D8%AB%D8%A7%D9%86%D9%8A%20%D8%B9%D8%B4%D8%B1%20%D8%A7%D9%84%D8%AC%D8%B2%D8%A1%20%D8%A7%D9%84%D8%A3%D9%88%D9%84%20%D8%AC%D8%AF%D9%8A%D8%AF%20M%20.pdf',
        comingSoon: false
      },
      {
        id: 'chem-2',
        titleEn: 'Chemistry Part 2',
        titleAr: 'الفصل الثاني',
        url:
          'https://nccd.gov.jo/EBV4.0/Root_Storage/AR/Science/part%20%282%29%2010.12.2024/%D8%AB%D8%A7%D9%86%D9%8A%20%D8%B9%D8%B4%D8%B1/%D9%83%D9%8A%D9%85%D9%8A%D8%A7%D8%A1%20%D8%AB%D8%A7%D9%86%D9%8A%20%D8%B9%D8%B4%D8%B1%20%D8%A7%D9%84%D8%AC%D8%B2%D8%A1%20%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A.pdf',
        comingSoon: false
      }
    ]
  },
  {
    key: 'english',
    name: 'Advanced English',
    arabic: 'إنجليزي متقدم',
    color: 'purple',
    colorClass: 'bg-purple-500',
    examDate: '2025-06-20',
    pdfs: [
      {
        id: 'eng-1',
        titleEn: 'Jordan High Note G12 – Semester 1 (Student’s Book)',
        titleAr: 'الفصل الأول',
        url:
          'https://nccd.gov.jo/EBV4.0/Root_Storage/EN/2025/G12/1/Jordan-High%20Note-G12-S1-SB.pdf',
        comingSoon: false
      },
      {
        id: 'eng-2',
        titleEn: 'Jordan High Note G12 – Semester 2',
        titleAr: 'الفصل الثاني',
        url: '',
        comingSoon: true
      }
    ]
  },
  {
    key: 'elective',
    name: 'Financial Literacy',
    arabic: 'الثقافة المالية',
    color: 'orange',
    colorClass: 'bg-orange-500',
    examDate: '2025-06-25',
    pdfs: [
      {
        id: 'fin-1',
        titleEn: 'Financial Literacy – Part 1',
        titleAr: 'الفصل الأول',
        url:
          'https://www.nccd.gov.jo/EBV4.0/Root_Storage/AR/%D9%85%D8%A7%D9%84%D9%8A%D8%A9/G12/1/%D8%A7%D9%84%D8%AB%D9%82%D8%A7%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%D9%8A%D8%A9%2012%20%D9%811%20small%20file.pdf',
        comingSoon: false
      },
      {
        id: 'fin-2',
        titleEn: 'Financial Literacy – Part 2',
        titleAr: 'الفصل الثاني',
        url: '',
        comingSoon: true
      }
    ]
  }
];