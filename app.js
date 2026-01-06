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
// ✅ الحل: تشغيل الصوت مباشرة بدون أي تأخير

function speakText(text, btn) {
  if (!window.speechSynthesis) {
    alert("النطق غير مدعوم في هذا المتصفح");
    return;
  }

  const synth = window.speechSynthesis;
  
  // إيقاف أي صوت سابق
  synth.cancel();
  if (typeof responsiveVoice !== "undefined") {
    responsiveVoice.cancel();
  }

  // تحديث UI
  if (currentBtn) {
    currentBtn.classList.remove('speaking');
  }
  btn.classList.add('speaking');
  currentBtn = btn;

  // محاولة استخدام ResponsiveVoice أولاً (إن كان متوفراً)
  if (typeof responsiveVoice !== "undefined" && responsiveVoice.voiceSupport()) {
    try {
      responsiveVoice.speak(text, "Deutsch Female", {
        rate: 0.8,
        onend: () => {
          btn.classList.remove('speaking');
          currentBtn = null;
        },
        onerror: () => {
          // إذا فشل ResponsiveVoice، استخدم Web Speech API
          fallbackToWebSpeech(text, btn);
        }
      });
      return;
    } catch (e) {
      console.log("ResponsiveVoice failed, using fallback");
    }
  }

  // استخدام Web Speech API مباشرة
  fallbackToWebSpeech(text, btn);
}

function fallbackToWebSpeech(text, btn) {
  const synth = window.speechSynthesis;
  
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;

  // اختيار صوت ألماني إن وُجد
  const voices = synth.getVoices();
  const deVoice = voices.find(v => v.lang.startsWith('de'));
  if (deVoice) {
    utter.voice = deVoice;
  }

  utter.onend = () => {
    btn.classList.remove('speaking');
    currentBtn = null;
  };

  utter.onerror = () => {
    btn.classList.remove('speaking');
    currentBtn = null;
  };

  // ⚠️ مهم جداً: تشغيل الصوت مباشرة بدون أي async
  synth.speak(utter);
}

// تحميل الأصوات عند بداية الصفحة
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
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
  // ✅ الحل: استدعاء مباشر بدون stopPropagation
  speakBtn.onclick = e => {
    e.stopPropagation();
    // تشغيل الصوت فوراً
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

  // ✅ تشغيل الصوت عند الضغط على البطاقة نفسها
  card.onclick = () => {
    speakText(sentence.german, speakBtn);
  };

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

    const data = await res.json();
    box.innerHTML = '';

    data.examples.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'example-row';
      
      const textSpan = document.createElement('span');
      textSpan.textContent = ex;
      
      const exampleSpeakBtn = document.createElement('button');
      exampleSpeakBtn.textContent = '🔊';
      // ✅ الحل: تشغيل مباشر للأمثلة أيضاً
      exampleSpeakBtn.onclick = e => {
        e.stopPropagation();
        speakText(ex, exampleSpeakBtn);
      };
      
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
  loadDarkMode();
  updateFavCount();
  renderSentences('shopping');
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
