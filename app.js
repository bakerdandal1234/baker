// ================== STATE ==================
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;
let currentLevel = 'all';

// تنبيه عند تحميل الملف
console.log('🚀 JavaScript file loaded!');
alert('🚀 JavaScript file loaded!');

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

// ================== SPEECH ==================
function speakText(text, btn) {
  console.log('🔍 speakText called with:', text);
  alert('🔍 speakText called with: ' + text);
  
  if (!window.speechSynthesis) {
    alert('❌ speechSynthesis NOT supported!');
    return;
  }
  
  alert('✅ speechSynthesis supported');

  const synth = window.speechSynthesis;
  synth.cancel();
  
  if (typeof responsiveVoice !== "undefined") {
    responsiveVoice.cancel();
  }

  if (currentBtn) {
    currentBtn.classList.remove('speaking');
  }
  btn.classList.add('speaking');
  currentBtn = btn;

  // محاولة ResponsiveVoice
  if (typeof responsiveVoice !== "undefined" && responsiveVoice.voiceSupport()) {
    try {
      alert('🎤 Using ResponsiveVoice');
      responsiveVoice.speak(text, "Deutsch Female", {
        rate: 0.8,
        onend: () => {
          btn.classList.remove('speaking');
          currentBtn = null;
        },
        onerror: (err) => {
          alert('❌ ResponsiveVoice Error: ' + err);
          fallbackToWebSpeech(text, btn);
        }
      });
      return;
    } catch (e) {
      alert('❌ ResponsiveVoice Exception: ' + e.message);
    }
  }

  fallbackToWebSpeech(text, btn);
}

function fallbackToWebSpeech(text, btn) {
  alert('🔊 Using Web Speech API');
  
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;

  const voices = synth.getVoices();
  alert('Voices available: ' + voices.length);
  
  const deVoice = voices.find(v => v.lang.startsWith('de'));
  if (deVoice) {
    utter.voice = deVoice;
    alert('✅ German voice found: ' + deVoice.name);
  } else {
    alert('⚠️ No German voice');
  }

  utter.onstart = () => alert('✅ Started!');
  utter.onend = () => {
    alert('✅ Ended');
    btn.classList.remove('speaking');
    currentBtn = null;
  };
  utter.onerror = (e) => {
    alert('❌ Error: ' + e.error);
    btn.classList.remove('speaking');
    currentBtn = null;
  };

  alert('🎬 Calling speak()...');
  synth.speak(utter);
  alert('✅ speak() called');
}

// ================== CARD ==================
function renderSentenceCard(sentence) {
  console.log('Creating card for:', sentence.german);
  
  const card = document.createElement('div');
  card.className = 'sentence-card';

  const favBtn = document.createElement('button');
  favBtn.className = 'favorite-btn';
  favBtn.textContent = isFavorite(sentence) ? '★' : '☆';
  favBtn.onclick = e => {
    console.log('Favorite button clicked');
    favBtn.textContent = toggleFavorite(sentence, e) ? '★' : '☆';
  };

  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.textContent = '🔊';
  speakBtn.onclick = function(e) {
    console.log('🖱️ Speak button clicked!');
    alert('🖱️ Speak button clicked!');
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

  card.onclick = function() {
    console.log('🖱️ Card clicked!');
    alert('🖱️ Card clicked!');
    speakText(sentence.german, speakBtn);
  };

  return card;
}

// ================== RENDER TABS ==================
function renderSentences(tabId) {
  console.log('Rendering tab:', tabId);
  
  const grid = document.querySelector(`#${tabId} .sentences-grid`);
  if (!grid) {
    console.error('Grid not found for:', tabId);
    alert('❌ Grid not found for: ' + tabId);
    return;
  }
  
  if (!sentencesData || !sentencesData[tabId]) {
    console.error('No data for tab:', tabId);
    alert('❌ No data for tab: ' + tabId);
    return;
  }

  grid.innerHTML = '';

  const sentences = sentencesData[tabId].filter(
    s => currentLevel === 'all' || s.level === currentLevel
  );
  
  console.log('Rendering', sentences.length, 'sentences');

  sentences.forEach(s => grid.appendChild(renderSentenceCard(s)));
}

// ================== TABS ==================
function openTab(e, tabId) {
  console.log('Opening tab:', tabId);
  
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

  const tabElement = document.getElementById(tabId);
  if (tabElement) {
    tabElement.classList.add('active');
  }
  
  if (e && e.currentTarget) {
    e.currentTarget.classList.add('active');
  }

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
      exampleSpeakBtn.onclick = function(e) {
        alert('🖱️ AI example clicked');
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
  console.log('🚀 initApp called');
  alert('🚀 initApp starting...');
  
  loadDarkMode();
  updateFavCount();
  
  // Check if sentencesData exists
  if (typeof sentencesData === 'undefined') {
    alert('❌ CRITICAL: sentencesData is not defined!');
    return;
  }
  
  alert('✅ sentencesData exists');
  renderSentences('shopping');
  alert('✅ App initialized');
}

// تشغيل عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

console.log('📄 Script finished loading');
