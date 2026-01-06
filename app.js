// ====== app.js (محسّن: pre-index + debounce) ======

// ====== Favorites & State ======
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;

// ====== Indexing structures ======
let flatList = [];        // array of { id, tab, german, arabic, usage, searchText }
let tokenMap = new Map(); // token -> Set of ids

// ====== Dark Mode ======
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const btn = document.getElementById('darkModeToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('darkModeToggle');
        if (btn) btn.textContent = '☀️';
    }
}

// ====== Favorite Count ======
function updateFavCount() {
    const el = document.getElementById('favCount');
    if (el) el.textContent = favorites.length;
}

// ====== Speech ======
function speakText(text, btn) {
    if (currentBtn) {
        currentBtn.classList.remove('speaking');
    }
    if (btn) {
        btn.classList.add('speaking');
        currentBtn = btn;
    }

    try {
        if (typeof responsiveVoice !== "undefined") {
            responsiveVoice.cancel();
            responsiveVoice.speak(text, "Deutsch Female", {
                rate: 0.8,
                onend: () => btn && btn.classList.remove('speaking'),
                onerror: () => webSpeech(text, btn)
            });
            return;
        }
    } catch (e) {
        console.log("ResponsiveVoice failed", e);
    }

    webSpeech(text, btn);
}

function webSpeech(text, btn) {
    if (!window.speechSynthesis) {
        alert("النطق غير مدعوم في هذا المتصفح");
        btn && btn.classList.remove('speaking');
        return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const deVoice = voices.find(v => v.lang && v.lang.startsWith && v.lang.startsWith("de"));
    if (deVoice) utter.voice = deVoice;

    utter.rate = 0.9;
    utter.onend = () => btn && btn.classList.remove('speaking');
    utter.onerror = () => btn && btn.classList.remove('speaking');

    synth.speak(utter);
}

// ====== Favorites Logic ======
function toggleFavorite(sentence, event) {
    if (event) event.stopPropagation();

    const index = favorites.findIndex(f => f.german === sentence.german && f.arabic === sentence.arabic);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(sentence);
    }

    localStorage.setItem('shortSentencesFavorites', JSON.stringify(favorites));
    updateFavCount();

    if (document.getElementById('favorites').classList.contains('active')) {
        renderFavorites();
    }

    return favorites.findIndex(f => f.german === sentence.german && f.arabic === sentence.arabic) > -1;
}

function isFavorite(sentence) {
    return favorites.findIndex(f => f.german === sentence.german && f.arabic === sentence.arabic) > -1;
}

function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const noFavMsg = document.getElementById('noFavorites');

    if (!grid || !noFavMsg) return;

    grid.innerHTML = '';

    if (favorites.length === 0) {
        noFavMsg.style.display = 'block';
        grid.style.display = 'none';
    } else {
        noFavMsg.style.display = 'none';
        grid.style.display = 'grid';
        favorites.forEach(sentence => {
            grid.appendChild(renderSentenceCard(sentence));
        });
    }
}

// ====== Render Sentence Card ======
function renderSentenceCard(sentence) {
    const card = document.createElement('div');
    card.className = 'sentence-card';




    const aiBtn = document.createElement('button');
aiBtn.className = 'ai-btn';
aiBtn.textContent = '🧠 أمثلة فهم ذكي';

aiBtn.onclick = (e) => {
  e.stopPropagation();
  loadAIExamples(card, sentence);
};

    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-btn';
    speakBtn.innerHTML = '🔊';
    speakBtn.onclick = function (e) {
        e.stopPropagation();
        speakText(sentence.german, this);
    };

    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-btn';
    favBtn.innerHTML = isFavorite(sentence) ? '★' : '☆';
    favBtn.onclick = function (e) {
        toggleFavBtn(this, e, sentence);
    };
    const levelBadge = document.createElement('div');
    levelBadge.className = `level-badge level-${sentence.level}`;
    levelBadge.textContent = sentence.level;

    card.appendChild(levelBadge);


    const germanDiv = document.createElement('div');
    germanDiv.className = 'german';
    germanDiv.textContent = sentence.german;

    const arabicDiv = document.createElement('div');
    arabicDiv.className = 'arabic';
    arabicDiv.textContent = sentence.arabic;

    const usageDiv = document.createElement('div');
    usageDiv.className = 'usage';
    usageDiv.innerHTML = `<span class="usage-label">متى تستخدمها:</span> ${sentence.usage}`;

    card.appendChild(favBtn);
    card.appendChild(speakBtn);
    card.appendChild(levelBadge);
    card.appendChild(germanDiv);
    card.appendChild(arabicDiv);
    card.appendChild(aiBtn);
    card.appendChild(usageDiv);

    card.onclick = function () {
        speakText(sentence.german, speakBtn);
    };

    card.sentenceData = sentence;
    return card;
}

function toggleFavBtn(btn, event, sentence) {
    event.stopPropagation();
    const isFav = toggleFavorite(sentence, event);
    btn.innerHTML = isFav ? '★' : '☆';
}

// ====== Render Tab Content ======
function renderSentences(tabId) {
    const grid = document.querySelector(`#${tabId} .sentences-grid`);
    if (!grid) return;
    grid.innerHTML = '';

    // If tab exists in sentencesData, render from there
    if (sentencesData[tabId] && Array.isArray(sentencesData[tabId])) {
        sentencesData[tabId].forEach(s => {
            grid.appendChild(renderSentenceCard(s));
        });
    }
}

// ====== Utility: normalize & tokenize ======
function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().trim();
}

function tokenizeTextForIndex(text) {
    // keep Arabic range \u0600-\u06FF and latin letters and digits
    // replace other chars by space then split
    const cleaned = (text || '').replace(/[^A-Za-z0-9\u0600-\u06FF]+/g, ' ');
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    return tokens;
}

// ====== Build Index (pre-index) ======
function buildIndex() {
    flatList = [];
    tokenMap = new Map();
    let id = 0;

    Object.keys(sentencesData).forEach(tabKey => {
        sentencesData[tabKey].forEach(sentence => {
            const searchText = normalizeText(`${sentence.german} ${sentence.arabic} ${sentence.usage}`);
            const item = {
                id,
                tab: tabKey,
                german: sentence.german,
                arabic: sentence.arabic,
                usage: sentence.usage,
                searchText
            };
            flatList.push(item);

            const tokens = tokenizeTextForIndex(searchText);
            tokens.forEach(token => {
                if (!tokenMap.has(token)) tokenMap.set(token, new Set());
                tokenMap.get(token).add(id);
            });

            id++;
        });
    });
}

// ====== Search (using index + final filter) ======
function searchSentences(query) {
    query = (query !== undefined) ? String(query).trim().toLowerCase() : (document.getElementById('searchBox') ? document.getElementById('searchBox').value.trim().toLowerCase() : '');

    if (query.length === 0) {
        // restore previous active tab if any, otherwise shopping
        document.getElementById('searchResults') && document.getElementById('searchResults').classList.remove('active');
        const activeTab = document.querySelector('.tab-content.active:not(#searchResults)');
        if (!activeTab) document.getElementById('shopping') && document.getElementById('shopping').classList.add('active');
        return;
    }

    // UI: show search results tab
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    const sr = document.getElementById('searchResults');
    sr && sr.classList.add('active');

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const searchResultsGrid = document.getElementById('searchResultsGrid');
    if (!searchResultsGrid) return;
    searchResultsGrid.innerHTML = '';

    // Tokenize query (simple)
    const qTokens = tokenizeTextForIndex(query);

    let candidateIds = null;

    if (qTokens.length > 0) {
        // intersect sets of ids for each token
        for (const token of qTokens) {
            const set = tokenMap.get(token);
            if (!set) {
                candidateIds = new Set(); // no results
                break;
            }
            if (candidateIds === null) {
                // first token
                candidateIds = new Set(set);
            } else {
                // intersection
                for (const id of Array.from(candidateIds)) {
                    if (!set.has(id)) candidateIds.delete(id);
                }
            }
            // early exit
            if (candidateIds.size === 0) break;
        }
    }

    let found = [];

    if (candidateIds && candidateIds.size > 0) {
        // convert ids to items and final filter with substring match to be safe
        for (const id of candidateIds) {
            const item = flatList[id];
            if (item && item.searchText.includes(query)) {
                found.push({ german: item.german, arabic: item.arabic, usage: item.usage });
            }
        }
    } else {
        // Fallback: linear scan (safe for small datasets)
        for (const item of flatList) {
            if (item.searchText.includes(query)) {
                found.push({ german: item.german, arabic: item.arabic, usage: item.usage });
            }
        }
    }

    if (found.length > 0) {
        found.forEach(sentence => {
            searchResultsGrid.appendChild(renderSentenceCard(sentence));
        });
    } else {
        searchResultsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999; font-size: 1.2em;">لم يتم العثور على نتائج</div>';
    }
}

// ====== Debounce helper ======
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}

// ====== Tabs ======
function openTab(evt, tabId) {
    const searchBox = document.getElementById('searchBox');
    if (searchBox && searchBox.value.trim().length > 0) {
        searchBox.value = '';
        // clear search results UI
        document.getElementById('searchResults') && document.getElementById('searchResults').classList.remove('active');
    }

    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');

    if (tabId === 'favorites') {
        renderFavorites();
    } else if (tabId !== 'searchResults') {
        renderSentences(tabId);
    }
}

// ====== Initialize ======
function initApp() {
    buildIndex();

    // render default tab
    renderSentences('shopping');
    updateFavCount();
    loadDarkMode();

    // Attach debounced search listener (debounce 300ms)
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        // remove any inline handler to avoid double calls (optional)
        try { searchBox.removeAttribute('oninput'); } catch (e) { /* ignore */ }
        const debouncedSearch = debounce(function (e) {
            searchSentences(e && e.target ? e.target.value : undefined);
        }, 300);
        searchBox.addEventListener('input', debouncedSearch);
    }

    // Ensure favorites grid exists (render if user opened favorites by default)
    if (document.getElementById('favorites') && document.getElementById('favorites').classList.contains('active')) {
        renderFavorites();
    }
}

// Run init on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


function toggleExamples(card, sentence) {
  let exampleBox = card.querySelector('.examples-box');

  if (exampleBox) {
    exampleBox.remove();
    return;
  }

  exampleBox = document.createElement('div');
  exampleBox.className = 'examples-box';

  if (!sentence.examples || sentence.examples.length === 0) {
    exampleBox.textContent = "لا توجد أمثلة إضافية حالياً";
  } else {
    sentence.examples.forEach(ex => {
  const row = document.createElement('div');
  row.className = 'example-row';

  const text = document.createElement('span');
  text.textContent = "• " + ex;

  const soundBtn = document.createElement('button');
  soundBtn.className = 'sound-btn';
  soundBtn.textContent = '🔊';

  soundBtn.onclick = (e) => {
    e.stopPropagation();
    speakText(ex, soundBtn); // 👈 إعادة استخدام نفس الدالة
  };

  row.appendChild(text);
  row.appendChild(soundBtn);
  exampleBox.appendChild(row);
});

  }

  card.appendChild(exampleBox);
}




async function loadAIExamples(card, sentence) {
  let box = card.querySelector('.ai-examples');

  if (box) {
    box.remove();
    return;
  }

  box = document.createElement('div');
  box.className = 'ai-examples';
  box.textContent = '⏳ يتم توليد أمثلة ذكية...';
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

      const text = document.createElement('span');
      text.textContent = '• ' + ex;

      const soundBtn = document.createElement('button');
      soundBtn.textContent = '🔊';
      soundBtn.onclick = () => speakText(ex, soundBtn);

      row.appendChild(text);
      row.appendChild(soundBtn);
      box.appendChild(row);
    });

  } catch (err) {
    box.textContent = '❌ فشل تحميل الأمثلة';
  }
}


