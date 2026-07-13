document.addEventListener('DOMContentLoaded', () => {

    // === 1. БІБЛІОТЕКА ПІСЕНЬ 

    const songs = [
        { id: 0, title: "No Sleep", artist: "Kontraa", cover: "assets/cover1.jpg", file: "audio/track1.mp3", mood: "Енергія" },
        { id: 1, title: "Berry Groovy", artist: "Giorgio Vitte", cover: "assets/cover2.jpg", file: "audio/track2.mp3", mood: "Релакс" },
        { id: 2, title: "Вода | Афро-поп музика", artist: "контра", cover: "assets/cover3.jpg", file: "audio/track3.mp3", mood: "Фокус" },
        { id: 3, title: "Хайп | Дрилл Музика", artist: "контра", cover: "assets/cover4.jpg", file: "audio/track4.mp3", mood: "Фокус" },
        { id: 4, title: "Ретро Радіо", artist: "контра", cover: "assets/cover5.jpg", file: "audio/track5.mp3", mood: "Релакс" },
        { id: 5, title: "Сейшн", artist: "контра", cover: "assets/cover6.jpg", file: "audio/track6.mp3", mood: "Енергія" },
        
        // Секція "Тобі сподобається" 
        { id: 6, title: "The Mountain", artist: "Paul Yudin", cover: "assets/cover7.png", file: "audio/track7.mp3", mood: "Сум" }, 
        { id: 7, title: "Paul Yudin Beats", artist: "Paul Yudin", cover: "assets/cover8.png", file: "audio/track8.mp3", mood: "Тренування" }, 
        { id: 8, title: "Royalty Free Music", artist: "контра", cover: "assets/cover9.jpg", file: "audio/track9.mp3", mood: "Сум" }, 
        { id: 9, title: "Neon Girl", artist: "Kontraa", cover: "assets/cover10.jpg", file: "audio/track10.mp3", mood: "У дорозі" },
        { id: 10, title: "Red Explosion", artist: "контра", cover: "assets/cover11.jpg", file: "audio/track11.mp3", mood: "Вечірка" }, 
        { id: 11, title: "New Wave Wave", artist: "Kontraa", cover: "assets/cover17.jpg", file: "audio/track17.mp3", mood: "Вечірка" }, 
        
        // Секція "Нові релізи"
        { id: 12, title: "Crimson Clouds", artist: "Paul Yudin", cover: "assets/cover12.png", file: "audio/track12.mp3", mood: "Романтика" }, // Змінено на Романтика
        { id: 13, title: "Dark Smoke", artist: "контра", cover: "assets/cover13.jpg", file: "audio/track13.mp3", mood: "Тренування" }, 
        { id: 14, title: "Cyberpunk Alley", artist: "Kontraa", cover: "assets/cover14.jpeg", file: "audio/track14.mp3", mood: "У дорозі" }, 
        { id: 15, title: "Moonlight Tunes", artist: "Giorgio Vitte", cover: "assets/cover15.jpeg", file: "audio/track15.mp3", mood: "Романтика" }, // Змінено на Романтика
        { id: 16, title: "FASS Fast Track", artist: "FASS", cover: "assets/cover16.jpg", file: "audio/track16.mp3", mood: "Сон" }, 
        { id: 17, title: "Midnight Drive", artist: "Giorgio Vitte", cover: "assets/cover18.jpg", file: "audio/track18.mp3", mood: "Сон" } 
    ];
    // Дані для карток розділу "Огляд"
    const exploreCategories = [
        { name: "Новинки", icon: "✨", color: "linear-gradient(135deg, #ff0055, #7000ff)" },
        { name: "Хіти", icon: "🔥", color: "linear-gradient(135deg, #ff9900, #ff5500)" },
        { name: "Настрій", icon: "🎭", color: "linear-gradient(135deg, #00f2fe, #4facfe)" },
        { name: "Жанри", icon: "🎸", color: "linear-gradient(135deg, #43e97b, #38f9d7)" }
    ];

    // Списки треків у плейлістах
    let likedSongs = [];
    let customPlaylists = {};

    let currentViewMode = "all";
    let currentFilteredSongs = [...songs];
    let currentPlayingList = [...songs]; // Список, з якого зараз грає музика
    let currentSongIndex = -1;           // Індекс поточного треку в списку відтворення

    // Елементи інтерфейсу (Контейнери сіток)
    const musicGrid = document.querySelector('.music-grid');
    const recommendedGrid = document.getElementById('recommendedGrid');
    const newReleasesGrid = document.getElementById('newReleasesGrid');
    const chartsGrid = document.getElementById('chartsGrid');

    // Масив з усіма додатковими сітками
    const extraGrids = [recommendedGrid, newReleasesGrid, chartsGrid];

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

    // Кнопки навігації треків (⏮ та ⏭)
    const prevBtn = document.querySelector('.player-controls button:first-child');
    const nextBtn = document.querySelector('.player-controls button:nth-child(3)');

    // Контейнери верхньої панелі
    const moodContainer = document.querySelector('.mood-pills') || document.querySelector('.pills-container') || moodPills[0]?.parentElement;
    const searchContainer = document.querySelector('.search-container') || searchInput?.parentElement;

    // Кнопки бічного меню
    const navItems = document.querySelectorAll('.nav-item');

    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackImg = document.getElementById('currentTrackImg');

    let currentAudio = new Audio();
    let isPlaying = false;
    let isRepeatMode = false;
    let progressInterval;

    // Допоміжна функція для створення копії масиву з випадковим порядком
    function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Функція приховування або показу всіх додаткових блоків
    function setExtraGridsVisibility(visible) {
        extraGrids.forEach(grid => {
            if (grid && grid.parentElement) {
                grid.parentElement.style.display = visible ? 'block' : 'none';
            }
        });
    }

    // === ФУНКЦІЯ РЕНДЕРУ ВСІХ СЕКЦІЙ НА ГОЛОВНІЙ (РОЗПОДІЛ З УРАХУВАННЯМ НОВИХ ТРЕКІВ) ===
    function renderAllHomeSections() {
        // 1. СЛУХАТИ ЗНОВУ — перші 6 початкових треків (id 0-5)
        renderLibrary(songs.slice(0, 6), musicGrid, true);
        
        // 2. ТОБІ СПОДОБАЄТЬСЯ — оновлено до 6 треків (id 6-11, включаючи track17)
        renderLibrary(songs.slice(6, 12), recommendedGrid, true);
        
        // 3. НОВІ РЕЛІЗИ — оновлено до 6 треків (id 12-17, включаючи track18)
        renderLibrary(songs.slice(12, 18), newReleasesGrid, true);
        
        // 4. СВІЖІ ЧАРТИ — показуємо перемішані всі треки
        renderLibrary(shuffleArray(songs), chartsGrid, true);
    }

    // === 2. РЕНДЕР КАРТОК ПІСЕНЬ (З КАСТОМНИМ СКРОЛБАРОМ) ===
    function renderLibrary(list, container = musicGrid, forceRowMode = false) {
        if (!container) return;
        container.removeAttribute('style'); 
        container.innerHTML = '';

        if (forceRowMode) {
            container.style.display = 'flex';
            container.style.flexDirection = 'row';
            container.style.overflowX = 'scroll'; 
            container.style.gap = '20px';
            container.style.padding = '20px 0 15px 0'; 
            container.style.whiteSpace = 'nowrap';
            container.style.transform = 'rotateX(180deg)'; 
            
            container.style.scrollbarWidth = 'thin';
            container.style.scrollbarColor = 'rgba(255, 255, 255, 0.2) transparent';
        }

        if (list.length === 0) {
            container.innerHTML = '<div style="color: #6b7280; grid-column: 1/-1; text-align: center; padding: 40px; font-size: 16px; transform: rotateX(180deg);">У цій секції ще немає треків</div>';
            return;
        }

        list.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = `card ${index % 2 === 0 ? 'pink-glow' : 'teal-glow'}`;
            
            if (forceRowMode) {
                card.style.flex = '0 0 220px';
                card.style.maxWidth = '220px';
                card.style.display = 'inline-block';
                card.style.verticalAlign = 'top';
                card.style.transform = 'rotateX(180deg)'; 
            }
            
            const isLiked = likedSongs.includes(song.id);

            card.innerHTML = `
                <div class="img-wrapper">
                    <img src="${song.cover}" class="card-img" alt="${song.title}" onerror="this.src='https://via.placeholder.com/220x220/0d1121/ffffff?text=Music'">
                    <div class="play-overlay">▶</div>
                </div>
                <div class="card-body-row">
                    <div class="card-body-text">
                        <div class="song-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${song.title}</div>
                        <div class="song-desc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${song.artist}</div>
                    </div>
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${song.id}" title="Додати в улюблене">
                        <img src="assets/love.png" alt="Like" class="like-icon">
                    </button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.like-btn')) return;

                currentPlayingList = [...list];
                currentSongIndex = index;

                loadAndPlayTrack(song);
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

            container.appendChild(card);
        });
    }

    // Функція завантаження метаданих треку в плеєр та його запуску
    function loadAndPlayTrack(song) {
        if (!song) return;
        currentTrackTitle.innerText = song.title;
        currentTrackArtist.innerText = song.artist;
        currentTrackImg.src = song.cover;
        currentAudio.src = song.file;
        
        if (progressFill) progressFill.style.width = '0%';
        playTrack();
    }

    // Функції перемикання треків вперед та назад
    function nextTrack() {
        if (currentPlayingList.length === 0) return;
        currentSongIndex++;
        if (currentSongIndex >= currentPlayingList.length) {
            currentSongIndex = 0; 
        }
        loadAndPlayTrack(currentPlayingList[currentSongIndex]);
    }

    // Слухачі для кнопок ⏮ та ⏭
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);

    function prevTrack() {
        if (currentPlayingList.length === 0) return;
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentPlayingList.length - 1; 
        }
        loadAndPlayTrack(currentPlayingList[currentSongIndex]);
    }

    // === РЕНДЕР СЕКЦІЇ "ОГЛЯД" ===
    function renderExplore() {
        if (!musicGrid) return;
        musicGrid.innerHTML = '';
        currentViewMode = "explore";

        setExtraGridsVisibility(false);

        musicGrid.style.display = 'grid';
        musicGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
        musicGrid.style.gap = '25px';
        musicGrid.style.padding = '20px 0';

        exploreCategories.forEach(cat => {
            const expCard = document.createElement('div');
            expCard.style.background = cat.color;
            expCard.style.borderRadius = '20px';
            expCard.style.height = '160px';
            expCard.style.display = 'flex';
            expCard.style.flexDirection = 'column';
            expCard.style.justifyContent = 'space-between';
            expCard.style.padding = '25px';
            expCard.style.cursor = 'pointer';
            expCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            expCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';

            expCard.innerHTML = `
                <span style="color: white; font-size: 24px; font-weight: bold; font-family: sans-serif;">${cat.name}</span>
                <span style="font-size: 50px; align-self: flex-end;">${cat.icon}</span>
            `;

            expCard.addEventListener('mouseenter', () => {
                expCard.style.transform = 'translateY(-5px) scale(1.02)';
                expCard.style.boxShadow = '0 12px 25px rgba(255,255,255,0.1)';
            });
            expCard.addEventListener('mouseleave', () => {
                expCard.style.transform = 'translateY(0) scale(1)';
                expCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
            });

            expCard.addEventListener('click', () => {
                alert(`Ви відкрили категорію: ${cat.name}`);
            });

            musicGrid.appendChild(expCard);
        });
    }

    // === УПРАВЛІННЯ SIDEBAR ===
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const text = item.innerText.trim();
            const heading = document.querySelector('.glow-text');

            if (text.includes("Огляд")) {
                if (heading) heading.innerText = "Огляд";
                if (moodContainer) moodContainer.style.display = 'none';
                if (searchContainer) searchContainer.style.display = 'none';
                renderExplore(); 
            } else {
                if (moodContainer) moodContainer.style.display = 'flex';
                if (searchContainer) searchContainer.style.display = 'flex';

                if (text.includes("Головна")) {
                    if (heading) heading.innerText = "Слухати знову";
                    currentViewMode = "all";
                    currentFilteredSongs = [...songs];
                    setExtraGridsVisibility(true); 
                    renderAllHomeSections();
                } else if (text.includes("Бібліотека")) {
                    if (heading) heading.innerText = "Твоя Бібліотека";
                    setExtraGridsVisibility(false); 
                    renderLibrary(songs, musicGrid, false);
                }
            }
        });
    });

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
            nextTrack();
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

            navItems.forEach(i => i.classList.remove('active'));
            if(navItems[0]) navItems[0].classList.add('active');

            const selectedMood = pill.innerText.trim();
            
            if (selectedMood === "Гарний настрій") {
                currentFilteredSongs = [...songs];
                setExtraGridsVisibility(true); 
                renderAllHomeSections();
            } else {
                setExtraGridsVisibility(false); 
                currentFilteredSongs = songs.filter(s => s.mood === selectedMood);
                renderLibrary(currentFilteredSongs, musicGrid, false);
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if(currentViewMode === "explore") return; 

            const term = e.target.value.toLowerCase();
            const baseList = currentViewMode === "all" ? currentFilteredSongs : getActivePlaylistSongs();
            const filtered = baseList.filter(s => 
                s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term)
            );
            
            if (term.length > 0) {
                setExtraGridsVisibility(false);
                renderLibrary(filtered, musicGrid, false);
            } else if (currentViewMode === "all" && document.querySelector('.pill.active')?.innerText.trim() === "Гарний настрій") {
                setExtraGridsVisibility(true);
                renderAllHomeSections();
            } else {
                renderLibrary(filtered, musicGrid, false);
            }
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
            item.style.position = 'relative';
            
            item.innerHTML = `
                <div class="playlist-info-block" style="flex: 1; cursor: pointer;">
                    <div class="playlist-title">${name}</div>
                    <div class="playlist-sub">Плейліст • ${customPlaylists[name].length} treki</div>
                </div>
                <button class="delete-playlist-btn" data-name="${name}" title="Видалити плейліст" 
                        style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 0 5px; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity 0.2s;">
                    ×
                </button>
            `;
            
            item.querySelector('.playlist-info-block').addEventListener('click', () => {
                selectCustomPlaylist(name, item);
            });

            item.addEventListener('mouseenter', () => {
                const btn = item.querySelector('.delete-playlist-btn');
                if (btn) btn.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                const btn = item.querySelector('.delete-playlist-btn');
                if (btn) btn.style.opacity = '0';
            });

            item.querySelector('.delete-playlist-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Ви впевнені, що хочете видалити плейліст "${name}"?`)) {
                    delete customPlaylists[name];
                    if (currentViewMode === `playlist-custom-${name}`) {
                        currentViewMode = "all";
                        renderLibrary(songs, musicGrid, false);
                    }
                    updateSidebarPlaylists();
                }
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
        navItems.forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active-playlist'));
        if (element) element.classList.add('active-playlist');

        if (moodContainer) moodContainer.style.display = 'flex'; 
        if (searchContainer) searchContainer.style.display = 'flex';
        setExtraGridsVisibility(false); 

        const heading = document.querySelector('.glow-text');
        if (heading) heading.innerText = "Улюблене";

        const likedList = songs.filter(s => likedSongs.includes(s.id));
        renderLibrary(likedList, musicGrid, false);
    }

    function selectCustomPlaylist(name, element) {
        currentViewMode = `playlist-custom-${name}`;
        moodPills.forEach(p => p.classList.remove('active'));
        navItems.forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active-playlist'));
        element.classList.add('active-playlist');

        if (moodContainer) moodContainer.style.display = 'flex'; 
        if (searchContainer) searchContainer.style.display = 'flex';
        setExtraGridsVisibility(false); 

        const heading = document.querySelector('.glow-text');
        if (heading) {
            heading.innerHTML = `
                ${name} 
                <button id="editPlaylistTracksBtn" style="font-size: 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 12px; margin-left: 15px; cursor: pointer;">
                    ⚙ Редагувати треки
                </button>
            `;
            
            document.getElementById('editPlaylistTracksBtn').addEventListener('click', () => {
                editPlaylistTracks(name, element);
            });
        }

        const ids = customPlaylists[name] || [];
        const list = songs.filter(s => ids.includes(s.id));
        renderLibrary(list, musicGrid, false);
    }

    function editPlaylistTracks(name, element) {
        let message = `Редагування плейліста "${name}"\n`;
        message += "Введіть через кому НОВІ номери пісень (зі списку ваших улюблиних):\n\n";
        
        const favoriteSongsList = songs.filter(s => likedSongs.includes(s.id));
        if (favoriteSongsList.length === 0) {
            alert("У вас немає треків в «Улюблене», щоб додати їх сюди.");
            return;
        }

        favoriteSongsList.forEach((song, idx) => {
            const isAlreadyIn = customPlaylists[name].includes(song.id) ? "[Вже додано] " : "";
            message += `${idx + 1}. ${isAlreadyIn}${song.title} — ${song.artist}\n`;
        });

        const choices = prompt(message);
        if (choices === null) return;

        const selectedIds = [];
        if (choices.trim() !== "") {
            const parts = choices.split(',');
            parts.forEach(p => {
                const num = parseInt(p.trim(), 10) - 1;
                if (!isNaN(num) && num >= 0 && num < favoriteSongsList.length) {
                    selectedIds.push(favoriteSongsList[num].id);
                }
            });
        }

        customPlaylists[name] = selectedIds;
        updateSidebarPlaylists();
        selectCustomPlaylist(name, element);
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

    // === 6. КЕРУВАННЯ ГУЧНІСТЮ ===
    if (volumeSlider) {
        function updateVolumeIcon(value) {
            const vol = parseInt(value, 10);
            if (!volumeIcon) return;

            if (vol === 0) {
                volumeIcon.src = "assets/audio-speaker0.png";
            } else if (vol > 0 && vol <= 50) {
                volumeIcon.src = "assets/audio-speaker1.png";
            } else {
                volumeIcon.src = "assets/audio-speaker2.png";
            }
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
    renderAllHomeSections();
});