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
function speakText(text, btn) {
  if (currentBtn) currentBtn.classList.remove('speaking');
  currentBtn = btn;
  btn.classList.add('speaking');

  responsiveVoice.speak(text, "Deutsch Female", {
    rate: 0.85,
    onend: () => btn.classList.remove('speaking')
  });
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
  aiBtn.textContent = '🧠 أمثلة ذكية ';
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
  box.textContent = '🤖 الذكاء الاصطناعي يفكّر...';
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
