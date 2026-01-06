// ================== STATE ==================
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;
let currentLevel = 'all';

// ================== DEBUG / VISUAL LOG ==================
const USE_ALERTS = false; // ضع true إذا تريد رسائل alert أيضاً
let debugPanel = null;

function ensureDebugPanel() {
  if (debugPanel) return;
  debugPanel = document.createElement('div');
  debugPanel.id = 'debugPanel';
  Object.assign(debugPanel.style, {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
    width: '320px',
    maxHeight: '45vh',
    overflow: 'auto',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '8px',
    fontSize: '12px',
    zIndex: 99999,
    borderRadius: '6px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
  });
  document.body.appendChild(debugPanel);
}

function debug(msg, level = 'log') {
  try {
    ensureDebugPanel();
    const time = new Date().toLocaleTimeString();
    let text = '';
    if (typeof msg === 'string') text = msg;
    else if (msg instanceof Error) text = msg.message + (msg.stack ? '\n' + msg.stack : '');
    else text = JSON.stringify(msg, null, 2);
    const line = document.createElement('div');
    line.style.marginBottom = '6px';
    line.innerText = `[${time}] ${level.toUpperCase()}: ${text}`;
    debugPanel.appendChild(line);
    debugPanel.scrollTop = debugPanel.scrollHeight;
    if (USE_ALERTS) alert(level.toUpperCase() + ': ' + text);
  } catch (e) {
    try { if (USE_ALERTS) alert('DEBUG FAILED: ' + String(e)); } catch(_) {}
  }
}

// ================== VOICES / DEBUG ==================
let availableVoices = [];

function loadVoices() {
  if (!window.speechSynthesis) {
    debug('speechSynthesis غير مدعوم', 'warn');
    return;
  }

  const synth = window.speechSynthesis;
  availableVoices = synth.getVoices() || [];

  if (availableVoices.length === 0) {
    debug('لا توجد أصوات حالياً - تسجيل onvoiceschanged', 'log');
    synth.onvoiceschanged = () => {
      try {
        availableVoices = synth.getVoices() || [];
        debug({ msg: 'voices loaded', voices: availableVoices.map(v => v.name + '|' + v.lang) }, 'log');
      } catch (e) {
        debug({ msg: 'onvoiceschanged error', err: e }, 'error');
      }
    };
  } else {
    debug({ msg: 'voices available initially', voices: availableVoices.map(v => v.name + '|' + v.lang) }, 'log');
  }
}

// ================== LEVEL FILTER ==================
function filterByLevel(level) {
  currentLevel = level;
  document.querySelectorAll('.level-filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (
      btn.textContent.includes(level) ||
      (level === 'all' && btn.textContent.includes('الكل'))
    ) {
      btn.classList.add('active');
    }
  });

  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  if (activeTab.id === 'favorites') {
    renderFavorites();
  } else {
    renderSentences(activeTab.id);
  }
}

// ================== DARK MODE ==================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  const dm = document.getElementById('darkModeToggle');
  if (dm) dm.textContent = isDark ? '☀️' : '🌙';
}

function loadDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const dm = document.getElementById('darkModeToggle');
    if (dm) dm.textContent = '☀️';
  }
}

// ================== FAVORITES ==================
function updateFavCount() {
  const el = document.getElementById('favCount');
  if (el) el.textContent = favorites.length;
}

function toggleFavorite(sentence, e) {
  e.stopPropagation();
  const index = favorites.findIndex(
    f => f.german === sentence.german && f.arabic === sentence.arabic
  );

  if (index > -1) favorites.splice(index, 1);
  else favorites.push(sentence);

  localStorage.setItem('shortSentencesFavorites', JSON.stringify(favorites));
  updateFavCount();
  return index === -1;
}

function isFavorite(sentence) {
  return favorites.some(
    f => f.german === sentence.german && f.arabic === sentence.arabic
  );
}

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const noFav = document.getElementById('noFavorites');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = favorites.filter(s => currentLevel === 'all' || s.level === currentLevel);
  if (filtered.length === 0) {
    if (noFav) noFav.style.display = 'block';
    grid.style.display = 'none';
    return;
  }
  if (noFav) noFav.style.display = 'none';
  grid.style.display = 'grid';
  filtered.forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== SPEECH ==================
let currentUtterance = null;

function speakText(text, btn) {
  if (!window.speechSynthesis) {
    debug('speechSynthesis غير مدعوم في المتصفح', 'warn');
    try { if (btn) btn.classList.remove('speaking'); } catch(_) {}
    return;
  }

  const synth = window.speechSynthesis;

  try {
    synth.cancel();
  } catch (e) {
    debug({ msg: 'cancel() threw', err: e }, 'error');
  }
  currentUtterance = null;

  if (typeof responsiveVoice !== "undefined") {
    try {
      if (typeof responsiveVoice.voiceSupport === 'function' ? responsiveVoice.voiceSupport() : true) {
        responsiveVoice.cancel();
        responsiveVoice.speak(text, "Deutsch Female", {
          rate: 0.8,
          onend: () => { try { if (btn) btn.classList.remove('speaking'); } catch(_) {} },
          onerror: () => {
            debug('responsiveVoice error -> fallback webSpeech', 'warn');
            webSpeech(text, btn);
          }
        });
        debug('used responsiveVoice for: ' + text, 'log');
        if (currentBtn) currentBtn.classList.remove('speaking');
        if (btn) btn.classList.add('speaking');
        currentBtn = btn;
        return;
      }
    } catch (e) {
      debug({ msg: 'responsiveVoice threw', err: e }, 'error');
    }
  }

  if (currentBtn) try { currentBtn.classList.remove('speaking'); } catch(_) {}
  if (btn) try { btn.classList.add('speaking'); } catch(_) {}
  currentBtn = btn;

  webSpeech(text, btn);
}

function webSpeech(text, btn) {
  if (!window.speechSynthesis) {
    debug('speechSynthesis unavailable', 'warn');
    try { if (btn) btn.classList.remove('speaking'); } catch(_) {}
    return;
  }

  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;

  const voices = availableVoices.length ? availableVoices : (synth.getVoices() || []);
  const deVoice = voices.find(v => v.lang && v.lang.startsWith('de'));
  if (deVoice) {
    utter.voice = deVoice;
    debug('selected german voice: ' + (deVoice.name || deVoice.lang), 'log');
  } else {
    debug('no german voice found, using default', 'log');
  }

  utter.onend = () => {
    try { if (btn) btn.classList.remove('speaking'); } catch(_) {}
    currentUtterance = null;
    debug('utter.onend', 'log');
  };

  utter.onerror = (e) => {
    debug({ msg: 'utter.onerror', err: e }, 'error');
    try { if (btn) btn.classList.remove('speaking'); } catch(_) {}
    currentUtterance = null;
  };

  currentUtterance = utter;

  try {
    synth.speak(utter);
    debug('synth.speak called for: ' + text, 'log');
  } catch (err) {
    debug({ msg: 'synth.speak threw', err: err }, 'error');
    try { if (btn) btn.classList.remove('speaking'); } catch(_) {}
    currentUtterance = null;
  }
}

// ================== CARD ==================
function renderSentenceCard(sentence) {
  const card = document.createElement('div');
  card.className = 'sentence-card';

  const favBtn = document.createElement('button');
  favBtn.className = 'favorite-btn';
  favBtn.textContent = isFavorite(sentence) ? '★' : '☆';
  favBtn.onclick = e => {
    favBtn.textContent = toggleFavorite(sentence, e) ? '★' : '☆';
  };

  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.textContent = '🔊';
  speakBtn.onclick = e => {
    e.stopPropagation();
    speakText(sentence.german, speakBtn);
  };

  const level = document.createElement('div');
  level.className = `level-badge level-${sentence.level}`;
  level.textContent = sentence.level;

  const german = document.createElement('div');
  german.className = 'german';
  german.textContent = sentence.german;

  const arabic = document.createElement('div');
  arabic.className = 'arabic';
  arabic.textContent = sentence.arabic;

  const usage = document.createElement('div');
  usage.className = 'usage';
  usage.innerHTML = `<b>متى تستخدمها:</b> ${sentence.usage}`;

  const aiBtn = document.createElement('button');
  aiBtn.className = 'ai-btn';
  aiBtn.textContent = '🧠 AI ';
  aiBtn.onclick = e => {
    e.stopPropagation();
    loadAIExamples(card, sentence);
  };

  card.append(favBtn, speakBtn, level, german, arabic, aiBtn, usage);
  card.onclick = () => speakText(sentence.german, speakBtn);
  return card;
}

// ================== RENDER TABS ==================
function renderSentences(tabId) {
  const grid = document.querySelector(`#${tabId} .sentences-grid`);
  if (!grid || !sentencesData || !sentencesData[tabId]) return;
  grid.innerHTML = '';
  sentencesData[tabId]
    .filter(s => currentLevel === 'all' || s.level === currentLevel)
    .forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== TABS ==================
function openTab(e, tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  const tabEl = document.getElementById(tabId);
  if (tabEl) tabEl.classList.add('active');
  if (e && e.currentTarget) e.currentTarget.classList.add('active');
  if (tabId === 'favorites') renderFavorites();
  else renderSentences(tabId);
}

// ================== AI EXAMPLES ==================
async function loadAIExamples(card, sentence) {
  let box = card.querySelector('.ai-examples');
  if (box) return box.remove();
  box = document.createElement('div');
  box.className = 'ai-examples';
  box.textContent = '⏳ يتم توليد أمثلة...';
  card.appendChild(box);

  try {
    const res = await fetch('https://baker-l14t.onrender.com/api/generate-examples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ german: sentence.german, level: sentence.level })
    });
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    box.innerHTML = '';
    (data.examples || []).forEach(ex => {
      const row = document.createElement('div');
      row.className = 'example-row';
      row.innerHTML = `${ex} <button>🔊</button>`;
      row.querySelector('button').onclick = e => {
        e.stopPropagation();
        speakText(ex, e.target);
      };
      box.appendChild(row);
    });
  } catch (err) {
    debug({ msg: 'Failed to load AI examples', err }, 'error');
    box.textContent = 'خطأ في توليد الأمثلة';
  }
}

// ================== TEST UI ==================
function createTestUI() {
  try {
    const container = document.createElement('div');
    container.id = 'testControls';
    Object.assign(container.style, {
      position: 'fixed', left: '10px', bottom: '10px', zIndex: 99998
    });

    const testBtn = document.createElement('button');
    testBtn.textContent = 'اختبر الصوت';
    Object.assign(testBtn.style, { padding: '8px 12px', fontSize: '14px' });

    testBtn.onclick = () => {
      debug('Test button clicked - will try speak "Guten Tag"', 'log');
      // نستخدم زر وهمي ليُمرّر إلى speakText حتى تُرى حالة الـ UI
      const fakeBtn = document.createElement('button');
      fakeBtn.className = 'speak-btn';
      speakText('Guten Tag', fakeBtn);
    };

    container.appendChild(testBtn);
    document.body.appendChild(container);
  } catch (e) {
    debug({ msg: 'createTestUI threw', err: e }, 'error');
  }
}

// ================== INIT ==================
function initApp() {
  loadDarkMode();
  updateFavCount();
  try { renderSentences('shopping'); } catch(e) { debug({ msg: 'renderSentences error', err: e }, 'error'); }
  loadVoices();
  createTestUI();
  debug({ msg: 'initApp done', speechSynthesisSupported: !!window.speechSynthesis }, 'log');
  debug({ msg: 'initial voices', voices: window.speechSynthesis ? window.speechSynthesis.getVoices().map(v => v.name + '|' + v.lang) : [] }, 'log');
}

document.addEventListener('DOMContentLoaded', initApp);
