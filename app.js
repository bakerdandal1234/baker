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

// تحميل الأصوات عند بدء الصفحة
// ================== SPEECH ==================

let audioContext = null;
let isSpeaking = false;

// تفعيل AudioContext للموبايل
function unlockAudio() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (e) {
      console.log('AudioContext failed:', e);
    }
  }
}

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

// تفعيل الصوت عند أول ضغطة
let audioInitialized = false;
document.addEventListener('click', function initAudio() {
  if (!audioInitialized) {
    unlockAudio();
    
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
    }
    
    audioInitialized = true;
  }
}, { once: true });

// الدالة الرئيسية للصوت
function speakText(text, btn) {
  // منع الضغط المتعدد
  if (isSpeaking) {
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }
    if (typeof responsiveVoice !== "undefined") {
      responsiveVoice.cancel();
    }
    if (currentBtn) {
      currentBtn.classList.remove('speaking');
    }
    isSpeaking = false;
    return;
  }

  // تفعيل الصوت
  unlockAudio();

  // إزالة التأثير من الزر السابق
  if (currentBtn) {
    currentBtn.classList.remove('speaking');
  }
  
  // إضافة تأثير للزر الحالي
  btn.classList.add('speaking');
  currentBtn = btn;
  isSpeaking = true;

  // محاولة ResponsiveVoice أولاً
  try {
    if (typeof responsiveVoice !== "undefined" && responsiveVoice.voiceSupport()) {
      responsiveVoice.cancel();
      
      responsiveVoice.speak(text, "Deutsch Female", {
        rate: 0.8,
        pitch: 1,
        volume: 1,
        
        onstart: () => {
          console.log('ResponsiveVoice started');
          isSpeaking = true;
        },
        
        onend: () => {
          console.log('ResponsiveVoice ended');
          btn.classList.remove('speaking');
          isSpeaking = false;
        },
        
        onerror: (err) => {
          console.log('ResponsiveVoice error:', err);
          isSpeaking = false;
          webSpeech(text, btn);
        }
      });
      return;
    }
  } catch (e) {
    console.log("ResponsiveVoice failed:", e);
  }

  // البديل: Web Speech API
  webSpeech(text, btn);
}

// Web Speech API (البديل)
function webSpeech(text, btn) {
  if (!window.speechSynthesis) {
    alert("الصوت غير مدعوم في هذا المتصفح");
    btn.classList.remove('speaking');
    isSpeaking = false;
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  // انتظار قصير قبل التشغيل (مهم للموبايل)
  setTimeout(() => {
    const utter = new SpeechSynthesisUtterance(text);
    
    // البحث عن صوت ألماني
    const voices = synth.getVoices();
    const deVoice = voices.find(v => v.lang.includes('de'));
    
    if (deVoice) {
      utter.voice = deVoice;
    }

    utter.lang = 'de-DE';
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.volume = 1;

    utter.onstart = () => {
      console.log('Web Speech started');
      isSpeaking = true;
    };

    utter.onend = () => {
      console.log('Web Speech ended');
      btn.classList.remove('speaking');
      isSpeaking = false;
    };

    utter.onerror = (e) => {
      console.error('Web Speech error:', e);
      btn.classList.remove('speaking');
      isSpeaking = false;
      
      // إعادة المحاولة في حالة "interrupted"
      if (e.error === 'interrupted') {
        setTimeout(() => {
          synth.cancel();
          synth.speak(utter);
        }, 100);
      }
    };

    // تشغيل الصوت
    synth.speak(utter);

    // Keep-alive للموبايل (يمنع توقف الصوت)
    const keepAlive = setInterval(() => {
      if (!isSpeaking) {
        clearInterval(keepAlive);
      } else {
        synth.pause();
        synth.resume();
      }
    }, 8000);

  }, 100);
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
