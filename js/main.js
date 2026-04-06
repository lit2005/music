document.addEventListener('DOMContentLoaded', () => {

    // === 1. ЗНАХОДИМО ЕЛЕМЕНТИ ===
    const playBtn = document.getElementById('mainPlayBtn');
    const progressFill = document.getElementById('progressFill');
    const searchInput = document.getElementById('searchInput');
    const allCards = document.querySelectorAll('.card');
    
    // Елементи оновлення UI плеєра
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackImg = document.getElementById('currentTrackImg');
    
    // Повзунок гучності
    const volumeSlider = document.querySelector('.volume-slider');

    // === 2. СТАН ПЛЕЄРА ===
    let currentAudio = new Audio();
    let isPlaying = false;
    let progressInterval;

    // Початкова гучність
    if (volumeSlider) {
        currentAudio.volume = volumeSlider.value / 100;
    }

    // === 3. ЛОГІКА ПОШУКУ ===
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            allCards.forEach(card => {
                const songName = card.querySelector('.song-name').innerText.toLowerCase();
                const artistName = card.querySelector('.song-desc').innerText.toLowerCase();
                
                if (songName.includes(searchTerm) || artistName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // === 4. ЛОГІКА ПЛЕЄРА ===

    function playTrack() {
        if (!currentAudio.src) return;
        
        currentAudio.play().then(() => {
            isPlaying = true;
            playBtn.innerText = '⏸';
            clearInterval(progressInterval);
            progressInterval = setInterval(updateProgress, 500);
        }).catch(error => console.log("Помилка відтворення:", error));
    }

    function pauseTrack() {
        isPlaying = false;
        playBtn.innerText = '▶';
        currentAudio.pause();
        clearInterval(progressInterval);
    }

    function updateProgress() {
        if (currentAudio.duration) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }

    // Клік по картці
    allCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const songName = card.querySelector('.song-name').innerText;
            const artistName = card.querySelector('.song-desc').innerText;
            const imgSource = card.querySelector('.card-img').src;

            currentTrackTitle.innerText = songName;
            currentTrackArtist.innerText = artistName;
            currentTrackImg.src = imgSource;

            currentAudio.src = `audio/track${index}.mp3`; 
            progressFill.style.width = '0%';
            playTrack();
        });
    });

    // Кнопка Play/Pause
    playBtn.addEventListener('click', () => {
        if (isPlaying) pauseTrack();
        else playTrack();
    });

    // Коли пісня закінчилася
    currentAudio.addEventListener('ended', () => {
        pauseTrack();
        progressFill.style.width = '0%';
    });

    // === 5. ВИПРАВЛЕНА ГУЧНІСТЬ ===
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value / 100;
            currentAudio.volume = val;
            
            // Якщо гучність 0, ставимо mute для надійності
            currentAudio.muted = (val === 0);
        });
    }
});