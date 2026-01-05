// ====== Favorites & State ======
let favorites = JSON.parse(localStorage.getItem('shortSentencesFavorites')) || [];
let currentBtn = null;

// ====== Dark Mode ======
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
}

function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
}

// ====== Favorite Count ======
function updateFavCount() {
    document.getElementById('favCount').textContent = favorites.length;
}

// ====== Speech ======
function speakText(text, btn) {
    if (currentBtn) {
        currentBtn.classList.remove('speaking');
    }
    btn.classList.add('speaking');
    currentBtn = btn;

    try {
        if (typeof responsiveVoice !== "undefined") {
            responsiveVoice.cancel();
            responsiveVoice.speak(text, "Deutsch Female", {
                rate: 0.8,
                onend: () => btn.classList.remove('speaking'),
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
        btn.classList.remove('speaking');
        return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith("de"));
    if (deVoice) utter.voice = deVoice;

    utter.rate = 0.9;
    utter.onend = () => btn.classList.remove('speaking');
    utter.onerror = () => btn.classList.remove('speaking');

    synth.speak(utter);
}

// ====== Favorites Logic ======
function toggleFavorite(sentence, event) {
    if (event) event.stopPropagation();

    const index = favorites.findIndex(f => f.german === sentence.german);

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

    return favorites.findIndex(f => f.german === sentence.german) > -1;
}

function isFavorite(sentence) {
    return favorites.findIndex(f => f.german === sentence.german) > -1;
}

function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const noFavMsg = document.getElementById('noFavorites');

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
    card.appendChild(germanDiv);
    card.appendChild(arabicDiv);
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
    grid.innerHTML = '';

    sentencesData[tabId].forEach(s => {
        grid.appendChild(renderSentenceCard(s));
    });
}

// ====== Search ======
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

// ====== Tabs ======
function openTab(evt, tabId) {
    const searchBox = document.getElementById('searchBox');
    if (searchBox.value.trim().length > 0) {
        searchBox.value = '';
        searchSentences();
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
renderSentences('shopping');
updateFavCount();
loadDarkMode();

