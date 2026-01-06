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

  // ✅ زر الصوت - الحل الصحيح
  const speakBtn = document.createElement('button');
  speakBtn.className = 'speak-btn';
  speakBtn.textContent = '🔊';
  
  speakBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    // تحديث UI
    if (currentBtn) {
      currentBtn.classList.remove('speaking');
    }
    this.classList.add('speaking');
    currentBtn = this;
    
    // ✅ تشغيل الصوت مباشرة (بدون دالة وسيطة)
    const synth = window.speechSynthesis;
    synth.cancel();
    
    const utter = new SpeechSynthesisUtterance(sentence.german);
    utter.lang = 'de-DE';
    utter.rate = 0.9;
    
    // اختيار صوت ألماني
    const voices = synth.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de'));
    if (deVoice) {
      utter.voice = deVoice;
    }
    
    // Events
    const btnRef = this;
    utter.onend = () => {
      btnRef.classList.remove('speaking');
      currentBtn = null;
    };
    utter.onerror = () => {
      btnRef.classList.remove('speaking');
      currentBtn = null;
    };
    
    // ✅ تشغيل مباشر
    synth.speak(utter);
    
  }, {capture: false, passive: false});

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
  card.append(
    favBtn,
    speakBtn,
    level,
    german,
    arabic,
    aiBtn,
    usage
  );

  // ✅ الضغط على البطاقة نفسها
  card.addEventListener('click', function() {
    // تشغيل الصوت مباشرة
    const synth = window.speechSynthesis;
    synth.cancel();
    
    if (currentBtn) {
      currentBtn.classList.remove('speaking');
    }
    speakBtn.classList.add('speaking');
    currentBtn = speakBtn;
    
    const utter = new SpeechSynthesisUtterance(sentence.german);
    utter.lang = 'de-DE';
    utter.rate = 0.9;
    
    const voices = synth.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de'));
    if (deVoice) utter.voice = deVoice;
    
    utter.onend = () => {
      speakBtn.classList.remove('speaking');
      currentBtn = null;
    };
    utter.onerror = () => {
      speakBtn.classList.remove('speaking');
      currentBtn = null;
    };
    
    synth.speak(utter);
  });

  return card;
}

// ================== RENDER TABS ==================
function renderSentences(tabId) {
  const grid = document.querySelector(`#${tabId} .sentences-grid`);
  if (!grid) {
    console.error('Grid not found for:', tabId);
    return;
  }
  
  if (!sentencesData || !sentencesData[tabId]) {
    console.error('No data for tab:', tabId);
    return;
  }

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

// ================== SEARCH ==================
function searchSentences() {
  const query = document.getElementById('searchBox').value.trim().toLowerCase();
  
  if (query.length === 0) {
    document.getElementById('searchResults').classList.remove('active');
    const activeTab = document.querySelector('.tab-content.active:not(#searchResults)');
    if (!activeTab) {
      document.getElementById('shopping').classList.add('active');
    }
    return;
  }
  
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById('searchResults').classList.add('active');
  
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  searchResultsGrid.innerHTML = '';
  
  let foundSentences = [];
  
  Object.keys(sentencesData).forEach(tabKey => {
    sentencesData[tabKey].forEach(sentence => {
      if (sentence.german.toLowerCase().includes(query) ||
          sentence.arabic.toLowerCase().includes(query)) {
        foundSentences.push(sentence);
      }
    });
  });
  
  if (foundSentences.length > 0) {
    foundSentences.forEach(sentence => {
      searchResultsGrid.appendChild(renderSentenceCard(sentence));
    });
  } else {
    searchResultsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999; font-size: 1.2em;">لم يتم العثور على نتائج</div>';
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
      
      // ✅ نفس الطريقة للأمثلة
      exampleSpeakBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const synth = window.speechSynthesis;
        synth.cancel();
        
        const utter = new SpeechSynthesisUtterance(ex);
        utter.lang = 'de-DE';
        utter.rate = 0.9;
        
        const voices = synth.getVoices();
        const deVoice = voices.find(v => v.lang.startsWith('de'));
        if (deVoice) utter.voice = deVoice;
        
        synth.speak(utter);
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
  
  // تحميل Dark Mode
  loadDarkMode();
  
  // تحديث عدد المفضلة
  updateFavCount();
  
  // التحقق من وجود البيانات
  if (typeof sentencesData === 'undefined') {
    console.error('❌ CRITICAL: sentencesData is not defined!');
    alert('خطأ: البيانات غير موجودة. تأكد من تحميل data.js قبل app.js');
    return;
  }
  
  // ✅ تحميل الأصوات مسبقاً
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    
    // تحميل الأصوات عند تغييرها
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
  
  // عرض التبويب الأول
  renderSentences('shopping');
  
  console.log('✅ App initialized successfully');
}

// ================== تشغيل التطبيق ==================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
