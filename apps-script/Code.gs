var ADMIN_PASSWORD = 'admin';
var EXAMS_FOLDER_NAME = 'DirastiPro_ExamJson';
var PDFS_FOLDER_NAME = 'DirastiPro_ExamPdf';
var RESULTS_SHEET_NAME = 'Results';
var QUESTION_BANK_SHEET_NAME = 'QuestionBank';

var SUBJECT_BLUEPRINTS = {
  chemistry:{nameAr:'الكيمياء',comprehensiveTitle:'بنك شامل لكل المادة',weights:{'1|حالات المادة':13.5,'1|المحاليل':8,'1|الاتزان الكيميائي':10.8,'1|الحموض والقواعد وتطبيقاتها':18.9,'2|الكيمياء الحركيه':13.5,'2|الكيمياء الكهربائيه':17.5,'2|الكيمياء العضويه':17.5}},
  life_sciences:{nameAr:'الأحياء',comprehensiveTitle:'بنك شامل لكل المادة',weights:{'1|كيمياء الحياة':16.9,'1|دوره الخليه وتصنيع البروتينات':12.8,'1|الوراثة':14.9,'1|التكنولوجيا الحيوية':8.2,'2|التنظيم والاتزان':11.8,'2|الدعامه والحركه':6.1,'2|الهضم والنقل وتبادل الغازات':10.7,'2|الاخراج والتكاثر':11.3,'2|المناعه والمضادات الحيويه':6.9}},
  islamic_education:{nameAr:'التربيه الاسلاميه',comprehensiveTitle:'بنك شامل لكل المادة',weights:{'1|علاقه الانسان بربه':16.66,'1|علاقه الانسان بنفسه':16.66,'1|علاقه الانسان بمن حوله':16.66,'2|علاقه الانسان بربه':16.66,'2|علاقه الانسان بنفسه':16.66,'2|علاقه الانسان بمن حوله':16.66}},
  english:{nameAr:'Advance English',comprehensiveTitle:'بنك شامل لكل المادة',weights:{'1|Unit 1':10,'1|Unit 2':10,'1|Unit 3':10,'1|Unit 4':10,'1|Unit 5':10,'2|Unit 6':10,'2|Unit 7':10,'2|Unit 8':10,'2|Unit 9':10,'2|Unit 10':10}}
};

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doGet(e) { return handle_(e && e.parameter ? e.parameter : {}); } 
function doPost(e) { 
  var body = {};
  try { 
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) { 
    return out_({ ok: false, error: 'Invalid JSON body: ' + err.message });
  } 
  return handle_(body); 
} 

function handle_(p) {
  try {
    var a = String(p.action || 'getCatalog');
    var r;
    switch (a) {
      case 'getCatalog': r = getCatalog(); break;
      case 'getExamBundle': r = getExamBundle(p.examId); break;
      case 'uploadExam': r = uploadExam(p.adminPassword, p.examJson, p.pdfDataUrl, p.pdfFileName, p.examId); break;
      case 'updateExamSettings': r = updateExamSettings(p.adminPassword, p.examId, p.patch || {}); break;
      case 'deleteExam': r = deleteExam(p.adminPassword, p.examId); break;
      case 'submitResult': r = submitResult(p); break;
      case 'getUserResults': r = getUserResults(p.userId); break;
      case 'listAllResults': r = listAllResults(p.adminPassword); break;
      case 'getUserAnalytics': r = getUserAnalytics(p.userId); break;
      case 'getQuestionBankSummary': r = getQuestionBankSummary(); break;
      case 'buildCustomExam': r = buildCustomExam(p); break;
      case 'buildWrongRedo': r = buildWrongRedo(p.userId, p.resultId); break;
      case 'generateRedoExam': r = generateRedoExam(p); break;
      case 'getAttemptReview': r = getAttemptReview(p.attemptId); break;
      default: throw new Error('Unknown action: ' + a);
    }
    return out_(r);
  } catch(err) {
    return out_({ ok: false, error: err.message || String(err) });
  }
} 

function out_(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); } 

function getCatalog() { return { ok: true, syllabus: SUBJECT_BLUEPRINTS, exams: listExamSummaries_(), questionBank: bankSummary_() }; }

function getExamBundle(examId) {
  if(!examId) throw new Error('examId is required');
  var f = DriveApp.getFileById(examId);
  var e = validateExam_(JSON.parse(f.getBlob().getDataAsString('UTF-8')));
  e.id = examId;
  return { ok: true, exam: e };
}

function uploadExam(adminPassword, examJson, pdfDataUrl, pdfFileName, examId) {
  validateAdmin_(adminPassword);
  var exam = typeof examJson === 'string' ? JSON.parse(examJson) : examJson;
  if(!exam) throw new Error('examJson is required');
  var existing = examId ? getExamBundle(examId).exam : null;
  if(pdfDataUrl) {
    exam.sourcePdf = savePdf_(pdfDataUrl, pdfFileName || ((exam.title || 'source') + '.pdf'));
  } else if(existing && existing.sourcePdf) {
    exam.sourcePdf = existing.sourcePdf;
  } else if(!(exam.sourcePdf && exam.sourcePdf.driveFileId)) {
    exam.sourcePdf = { fileName: pdfFileName || 'source.pdf', driveFileId: '' };
  }
  
  exam = validateExam_(exam);
  var folder = getFolder_(EXAMS_FOLDER_NAME);
  var fileName = cleanName_((exam.subjectAr || exam.subjectCode || 'exam') + ' - ' + (exam.unitTitleAr || '') + ' - ' + (exam.title || '')) + '.json';
  var content = JSON.stringify(exam, null, 2);
  var file;
  
  if(examId) {
    file = DriveApp.getFileById(examId);
    file.setName(fileName);
    file.setContent(content);
  } else {
    file = folder.createFile(fileName, content, MimeType.PLAIN_TEXT);
  }
  
  indexQuestions_(file.getId(), exam);
  return { ok: true, examId: file.getId(), exam: examSummary_(file.getId(), exam, file.getName()) };
}

function updateExamSettings(adminPassword, examId, patch) {
  validateAdmin_(adminPassword);
  if(!examId) throw new Error('examId is required');
  patch = patch || {};
  var exam = getExamBundle(examId).exam;
  if(patch.duration !== undefined) exam.duration = Number(patch.duration || 0) || null;
  exam.settings = exam.settings || {};
  if(patch.allowStudentTimeOverride !== undefined) exam.allowStudentTimeOverride = !!patch.allowStudentTimeOverride;
  exam = validateExam_(exam);
  DriveApp.getFileById(examId).setContent(JSON.stringify(exam, null, 2));
  indexQuestions_(examId, exam);
  return { ok: true, exam: examSummary_(examId, exam, DriveApp.getFileById(examId).getName()) };
}

function deleteExam(adminPassword, examId) {
  validateAdmin_(adminPassword);
  if(!examId) throw new Error('examId is required');
  DriveApp.getFileById(examId).setTrashed(true);
  removeExamQuestions_(examId);
  return { ok: true };
}

function submitResult(body) {
  if(!body.userId) throw new Error('userId is required');
  var sh = resultsSheet_();
  var id = Utilities.getUuid();
  var row = [
    id, body.userId || '', body.userName || '', body.examId || '', body.examTitle || '', 
    body.subjectCode || '', body.subjectAr || '', body.semester == null ? '' : body.semester, 
    body.unitTitleAr || '', body.subunitTitleAr || '', Number(body.score || 0), 
    Number(body.correctCount || 0), Number(body.totalQuestions || 0), 
    JSON.stringify(body.answers || {}), JSON.stringify(body.wrongItems || []), 
    JSON.stringify(body.examSnapshot || {}), JSON.stringify(body.openAnswers || {}), 
    new Date().toISOString()
  ];
  sh.appendRow(row);
  return { ok: true, resultId: id, attemptId: id };
}

function getUserResults(userId) {
  if(!userId) throw new Error('userId is required');
  return { ok: true, results: sheetObjs_(resultsSheet_()).filter(function(r){ return String(r.userId) === String(userId); }).sort(sortDateDesc_) };
}

function listAllResults(adminPassword) {
  validateAdmin_(adminPassword);
  return { ok: true, results: sheetObjs_(resultsSheet_()).sort(sortDateDesc_) };
}

function getAttemptReview(attemptId) {
  var results = sheetObjs_(resultsSheet_());
  var attempt = results.filter(function(r) { return String(r.resultId) === String(attemptId); })[0];
  if(!attempt) throw new Error('Attempt not found');
  attempt.answers = parse_(attempt.answersJson, {});
  attempt.openAnswers = parse_(attempt.customMetaJson, {});
  attempt.wrongItems = parse_(attempt.wrongItemsJson, []);
  attempt.examSnapshot = parse_(attempt.examSnapshotJson, {});
  attempt.score = Number(attempt.score || 0);
  attempt.id = attempt.resultId;
  return { ok: true, attempt: attempt };
}

function getUserAnalytics(userId) {
  var results = getUserResults(userId).results;
  var overall = { attempts: 0, total: 0, correct: 0 };
  var sMap = {}, uMap = {};
  results.forEach(function(r) {
    var exam = parse_(r.examSnapshotJson, null);
    var answers = parse_(r.answersJson, {});
    var qs = exam && exam.questions ? exam.questions : [];
    overall.attempts++;
    qs.forEach(function(q) {
      if(q.correctIndex === null || q.correctIndex === undefined) return;
      var sc = q.subjectCode || exam.subjectCode || r.subjectCode || 'unknown';
      var sa = q.subjectAr || exam.subjectAr || r.subjectAr || sc;
      var sem = q.semester || exam.semester || r.semester || '';
      var unit = q.unitTitleAr || exam.unitTitleAr || r.unitTitleAr || 'غير مصنف';
      var ok = String(answers[q.id]) === String(q.correctIndex);
      overall.total++;
      if(ok) overall.correct++;
      if(!sMap[sc]) sMap[sc] = { subjectCode: sc, subjectAr: sa, attempted: 0, correct: 0 };
      sMap[sc].attempted++;
      if(ok) sMap[sc].correct++;
      var uk = sc + '||' + sem + '||' + unit;
      if(!uMap[uk]) uMap[uk] = { subjectCode: sc, subjectAr: sa, semester: sem, unitTitleAr: unit, attempted: 0, correct: 0 };
      uMap[uk].attempted++;
      if(ok) uMap[uk].correct++;
    });
  });
  var subjectStats = vals_(sMap).map(function(x){ x.mastery = x.attempted ? round_(100 * x.correct / x.attempted) : 0; return x; }).sort(function(a,b){ return b.mastery - a.mastery; });
  var unitStats = vals_(uMap).map(function(x){ x.mastery = x.attempted ? round_(100 * x.correct / x.attempted) : 0; x.weaknessScore = round_(100 - x.mastery); x.wrongs = x.attempted - x.correct; return x; }).sort(function(a,b){ return b.weaknessScore - a.weaknessScore; });
  return { ok: true, analytics: { attempts: overall.attempts, totalQuestions: overall.total, correctQuestions: overall.correct, overallMastery: overall.total ? round_(100 * overall.correct / overall.total) : 0, subjectMastery: subjectStats, unitMastery: unitStats, weaknessRows: unitStats } };
}

function getQuestionBankSummary() { return { ok: true, summary: bankSummary_() }; }

// Attach PDFs securely to selected questions dynamically
function attachPdfToQuestions_(qs, rowsWithExamIds) {
  var pdfCache = {};
  qs.forEach(function(q, index) {
    var eid = rowsWithExamIds[index] ? rowsWithExamIds[index].examId : null;
    if(eid) {
      if(pdfCache[eid] === undefined) {
        try {
          var f = DriveApp.getFileById(eid);
          var ex = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
          pdfCache[eid] = (ex.sourcePdf && ex.sourcePdf.base64) ? ex.sourcePdf.base64 : null;
        } catch(e) { pdfCache[eid] = null; }
      }
      if(pdfCache[eid]) q.sourcePdfBase64 = pdfCache[eid];
    }
  });
  return qs;
}

function buildWrongRedo(userId, resultId) {
  if(!userId) throw new Error('userId is required');
  if(!resultId) throw new Error('resultId is required');
  var result = sheetObjs_(resultsSheet_()).filter(function(r){ return String(r.userId) === String(userId) && String(r.resultId) === String(resultId); })[0];
  if(!result) throw new Error('Result not found');
  var wrong = parse_(result.wrongItemsJson, []);
  if(!wrong.length) throw new Error('No wrong questions stored for this attempt');
  return { ok: true, exam: redoExam_(wrong, result) };
}

function generateRedoExam(body) {
  var userId = body.userId;
  if(!userId) throw new Error('userId is required');
  var wrong = [];
  getUserResults(userId).results.forEach(function(r){
    parse_(r.wrongItemsJson, []).forEach(function(item){
      var pass = true;
      if(body.subjectCode && String(item.subjectCode || '') !== String(body.subjectCode)) pass = false;
      if(body.unitTitleAr && String(item.unitTitleAr || '') !== String(body.unitTitleAr)) pass = false;
      if(pass) wrong.push(item);
    });
  });
  if(!wrong.length) throw new Error('No matching wrong questions found');
  return { ok: true, exam: redoExam_(wrong, body) };
}

function buildCustomExam(body) {
  if(!body.subjectCode) throw new Error('subjectCode is required');
  var selected = normUnits_(arr_(body.selectedUnits));
  if(!selected.length) throw new Error('Select at least one unit');
  var total = Number(body.totalQuestions || 0);
  var manual = body.explicitUnitCounts || {};
  var useManual = keys_(manual).some(function(k){ return Number(manual[k] || 0) > 0; });
  if(!useManual && total <= 0) throw new Error('totalQuestions must be greater than zero');
  var rows = sheetObjs_(qbSheet_()).filter(function(r){ return String(r.subjectCode) === String(body.subjectCode) && selected.some(function(u){ return u.key === r.subjectCode + '||' + r.semester + '||' + r.unitTitleAr; }) && String(r.questionType) === 'mcq'; });
  if(!rows.length) throw new Error('No bank questions found for the selected units');
  var grouped = {};
  rows.forEach(function(r){ var k = r.subjectCode + '||' + r.semester + '||' + r.unitTitleAr; if(!grouped[k]) grouped[k] = []; grouped[k].push(r); });
  var allocations = useManual ? manualAlloc_(selected, manual, grouped) : weightedAlloc_(body.subjectCode, selected, total, grouped);
  var picked = [];
  keys_(allocations).forEach(function(k){ var group = shuffle_(grouped[k] || []); var need = Number(allocations[k].requested || 0); for(var i=0; i<group.length && need>0; i++){ picked.push(group[i]); need--; } });
  if(!picked.length) throw new Error('Unable to assemble custom exam from bank');
  
  var questions = picked.map(function(r){ return parse_(r.questionJson, null); }).filter(Boolean);
  
  // Attach PDF Base64 Fix!
  questions = attachPdfToQuestions_(questions, picked);

  var sub = SUBJECT_BLUEPRINTS[body.subjectCode];
  return { ok: true, exam: { id: 'custom-' + Utilities.getUuid(), title: body.title || 'امتحان مخصص', subjectCode: body.subjectCode, subjectAr: sub ? sub.nameAr : body.subjectCode, semester: 'custom', unitTitleAr: 'امتحان مخصص', subunitTitleAr: '', examMode: 'OMR_MCQ', duration: Number(body.duration || 0) || 3600, settings: { allowSwitchView: true, defaultQuestionView: 'single', showOneQuestionPerRow: true }, allowStudentTimeOverride: false, sourcePdf: { fileName: 'custom.pdf', driveFileId: '' }, questions: questions, openQuestions: [] } };
}

function validateAdmin_(adminPassword) { if(String(adminPassword||'') !== String(ADMIN_PASSWORD)) throw new Error('Admin password is incorrect'); }
function listExamSummaries_() {
  var files = getFolder_(EXAMS_FOLDER_NAME).getFiles();
  var exams = [];
  while(files.hasNext()){
    var f = files.next();
    try {
      var e = validateExam_(JSON.parse(f.getBlob().getDataAsString('UTF-8')));
      exams.push(examSummary_(f.getId(), e, f.getName()));
    }catch(err){}
  }
  exams.sort(function(a,b){ return String(a.subjectAr).localeCompare(String(b.subjectAr),'ar') || String(a.unitTitleAr).localeCompare(String(b.unitTitleAr),'ar') || String(a.title).localeCompare(String(b.title),'ar'); });
  return exams;
}
function examSummary_(id, exam, fileName) { return { id: id, fileName: fileName || '', title: exam.title || '', subjectCode: exam.subjectCode || '', subjectAr: exam.subjectAr || '', semester: exam.semester || '', unitTitleAr: exam.unitTitleAr || '', subunitTitleAr: exam.subunitTitleAr || '', examMode: exam.examMode || 'OMR_MCQ', duration: exam.duration || null, allowStudentTimeOverride: exam.allowStudentTimeOverride || false, questionCount: arr_(exam.questions).length, openQuestionCount: arr_(exam.openQuestions).length, sourcePdf: exam.sourcePdf || { fileName: '', driveFileId: '' } }; }
function savePdf_(dataUrl, fileName) {
  var m = String(dataUrl||'').match(/^data:([^;]+);base64,(.+)$/);
  if(!m) throw new Error('Invalid PDF data URL');
  var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], cleanName_(fileName || 'source.pdf'));
  var f = getFolder_(PDFS_FOLDER_NAME).createFile(blob);
  return { fileName: f.getName(), driveFileId: f.getId(), base64: m[2] };
}
function validateExam_(exam) {
  exam = exam || {};
  exam.title = exam.title || '';
  exam.subjectCode = exam.subjectCode || '';
  exam.subjectAr = exam.subjectAr || (SUBJECT_BLUEPRINTS[exam.subjectCode] ? SUBJECT_BLUEPRINTS[exam.subjectCode].nameAr : '') || '';
  exam.semester = exam.semester == null ? '' : exam.semester;
  exam.unitTitleAr = exam.unitTitleAr || '';
  exam.subunitTitleAr = exam.subunitTitleAr || '';
  exam.examMode = exam.examMode || 'OMR_MCQ';
  exam.duration = exam.duration == null || exam.duration === '' ? null : Number(exam.duration);
  exam.allowStudentTimeOverride = !!exam.allowStudentTimeOverride;
  exam.minDuration = exam.minDuration || null;
  exam.maxDuration = exam.maxDuration || null;
  exam.settings = exam.settings || {};
  exam.sourcePdf = exam.sourcePdf || { fileName: 'source.pdf', driveFileId: '' };
  exam.questions = arr_(exam.questions).map(function(q, i) { q = q || {}; q.id = q.id || ('q'+(i+1)); q.questionType = 'mcq'; q.options = arr_(q.options).map(function(v){ return String(v); }); q.correctIndex = q.correctIndex === '' || q.correctIndex === undefined ? null : (q.correctIndex == null ? null : Number(q.correctIndex)); q.subjectCode = q.subjectCode || exam.subjectCode; q.subjectAr = q.subjectAr || exam.subjectAr; q.semester = q.semester == null ? exam.semester : q.semester; q.unitTitleAr = q.unitTitleAr || exam.unitTitleAr; return q; });
  exam.openQuestions = arr_(exam.openQuestions).map(function(q, i) { q = q || {}; q.id = q.id || ('oq'+(i+1)); q.questionType = 'essay'; q.subjectCode = q.subjectCode || exam.subjectCode; q.subjectAr = q.subjectAr || exam.subjectAr; q.semester = q.semester == null ? exam.semester : q.semester; q.unitTitleAr = q.unitTitleAr || exam.unitTitleAr; return q; });
  return exam;
}
function resultsSheet_() {
  var sh = sheet_(RESULTS_SHEET_NAME);
  headers_(sh, ['resultId','userId','userName','examId','examTitle','subjectCode','subjectAr','semester','unitTitleAr','subunitTitleAr','score','correctCount','totalMcq','answersJson','wrongItemsJson','examSnapshotJson','customMetaJson','createdAt']);
  return sh;
}
function qbSheet_() {
  var sh = sheet_(QUESTION_BANK_SHEET_NAME);
  headers_(sh, ['examId','examTitle','subjectCode','subjectAr','semester','unitTitleAr','subunitTitleAr','questionId','questionType','questionText','optionsJson','correctIndex','explanation','sourcePdfFileId','questionJson']);
  return sh;
}
function sheet_(name) { var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name); if(!sh) sh = ss.insertSheet(name); return sh;
}
function headers_(sheet, headers) {
  if(sheet.getLastRow() === 0) { sheet.getRange(1, 1, 1, headers.length).setValues([headers]); sheet.setFrozenRows(1); return; }
  var cur = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var changed = false;
  for(var i=0; i<headers.length; i++) { if(String(cur[i]) !== String(headers[i])) changed = true; }
  if(changed) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}
function sheetObjs_(sheet) {
  var vals = sheet.getDataRange().getValues();
  if(vals.length < 2) return [];
  var h = vals[0];
  return vals.slice(1).map(function(r) { var o = {}; h.forEach(function(k, i){ o[k] = r[i]; }); return o; });
}
function bankSummary_() {
  var rows = sheetObjs_(qbSheet_());
  var s = { totalQuestions: rows.length, bySubject: {}, byUnitKey: {}, subjects: [] };
  var subMap = {};
  rows.forEach(function(r) {
    var sk = r.subjectCode || 'unknown';
    var uk = r.subjectCode + '||' + r.semester + '||' + r.unitTitleAr;
    s.bySubject[sk] = (s.bySubject[sk] || 0) + 1;
    s.byUnitKey[uk] = (s.byUnitKey[uk] || 0) + 1;
    
    if(!subMap[sk]) subMap[sk] = { subjectCode: sk, subjectAr: r.subjectAr || sk, units: {} };
    if(!subMap[sk].units[uk]) subMap[sk].units[uk] = { unitTitleAr: r.unitTitleAr || '', semester: r.semester, questionCount: 0 };
    subMap[sk].units[uk].questionCount++;
  });
  s.subjects = keys_(subMap).map(function(k){
    var subj = subMap[k];
    subj.units = vals_(subj.units);
    return subj;
  });
  return s;
}
function indexQuestions_(examId, exam) {
  removeExamQuestions_(examId);
  var sh = qbSheet_();
  var rows = [];
  arr_(exam.questions).forEach(function(q){
    rows.push([examId, exam.title || '', q.subjectCode || exam.subjectCode || '', q.subjectAr || exam.subjectAr || '', q.semester == null ? exam.semester : q.semester, q.unitTitleAr || exam.unitTitleAr || '', q.subunitTitleAr || exam.subunitTitleAr || '', q.id || '', 'mcq', q.text || '', JSON.stringify(q.options || []), q.correctIndex == null ? '' : q.correctIndex, q.explanation || '', (q.sourcePdf && q.sourcePdf.driveFileId) || '', JSON.stringify(q)]);
  });
  if(rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
} 
function removeExamQuestions_(examId) {
  var sh = qbSheet_();
  var values = sh.getDataRange().getValues();
  if(values.length < 2) return;
  for(var i = values.length; i >= 2; i--) { if(String(values[i-1][0]) === String(examId)) sh.deleteRow(i); }
}
function redoExam_(wrongItems, meta) {
  var rows = sheetObjs_(qbSheet_());
  var seen = {}, qs = [], pickedRows = [];
  wrongItems.forEach(function(item) {
    var id = String(item.questionId || '');
    if(!id || seen[id]) return;
    var row = rows.filter(function(r){ return String(r.questionId) === id; })[0];
    if(!row) return;
    var q = parse_(row.questionJson, null);
    if(!q) return;
    seen[id] = true;
    qs.push(q);
    pickedRows.push(row);
  });
  if(!qs.length) throw new Error('Could not rebuild the missed questions');
  
  // Attach PDF Base64 Fix!
  qs = attachPdfToQuestions_(qs, pickedRows);

  return { id: 'redo-' + Utilities.getUuid(), title: 'إعادة الأسئلة الخاطئة', subjectCode: meta.subjectCode || (qs[0].subjectCode || ''), subjectAr: meta.subjectAr || (qs[0].subjectAr || ''), semester: meta.semester || (qs[0].semester || ''), unitTitleAr: 'أسئلة خاطئة', subunitTitleAr: '', examMode: 'OMR_MCQ', duration: Math.max(900, qs.length * 70), allowStudentTimeOverride: false, sourcePdf: { fileName: 'redo.pdf', driveFileId: '' }, questions: qs, openQuestions: [] };
}
function normUnits_(items) {
  return items.map(function(item){
    if(typeof item === 'string'){ var p = item.split('||'); return { subjectCode: p[0], semester: p[1], unitTitleAr: p.slice(2).join('||'), key: item }; }
    return { subjectCode: item.subjectCode || '', semester: item.semester == null ? '' : item.semester, unitTitleAr: item.unitTitleAr || '', key: (item.subjectCode || '') + '||' + (item.semester == null ? '' : item.semester) + '||' + (item.unitTitleAr || '') };
  }).filter(function(x){ return x.unitTitleAr; });
}
function manualAlloc_(selected, manual, grouped) {
  var report = {};
  selected.forEach(function(u){ var req = Math.max(0, Number(manual[u.key] || 0)); var av = (grouped[u.key] || []).length; report[u.key] = { key: u.key, subjectCode: u.subjectCode, semester: u.semester, unitTitleAr: u.unitTitleAr, requested: Math.min(req, av), requestedBeforeCap: req, available: av, effectivePercent: null, rawWeight: null, mode: 'manual' }; });
  return report;
}
function weightedAlloc_(subjectCode, selected, total, grouped) {
  var weights = SUBJECT_BLUEPRINTS[subjectCode] ? SUBJECT_BLUEPRINTS[subjectCode].weights : {};
  var items = selected.map(function(u){ var w = Number(weights[String(u.semester) + '|' + u.unitTitleAr] || 0); return { key: u.key, subjectCode: u.subjectCode, semester: u.semester, unitTitleAr: u.unitTitleAr, weight: w, available: (grouped[u.key] || []).length, requested: 0, rawRequested: 0, remainder: 0, normalized: 0 }; });
  var sum = items.reduce(function(a,x){ return a + x.weight; }, 0);
  if(sum <= 0) throw new Error('No weights found for the selected units');
  items.forEach(function(x){ x.normalized = x.weight / sum; x.rawRequested = total * x.normalized; x.requested = Math.floor(x.rawRequested); x.remainder = x.rawRequested - x.requested; });
  var left = total - items.reduce(function(a,x){ return a + x.requested; }, 0);
  items.sort(function(a,b){ return b.remainder - a.remainder; });
  while(left > 0 && items.length){ for(var i=0; i<items.length && left>0; i++){ items[i].requested++; left--; } }
  items.forEach(function(x){ if(x.requested > x.available) x.requested = x.available; });
  var current = items.reduce(function(a,x){ return a + x.requested; }, 0);
  var guard = 0;
  while(current < total && guard < 10000){ guard++; var c = items.filter(function(x){ return x.requested < x.available; }).sort(function(a,b){ return b.remainder - a.remainder; })[0];
  if(!c) break; c.requested++; current++; }
  var report = {};
  items.forEach(function(x){ report[x.key] = { key: x.key, subjectCode: x.subjectCode, semester: x.semester, unitTitleAr: x.unitTitleAr, requested: x.requested, requestedBeforeCap: round_(x.rawRequested), available: x.available, effectivePercent: round_(x.normalized * 100), rawWeight: x.weight, mode: 'weighted' }; });
  return report;
}
function getFolder_(name) { var it = DriveApp.getFoldersByName(name); return it.hasNext() ? it.next() : DriveApp.createFolder(name); } 
function cleanName_(name) { return String(name||'file').replace(/[\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim() || 'file'; }
function arr_(v) { return Array.isArray(v) ? v : []; } 
function parse_(t,f) { try{ return t ? JSON.parse(t) : f; }catch(e){ return f; } } 
function keys_(o) { return Object.keys(o||{}); } 
function vals_(o) { return Object.keys(o||{}).map(function(k){ return o[k]; }); } 
function round_(n) { return Math.round(Number(n||0)*100)/100; } 
function sortDateDesc_(a,b) { return new Date(b.createdAt||0) - new Date(a.createdAt||0); } 
function shuffle_(a) { a = a.slice(); for(var i = a.length-1; i>0; i--){ var j = Math.floor(Math.random()*(i+1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
