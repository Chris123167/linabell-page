function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function saveSearch(query) {
    const searches = JSON.parse(localStorage.getItem('searches') || '[]');
    if (!searches.includes(query)) {
        searches.unshift(query);
        if (searches.length > 10) searches.pop();
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function search(engine) {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    saveSearch(query);
    const urls = {
        google: `https://www.google.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        baidu: `https://www.baidu.com/s?wd=${query}`
    };

    window.open(urls[engine], '_blank');
}

const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');

searchInput.addEventListener('input', function() {
    clearButton.style.display = this.value ? 'block' : 'none';
});

clearButton.addEventListener('click', function() {
    searchInput.value = '';
    clearButton.style.display = 'none';
    localStorage.removeItem('searches');
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const input = this.value.trim();
        
        if (isValidUrl(input) || isValidUrl('http://' + input)) {
            const url = input.startsWith('http') ? input : 'http://' + input;
            saveSearch(input);
            window.open(url, '_blank');
        } else {
            search('google');
        }
    }
});

function changeBackground(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            localStorage.setItem('background', e.target.result);
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

window.addEventListener('load', function() {
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.body.style.backgroundImage = `url(${savedBg})`;
    }
});

// 播放器功能
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playlist = document.getElementById('playlist');
let currentIndex = 0;
let musicList = [];

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸️';
        document.querySelector('.mini-player').classList.add('playing');
    } else {
        audio.pause();
        playBtn.textContent = '▶️';
        document.querySelector('.mini-player').classList.remove('playing');
    }
}

function addMusics(input) {
    if (input.files && input.files.length > 0) {
        const newFiles = Array.from(input.files);
        newFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            jsmediatags.read(file, {
                onSuccess: function(tag) {
                    let cover = '';
                    if (tag.tags.picture) {
                        const { data, format } = tag.tags.picture;
                        const base64String = data.reduce((acc, cur) => acc + String.fromCharCode(cur), '');
                        cover = `data:${format};base64,${btoa(base64String)}`;
                    }