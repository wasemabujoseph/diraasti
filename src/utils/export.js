// Utility to export a DOM element to PDF using html2pdf.js.  The
// library is loaded globally from a CDN in index.html.  This helper
// isolates the dependency and provides sensible defaults.

export function exportPlannerToPdf(elementId, filename = 'plan.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;
  const opt = {
    margin: 0.5,
    filename,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  // html2pdf is attached to the window object by the CDN script
  window.html2pdf().set(opt).from(element).save();
}