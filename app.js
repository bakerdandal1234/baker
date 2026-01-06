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
// ✅ مع تنبيهات تفصيلية لمعرفة المشكلة

function speakText(text, btn) {
  alert('🔍 Step 1: speakText called with text: ' + text);
  
  if (!window.speechSynthesis) {
    alert('❌ ERROR: speechSynthesis غير مدعوم في المتصفح!');
    return;
  }
  
  alert('✅ Step 2: speechSynthesis موجود');

  const synth = window.speechSynthesis;
  
  // إيقاف أي صوت سابق
  synth.cancel();
  alert('✅ Step 3: تم إيقاف الأصوات السابقة');
  
  if (typeof responsiveVoice !== "undefined") {
    alert('✅ Step 4: ResponsiveVoice موجود، سيتم استخدامه');
    responsiveVoice.cancel();
  } else {
    alert('⚠️ Step 4: ResponsiveVoice غير موجود');
  }

  // تحديث UI
  if (currentBtn) {
    currentBtn.classList.remove('speaking');
  }
  btn.classList.add('speaking');
  currentBtn = btn;
  
  alert('✅ Step 5: تم تحديث UI');

  // محاولة استخدام ResponsiveVoice أولاً
  if (typeof responsiveVoice !== "undefined" && responsiveVoice.voiceSupport()) {
    try {
      alert('🎤 Step 6: محاولة ResponsiveVoice...');
      responsiveVoice.speak(text, "Deutsch Female", {
        rate: 0.8,
        onend: () => {
          alert('✅ ResponsiveVoice انتهى');
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

  // استخدام Web Speech API مباشرة
  alert('🎤 Step 7: استخدام Web Speech API');
  fallbackToWebSpeech(text, btn);
}

function fallbackToWebSpeech(text, btn) {
  alert('🔊 fallbackToWebSpeech: بدء التشغيل');
  
  const synth = window.speechSynthesis;
  
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.9;
  
  alert('✅ تم إنشاء SpeechSynthesisUtterance');

  // اختيار صوت ألماني
  const voices = synth.getVoices();
  alert('✅ عدد الأصوات المتاحة: ' + voices.length);
  
  const deVoice = voices.find(v => v.lang.startsWith('de'));
  if (deVoice) {
    utter.voice = deVoice;
    alert('✅ تم اختيار صوت ألماني: ' + deVoice.name);
  } else {
    alert('⚠️ لم يتم العثور على صوت ألماني');
  }

  utter.onstart = () => {
    alert('✅ بدأ التشغيل!');
  };

  utter.onend = () => {
    alert('✅ انتهى التشغيل');
    btn.classList.remove('speaking');
    currentBtn = null;
  };

  utter.onerror = (e) => {
    alert('❌ خطأ في التشغيل: ' + e.error + ' - ' + e.message);
    btn.classList.remove('speaking');
    currentBtn = null;
  };

  // تشغيل الصوت
  alert('🎬 محاولة التشغيل الآن...');
  try {
    synth.speak(utter);
    alert('✅ تم استدعاء synth.speak()');
  } catch (e) {
    alert('❌ Exception في synth.speak(): ' + e.message);
  }
}

// تحميل الأصوات عند بداية الصفحة
if (window.speechSynthesis) {
  alert('🎵 تحميل الأصوات...');
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    alert('✅ تم تحميل ' + voices.length + ' صوت');
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
  speakBtn.onclick = e => {
    alert('🖱️ تم الضغط على زر الصوت');
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

  card.onclick = () => {
    alert('🖱️ تم الضغط على البطاقة');
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
      exampleSpeakBtn.onclick = e => {
        alert('🖱️ تم الضغط على مثال AI');
        e.stopPropagation();
        speakText(ex, exampleSpeakBtn);
      };
      
      row.appendChild(textSpan);
      row.appendChild(exampleSpeakBtn);
      box.appendChild(row);
    });
  } catch (error) {
    box.textContent = '❌ حدث خطأ في تحميل الأمثلة';
    alert('❌ AI Error: ' + error.message);
    console.error('AI Examples Error:', error);
  }
}

// ================== INIT ==================
function initApp() {
  alert('🚀 تم بدء التطبيق');
  loadDarkMode();
  updateFavCount();
  renderSentences('shopping');
  alert('✅ تم تحميل التطبيق بنجاح');
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
