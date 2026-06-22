document.addEventListener('DOMContentLoaded', () => {

    // === 1. БІБЛІОТЕКА ПІСЕНЬ ===
    const songs = [
        { id: 0, title: "No Sleep", artist: "Kontraa", cover: "assets/cover1.jpg", file: "audio/track0.mp3", mood: "Енергія" },
        { id: 1, title: "Berry Groovy", artist: "Giorgio Vitte", cover: "assets/cover2.jpg", file: "audio/track1.mp3", mood: "Релакс" },
        { id: 2, title: "Вода | Афро-поп музика", artist: "контра", cover: "assets/cover3.jpg", file: "audio/track2.mp3", mood: "Фокус" },
        { id: 3, title: "Хайп | Дрилл Музика", artist: "контра", cover: "assets/cover4.jpg", file: "audio/track3.mp3", mood: "Фокус" }
    ];

    // Списки треків у плейлістах
    let likedSongs = [];
    let customPlaylists = {};

    let currentViewMode = "all";
    let currentFilteredSongs = [...songs];

    // Елементи інтерфейсу
    const musicGrid = document.querySelector('.music-grid');
    const playBtn = document.getElementById('mainPlayBtn');
    const playBtnImg = document.getElementById('playBtnImg');
    const repeatBtn = document.getElementById('repeatBtn');
    const progressContainer = document.querySelector('.progress-container');
    const progressFill = document.getElementById('progressFill');
    const searchInput = document.getElementById('searchInput');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    const moodPills = document.querySelectorAll('.pill');
    const playlistSection = document.querySelector('.playlist-section');
    const btnNewPlaylist = document.querySelector('.btn-new-playlist');

    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackImg = document.getElementById('currentTrackImg');

    let currentAudio = new Audio();
    let isPlaying = false;
    let isRepeatMode = false;
    let progressInterval;

    // === 2. РЕНДЕР КАРТОК ПІСЕНЬ ===
    function renderLibrary(list) {
        if (!musicGrid) return;
        musicGrid.innerHTML = '';

        if (list.length === 0) {
            musicGrid.innerHTML = '<div style="color: #6b7280; grid-column: 1/-1; text-align: center; padding: 40px; font-size: 16px;">У цій секції ще немає треків</div>';
            return;
        }

        list.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = `card ${index % 2 === 0 ? 'pink-glow' : 'teal-glow'}`;
            
            const isLiked = likedSongs.includes(song.id);

            card.innerHTML = `
                <div class="img-wrapper">
                    <img src="${song.cover}" class="card-img" alt="${song.title}" onerror="this.src='https://via.placeholder.com/220x220/0d1121/ffffff?text=Music'">
                    <div class="play-overlay">▶</div>
                </div>
                <div class="card-body-row">
                    <div class="card-body-text">
                        <div class="song-name">${song.title}</div>
                        <div class="song-desc">${song.artist}</div>
                    </div>
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${song.id}" title="Додати в улюблене">
                        <img src="assets/love.png" alt="Like" class="like-icon">
                    </button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.like-btn')) return;

                currentTrackTitle.innerText = song.title;
                currentTrackArtist.innerText = song.artist;
                currentTrackImg.src = song.cover;
                currentAudio.src = song.file;
                
                if (progressFill) progressFill.style.width = '0%';
                playTrack();
            });

            const likeBtn = card.querySelector('.like-btn');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const songId = parseInt(likeBtn.getAttribute('data-id'), 10);
                
                if (likedSongs.includes(songId)) {
                    likedSongs = likedSongs.filter(id => id !== songId);
                    likeBtn.classList.remove('liked');
                } else {
                    likedSongs.push(songId);
                    likeBtn.classList.add('liked');
                }

                if (currentViewMode === "playlist-liked") {
                    showLikedPlaylist();
                }
            });

            musicGrid.appendChild(card);
        });
    }

    // === 3. РОБОТА З ПЛЕЄРОМ ===
    function playTrack() {
        if (!currentAudio.src) return;

        const playerBar = document.querySelector('.player-bar');
        if (playerBar) playerBar.classList.add('active');

        currentAudio.play().then(() => {
            isPlaying = true;
            if (playBtnImg) playBtnImg.src = 'assets/pause.png';
            clearInterval(progressInterval);
            progressInterval = setInterval(updateProgress, 500);
        }).catch(err => console.log("Аудіофайл не знайдено:", err));
    }

    function pauseTrack() {
        isPlaying = false;
        if (playBtnImg) playBtnImg.src = 'assets/play.png';
        currentAudio.pause();
        clearInterval(progressInterval);
    }

    function updateProgress() {
        if (currentAudio.duration && progressFill) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }

    currentAudio.addEventListener('ended', () => {
        if (isRepeatMode) {
            currentAudio.currentTime = 0;
            playTrack();
        } else {
            pauseTrack();
            if (progressFill) progressFill.style.width = '0%';
        }
    });

    playBtn.addEventListener('click', () => {
        if (isPlaying) pauseTrack(); else playTrack();
    });

    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            isRepeatMode = !isRepeatMode;
            repeatBtn.classList.toggle('repeat-active', isRepeatMode);
        });
    }

    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!currentAudio.src || !currentAudio.duration) return;
            const width = progressContainer.clientWidth;
            const clickPercent = e.offsetX / width;
            currentAudio.currentTime = clickPercent * currentAudio.duration;
            if (progressFill) progressFill.style.width = (clickPercent * 100) + '%';
            if (!isPlaying) playTrack();
        });
    }

    // === 4. УПРАВЛІННЯ КАТЕГОРІЯМИ ТА ПОШУКОМ ===
    moodPills.forEach(pill => {
        pill.addEventListener('click', () => {
            currentViewMode = "all";
            moodPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active-playlist'));
            
            const heading = document.querySelector('.glow-text');
            if (heading) heading.innerText = "Слухати знову";

            const selectedMood = pill.innerText.trim();
            
            // Якщо обрано "Гарний настрій" — повертаємо копію всіх пісень
            if (selectedMood === "Гарний настрій") {
                currentFilteredSongs = [...songs];
            } else {
                currentFilteredSongs = songs.filter(s => s.mood === selectedMood);
            }
            renderLibrary(currentFilteredSongs);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const baseList = currentViewMode === "all" ? currentFilteredSongs : getActivePlaylistSongs();
            const filtered = baseList.filter(s => 
                s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term)
            );
            renderLibrary(filtered);
        });
    }

    function getActivePlaylistSongs() {
        if (currentViewMode === "playlist-liked") {
            return songs.filter(s => likedSongs.includes(s.id));
        } else if (currentViewMode.startsWith("playlist-custom-")) {
            const playlistName = currentViewMode.replace("playlist-custom-", "");
            const ids = customPlaylists[playlistName] || [];
            return songs.filter(s => ids.includes(s.id));
        }
        return [...songs];
    }

    // === 5. ІНТЕРАКТИВНІ ПЛЕЙЛІСТИ ===
    function updateSidebarPlaylists() {
        playlistSection.innerHTML = `
            <div class="playlist-item" id="likedPlaylistBtn">
                <div class="playlist-title">Улюблене</div>
                <div class="playlist-sub">★ Автоплейліст</div>
            </div>
        `;

        Object.keys(customPlaylists).forEach(name => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-title">${name}</div>
                <div class="playlist-sub">Плейліст • ${customPlaylists[name].length} трек(ів)</div>
            `;
            
            item.addEventListener('click', () => {
                selectCustomPlaylist(name, item);
            });

            playlistSection.appendChild(item);
        });

        const likedBtn = document.getElementById('likedPlaylistBtn');
        if (likedBtn) {
            likedBtn.addEventListener('click', () => showLikedPlaylist(likedBtn));
            if (currentViewMode === "playlist-liked") likedBtn.classList.add('active-playlist');
        }
    }

    function showLikedPlaylist(element) {
        currentViewMode = "playlist-liked";
        moodPills.forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active-playlist'));
        if (element) element.classList.add('active-playlist');

        const heading = document.querySelector('.glow-text');
        if (heading) heading.innerText = "Улюблене";

        const likedList = songs.filter(s => likedSongs.includes(s.id));
        renderLibrary(likedList);
    }

    function selectCustomPlaylist(name, element) {
        currentViewMode = `playlist-custom-${name}`;
        moodPills.forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active-playlist'));
        element.classList.add('active-playlist');

        const heading = document.querySelector('.glow-text');
        if (heading) heading.innerText = name;

        const ids = customPlaylists[name] || [];
        const list = songs.filter(s => ids.includes(s.id));
        renderLibrary(list);
    }

    if (btnNewPlaylist) {
        btnNewPlaylist.addEventListener('click', () => {
            if (likedSongs.length === 0) {
                alert("Спочатку додайте хоча б один трек в «Улюблене» за допомогою сердечка!");
                return;
            }

            const playlistName = prompt("Введіть назву для нового плейліста:");
            if (!playlistName || playlistName.trim() === "") return;

            if (customPlaylists[playlistName.trim()]) {
                alert("Плейліст з такою назвою вже існує!");
                return;
            }

            const favoriteSongsList = songs.filter(s => likedSongs.includes(s.id));

            let message = "Оберіть номери пісень через кому, які хочете додати до плейліста:\n\n";
            favoriteSongsList.forEach((song, idx) => {
                message += `${idx + 1}. ${song.title} — ${song.artist}\n`;
            });

            const choices = prompt(message);
            const selectedIds = [];

            if (choices) {
                const parts = choices.split(',');
                parts.forEach(p => {
                    const num = parseInt(p.trim(), 10) - 1;
                    if (!isNaN(num) && num >= 0 && num < favoriteSongsList.length) {
                        selectedIds.push(favoriteSongsList[num].id);
                    }
                });
            }

            customPlaylists[playlistName.trim()] = selectedIds;
            updateSidebarPlaylists();
            alert(`Плейліст "${playlistName.trim()}" успішно створено з обраними треками!`);
        });
    }

    // === 6. КЕРУВАННЯ ГУЧНІСТЮ ТА ДИНАМІЧНИМИ ІКОНКАМИ ===
    if (volumeSlider) {
        function updateVolumeIcon(value) {
            const vol = parseInt(value, 10);
            if (!volumeIcon) return;

            if (vol === 0) {
                volumeIcon.src = "assets/audio-speaker0.png";  // Спікер закреслений (0%)
            } else if (vol > 0 && vol <= 50) {
                volumeIcon.src = "assets/audio-speaker1.png"; // Тихо (1%-50%)
            } else {
                volumeIcon.src = "assets/audio-speaker2.png"; // Гучно (51%-100%)
            }

            // Робимо красивий червоний колір до бігунка
            volumeSlider.style.background = `linear-gradient(90deg, #ff4444 ${vol}%, rgba(255, 255, 255, 0.1) ${vol}%)`;
        }

        currentAudio.volume = volumeSlider.value / 100;
        updateVolumeIcon(volumeSlider.value);

        volumeSlider.addEventListener('input', (e) => {
            const currentVal = e.target.value;
            currentAudio.volume = currentVal / 100;
            updateVolumeIcon(currentVal);
        });
    }

    // === СТАРТ ДОДАТКУ ===
    updateSidebarPlaylists();
    
    // ВІДОБРАЖАЄМО ВСІ ТРЕКИ РАЗОМ ПРИ СТАРТІ СТОРІНКИ
    renderLibrary(songs);
});