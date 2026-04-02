// 1. Находим элементы
const playBtn = document.getElementById('mainPlayBtn');
const progressFill = document.getElementById('progressFill');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const trackImg = document.querySelector('.current-track-img');

// Создаем объект аудио (пока без файла)
let currentAudio = new Audio(); 
let isPlaying = false;
let progressInterval;

// 2. Функция переключения Play/Pause
function togglePlay() {
    if (!currentAudio.src) return; // Если файл не выбран, ничего не делаем

    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    isPlaying = true;
    playBtn.innerText = '⏸';
    currentAudio.play();
    
    // Очищаем старый интервал перед запуском нового
    clearInterval(progressInterval);
    
    progressInterval = setInterval(() => {
        if (currentAudio.duration) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }, 500);
}

function pauseTrack() {
    isPlaying = false;
    playBtn.innerText = '▶';
    currentAudio.pause();
    clearInterval(progressInterval);
}

// 3. Выбор песни из карточки
document.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
        const songName = card.querySelector('.song-name').innerText;
        const artistName = card.querySelector('.song-desc').innerText;
        const imgSource = card.querySelector('.card-img').src;

        // Обновляем текст и картинку в плеере
        trackTitle.innerText = songName;
        trackArtist.innerText = artistName;
        trackImg.src = imgSource;

        // Подставляем файл. 
        // ВАЖНО: Назови файлы в папке audio как track0.mp3, track1.mp3 и т.д.
        // Или замени путь на конкретный файл
        currentAudio.src = `audio/track${index}.mp3`; 
        
        // Сбрасываем полоску и запускаем
        progressFill.style.width = '0%';
        playTrack();
    });
});

// Слушатель клика на главную кнопку
playBtn.addEventListener('click', togglePlay);

// Если песня закончилась сама
currentAudio.addEventListener('ended', () => {
    pauseTrack();
    progressFill.style.width = '0%';
});