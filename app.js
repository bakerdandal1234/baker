// ================== STATE ==================
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;
let currentLevel = 'all';

// ================== VOICES / DEBUG ==================
const DEBUG = false;
let availableVoices = [];

// تحميل الأصوات بشكل موثوق
function loadVoices() {
  if (!window.speechSynthesis) {
    if (DEBUG) console.log('speechSynthesis غير مدعوم');
    return;
  }

  const synth = window.speechSynthesis;
  availableVoices = synth.getVoices() || [];

  if (availableVoices.length === 0) {
    // تُنادى عندما تصبح الأصوات جاهزة
    synth.onvoiceschanged = () => {
      availableVoices = synth.getVoices() || [];
      if (DEBUG) console.log('voices loaded', availableVoices);
    };
  } else {
    if (DEBUG) console.log('voices already available', availableVoices);
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
  document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
}

function loadDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').textContent = '☀️';
  }
}

// ================== FAVORITES ==================
function updateFavCount() {
  document.getElementById('favCount').textContent = favorites.length;
}

function toggleFavorite(sentence, e) {
  e.stopPropagation();

  const index = favorites.findIndex(
    f => f.german === sentence.german && f.arabic === sentence.arabic
  );

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(sentence);
  }

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

  grid.innerHTML = '';

  const filtered = favorites.filter(
    s => currentLevel === 'all' || s.level === currentLevel
  );

  if (filtered.length === 0) {
    noFav.style.display = 'block';
    grid.style.display = 'none';
    return;
  }

  noFav.style.display = 'none';
  grid.style.display = 'grid';

  filtered.forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== SPEECH ==================

let currentUtterance = null;

// تشغيل الصوت (نقطة الدخول الوحيدة)
function speakText(text, btn) {
  if (!window.speechSynthesis) {
    if (DEBUG) console.warn('speechSynthesis غير مدعوم في المتصفح');
    return;
  }

  const synth = window.speechSynthesis;

  // إيقاف أي صوت سابق
  try {
    synth.cancel();
  } catch (e) {
    if (DEBUG) console.error('خطأ عند cancel():', e);
  }
  currentUtterance = null;
  if (typeof responsiveVoice !== "undefined") {
    try {
      // إذا كانت responsiveVoice متاحة ومؤيدة للأصوات ستحاول استخدامها أولاً
      if (typeof responsiveVoice.voiceSupport === 'function' ? responsiveVoice.voiceSupport() : true) {
        responsiveVoice.cancel();
        responsiveVoice.speak(text, "Deutsch Female", {
          rate: 0.8,
          onend: () => {
            try { btn.classList.remove('speaking'); } catch(e){}
          },
          onerror: () => {
            // فشل responsiveVoice -> اعادة المحاولة عبر Web Speech API
            if (DEBUG) console.log('responsiveVoice failed, falling back to webSpeech');
            webSpeech(text, btn);
          }
        });
        // نجح الاستدعاء (أو على الأقل حاول responsiveVoice). نخرج.
        if (DEBUG) console.log('used responsiveVoice for:', text);
        // واجهة المستخدم
        if (currentBtn) currentBtn.classList.remove('speaking');
        btn.classList.add('speaking');
        currentBtn = btn;
        return;
      }
    } catch (e) {
      if (DEBUG) console.error('responsiveVoice threw:', e);
      // استمرار إلى webSpeech كـ fallback
    }
  }

  // UI
  if (currentBtn) currentBtn.classList.remove('speaking');
  btn.classList.add('speaking');
  currentBtn = btn;

  // fallback آمن
  webSpeech(text, btn);
}

// Web Speech API — آمن للموبايل
function webSpeech(text, btn) {
  if (!window.speechSynthesis) {
    if (DEBUG) console.warn('speechSynthesis غير متاح');
    try { btn.classList.remove('speaking'); } catch(e){}
    return;
  }

  const synth = window.speechSynthesis;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;

  // اختيار صوت ألماني إن وُجد
  const voices = availableVoices.length ? availableVoices : (synth.getVoices() || []);
  const deVoice = voices.find(v => v.lang && v.lang.startsWith('de'));
  if (deVoice) {
    utter.voice = deVoice;
    if (DEBUG) console.log('selected german voice:', deVoice.name, deVoice.lang);
  } else {
    if (DEBUG) console.log('no german voice found, using default voice');
  }

  utter.onend = () => {
    try { btn.classList.remove('speaking'); } catch(e){}
    currentUtterance = null;
  };

  utter.onerror = (e) => {
    console.error('speech utter error:', e);
    try { btn.classList.remove('speaking'); } catch(e){}
    currentUtterance = null;
  };

  currentUtterance = utter;

  try {
    // قد ترفض المتصفحات speak() في حالات نادرة — لذا نستخدم try/catch
    synth.speak(utter);
  } catch (err) {
    console.error('speak() threw:', err);
    try { btn.classList.remove('speaking'); } catch(e){}
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

  card.append(
    favBtn,
    speakBtn,
    level,
    german,
    arabic,
    aiBtn,
    usage
  );

  card.onclick = () => speakText(sentence.german, speakBtn);

  return card;
}

// ================== RENDER TABS ==================
function renderSentences(tabId) {
  const grid = document.querySelector(`#${tabId} .sentences-grid`);
  if (!grid || !sentencesData[tabId]) return;

  grid.innerHTML = '';

  sentencesData[tabId]
    .filter(s => currentLevel === 'all' || s.level === currentLevel)
    .forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== TABS ==================
function openTab(e, tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  e.currentTarget.classList.add('active');

  if (tabId === 'favorites') {
    renderFavorites();
  } else {
    renderSentences(tabId);
  }
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
      body: JSON.stringify({
        german: sentence.german,
        level: sentence.level
      })
    });

    if (!res.ok) {
      throw new Error('API responded with ' + res.status);
    }

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
    console.error('Failed to load AI examples:', err);
    box.textContent = 'خطأ في توليد الأمثلة';
  }
}

// ================== INIT ==================
function initApp() {
  loadDarkMode();
  updateFavCount();
  renderSentences('shopping');
  loadVoices(); // تحميل الأصوات عند بدء التطبيق
  if (DEBUG) {
    console.log('initApp done. speechSynthesis supported?', !!window.speechSynthesis);
    console.log('initial voices:', window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
