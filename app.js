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




// استبدل دالة loadAIExamples الموجودة بهذه النسخة المحسّنة:

async function loadAIExamples(card, sentence) {
  let box = card.querySelector('.ai-examples');

  // إذا الـ box موجود، احذفه (toggle)
  if (box) {
    box.remove();
    return;
  }

  // إنشاء صندوق الأمثلة
  box = document.createElement('div');
  box.className = 'ai-examples';
  box.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; color: #666;">
      <div class="spinner"></div>
      <span>⏳ يتم توليد أمثلة ذكية بواسطة Claude AI...</span>
    </div>
  `;
  card.appendChild(box);

  try {
    // استدعاء Claude API مباشرة من المتصفح (مجاني!)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `أنت معلم لغة ألمانية محترف. أعطني 3 جمل ألمانية جديدة بنفس معنى الجملة التالية، مناسبة لمستوى ${sentence.level || 'A1'}:

"${sentence.german}"

القواعد المهمة:
- 3 جمل فقط، لا أكثر ولا أقل
- بدون ترجمة عربية أو إنجليزية
- بدون ترقيم أو رموز (-, •, 1., 2., إلخ)
- كل جملة في سطر منفصل
- استخدم مفردات وتراكيب نحوية مناسبة لمستوى ${sentence.level || 'A1'}
- الجمل يجب أن تكون مختلفة عن بعضها في التركيب

مثال للشكل المطلوب:
Ich gehe heute einkaufen
Heute mache ich meine Einkäufe
Ich kaufe heute ein`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // استخراج النص من الرد
    let text = '';
    if (data.content && data.content[0] && data.content[0].text) {
      text = data.content[0].text;
    } else {
      throw new Error('Invalid response format');
    }

    console.log('✅ Claude Response:', text);

    // تنظيف وفلترة الجمل
    const examples = text
      .split('\n')
      .map(line => line.replace(/^[-•\d.)\s*]+/, '').trim()) // إزالة الترقيم
      .filter(line => {
        // فلتر الجمل الألمانية فقط
        return line.length > 10 && 
               /[a-zA-ZäöüßÄÖÜ]/.test(line) && // يحتوي على أحرف ألمانية
               !line.includes(':') && // ليس عنوان
               !line.toLowerCase().includes('beispiel') && // ليس كلمة "مثال"
               !line.toLowerCase().includes('sentence'); // ليس كلمة "جملة"
      })
      .slice(0, 3); // أول 3 جمل فقط

    // تحديث الصندوق بالأمثلة
    box.innerHTML = '';

    if (examples.length === 0) {
      box.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #999;">
          ❌ لم يتم إنشاء أمثلة صحيحة. حاول مرة أخرى.
        </div>
      `;
      return;
    }

    // إضافة عنوان
    const header = document.createElement('div');
    header.style.cssText = 'font-weight: bold; color: #4A90E2; margin-bottom: 10px; font-size: 0.95em;';
    header.innerHTML = '🤖 أمثلة مولدة بواسطة Claude AI:';
    box.appendChild(header);

    // عرض كل مثال مع زر النطق
    examples.forEach((ex, index) => {
      const row = document.createElement('div');
      row.className = 'example-row';
      row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;';

      const text = document.createElement('span');
      text.style.cssText = 'flex: 1; font-size: 1em; color: #333;';
      text.textContent = `${index + 1}. ${ex}`;

      const soundBtn = document.createElement('button');
      soundBtn.className = 'sound-btn';
      soundBtn.style.cssText = 'background: #4A90E2; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 1.1em; display: flex; align-items: center; justify-content: center; transition: all 0.2s;';
      soundBtn.textContent = '🔊';
      soundBtn.title = 'استمع للنطق';

      soundBtn.onmouseover = () => {
        soundBtn.style.background = '#357ABD';
        soundBtn.style.transform = 'scale(1.1)';
      };
      soundBtn.onmouseout = () => {
        soundBtn.style.background = '#4A90E2';
        soundBtn.style.transform = 'scale(1)';
      };

      soundBtn.onclick = (e) => {
        e.stopPropagation();
        speakText(ex, soundBtn);
      };

      row.appendChild(text);
      row.appendChild(soundBtn);
      box.appendChild(row);
    });

    // إضافة footer
    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; font-size: 0.85em; color: #999; text-align: center;';
    footer.textContent = '✨ مدعوم بتقنية Claude AI';
    box.appendChild(footer);

  } catch (err) {
    console.error('❌ Error:', err);
    box.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #e74c3c;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <div style="font-weight: bold; margin-bottom: 5px;">فشل تحميل الأمثلة</div>
        <div style="font-size: 0.9em; color: #999;">
          ${err.message || 'حدث خطأ غير متوقع'}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 15px; padding: 8px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
          إغلاق
        </button>
      </div>
    `;
  }
}

// إضافة CSS للـ spinner (loading animation)
if (!document.getElementById('spinner-style')) {
  const style = document.createElement('style');
  style.id = 'spinner-style';
  style.textContent = `
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4A90E2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .ai-examples {
      margin-top: 15px;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      color: white;
    }
    
    .example-row {
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}


