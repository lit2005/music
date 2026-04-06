// Чекаємо завантаження всього DOM
document.addEventListener('DOMContentLoaded', () => {

    // === 1. ЗНАХОДИМО ЕЛЕМЕНТИ ===
    const playBtn = document.getElementById('mainPlayBtn');
    const progressFill = document.getElementById('progressFill');
    const searchInput = document.getElementById('searchInput');
    const allCards = document.querySelectorAll('.card');

    // Елементи оновлення UI плеера
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackImg = document.getElementById('currentTrackImg');

    // === 2. СТАН ПЛЕЕРА ===
    let currentAudio = new Audio(); // Об'єкт для відтворення звуку
    let isPlaying = false;
    let progressInterval;

    // === 3. ЛОГІКА ПОИСКУ ===
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase(); // Текст пошуку в нижньому регістрі

            allCards.forEach(card => {
                // Шукаємо текст в назві пісні та виконавця
                const songName = card.querySelector('.song-name').innerText.toLowerCase();
                const artistName = card.querySelector('.song-desc').innerText.toLowerCase();

                // Якщо текст знайдено, показуємо картку, інакше приховуємо
                if (songName.includes(searchTerm) || artistName.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease'; // Легка анімація появи
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // === 4. ЛОГІКА ПЛЕЕРА ===

    // Функція запуску треку
    function playTrack() {
        isPlaying = true;
        playBtn.innerText = '⏸'; // Міняємо іконку на паузу
        currentAudio.play();
        
        // Запускаємо оновлення полоски прогресу
        clearInterval(progressInterval); // Чистимо старий інтервал
        progressInterval = setInterval(updateProgress, 500); // Оновлюємо кожні 0.5 сек
    }

    // Функція паузи треку
    function pauseTrack() {
        isPlaying = false;
        playBtn.innerText = '▶'; // Міняємо іконку на плей
        currentAudio.pause();
        clearInterval(progressInterval); // Зупиняємо оновлення полоски
    }

    // Оновлення полоски прогресу
    function updateProgress() {
        if (currentAudio.duration) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }

    // Клік по картці — запуск нової пісні
    allCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Отримуємо дані з натиснутої картки
            const songName = card.querySelector('.song-name').innerText;
            const artistName = card.querySelector('.song-desc').innerText;
            const imgSource = card.querySelector('.card-img').src;

            // Оновлюємо UI нижнього плеера
            currentTrackTitle.innerText = songName;
            currentTrackArtist.innerText = artistName;
            currentTrackImg.src = imgSource;

            // Підставляємо файл: audio/track0.mp3, audio/track1.mp3...
            currentAudio.src = `audio/track${index}.mp3`; 
            
            // Скидаємо прогрес і запускаємо
            progressFill.style.width = '0%';
            playTrack();
        });
    });

    // Слухач кліка на головну кнопку Play/Pause
    playBtn.addEventListener('click', () => {
        if (!currentAudio.src) return; // Якщо файл не вибрано, нічого не робимо

        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    // Якщо пісня закінчилася сама
    currentAudio.addEventListener('ended', () => {
        pauseTrack();
        progressFill.style.width = '0%';
    });
});