# Diraasti – Tawjihi Generation 2008

Diraasti (Arabic: دراستي) is a fully client‑side study platform designed for
Jordanian high‑school students born in **Generation 2008** preparing for
the 2025/2026 Tawjihi exams.  It is delivered as a static single‑page
application that can be hosted on GitHub Pages.  The goal is to help
students plan and revise their studies, practise through quizzes,
embed and search official PDF resources, and chat with an AI assistant
powered by Google Gemini.

## Features

* **Dashboard** – show exam countdowns, subject progress, points, streaks and
  badges.  Countdown dates can be edited in settings and are stored in
  local storage.  Progress bars update when topics or quizzes are marked
  complete.
* **Study Planner** – plan tasks by day, week, month or year.  Tasks
  persist in local storage, can be coloured per subject and exported
  as a PDF.  Drag‑and‑drop reordering is supported on modern browsers.
* **Resource Hub** – official Tawjihi PDFs are hard‑coded for Biology,
  Chemistry, Advanced English and the optional Financial Literacy subject.
  Each card provides **Open**, **Preview** and **Download** actions, and
  placeholders for “Coming Soon” where the Ministry has not yet published
  the material.  Students can also upload their own files (stored
  locally) and query selected text using the AI assistant.
* **Quizzes** – both local sample quizzes and AI‑generated quizzes with
  configurable difficulty and number of questions.  After submission,
  explanations are shown and results are saved for later review.
* **Study with AI** – chat with an assistant that uses the Google
  Generative AI API.  A modal prompts the user to paste their API key,
  which is stored in the browser’s `localStorage`.  The assistant
  supports contextual study plan generation, progress analysis and
  custom quizzes.  No keys are ever stored on the server.
* **Revision Mode** – flashcards with flip animations and spaced
  repetition lists help you strengthen memory.  Flashcards can be added
  manually or from AI responses.
* **Admin Panel** – a purely client‑side mock to visualise aggregated
  progress data and export CSV.  There are no server or database
  dependencies.
* **Internationalisation & RTL** – all UI text comes from
  `src/data/i18n.js`.  A language switcher persists the chosen language
  (English or Arabic).  When Arabic is active, the layout uses Tailwind’s
  `rtl:` utilities to mirror the UI.
* **Progressive Web App** – the project includes a `manifest.webmanifest`
  and a simple service worker to cache the application shell.  According
  to MDN, a PWA must include a manifest and (optionally) a service
  worker for offline behaviour【98473576973214†L155-L170】【87356029003546†L109-L123】.  The
  service worker caches static assets and ignores AI calls.
* **Accessibility (WCAG AA)** – focus states, labels, roles and colour
  contrast follow the Web Accessibility Initiative’s principles that
  content be perceivable, operable, understandable and robust【621273722001746†L107-L130】.

## Setup & Local Development

This repository is completely static – there are no build tools or
Node dependencies.  To develop locally you only need a web browser:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/diraasti-tawjihi-2008.git
   cd diraasti-tawjihi-2008
   ```
2. **Serve the files over HTTP** – because ESM modules and the service
   worker require a web origin.  You can use any lightweight static
   server:
   ```bash
   # using Python (3.x)
   python -m http.server 8000
   # or using Node.js if installed
   npx serve .
   ```
   Then open `http://localhost:8000` in your browser.
3. **Setting your Gemini API key** – click the **AI** tab or the
   **Key Setup** button.  A modal will prompt you to paste your
   Google Gemini API key (obtain it from your Google Cloud console).
   The key is stored in `localStorage` under `GEMINI_API_KEY`.  You can
   change or clear it at any time through the same modal.  No keys are
   ever transmitted to our servers.
4. **Saving and exporting data** – all user data (profile, planner
   tasks, quiz results, flashcards, API key and last‑opened tab) is
   stored in the browser.  Use the import/export feature under
   Settings to back up your data to a JSON file.

## Deployment to GitHub Pages

1. Create a new repository on GitHub called
   `diraasti-tawjihi-2008` (or any name you prefer).  Push the files to
   the `main` branch.
2. Create an empty `.nojekyll` file in the root of the repository
   (already included here) so GitHub Pages will serve files from the
   `src/` directory without Jekyll processing.
3. In the repository settings, scroll to **Pages** and choose the
   `main` branch as the source.  Set the root directory to `/` and
   save.  GitHub will build and publish your site at
   `https://<username>.github.io/<repo>/`.
4. After the site is live, open it in a browser.  Because the app
   registers a service worker, you may need to refresh a couple of
   times to update cached assets.  The PWA will prompt for
   installation once the manifest and service worker are present
   【98473576973214†L155-L170】.

## Adding Official PDFs

The file `src/data/subjects.js` defines the subjects and their official
Jordanian 2025/2026 curricula for **Generation 2008**.  This list
reflects the Ministry of Education’s updated pages dated **6 Aug 2025**.
Each PDF entry includes a URL and title.  Where the Ministry has not
yet published a chapter (for example, the second half of **Jordan
High Note G12** and **Financial Literacy** as of 9 Aug 2025), the
entry is marked as `comingSoon`.  Cards in the Resource Hub display
“Coming Soon” instead of preview/download buttons for those items.

## Gemini Integration

We use Google’s official Generative AI JavaScript SDK loaded from
ESM.  The wrapper in `src/ai/gemini.js` exposes three asynchronous
functions:

* `getGeminiClient()` – returns a configured Gemini client using the
  API key stored in `localStorage`.
* `geminiChat(messages)` – sends a list of chat messages and returns
  the assistant’s response.  It is used for the Study with AI chat.
* `geminiPlan(input)` – takes the user’s availability, priorities and
  exam countdown and returns a structured study plan.  The plan is
  consumed by the planner.
* `geminiQuiz(input)` – generates multiple‑choice questions with
  answers and explanations.  The quiz UI uses this function when the
  user selects “AI quiz”.

If any of these functions throw an error (missing/invalid key, network
issues, quota exhaustion), the UI shows a friendly error message and
does not crash.  Because AI calls are made from the browser, they
never hit our servers.

## Accessibility Notes

The interface follows [WCAG 2.1] recommendations.  Key points include:

* All inputs have associated `<label>` elements and descriptive `aria`
  attributes so that screen readers can announce them correctly.
* Buttons and interactive elements are keyboard accessible and have
  visible focus indicators (via Tailwind’s ring classes).  This
  implements the *operable* and *navigable* principles【621273722001746†L107-L130】.
* Colour palettes are chosen for sufficient contrast; dark mode uses
  higher contrast backgrounds.  Users can toggle themes and languages.
* Text alternatives are provided for icons and images.  The logo
  includes a `<title>` element describing it for assistive devices.

## Contribution

Contributions are welcome!  Please fork the repository and submit a
pull request.  When adding new features, ensure that they work in
both English and Arabic, meet basic accessibility requirements and
never store secrets on the server.