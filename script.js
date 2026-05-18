/* ==========================================================
   1. CONFIGURATION & CONSTANTS
   ========================================================== */
const grid = document.getElementById("grid");
const rows = 13;
const cols = 8;
const todayWeekday = new Date().getDay();
const weekdayToCol = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
const todayCol = weekdayToCol[todayWeekday];

const schedule = {
    // Header Row
    "0-0": "SCHED", "0-1": "MON", "0-2": "TUE", "0-3": "WED", "0-4": "THU", "0-5": "FRI", "0-6": "SAT", "0-7": "SUN",
    
    // Time Column (Row Headers)
    "1-0": "7:00 - 8:00", 
    "2-0": "8:00 - 9:00", 
    "3-0": "9:00 - 10:00", 
    "4-0": "10:00 - 11:00",
    "5-0": "11:00 - 12:00", 
    "6-0": "12:00 - 1:00", 
    "7-0": "1:00 - 2:00", 
    "8-0": "2:00 - 3:00",
    "9-0": "3:00 - 4:00", 
    "10-0": "4:00 - 5:00", 
    "11-0": "5:00 - 6:00", 
    "12-0": "6:00 - 7:00",

    // MONDAY (Col 1)
    "1-1": ["EVENT", "Place", "Urgent", "nomeet"],
    "4-1": ["EVENT", "Place", "Urgent", "hasmeet"],
    "5-1": ["EVENT", "Place", "Urgent", "hasmeet"],
    "6-1": ["EVENT", "Place", "Urgent", "hasmeet"],
    "9-1": ["EVENT", "Place", "Urgent", "nomeet"],

    // TUESDAY (Col 2)
    "3-2": ["EVENT", "Place", "Urgent", "hasmeet"],
    "5-2": ["EVENT", "Place", "Urgent", "hasmeet"],
    "6-2": ["EVENT", "Place", "Urgent", "hasmeet"],
    "7-2": ["EVENT", "Place", "Urgent", "hasmeet"],
    "8-2": ["EVENT", "Place", "Urgent", "hasmeet"],
    "9-2": ["EVENT", "Place", "Urgent", "hasmeet"],

    // WEDNESDAY (Col 3)
    "1-3": ["EVENT", "Place", "Urgent", "nomeet"],
    "4-3": ["EVENT", "Place", "Urgent", "hasmeet"],
    "5-3": ["EVENT", "Place", "Urgent", "hasmeet"],
    "6-3": ["EVENT", "Place", "Urgent", "hasmeet"],
    "9-3": ["EVENT", "Place", "Urgent", "nomeet"],

    // THURSDAY (Col 4)
    "3-4": ["EVENT", "Place", "Urgent", "hasmeet"],
    "5-4": ["EVENT", "Place", "Urgent", "hasmeet"],
    "6-4": ["EVENT", "Place", "Urgent", "hasmeet"],
    "7-4": ["EVENT", "Place", "Urgent", "hasmeet"],
    "8-4": ["EVENT", "Place", "Urgent", "hasmeet"],

    // FRIDAY (Col 5)
    "1-5": ["EVENT", "Place", "Urgent", "hasmeet"],
    "9-5": ["EVENT", "Place", "Urgent", "hasmeet"],

    // SATURDAY (Col 6)
    "5-6": ["EVENT", "Place", "Urgent", "hasmeet"]
};

/* ==========================================================
   2. SCHEDULE GRID GENERATION (Optimized with Fragment)
   ========================================================== */
const fragment = document.createDocumentFragment();
for (let i = 0; i < rows * cols; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const box = document.createElement("div");
    box.className = "box";
    box.setAttribute('data-pos', `${row}-${col}`);

    const key = `${row}-${col}`;
    const entry = schedule[key];

    if (entry) {
        if (typeof entry === "string") {
            box.textContent = entry;
            if (row === 0 && col > 0) {
                box.classList.add("day");
                if (col === todayCol) box.classList.add("today");
            } else {
                box.classList.add("time");
            }
        } else if (Array.isArray(entry)) {
            const [subj, room, sec, status] = entry;
            // Using template literals for faster creation than separate DOM calls
            box.innerHTML = `<div class="content"><div>${subj}</div><div>${room}</div><div>${sec}</div></div>`;
            if (status === "hasmeet") box.dataset.meeting = "true";
            else if (status === "nomeet") box.dataset.meeting = "false";
            box.classList.add("class");
        }
    }
    fragment.appendChild(box);
}
grid.appendChild(fragment);

/* ==========================================================
   3. CLOCK & CLASS HIGHLIGHTING
   ========================================================== */
const clockEl = document.getElementById('clock');
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
}

const timeSlots = [
    { row: 1, start: 420, end: 490 }, { row: 2, start: 490, end: 560 },
    { row: 3, start: 560, end: 630 }, { row: 4, start: 630, end: 700 },
    { row: 5, start: 700, end: 770 }, { row: 6, start: 770, end: 840 },
    { row: 7, start: 840, end: 910 }, { row: 8, start: 910, end: 980 },
    { row: 9, start: 980, end: 1050 }, { row: 10, start: 1050, end: 1120 },
    { row: 11, start: 1120, end: 1190 }, { row: 12, start: 1190, end: 1260 }
];

function highlightCurrentClass() {
    const now = new Date();
    const currentTimeInMinutes = (now.getHours() * 60) + now.getMinutes();
    const currentDay = now.getDay();
    const currentCol = weekdayToCol[currentDay];

    document.querySelectorAll('.active-class').forEach(el => el.classList.remove('active-class'));
    const slot = timeSlots.find(s => currentTimeInMinutes >= (s.start - 10) && currentTimeInMinutes < s.end);

    if (slot) {
        const key = `${slot.row}-${currentCol}`;
        if (schedule[key] && Array.isArray(schedule[key])) {
            document.querySelector(`.box[data-pos="${key}"]`)?.classList.add('active-class');
            document.querySelector(`.box[data-pos="${slot.row}-0"]`)?.classList.add('active-class');
        }
    }
}

setInterval(updateClock, 1000);
setInterval(highlightCurrentClass, 60000);
updateClock();
highlightCurrentClass();

/* ==========================================================
   4. BIBLE VERSE SYSTEM (Optimized with SessionStorage)
   ========================================================== */
async function fetchBibleVerse() {
    const topPanel = document.getElementById('panel-top');
    const cachedVerse = sessionStorage.getItem('dailyVerse');
    const cacheDate = sessionStorage.getItem('verseDate');
    const today = new Date().toDateString();

    if (cachedVerse && cacheDate === today) {
        topPanel.innerHTML = cachedVerse;
        return;
    }

    try {
        const response = await fetch("https://beta.ourmanna.com/api/v1/get?format=json&order=daily");
        const data = await response.json();
        const verseHtml = `
            <div style="padding: 15px; text-align: center;">
                <div style="font-size: 14px; margin-bottom: 8px; line-height: 1.4;">"${data.verse.details.text}"</div>
                <div style="font-size: 11px; color: lightsalmon; opacity: 0.8;">— ${data.verse.details.reference}</div>
            </div>`;
        topPanel.innerHTML = verseHtml;
        sessionStorage.setItem('dailyVerse', verseHtml);
        sessionStorage.setItem('verseDate', today);
    } catch (error) {
        topPanel.textContent = "Jesus loves me this I know. For the Bible tells me so.";
    }
}
fetchBibleVerse();

/* ==========================================================
   5. DEADLINES SYSTEM (With Offline Cache & Interaction)
   ========================================================== */
const APU_URL = "your_script_goes_here"; //put the script url here
const listContainer = document.getElementById('due-dates-list');
const dueHeaderRefresh = document.getElementById('due-header-refresh');
let silencedItems = JSON.parse(localStorage.getItem('silencedDeadlines') || "[]");

listContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.due-item');
    if (!item) return;

    if (item.dataset.id) {
        const itemId = item.dataset.id;
        if (silencedItems.includes(itemId)) {
            silencedItems = silencedItems.filter(id => id !== itemId);
            item.classList.remove('silenced');
        } else {
            silencedItems.push(itemId);
            item.classList.add('silenced');
        }
        localStorage.setItem('silencedDeadlines', JSON.stringify(silencedItems));
    }
});

function renderDeadlines(deadlines) {
    listContainer.innerHTML = '';
    const now = new Date();

    if (!deadlines || deadlines.length === 0) {
        listContainer.innerHTML = '<div class="due-item">No upcoming deadlines</div>';
        return;
    }

    deadlines.forEach(item => {
        const dueDate = new Date(item.start);
        const createdDate = new Date(item.created);
        const diffToDeadline = (dueDate - now) / (1000 * 60 * 60);
        const diffFromCreated = (now - createdDate) / (1000 * 60);
        const itemId = btoa(item.title + item.start).substring(0, 16);

        const div = document.createElement('div');
        div.className = 'due-item';
        div.dataset.id = itemId;

        if (diffFromCreated >= 0 && diffFromCreated <= 30) div.classList.add('new');
        if (diffToDeadline > 0 && diffToDeadline <= 24) div.classList.add('urgent');
        if (silencedItems.includes(itemId)) div.classList.add('silenced');
        if (diffToDeadline <= 0) div.style.opacity = "0.4";

        div.innerHTML = `
            <div class="content">
                <div title="${item.title}">${item.title}</div>
                <div>${dueDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} | ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>`;
        listContainer.appendChild(div);
    });
}

async function updateDueDates() {
    try {
        const response = await fetch(APU_URL);
        if (!response.ok) throw new Error();
        const deadlines = await response.json();
        
        localStorage.setItem('cachedDeadlines', JSON.stringify(deadlines));
        localStorage.setItem('lastFetchDate', new Date().getTime());
        renderDeadlines(deadlines);
    } catch (e) {
        const cached = localStorage.getItem('cachedDeadlines');
        if (cached) {
            renderDeadlines(JSON.parse(cached));
        } else {
            // Updated: Button is now part of the list
            listContainer.innerHTML = `
                <div class="due-item" style="border-left-color: #ff4d4d; cursor: pointer;" onclick="updateDueDates()">
                    <div class="content">
                        <div style="color: #ff4d4d;">⚠️ Load Failed</div>
                        <div style="font-size: 10px; opacity: 1;">Tap here to try again</div>
                    </div>
                </div>`;
        }
    }
}

async function forceRefreshDueDates() {
    localStorage.removeItem('cachedDeadlines');
    localStorage.removeItem('lastFetchDate');
    localStorage.removeItem('silencedDeadlines');
    silencedItems = [];
    listContainer.innerHTML = `
        <div class="due-item">
            <div class="content">
                <div>Refreshing...</div>
            </div>
        </div>`;
    await updateDueDates();
}

dueHeaderRefresh?.addEventListener('click', forceRefreshDueDates);

const lastFetch = localStorage.getItem('lastFetchDate');
const isCacheOld = !lastFetch || (new Date().getTime() - lastFetch > 1800000);

if (isCacheOld) {
    updateDueDates();
} else {
    const cachedData = localStorage.getItem('cachedDeadlines');
    if (cachedData) renderDeadlines(JSON.parse(cachedData));
    else updateDueDates();
}

setInterval(updateDueDates, 1800000);


/* ==========================================================
   6. CLOCK LOGIC ACTIVE CLASS
   ========================================================== */

   function updateClockHighlight() {
    const clock = document.getElementById('clock');
    const hasActiveMeeting = document.querySelector('.active-class') !== null;

    if (hasActiveMeeting) {
        clock.classList.add('active-session');
    } else {
        clock.classList.remove('active-session');
    }
}

updateClockHighlight();

