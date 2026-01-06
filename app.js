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
// function speakText(text, btn) {
//   if (currentBtn) currentBtn.classList.remove('speaking');
//   currentBtn = btn;
//   btn.classList.add('speaking');

//   responsiveVoice.speak(text, "Deutsch Female", {
//     rate: 0.85,
//     onend: () => btn.classList.remove('speaking')
//   });
// }

// function speakText(text, btn) {
//   // اختبار 1: هل الزر يشتغل أصلاً؟
//   alert('تم الضغط على الزر!');
  
//   // اختبار 2: هل المكتبة موجودة؟
//   if (!responsiveVoice) {
//     alert('خطأ: ResponsiveVoice غير موجود!');
//     return;
//   }
  
//   if (currentBtn) currentBtn.classList.remove('speaking');
//   currentBtn = btn;
//   btn.classList.add('speaking');

//   responsiveVoice.speak(text, "Deutsch Female", {
//     rate: 0.85,
//     onend: () => btn.classList.remove('speaking'),
//     onerror: (err) => alert('خطأ في الصوت: ' + err) // اختبار 3
//   });
// }

let currentBtn = null;
let isSpeaking = false;

function speakText(text, btn) {
  // منع الضغط المتعدد
  if (isSpeaking) {
    speechSynthesis.cancel();
    return;
  }

  const testDiv = document.createElement('div');
  testDiv.style.cssText = 'position:fixed;top:10px;left:10px;right:10px;background:rgba(0,0,0,0.9);color:white;padding:15px;z-index:9999;font-size:14px;border-radius:8px;';
  testDiv.innerHTML = '⏳ تحضير الصوت...';
  document.body.appendChild(testDiv);

  if (currentBtn) currentBtn.classList.remove('speaking');
  currentBtn = btn;
  btn.classList.add('speaking');

  // إلغاء أي صوت سابق تماماً
  speechSynthesis.cancel();
  
  // انتظار أطول قبل التشغيل
  setTimeout(() => {
    isSpeaking = true;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // مهم جداً: تعيين الصوت بشكل صحيح
    const voices = speechSynthesis.getVoices();
    const germanVoice = voices.find(v => v.lang.includes('de'));
    if (germanVoice) {
      utterance.voice = germanVoice;
    }
    
    utterance.onstart = () => {
      testDiv.innerHTML = '🔊 الصوت يعمل!';
      isSpeaking = true;
    };
    
    utterance.onend = () => {
      testDiv.innerHTML = '✅ انتهى الصوت';
      btn.classList.remove('speaking');
      isSpeaking = false;
      setTimeout(() => testDiv.remove(), 1500);
    };
    
    utterance.onerror = (e) => {
      testDiv.innerHTML = '❌ خطأ: ' + e.error;
      btn.classList.remove('speaking');
      isSpeaking = false;
      
      // إعادة المحاولة تلقائياً
      if (e.error === 'interrupted') {
        testDiv.innerHTML += '<br>🔄 إعادة المحاولة...';
        setTimeout(() => {
          speechSynthesis.cancel();
          speechSynthesis.speak(utterance);
        }, 300);
      }
    };

    // التشغيل
    speechSynthesis.speak(utterance);
    
    // حل Chrome Mobile: إبقاء الصوت نشطاً
    const keepAlive = setInterval(() => {
      if (!isSpeaking) {
        clearInterval(keepAlive);
      } else {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 5000);
    
  }, 250); // انتظار 250ms مهم جداً!
}

// تحميل الأصوات مسبقاً عند فتح الصفحة
window.addEventListener('load', () => {
  speechSynthesis.getVoices();
  
  // تفعيل الصوت عند أول ضغطة في أي مكان
  document.addEventListener('click', function initAudio() {
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    speechSynthesis.speak(utterance);
    document.removeEventListener('click', initAudio);
  }, { once: true });
});

// مهم: إعادة تحميل الأصوات
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
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
