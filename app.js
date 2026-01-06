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
// ================== SPEECH ==================

// تحميل الأصوات عند بدء الصفحة
window.addEventListener('load', () => {
  if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
      };
    }
  }
});

// تفعيل الصوت عند أول تفاعل (للموبايل)
document.addEventListener('click', function initAudio() {
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    speechSynthesis.speak(utterance);
  }
  document.removeEventListener('click', initAudio);
}, { once: true });

// الدالة الرئيسية للصوت
function speakText(text, btn) {
  // إزالة التأثير من الزر السابق
  if (currentBtn) {
    currentBtn.classList.remove('speaking');
  }
  
  // إضافة تأثير للزر الحالي
  btn.classList.add('speaking');
  currentBtn = btn;

  // محاولة استخدام ResponsiveVoice أولاً
  try {
    if (typeof responsiveVoice !== "undefined") {
      responsiveVoice.cancel();
      
      responsiveVoice.speak(text, "Deutsch Female", {
        rate: 0.8,
        pitch: 1,
        volume: 1,
        
        onend: () => {
          btn.classList.remove('speaking');
        },
        
        onerror: () => {
          console.log("ResponsiveVoice error, switching to Web Speech API");
          webSpeech(text, btn);
        }
      });
      return;
    }
  } catch (e) {
    console.log("ResponsiveVoice failed:", e);
  }

  // إذا فشل ResponsiveVoice -> استخدم Web Speech API
  webSpeech(text, btn);
}

// Web Speech API (البديل)
function webSpeech(text, btn) {
  // تحقق من دعم المتصفح
  if (!window.speechSynthesis) {
    alert("النطق غير مدعوم في هذا المتصفح");
    btn.classList.remove('speaking');
    return;
  }

  const synth = window.speechSynthesis;
  
  // إلغاء أي صوت سابق
  synth.cancel();

  // إنشاء كائن النطق
  const utter = new SpeechSynthesisUtterance(text);
  
  // البحث عن صوت ألماني
  const voices = synth.getVoices();
  const deVoice = voices.find(v => v.lang.startsWith("de"));
  
  if (deVoice) {
    utter.voice = deVoice;
  }

  // إعدادات الصوت
  utter.lang = 'de-DE';
  utter.rate = 0.9;
  utter.pitch = 1;
  utter.volume = 1;

  // عند انتهاء الصوت
  utter.onend = () => {
    btn.classList.remove('speaking');
  };

  // عند حدوث خطأ
  utter.onerror = (e) => {
    console.error('Speech error:', e);
    btn.classList.remove('speaking');
  };

  // تشغيل الصوت
  synth.speak(utter);
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
    row.innerHTML = `${ex} <button>🔊</button>`;
    row.querySelector('button').onclick = e => {
      e.stopPropagation();
      speakText(ex, e.target);
    };
    box.appendChild(row);
  });
}

// ================== INIT ==================
function initApp() {
  loadDarkMode();
  updateFavCount();
  renderSentences('shopping');
}

document.addEventListener('DOMContentLoaded', initApp);
