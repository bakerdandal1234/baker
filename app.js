// ================== STATE ==================
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;
let currentLevel = 'all';

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
  const favCountElement = document.getElementById('favCount');
  if (favCountElement) {
    favCountElement.textContent = favorites.length;
  }
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

  if (!grid) return;

  grid.innerHTML = '';

  const filtered = favorites.filter(
    s => currentLevel === 'all' || s.level === currentLevel
  );

  if (filtered.length === 0) {
    if (noFav) noFav.style.display = 'block';
    grid.style.display = 'none';
    return;
  }

  if (noFav) noFav.style.display = 'none';
  grid.style.display = 'grid';

  filtered.forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== VOICE UTILS ==================
function getGermanVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith('de')) || null;
}

function speakText(text, btn = null) {
  const synth = window.speechSynthesis;
  synth.cancel();

  if (btn) {
    if (currentBtn) currentBtn.classList.remove('speaking');
    currentBtn = btn;
    btn.classList.add('speaking');
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;

  const deVoice = getGermanVoice();
  if (deVoice) utter.voice = deVoice;

  utter.onend = () => {
    if (btn) btn.classList.remove('speaking');
    currentBtn = null;
  };
  utter.onerror = () => {
    if (btn) btn.classList.remove('speaking');
    currentBtn = null;
  };

  synth.speak(utter);
}

// ================== CARD ==================
function renderSentenceCard(sentence) {
  const card = document.createElement('div');
  card.className = 'sentence-card';

  // زر المفضلة
  const favBtn = document.createElement('button');
  favBtn.className = 'favorite-btn';
  favBtn.textContent = isFavorite(sentence) ? '★' : '☆';
  favBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isFav = toggleFavorite(sentence, e);
    this.textContent = isFav ? '★' : '☆';
  });

  // زر الصوت
  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.textContent = '🔊';
  speakBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    speakText(sentence.german, this);
  });

  // المستوى
  const level = document.createElement('div');
  level.className = `level-badge level-${sentence.level}`;
  level.textContent = sentence.level;

  // النص الألماني
  const german = document.createElement('div');
  german.className = 'german';
  german.textContent = sentence.german;

  // النص العربي
  const arabic = document.createElement('div');
  arabic.className = 'arabic';
  arabic.textContent = sentence.arabic;

  // الاستخدام
  const usage = document.createElement('div');
  usage.className = 'usage';
  usage.innerHTML = `<b>متى تستخدمها:</b> ${sentence.usage}`;

  // زر AI
  const aiBtn = document.createElement('button');
  aiBtn.className = 'ai-btn';
  aiBtn.textContent = '🧠 AI ';
  aiBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    loadAIExamples(card, sentence);
  });

  // تجميع العناصر
  card.append(favBtn, speakBtn, level, german, arabic, aiBtn, usage);

  // الضغط على البطاقة لتشغيل الصوت
  card.addEventListener('click', function() {
    speakText(sentence.german, speakBtn);
  });

  return card;
}

// ================== RENDER TABS ==================
function renderSentences(tabId) {
  const grid = document.querySelector(`#${tabId} .sentences-grid`);
  if (!grid) return;

  if (!sentencesData || !sentencesData[tabId]) return;

  grid.innerHTML = '';

  const sentences = sentencesData[tabId].filter(
    s => currentLevel === 'all' || s.level === currentLevel
  );

  sentences.forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== TABS ==================
function openTab(e, tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

  const tabElement = document.getElementById(tabId);
  if (tabElement) tabElement.classList.add('active');

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

    const data = await res.json();
    box.innerHTML = '';

    data.examples.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'example-row';
      const textSpan = document.createElement('span');
      textSpan.textContent = ex;

      const exampleSpeakBtn = document.createElement('button');
      exampleSpeakBtn.textContent = '🔊';
      exampleSpeakBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        speakText(ex);
      });

      row.appendChild(textSpan);
      row.appendChild(exampleSpeakBtn);
      box.appendChild(row);
    });
  } catch (error) {
    box.textContent = '❌ حدث خطأ في تحميل الأمثلة';
    console.error('AI Examples Error:', error);
  }
}

// ================== INIT ==================
function initApp() {
  console.log('🚀 App initializing...');

  loadDarkMode();
  updateFavCount();

  if (typeof sentencesData === 'undefined') {
    console.error('❌ CRITICAL: sentencesData is not defined!');
    alert('خطأ: البيانات غير موجودة. تأكد من تحميل data.js قبل app.js');
    return;
  }

  // تحميل الأصوات
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('Voices available:', window.speechSynthesis.getVoices());
    };
  }

  renderSentences('shopping');
  console.log('✅ App initialized successfully');
}

// ================== تشغيل التطبيق ==================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
