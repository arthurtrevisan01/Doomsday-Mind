/* ============================================================
   Doomsday Mind — treino do método Doomsday (John H. Conway)
   ============================================================ */
"use strict";

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

// Âncora do século: 0 = domingo
function centuryAnchor(year) {
  const c = Math.floor(year / 100);
  return mod(5 * mod(c, 4) + 2, 7);
}

// Doomsday do ano (método clássico a/b/c de Conway)
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
const yearDoomsday = (year) => yearDoomsdayParts(year).dd;

// Método alternativo "ímpar + 11"
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

// Data-referência (doomsday) de cada mês — dia do mês
function monthDoomsdayDay(month, leap) {
  // month: 1-12
  const table = [leap ? 4 : 3, leap ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12];
  return table[month - 1];
}

function monthMnemonic(month, leap) {
  switch (month) {
    case 1: return leap ? "Janeiro em ano bissexto: dia 4 (\u201cno 4º ano é 4\u201d)." : "Janeiro em ano comum: dia 3.";
    case 2: return leap ? "Último dia de fevereiro: 29 (bissexto)." : "Último dia de fevereiro: 28.";
    case 3: return "Dia do Pi: 14/03 (3.14).";
    case 4: case 6: case 8: case 10: case 12:
      return `Mês par: o dia é igual ao mês (${monthDoomsdayDay(month, leap)}/${month}).`;
    case 5: return "\u201cTrabalho das 9 às 5\u201d → 09/05.";
    case 9: return "\u201cTrabalho das 9 às 5\u201d → 05/09.";
    case 7: return "\u201c…no 7-Eleven\u201d → 11/07.";
    case 11: return "\u201c…no 7-Eleven\u201d → 07/11.";
  }
  return "";
}

// Dia da semana de qualquer data (usando o próprio método — fonte da verdade)
function weekdayOf(day, month, year) {
  const dd = yearDoomsday(year);
  const ref = monthDoomsdayDay(month, isLeap(year));
  return mod(dd + (day - ref), 7);
}

const daysInMonth = (m, y) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

const pad2 = (n) => String(n).padStart(2, "0");
const fmtDate = (d, m, y) => `${pad2(d)}/${pad2(m)}/${y}`;
const fmtTime = (ms) => (ms / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "s";

const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1)); // inclusivo

/* ---------- Estado ---------- */
const state = {
  mode: "full",
  range: [1900, 2099],
  timerLimit: 0, // segundos; 0 = livre
  question: null,       // objeto da pergunta atual
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
    // guarda no máximo 2000 tentativas
    if (store.attempts.length > 2000) store.attempts = store.attempts.slice(-2000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) { /* ignore */ }
}
let store = loadStore();

/* ---------- Elementos ---------- */
const $ = (id) => document.getElementById(id);
const els = {
  qModeBadge: $("q-mode-badge"), qPrompt: $("q-prompt"), qMain: $("q-main"), qSub: $("q-sub"),
  qTimer: $("q-timer"), qTimerValue: $("q-timer-value"),
  answersWeek: $("answers-week"), answersNum: $("answers-num"),
  numInput: $("num-input"), numSubmit: $("num-submit"),
  btnSkip: $("btn-skip"), btnNext: $("btn-next"),
  questionCard: $("question-card"), feedback: $("feedback"),
  fbVerdict: $("fb-verdict"), fbMeta: $("fb-meta"), fbAnswer: $("fb-answer"),
  stepsContainer: $("steps-container"),
};

/* ---------- Geração de perguntas ---------- */
function newQuestion() {
  const [lo, hi] = state.range;
  let q = { mode: state.mode };

  if (state.mode === "full") {
    const year = randInt(lo, hi);
    const month = randInt(1, 12);
    const day = randInt(1, daysInMonth(month, year));
    q.year = year; q.month = month; q.day = day;
    q.answer = weekdayOf(day, month, year);
    q.kind = "week";
    q.prompt = "Em que dia da semana caiu (ou cairá)…";
    q.main = fmtDate(day, month, year);
    q.sub = `${day} de ${MONTHS[month - 1]} de ${year}`;
  }
  else if (state.mode === "century") {
    // séculos dentro do intervalo escolhido (mínimo razoável: 1500–2500)
    const cLo = Math.floor(Math.max(lo, 1500) / 100);
    const cHi = Math.floor(hi / 100);
    const c = randInt(cLo, cHi);
    q.year = c * 100;
    q.answer = centuryAnchor(q.year);
    q.kind = "week";
    q.prompt = "Qual é o dia-âncora do século…";
    q.main = `${c * 100}–${c * 100 + 99}`;
    q.sub = `século de ${c * 100}`;
  }
  else if (state.mode === "year") {
    const year = randInt(lo, hi);
    q.year = year;
    q.answer = yearDoomsday(year);
    q.kind = "week";
    q.prompt = "Qual é o Doomsday do ano…";
    q.main = String(year);
    q.sub = isLeap(year) ? "⚠️ ano bissexto" : "ano comum";
  }
  else if (state.mode === "month") {
    const month = randInt(1, 12);
    const leap = Math.random() < 0.5;
    q.month = month; q.leap = leap;
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

function renderQuestion() {
  const q = state.question;
  els.qModeBadge.textContent = MODE_NAMES[q.mode];
  els.qPrompt.textContent = q.prompt;
  els.qMain.textContent = q.main;
  els.qSub.textContent = q.sub;

  // reset botões
  els.answersWeek.querySelectorAll(".ans").forEach((b) => {
    b.disabled = false; b.classList.remove("correct", "wrong");
  });
  els.numInput.value = "";

  if (q.kind === "week") {
    els.answersWeek.classList.remove("hidden");
    els.answersNum.classList.add("hidden");
  } else {
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
    }
  }, 100);
}
function stopTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}
function updateTimerDisplay() {
  const elapsed = (performance.now() - state.startTime) / 1000;
  if (state.timerLimit > 0) {
    const left = Math.max(0, state.timerLimit - elapsed);
    els.qTimerValue.textContent = "⏳ " + left.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "s";
  } else {
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

function recordAttempt({ correct, timedOut, elapsed }) {
  // sessão
  state.session.count++;
  if (correct) {
    state.session.correct++;
    state.session.streak++;
    state.session.times.push(elapsed);
  } else {
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

function answerLabel(q, value) {
  return q.kind === "week" ? WEEKDAYS[value] : `dia ${value}`;
}

function showFeedback({ correct, given, timedOut, skipped, elapsed }) {
  const q = state.question;

  // marca botões de dia da semana
  if (q.kind === "week") {
    els.answersWeek.querySelectorAll(".ans").forEach((b) => {
      const v = Number(b.dataset.dow);
      b.disabled = true;
      if (v === q.answer) b.classList.add("correct");
      else if (given !== null && v === given) b.classList.add("wrong");
    });
  }

  els.feedback.classList.remove("hidden", "ok", "no");
  els.feedback.classList.add(correct ? "ok" : "no");

  if (correct) els.fbVerdict.textContent = "✅ Acertou!";
  else if (skipped) els.fbVerdict.textContent = "⏭️ Pergunta pulada";
  else if (timedOut) els.fbVerdict.textContent = "⏰ Tempo esgotado!";
  else els.fbVerdict.textContent = "❌ Errou!";

  els.fbMeta.textContent = `tempo: ${fmtTime(elapsed)}`;

  let answerHtml = `Resposta correta: <strong>${answerLabel(q, q.answer)}</strong>`;
  if (!correct && given !== null) answerHtml += ` &nbsp;•&nbsp; você respondeu: <span style="color:var(--bad)">${answerLabel(q, given)}</span>`;
  els.fbAnswer.innerHTML = answerHtml;

  els.stepsContainer.innerHTML = buildSteps(q).join("");
  els.btnNext.focus();
}

/* ---------- Passo a passo ---------- */
function stepHtml(num, title, body, calc, final = false) {
  return `<div class="step${final ? " final" : ""}">
    <div class="step-num">${num}</div>
    <div class="step-body">
      <span class="t">${title}</span>
      ${body}
      ${calc ? `<span class="calc">${calc}</span>` : ""}
    </div>
  </div>`;
}

function buildSteps(q) {
  const steps = [];

  if (q.mode === "century") {
    const c = Math.floor(q.year / 100);
    const anchor = centuryAnchor(q.year);
    steps.push(stepHtml(1, "Fórmula da âncora do século",
      `Século = ⌊${q.year} ÷ 100⌋ = <b>${c}</b>. Aplicando a fórmula (0 = domingo):`,
      `âncora = (5 × (${c} mod 4) + 2) mod 7 = (5 × ${mod(c, 4)} + 2) mod 7 = ${mod(5 * mod(c, 4) + 2, 7)}`));
    steps.push(stepHtml(2, "Resultado",
      `Os séculos se repetem a cada 400 anos: 1700→dom, 1800→sex, 1900→qua, 2000→ter. <span class="res">Âncora de ${q.year}: ${WEEKDAYS[anchor]}.</span>`, null, true));
    return steps;
  }

  if (q.mode === "month") {
    const day = monthDoomsdayDay(q.month, q.leap);
    steps.push(stepHtml(1, `Referência de ${MONTHS[q.month - 1]}`,
      monthMnemonic(q.month, q.leap), null));
    steps.push(stepHtml(2, "Resultado",
      `<span class="res">${pad2(day)}/${pad2(q.month)} cai no Doomsday do ano${q.month <= 2 ? (q.leap ? " (bissexto)" : " (ano comum)") : ""}.</span>`, null, true));
    return steps;
  }

  // modos "year" e "full" começam iguais
  const p = yearDoomsdayParts(q.year);
  const c = Math.floor(q.year / 100);
  let n = 1;

  steps.push(stepHtml(n++, "Âncora do século",
    `O século de ${q.year} (${c}00–${c}99) tem âncora <b>${WEEKDAYS[p.anchor]}</b> (${p.anchor}).`,
    `(5 × (${c} mod 4) + 2) mod 7 = (5 × ${mod(c, 4)} + 2) mod 7 = ${p.anchor}`));

  const odd = odd11Parts(q.year);
  steps.push(stepHtml(n++, "Doomsday do ano — método a + b + c",
    `Últimos 2 dígitos: y = <b>${p.y}</b>. &nbsp;a = ⌊${p.y}÷12⌋ = ${p.a}, &nbsp;b = ${p.y} mod 12 = ${p.b}, &nbsp;c = ⌊${p.b}÷4⌋ = ${p.c}.<br/>
     Soma: ${p.a} + ${p.b} + ${p.c} = ${p.sum} ≡ ${mod(p.sum, 7)} (mod 7). Âncora + deslocamento: ${p.anchor} + ${mod(p.sum, 7)} ≡ ${p.dd}.<br/>
     <span class="res">Doomsday de ${q.year}: ${WEEKDAYS[p.dd]}.</span><br/>
     <small style="color:var(--muted)">Alternativa "ímpar+11": ${odd.steps.join(" → ")} → ${p.anchor} + ${odd.offset} ≡ ${mod(p.anchor + odd.offset, 7)} ✓</small>`,
    null, q.mode === "year"));

  if (q.mode === "year") return steps;

  // modo "full": ajuste do mês e do dia
  const leap = isLeap(q.year);
  const ref = monthDoomsdayDay(q.month, leap);
  steps.push(stepHtml(n++, `Data-referência de ${MONTHS[q.month - 1]}`,
    `${monthMnemonic(q.month, leap)}${q.month <= 2 ? ` (${q.year} ${leap ? "É bissexto" : "NÃO é bissexto"}.)` : ""}<br/>
     Logo <b>${pad2(ref)}/${pad2(q.month)}/${q.year}</b> caiu em <b>${WEEKDAYS[p.dd]}</b>.`, null));

  const diff = q.day - ref;
  const shift = mod(diff, 7);
  const dir = diff >= 0 ? "depois" : "antes";
  steps.push(stepHtml(n++, "Ajuste do dia",
    `Do dia ${ref} até o dia ${q.day}: <b>${diff >= 0 ? "+" : ""}${diff}</b> dia(s) (${Math.abs(diff)} ${dir}).`,
    `${diff} mod 7 = ${shift} → ${WEEKDAYS_SHORT[p.dd]} + ${shift} = ${WEEKDAYS_SHORT[mod(p.dd + shift, 7)]}`));

  steps.push(stepHtml(n++, "Resultado final",
    `<span class="res">${fmtDate(q.day, q.month, q.year)} → ${WEEKDAYS[q.answer]}.</span>`, null, true));

  return steps;
}

/* ---------- Sessão (strip) ---------- */
function renderSessionStrip() {
  const s = state.session;
  $("s-count").textContent = s.count;
  $("s-correct").textContent = s.correct;
  $("s-wrong").textContent = s.wrong;
  $("s-streak").textContent = s.streak;
  $("s-acc").textContent = s.count ? Math.round((s.correct / s.count) * 100) + "%" : "—";
  $("s-avg").textContent = s.times.length
    ? fmtTime(s.times.reduce((a, b) => a + b, 0) / s.times.length)
    : "—";
}

/* ---------- Estatísticas globais ---------- */
function renderStats() {
  const at = store.attempts;
  $("g-total").textContent = at.length;

  const correct = at.filter((a) => a.correct);
  $("g-acc").textContent = at.length ? Math.round((correct.length / at.length) * 100) + "%" : "—";
  $("g-best-streak").textContent = store.bestStreak || 0;

  $("g-avg-time").textContent = correct.length
    ? fmtTime(correct.reduce((s, a) => s + a.ms, 0) / correct.length)
    : "—";
  $("g-best-time").textContent = correct.length
    ? fmtTime(Math.min(...correct.map((a) => a.ms)))
    : "—";

  const today = new Date(); today.setHours(0, 0, 0, 0);
  $("g-today").textContent = at.filter((a) => a.ts >= today.getTime()).length;

  // dots
  const dots = $("history-dots");
  dots.innerHTML = "";
  at.slice(-50).forEach((a) => {
    const d = document.createElement("span");
    d.className = "hdot " + (a.correct ? "ok" : a.timedOut ? "to" : "no");
    d.title = `${MODE_NAMES[a.mode] || a.mode} • ${a.correct ? "acerto" : "erro"} • ${fmtTime(a.ms)}`;
    dots.appendChild(d);
  });
  if (!at.length) dots.innerHTML = `<span style="color:var(--muted);font-size:13px">Nenhuma tentativa ainda — vá praticar! 🎯</span>`;

  // tabela por modo
  const body = $("mode-table-body");
  body.innerHTML = "";
  Object.keys(MODE_NAMES).forEach((m) => {
    const list = at.filter((a) => a.mode === m);
    const ok = list.filter((a) => a.correct);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${MODE_NAMES[m]}</td>
      <td>${list.length}</td>
      <td>${ok.length}</td>
      <td>${list.length ? Math.round((ok.length / list.length) * 100) + "%" : "—"}</td>
      <td>${ok.length ? fmtTime(ok.reduce((s, a) => s + a.ms, 0) / ok.length) : "—"}</td>`;
    body.appendChild(tr);
  });

  drawProgressChart();
}

function drawProgressChart() {
  const canvas = $("progress-chart");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const at = store.attempts;
  const BLOCK = 10;
  const blocks = [];
  for (let i = 0; i < at.length; i += BLOCK) {
    const chunk = at.slice(i, i + BLOCK);
    if (chunk.length >= 3) blocks.push(chunk.filter((a) => a.correct).length / chunk.length);
  }

  // grade
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.fillStyle = "rgba(139,148,167,0.9)";
  ctx.font = "12px Inter, sans-serif";
  const padL = 40, padB = 24, padT = 12, padR = 10;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  for (let pct = 0; pct <= 100; pct += 25) {
    const y = padT + plotH * (1 - pct / 100);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText(pct + "%", 4, y + 4);
  }

  if (!blocks.length) {
    ctx.fillStyle = "rgba(139,148,167,0.8)";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Complete pelo menos algumas tentativas para ver sua evolução.", padL + 20, H / 2);
    return;
  }

  const step = blocks.length > 1 ? plotW / (blocks.length - 1) : 0;
  const px = (i) => (blocks.length > 1 ? padL + i * step : padL + plotW / 2);
  const py = (v) => padT + plotH * (1 - v);

  // área
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, "rgba(124,92,255,0.35)");
  grad.addColorStop(1, "rgba(124,92,255,0)");
  ctx.beginPath();
  ctx.moveTo(px(0), H - padB);
  blocks.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(blocks.length - 1), H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // linha
  ctx.beginPath();
  blocks.forEach((v, i) => (i ? ctx.lineTo(px(i), py(v)) : ctx.moveTo(px(i), py(v))));
  ctx.strokeStyle = "#9d7bff";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();

  // pontos
  blocks.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(v), 4, 0, Math.PI * 2);
    ctx.fillStyle = "#7c5cff";
    ctx.fill();
    ctx.strokeStyle = "#0b0e14";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/* ---------- Navegação por abas ---------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    $("panel-" + tab.dataset.tab).classList.add("active");
    if (tab.dataset.tab === "stats") renderStats();
  });
});

/* ---------- Config ---------- */
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
  if (!Number.isNaN(v)) submitAnswer(v);
});
els.numInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const v = parseInt(els.numInput.value, 10);
    if (!Number.isNaN(v)) submitAnswer(v);
  }
});
els.btnSkip.addEventListener("click", handleSkip);
els.btnNext.addEventListener("click", newQuestion);

$("btn-reset-stats").addEventListener("click", () => {
  if (confirm("Tem certeza? Todo o histórico de tentativas será apagado.")) {
    store = { attempts: [], bestStreak: 0 };
    saveStore();
    renderStats();
  }
});

/* ---------- Teclado ---------- */
document.addEventListener("keydown", (e) => {
  const practiceActive = $("panel-practice").classList.contains("active");
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
    [20, 7, 1969, 0], // domingo — chegada à Lua
    [1, 1, 2000, 6],  // sábado
    [7, 9, 1822, 6],  // sábado — Independência do Brasil
    [25, 12, 2025, 4],// quinta
    [29, 2, 2024, 4], // quinta
    [15, 11, 1889, 5],// sexta — Proclamação da República
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

/* ---------- Início ---------- */
renderSessionStrip();
newQuestion();

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrada:', registration.scope);
      })
      .catch((err) => {
        console.error('Falha ao registrar SW:', err);
      });
  });
}

// --- iOS Installation Banner Logic ---
function isiOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const agentScreen = navigator.appVersion || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isIPadOS = navigator.maxTouchPoints > 1 && /MacIntel/.test(userAgent);
  return isIOS || isIPadOS;
}

function isStandalone() {
  return navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
}

// Check if the user has already dismissed the banner
const dismissed = localStorage.getItem('install-banner-dismissed');

if (!isiOS() || isStandalone() || dismissed) {
  // Hide the banner on non-iOS, already standalone, or dismissed
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.add('hidden');
}

// Handle install button
const installBtn = document.getElementById('install-btn');
const closeBtn = document.getElementById('close-install-banner');
const banner = document.getElementById('install-banner');

if (installBtn && banner) {
  installBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Use Safari's share menu to prompt "Add to Home Screen"
    if (navigator.share) {
      navigator.share({
        title: 'Doomsday Mind',
        url: window.location.href,
      }).then(() => {
        // Mark as dismissed after sharing
        localStorage.setItem('install-banner-dismissed', '1');
        banner.classList.add('hidden');
      }).catch(() => {
        // fallback: just mark dismissed
        localStorage.setItem('install-banner-dismissed', '1');
        banner.classList.add('hidden');
      });
    } else {
      // fallback for browsers without Share API
      localStorage.setItem('install-banner-dismissed', '1');
      banner.classList.add('hidden');
    }
  });
}

if (closeBtn && banner) {
  closeBtn.addEventListener('click', () => {
    localStorage.setItem('install-banner-dismissed', '1');
    banner.classList.add('hidden');
  });
}
