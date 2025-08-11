// Wrapper around Google Generative AI for the Diraasti application.
// This module must only execute client‑side.  It retrieves the API key
// from localStorage and never stores secrets on the server.  See
// https://ai.google.dev/ for API documentation.

import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.19.0';

/**
 * Returns a configured Gemini client.  Throws if no key is set.
 */
export function getGeminiClient() {
  const key = localStorage.getItem('GEMINI_API_KEY');
  if (!key) {
    throw new Error('No Gemini API key set. Please open the Key Setup dialog and paste your key.');
  }
  const genai = new GoogleGenerativeAI(key);
  // Use Gemini 1.5 Flash for cost‑effective tasks
  return genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

/**
 * Sends a chat history to the model and returns the assistant’s reply as
 * plain text.  The `history` argument is an array of objects with
 * `{ sender: 'user'|'ai', text: string }`.  Errors are propagated to
 * the caller to allow the UI to display feedback.
 *
 * @param {Array<{sender:string,text:string}>} history
 * @returns {Promise<string>}
 */
export async function geminiChat(history) {
  const client = getGeminiClient();
  // Convert chat history into the API format
  const contents = history.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  try {
    const result = await client.generateContent({ contents });
    const candidates = result?.response?.candidates ?? [];
    const answer = candidates.length > 0 ? candidates[0].content?.parts?.map((p) => p.text).join('') : '';
    return answer || 'Sorry, I didn’t understand that.';
  } catch (err) {
    console.error('Gemini chat error', err);
    throw err;
  }
}

/**
 * Generates a study plan based on the user’s availability, subject
 * priorities and exam countdown.  The `input` argument should be an
 * object containing at least `availability` (e.g. hours per day),
 * `priorities` (subject weightings) and `examDates` (map of subject
 * keys to ISO date strings).  Returns parsed JSON with weeks and
 * checkpoints.  See README for usage.
 *
 * @param {object} input
 * @returns {Promise<any>}
 */
export async function geminiPlan(input) {
  const client = getGeminiClient();
  // Formulate a prompt instructing the model to return JSON.  We avoid
  // injecting sensitive information.  The message is in English; you can
  // localise it if needed.
  const prompt = `You are an educational planning assistant. Given the exam dates and
subject priorities, create a weekly study plan for the student. The plan
should allocate hours per subject each week, include milestones and
checkpoints, and finish before the earliest exam date. Respond only with
valid JSON, not markdown. The input is:\n${JSON.stringify(input)}`;
  try {
    const result = await client.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const answer = result?.response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('');
    return JSON.parse(answer);
  } catch (err) {
    console.error('Gemini plan error', err);
    throw err;
  }
}

/**
 * Generates multiple‑choice quiz questions.  The `input` argument should
 * include `subject`, `count`, and optional difficulty.  Returns an
 * array of objects with `question`, `options`, `correct` (index) and
 * `explanation`.
 *
 * @param {object} input
 * @returns {Promise<Array<{question:string,options:Array<string>,correct:number,explanation:string}>>>}
 */
export async function geminiQuiz(input) {
  const client = getGeminiClient();
  const prompt = `Generate ${input.count || 5} multiple‑choice questions for the subject ${input.subject}.
Each question should have four options, specify the index of the correct
answer (0‑based) and include a concise explanation.  Respond with a
valid JSON array of objects with the shape: { "question": string,
"options": [string, string, string, string], "correct": number,
"explanation": string }.`;
  try {
    const result = await client.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const answer = result?.response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('');
    return JSON.parse(answer);
  } catch (err) {
    console.error('Gemini quiz error', err);
    throw err;
  }
}