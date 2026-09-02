================================================================
/* ============================================================ */
/*   Doomsday Mind — treino do método Doomsday (John H. Conway) */
/* ============================================================ */
/* ---------- Autoverificação (sanidade do algoritmo) ---------- */
(function selfTest() {
  const known = [
    [20, 7, 1969, 0],
    [1, 1, 2000, 6],
    [7, 9, 1822, 6],
    [25, 12, 2025, 4],
    [29, 2, 2024, 4],
    [15, 11, 1889, 5],
  ];
  for (const [d, m, y, expected] of known) {
    const got = weekdayOf(d, m, y);
    if (got !== expected) console.error(`Self-test FALHOU: ${d}/${m}/${y} esperado ${expected}, obtido ${got}`);
  }
  // compara com Date do JS em 500 datas aleatórias (1583–2500)
  for (let i = 0; i < 500; i++) {
    const y = randInt(1583, 2500), mth = randInt(1, 12), d = randInt(1, daysInMonth(mth, y));
    const js = new Date(Date.UTC(2000, 0, 1));
    js.setUTCFullYear(y, mth - 1, d);
    if (js.getUTCDay() !== weekdayOf(d, mth, y)) {
      console.error(`Divergência com Date: ${d}/${mth}/${y}`);
    }
  }
})();
/* ---------- Constantes ---------- */
const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const WEEKDAYS_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MODE_NAMES = {
  full: "Data completa",
  century: "Âncora do século",
  year: "Doomsday do ano",
  month: "Referência do mês",
};
const STORAGE_KEY = "doomsday-mind-v1";
/* ---------- Matemática do calendário ---------- */
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const mod = (n, m) => ((n % m) + m) % m;
/* ---------- Âncora do século: 0 = domingo ---------- */
function centuryAnchor(year) {
  const c = Math.floor(year / 100);
  return mod(5 * mod(c, 4) + 2, 7);
}
/* ---------- Doomsday do ano (método clássico a/b/c de Conway) ---------- */
function yearDoomsdayParts(year) {
  const anchor = centuryAnchor(year);
  const y = mod(year, 100);
  const a = Math.floor(y / 12);
  const b = y % 12;
  const c = Math.floor(b / 4);
  const sum = a + b + c;
  const dd = mod(anchor + sum, 7);
  return { anchor, y, a, b, c, sum, dd };
}
/* ---------- Doomsday do ano ---------- */
const yearDoomsday = (year) => yearDoomsdayParts(year).dd;
/* ---------- Método alternativo "ímpar + 11" ---------- */
function odd11Parts(year) {
  const y = mod(year, 100);
  let t = y;
  const steps = [];
  if (t % 2 === 1) { t += 11; steps.push(`${y} é ímpar → ${y} + 11 = ${t}`); }
  else { steps.push(`${y} é par → mantém ${t}`); }
  const half = t / 2;
  steps.push(`${t} ÷ 2 = ${half}`);
  t = half;
  if (t % 2 === 1) { t += 11; steps.push(`${half} é ímpar → ${half} + 11 = ${t}`); }
  else { steps.push(`${half} é par → mantém ${t}`); }
  const offset = mod(7 - mod(t, 7), 7);
  steps.push(`7 − (${t} mod 7) = 7 − ${mod(t, 7)} = ${offset === 0 ? 7 : offset} → deslocamento ${offset}`);
  return { steps, offset };
}
/* ---------- Data-referência (doomsday) de cada mês — dia do mês ---------- */
function monthDoomsdayDay(month, leap) {
  // month: 1-12
  const table = [leap ? 4 : 3, leap ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12];
  return table[month - 1];
}
/* ---------- Mnemônico de cada mês ---------- */
function monthMnemonic(month, leap) {
  switch (month) {
    case 1: return leap ? "Janeiro em ano bissexto: dia 4 (no 4º ano é 4)." : "Janeiro em ano comum: dia 3.";
    case 2: return leap ? "Último dia de fevereiro: 29 (bissexto)." : "Último dia de fevereiro: 28.";
    case 3: return "Dia do Pi: 14/03 (3.14).";
    case 4: case 6: case 8: case 10: case 12:
      return `Mês par: o dia é igual ao mês (${monthDoomsdayDay(month, leap)}/${month}).`;
    case 5: return "Trabalho das 9 às 5 → 09/05.";
    case 9: return "Trabalho das 9 às 5 → 05/09.";
    case 7: return "...no 7-Eleven → 11/07.";
    case 11: return "...no 7-Eleven → 07/11.";
  }
  return "";
}
/* ---------- Dia da semana de qualquer data (usando o próprio método — fonte da verdade) ---------- */
function weekdayOf(day, month, year) {
  const dd = yearDoomsday(year);
  const ref = monthDoomsdayDay(month, isLeap(year));
  return mod(dd + (day - ref), 7);
}
/* ---------- Dias em cada mês ---------- */
const daysInMonth = (m, y) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
/* ---------- Utilitários de formatação ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtDate = (d, m, y) => `${pad2(d)}/${pad2(m)}/${y}`;
const fmtTime = (ms) => (ms / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "s";
/* ---------- Inteiro aleatório ---------- */
const randInt = (lo, hi) => lo + Math.floor(Math.random * (hi - lo + 1)); // inclusivo
/* ---------- Estado do jogo ---------- */
const state = {
  mode: "full",
  range: [1900, 2099],
  timerLimit: 0, // segundos; 0 = livre
  question: null,
  answered: false,
  startTime: 0,
  timerInterval: null,
  session: { count: 0, correct: 0, wrong: 0, streak: 0, times: [] },
};
/* ---------- Persistência ---------- */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { attempts: [], bestStreak: 0 };
}
function saveStore() {
  try {
    if (store.attempts.length > 2000) store.attempts = store.attempts.slice(-2000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) { /* ignore */ }
}
let store = loadStore();
/* ---------- Elementos DOM ---------- */
const $ = (id) => document.getElementById(id);
const els = {
  qModeBadge: $("#q-mode-badge"),
  qPrompt: $("#q-prompt"),
  qMain: $("#q-main"),
  qSub: $("#q-sub"),
  qTimer: $("#q-timer"),
  qTimerValue: $("#q-timer-value"),
  answersWeek: $("#answers-week"),
  answersNum: $("#answers-num"),
  numInput: $("#num-input"),
  numSubmit: $("#num-submit"),
  btnSkip: $("#btn-skip"),
  btnNext: $("#btn-next"),
  questionCard: $("#question-card"),
  feedback: $("#feedback"),
  fbVerdict: $("#fb-verdict"),
  fbMeta: $("#fb-meta"),
  fbAnswer: $("#fb-answer"),
  stepsContainer: $("#steps-container"),
  sCount: $("#s-count"),
  sCorrect: $("#s-correct"),
  sWrong: $("#s-wrong"),
  sStreak: $("#s-streak"),
  sAcc: $("#s-acc"),
  sAvg: $("#s-avg"),
  gTotal: $("#g-total"),
  gAcc: $("#g-acc"),
  gBestStreak: $("#g-best-streak"),
  gAvgTime: $("#g-avg-time"),
  gBestTime: $("#g-best-time"),
  gToday: $("#g-today"),
  modeTableBody: $("#mode-table-body"),
  progressChart: $("#progress-chart"),
  historyDots: $("#history-dots"),
  legend: $(".legend"),
};
/* ---------- Geração de perguntas ---------- */
function newQuestion() {
  const [lo, hi] = state.range;
  let q = { mode: state.mode };
  if (state.mode === "full") {
    const year = randInt(lo, hi);
    const month = randInt(1, 12);
    const day = randInt(1, daysInMonth(month, year));
    q.year = year;
    q.month = month;
    q.day = day;
    q.answer = weekdayOf(day, month, year);
    q.kind = "week";
    q.prompt = "Em que dia da semana caiu (ou cairá)...";
    q.main = fmtDate(day, month, year);
    q.sub = `${day} de ${MONTHS[month - 1]} de ${year}`;
  }
  else if (state.mode === "century") {
    const cLo = Math.floor(Math.max(lo, 1500) / 100);
    const cHi = Math.floor(hi / 100);
    const c = randInt(cLo, cHi);
    q.year = c * 100;
    q.answer = centuryAnchor(q.year);
    q.kind = "week";
    q.prompt = "Qual é o dia-âncora do século...";
    q.main = `${c * 100}–${c * 100 + 99}`;
    q.sub = `século de ${c * 100}`;
  }
  else if (state.mode === "year") {
    const year = randInt(lo, hi);
    q.year = year;
    q.answer = yearDoomsday(year);
    q.kind = "week";
    q.prompt = "Qual é o Doomsday do ano...";
    q.main = String(year);
    q.sub = isLeap(year) ? "⚠️ ano bissexto" : "ano comum";
  }
  else if (state.mode === "month") {
    const month = randInt(1, 12);
    const leap = Math.random() < 0.5;
    q.month = month;
    q.leap = leap;
    q.answer = monthDoomsdayDay(month, leap);
    q.kind = "num";
    q.prompt = "Qual dia deste mês cai no Doomsday do ano?";
    q.main = MONTHS[month - 1];
    q.sub = month <= 2 ? (leap ? "⚠️ em um ano BISSEXTO" : "em um ano comum") : "(vale para qualquer ano)";
  }
  state.question = q;
  state.answered = false;
  renderQuestion();
  startTimer();
}
/* ---------- Renderização da pergunta ---------- */
function renderQuestion() {
  const q = state.question;
  els.qModeBadge.textContent = MODE_NAMES[q.mode];
  els.qPrompt.textContent = q.prompt;
  els.qMain.textContent = q.main;
  els.qSub.textContent = q.sub;
  // reset botões
  els.answersWeek.querySelectorAll(".ans").forEach((b) => {
    b.disabled = false;
    b.classList.remove("correct", "wrong");
  });
  els.numInput.value = "";
  if (q.kind === "week") {
    els.answersWeek.classList.remove("hidden");
    els.answersNum.classList.add("hidden");
  }
  else {
    els.answersWeek.classList.add("hidden");
    els.answersNum.classList.remove("hidden");
    setTimeout(() => els.numInput.focus(), 50);
  }
  els.feedback.classList.add("hidden");
  els.questionCard.classList.remove("hidden");
}
/* ---------- Timer ---------- */
function startTimer() {
  stopTimer();
  state.startTime = performance.now();
  els.qTimer.classList.remove("urgent");
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    updateTimerDisplay();
    if (state.timerLimit > 0) {
      const elapsed = (performance.now() - state.startTime) / 1000;
      const left = state.timerLimit - elapsed;
      if (left <= 5) els.qTimer.classList.add("urgent");
      if (left <= 0) handleTimeout();
    }, 100);
  });
}
function stopTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}
function updateTimerDisplay() {
  const elapsed = (performance.now() - state.startTime) / 1000;
  if (state.timerLimit > 0) {
    const left = Math.max(0, state.timerLimit - elapsed);
    els.qTimerValue.textContent = "⏳ " + left.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "s";
  }
  else {
    els.qTimerValue.textContent = elapsed.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "s";
  }
}
/* ---------- Resposta / correção ---------- */
function submitAnswer(given) {
  if (state.answered || !state.question) return;
  state.answered = true;
  stopTimer();
  const q = state.question;
  const elapsed = performance.now() - state.startTime;
  const correct = given === q.answer;
  recordAttempt({ correct, timedOut: false, elapsed });
  showFeedback({ correct, given, timedOut: false, skipped: false, elapsed });
}
function handleTimeout() {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  const elapsed = performance.now() - state.startTime;
  recordAttempt({ correct: false, timedOut: true, elapsed });
  showFeedback({ correct: false, given: null, timedOut: true, skipped: false, elapsed });
}
function handleSkip() {
  if (state.answered || !state.question) return;
  state.answered = true;
  stopTimer();
  const elapsed = performance.now() - state.startTime;
  recordAttempt({ correct: false, timedOut: true, elapsed });
  showFeedback({ correct: false, given: null, timedOut: false, skipped: true, elapsed });
}
/* ---------- Registrar tentativa ---------- */
function recordAttempt({ correct, timedOut, elapsed }) {
  // sessão
  state.session.count++;
  if (correct) {
    state.session.correct++;
    state.session.streak++;
    state.session.times.push(elapsed);
  }
  else {
    state.session.wrong++;
    state.session.streak = 0;
  }
  if (state.session.streak > (store.bestStreak || 0)) store.bestStreak = state.session.streak;
  // persistente
  store.attempts.push({
    ts: Date.now(),
    mode: state.question.mode,
    correct,
    timedOut,
    ms: Math.round(elapsed),
  });
  saveStore();
  renderSessionStrip();
}
/* ---------- Navegação por abas ---------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    $(`panel-${tab.dataset.tab}`).classList.add("active");
    if (tab.dataset.tab === "stats") renderStats();
  });
});
function bindSeg(segId, onChange) {
  $(segId).querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $(segId).querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onChange(btn);
    });
  });
}
bindSeg("mode-seg", (btn) => { state.mode = btn.dataset.mode; newQuestion(); });
bindSeg("range-seg", (btn) => {
  state.range = btn.dataset.range.split(",").map(Number);
  newQuestion();
});
bindSeg("timer-seg", (btn) => { state.timerLimit = Number(btn.dataset.timer); newQuestion(); });
/* ---------- Respostas ---------- */
els.answersWeek.querySelectorAll(".ans").forEach((btn) => {
  btn.addEventListener("click", () => submitAnswer(Number(btn.dataset.dow)));
});
els.numSubmit.addEventListener("click", () => {
  const v = parseInt(els.numInput.value, 10);
  if (!isNaN(v)) submitAnswer(v);
});
els.numInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const v = parseInt(els.numInput.value, 10);
    if (!isNaN(v)) submitAnswer(v);
  }
});
els.btnSkip.addEventListener("click", handleSkip);
els.btnNext.addEventListener("click", newQuestion);
$("#btn-reset-stats").addEventListener("click", () => {
  if (confirm("Tem certeza? Todo o histórico de tentativas será apagado.")) {
    store = { attempts: [], bestStreak: 0 };
    saveStore();
    renderStats();
  }
});
document.addEventListener("keydown", (e) => {
  const practiceActive = $("#panel-practice").classList.contains("active");
  if (!practiceActive) return;
  if (state.answered) {
    if (e.key === "Enter") { e.preventDefault(); newQuestion(); }
    return;
  }
  if (e.key === "Escape") { e.preventDefault(); handleSkip(); return; }
  if (state.question && state.question.kind === "week" && /^[1-7]$/.test(e.key) && document.activeElement !== els.numInput) {
    e.preventDefault();
    submitAnswer(Number(e.key) - 1);
  }
});
/* ---------- Autoverificação (sanidade do algoritmo) ---------- */
(function selfTest() {
  const known = [
    [20, 7, 1969, 0],
    [1, 1, 2000, 6],
    [7, 9, 1822, 6],
    [25, 12, 2025, 4],
    [29, 2, 2024, 4],
    [15, 11, 1889, 5],
  ];
  for (const [d, m, y, expected] of known) {
    const got = weekdayOf(d, m, y);
    if (got !== expected) console.error(`Self-test FALHOU: ${d}/${m}/${y} esperado ${expected}, obtido ${got}`);
  }
  // compara com Date do JS em 500 datas aleatórias (1583–2500)
  for (let i = 0; i < 500; i++) {
    const y = randInt(1583, 2500);
    const mth = randInt(1, 12);
    const d = randInt(1, daysInMonth(mth, y));
    const js = new Date(Date.UTC(2000, 0, 1));
    js.setUTCFullYear(y, mth - 1, d);
    if (js.getUTCDay() !== weekdayOf(d, mth, y)) {
      console.error(`Divergência com Date: ${d}/${mth}/${y}`);
    }
  }
})();
/* ---------- Início ---------- */
renderSessionStrip();
newQuestion();
================================================================
