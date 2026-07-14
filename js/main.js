document.addEventListener('DOMContentLoaded', () => {

    // === 1. БІБЛІОТЕКА ПІСЕНЬ ===
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
        { id: 12, title: "Crimson Clouds", artist: "Paul Yudin", cover: "assets/cover12.png", file: "audio/track12.mp3", mood: "Романтика" }, 
        { id: 13, title: "Dark Smoke", artist: "контра", cover: "assets/cover13.jpg", file: "audio/track13.mp3", mood: "Тренування" }, 
        { id: 14, title: "Cyberpunk Alley", artist: "Kontraa", cover: "assets/cover14.jpeg", file: "audio/track14.mp3", mood: "У дорозі" }, 
        { id: 15, title: "Moonlight Tunes", artist: "Giorgio Vitte", cover: "assets/cover15.jpeg", file: "audio/track15.mp3", mood: "Романтика" }, 
        { id: 16, title: "FASS Fast Track", artist: "FASS", cover: "assets/cover16.jpg", file: "audio/track16.mp3", mood: "Сон" }, 
        { id: 17, title: "Midnight Drive", artist: "Giorgio Vitte", cover: "assets/cover18.jpg", file: "audio/track18.mp3", mood: "Сон" } 
    ];

    const foreignHits2026Songs = [
        songs[0], songs[1], songs[6], songs[7], songs[9], songs[14], songs[15]
    ];

    const exploreCategories = [
        { name: "Новинки", icon: "✨", color: "linear-gradient(135deg, #ff0055, #7000ff)" },
        { name: "Хіти", icon: "🔥", color: "linear-gradient(135deg, #ff9900, #ff5500)" },
        { name: "Настрій", icon: "🎭", color: "linear-gradient(135deg, #00f2fe, #4facfe)" },
        { name: "Жанри", icon: "🎸", color: "linear-gradient(135deg, #43e97b, #38f9d7)" }
    ];

    const moodAndGenres = [
        { name: "1990-е", color: "#4ade80" }, { name: "Рок", color: "#ef4444" }, { name: "Хорошее настроение", color: "#22c55e" },
        { name: "Саундтреки и мюзиклы", color: "#38bdf8" }, { name: "Классика", color: "#cbd5e1" }, { name: "Заряд энергии", color: "#fef08a" },
        { name: "В дороге", color: "#f59e0b" }, { name: "Грустная", color: "#94a3b8" }, { name: "2010-е", color: "#86efac" },
        { name: "2000-е", color: "#4ade80" }, { name: "1960-е", color: "#4ade80" }, { name: "1980-е", color: "#86efac" },
        { name: "Ukrainian rock", color: "#ef4444" }, { name: "Болливуд", color: "#a855f7" }, { name: "Латиноамериканская музыка", color: "#eab308" },
        { name: "Кантри и американа", color: "#2563eb" }, { name: "Тренировка", color: "#f97316" }, { name: "Инди и альтернатива", color: "#cbd5e1" },
        { name: "Африканская", color: "#22c55e" }, { name: "Хип-хоп", color: "#ea580c" }, { name: "Сон", color: "#a855f7" },
        { name: "Вечеринка", color: "#a855f7" }, { name: "Поп", color: "#e879f9" }, { name: "Фолк и акустика", color: "#16a34a" }
    ];

    // ==========================================
    // Зчитування стану з localStorage
    // ==========================================
    let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    let customPlaylists = JSON.parse(localStorage.getItem('customPlaylists')) || {};
    let favoritePlaylists = JSON.parse(localStorage.getItem('favoritePlaylists')) || []; 

    let currentViewMode = "all";
    let currentFilteredSongs = [...songs];
    let currentPlayingList = [...songs]; 
    let currentSongIndex = -1;           

    // Елементи інтерфейсу
    const musicGrid = document.querySelector('.music-grid');
    const recommendedGrid = document.getElementById('recommendedGrid');
    const newReleasesGrid = document.getElementById('newReleasesGrid');
    const chartsGrid = document.getElementById('chartsGrid');

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

    const prevBtn = document.querySelector('.player-controls button:first-child');
    const nextBtn = document.querySelector('.player-controls button:nth-child(3)');

    const moodContainer = document.querySelector('.mood-pills') || document.querySelector('.pills-container') || moodPills[0]?.parentElement;
    const searchContainer = document.querySelector('.search-container') || searchInput?.parentElement;

    const navItems = document.querySelectorAll('.nav-item');

    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackImg = document.getElementById('currentTrackImg');

    let currentAudio = new Audio();
    let isPlaying = false;
    let isRepeatMode = false;
    let progressInterval;

    function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function setExtraGridsVisibility(visible) {
        extraGrids.forEach(grid => {
            if (grid && grid.parentElement) {
                grid.parentElement.style.display = visible ? 'block' : 'none';
            }
        });
        
        const promoBanner = document.getElementById('promoPlaylistBanner');
        if (promoBanner) {
            promoBanner.style.display = (visible && currentViewMode === "all") ? 'block' : 'none';
        }
    }

    // === 2. РЕНДЕР КАРТОК ПІСЕНЬ ===
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
                
                localStorage.setItem('likedSongs', JSON.stringify(likedSongs));

                if (currentViewMode === "playlist-liked") {
                    showLikedPlaylist();
                }
            });

            container.appendChild(card);
        });
    }

    function renderAllHomeSections() {
        if(musicGrid) musicGrid.innerHTML = '';
        if(recommendedGrid) recommendedGrid.innerHTML = '';
        if(newReleasesGrid) newReleasesGrid.innerHTML = '';
        if(chartsGrid) chartsGrid.innerHTML = '';

        const oldBanner = document.getElementById('promoPlaylistBanner');
        if (oldBanner) oldBanner.remove();

        renderLibrary(songs.slice(0, 6), musicGrid, true);
        renderLibrary(songs.slice(6, 12), recommendedGrid, true);
        renderLibrary(songs.slice(12, 18), newReleasesGrid, true);
        renderLibrary(shuffleArray(songs), chartsGrid, true);

        if (chartsGrid && chartsGrid.parentElement) {
            const bannerContainer = document.createElement('div');
            bannerContainer.id = 'promoPlaylistBanner';
            bannerContainer.style.marginTop = '40px';
            bannerContainer.style.marginBottom = '20px';
            bannerContainer.style.width = '100%';

            bannerContainer.innerHTML = `
                <div style="position: relative; width: 100%; height: 380px; border-radius: 20px; overflow: hidden; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5); background: linear-gradient(135deg, #a855f7 0%, #ea580c 100%); transition: transform 0.3s ease, box-shadow 0.3s ease;" class="promo-banner-card">
                    <img src="assets/cover10.jpg" alt="Sia" style="position: absolute; right: 5%; bottom: 0; height: 95%; object-fit: contain; z-index: 1; pointer-events: none;" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000';">
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%); z-index: 2;"></div>
                    <div style="position: absolute; bottom: 40px; left: 40px; z-index: 3;">
                        <span style="color: rgba(255,255,255,0.7); font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; display: block; margin-bottom: 8px; font-family: sans-serif;">Промо-плейліст</span>
                        <h2 style="color: #ffffff; font-size: 48px; font-weight: 900; margin: 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; text-shadow: 2px 2px 10px rgba(0,0,0,0.5);">Зарубіжні хіти 2026</h2>
                    </div>
                </div>
            `;

            const cardEl = bannerContainer.querySelector('.promo-banner-card');
            cardEl.addEventListener('mouseenter', () => {
                cardEl.style.transform = 'scale(1.01)';
                cardEl.style.boxShadow = '0 15px 35px rgba(234, 88, 12, 0.3)';
            });
            cardEl.addEventListener('mouseleave', () => {
                cardEl.style.transform = 'scale(1)';
                cardEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            });
            cardEl.addEventListener('click', () => {
                renderPromoPlaylistView();
            });

            chartsGrid.parentElement.insertAdjacentElement('afterend', bannerContainer);
        }
    }

    function renderPromoPlaylistView() {
        if (!musicGrid) return;
        
        currentViewMode = "promo-playlist";
        setExtraGridsVisibility(false);
        if (moodContainer) moodContainer.style.display = 'none';

        const heading = document.querySelector('.glow-text');
        if (heading) heading.innerText = "Плейліст";

        musicGrid.removeAttribute('style');
        musicGrid.style.display = 'flex';
        musicGrid.style.flexDirection = 'column';
        musicGrid.style.width = '100%';
        musicGrid.style.transform = 'none';
        musicGrid.style.gap = '30px';
        musicGrid.innerHTML = '';

        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.flexWrap = 'wrap';
        headerContainer.style.gap = '40px';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.paddingBottom = '30px';
        headerContainer.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

        headerContainer.innerHTML = `
            <div style="width: 320px; height: 320px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4); flex-shrink: 0; background: linear-gradient(135deg, #a855f7, #ea580c);">
                <img src="assets/cover10.jpg" alt="Зарубіжні хіти 2026" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000';">
            </div>
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 15px; position: relative;">
                <span style="color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; font-family: sans-serif;">Плейліст</span>
                <h1 style="color: #ffffff; font-size: 42px; font-weight: 800; margin: 0; font-family: sans-serif;">Зарубіжні хіти 2026</h1>
                <div style="display: flex; gap: 15px; align-items: center; margin-top: 10px;">
                    <button id="playPromoPlaylistBtn" style="background: #1db954; color: #ffffff; border: none; border-radius: 50px; padding: 14px 28px; font-size: 16px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.2s, transform 0.2s;">
                        <span style="font-size: 14px;">▶</span> Слухати
                    </button>
                    <button id="promoDotsBtn" style="background: #282828; color: #ffffff; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; position: relative;">•••</button>
                </div>
                <div style="margin-top: 15px; font-family: sans-serif;">
                    <span style="color: #1db954; font-size: 14px; font-weight: bold; display: block; margin-bottom: 5px;">Плейлісти</span>
                    <span style="color: #9ca3af; font-size: 14px;">Пісень у плейлісті: ${foreignHits2026Songs.length}</span>
                </div>
            </div>
        `;

        musicGrid.appendChild(headerContainer);

        // Кнопка відтворення всього плейліста
        const playPlaylistBtn = headerContainer.querySelector('#playPromoPlaylistBtn');
        playPlaylistBtn.addEventListener('mouseenter', () => playPlaylistBtn.style.background = '#1ed760');
        playPlaylistBtn.addEventListener('mouseleave', () => playPlaylistBtn.style.background = '#1db954');
        playPlaylistBtn.addEventListener('click', () => {
            currentPlayingList = [...foreignHits2026Songs];
            currentSongIndex = 0;
            loadAndPlayTrack(foreignHits2026Songs[0]);
        });

        // Меню для кнопки Трьох крапок (•••)
        const promoDotsBtn = headerContainer.querySelector('#promoDotsBtn');
        promoDotsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const oldMenu = document.getElementById('promoContextMenu');
            if (oldMenu) {
                oldMenu.remove();
                return;
            }

            const isAlreadyFavorite = favoritePlaylists.includes("Зарубіжні хіти 2026");

            const menu = document.createElement('div');
            menu.id = 'promoContextMenu';
            menu.style.position = 'absolute';
            menu.style.background = '#282828';
            menu.style.border = '1px solid rgba(255,255,255,0.1)';
            menu.style.borderRadius = '8px';
            menu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
            menu.style.padding = '8px 0';
            menu.style.zIndex = '1000';
            menu.style.width = '260px';
            
            const rect = promoDotsBtn.getBoundingClientRect();
            menu.style.top = `${rect.bottom + window.scrollY + 10}px`;
            menu.style.left = `${rect.left + window.scrollX}px`;

            menu.innerHTML = `
                <div id="addAllToLiked" style="padding: 10px 16px; color: #ffffff; cursor: pointer; font-size: 14px; font-family: sans-serif; transition: background 0.2s;">
                    ❤️ Додати всі треки до улюблених
                </div>
                <div id="toggleFavoritePlaylist" style="padding: 10px 16px; color: #ffffff; cursor: pointer; font-size: 14px; font-family: sans-serif; transition: background 0.2s; border-top: 1px solid rgba(255,255,255,0.05);">
                    ${isAlreadyFavorite ? '❌ Прибрати цей плейліст з обраного' : '⭐ Додати плейліст в улюблені'}
                </div>
            `;

            document.body.appendChild(menu);

            const opt1 = menu.querySelector('#addAllToLiked');
            const opt2 = menu.querySelector('#toggleFavoritePlaylist');
            [opt1, opt2].forEach(opt => {
                opt.addEventListener('mouseenter', () => opt.style.background = '#3e3e3e');
                opt.addEventListener('mouseleave', () => opt.style.background = 'none');
            });

            opt1.addEventListener('click', () => {
                foreignHits2026Songs.forEach(song => {
                    if (!likedSongs.includes(song.id)) {
                        likedSongs.push(song.id);
                    }
                });
                localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
                menu.remove();
                renderPromoPlaylistView(); 
                alert("Усі треки додано до вашого автоплейліста «Улюблене»!");
            });

            opt2.addEventListener('click', () => {
                if (isAlreadyFavorite) {
                    favoritePlaylists = favoritePlaylists.filter(name => name !== "Зарубіжні хіти 2026");
                } else {
                    favoritePlaylists.push("Зарубіжні хіти 2026");
                }
                localStorage.setItem('favoritePlaylists', JSON.stringify(favoritePlaylists));
                menu.remove();
                updateSidebarPlaylists(); 
            });
        });

        document.addEventListener('click', () => {
            const menu = document.getElementById('promoContextMenu');
            if (menu) menu.remove();
        }, { once: false });

        const listHeader = document.createElement('h3');
        listHeader.innerText = "Пісні в плейлісті";
        listHeader.style.color = "#ffffff";
        listHeader.style.fontSize = "22px";
        listHeader.style.margin = "10px 0 0 0";
        listHeader.style.fontFamily = "sans-serif";
        musicGrid.appendChild(listHeader);

        const tracksListContainer = document.createElement('div');
        tracksListContainer.style.display = 'flex';
        tracksListContainer.style.flexDirection = 'column';
        tracksListContainer.style.gap = '10px';
        tracksListContainer.style.width = '100%';

        foreignHits2026Songs.forEach((song, idx) => {
            const trackRow = document.createElement('div');
            trackRow.style.display = 'flex';
            trackRow.style.alignItems = 'center';
            trackRow.style.justifyContent = 'space-between';
            trackRow.style.padding = '12px 20px';
            trackRow.style.background = 'rgba(255,255,255,0.03)';
            trackRow.style.borderRadius = '8px';
            trackRow.style.cursor = 'pointer';
            trackRow.style.transition = 'background 0.2s';

            const isLiked = likedSongs.includes(song.id);

            trackRow.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                    <span style="color: #6b7280; font-size: 14px; width: 25px; text-align: center;">${idx + 1}</span>
                    <img src="${song.cover}" alt="${song.title}" style="width: 45px; height: 45px; border-radius: 4px; object-fit: cover;">
                    <div>
                        <div style="color: #ffffff; font-size: 15px; font-weight: bold;">${song.title}</div>
                        <div style="color: #9ca3af; font-size: 13px;">${song.artist}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <span style="color: #9ca3af; font-size: 14px;">Electronic • Dance</span>
                    <button class="promo-like-btn ${isLiked ? 'liked' : ''}" style="background: none; border: none; cursor: pointer; display: flex; align-items: center;">
                        <img src="assets/love.png" alt="Like" class="like-icon" style="width: 18px; ${isLiked ? '' : 'filter: grayscale(1); opacity: 0.6;'}">
                    </button>
                    <span style="color: #6b7280; font-size: 13px; width: 40px; text-align: right;">03:26</span>
                </div>
            `;

            trackRow.addEventListener('mouseenter', () => trackRow.style.background = 'rgba(255,255,255,0.08)');
            trackRow.addEventListener('mouseleave', () => trackRow.style.background = 'rgba(255,255,255,0.03)');
            
            trackRow.addEventListener('click', () => {
                currentPlayingList = [...foreignHits2026Songs];
                currentSongIndex = idx;
                loadAndPlayTrack(song);
            });

            const promoLikeBtn = trackRow.querySelector('.promo-like-btn');
            promoLikeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                const songId = song.id;
                const likeImg = promoLikeBtn.querySelector('img');

                if (likedSongs.includes(songId)) {
                    likedSongs = likedSongs.filter(id => id !== songId);
                    promoLikeBtn.classList.remove('liked');
                    likeImg.style.filter = 'grayscale(1)';
                    likeImg.style.opacity = '0.6';
                } else {
                    likedSongs.push(songId);
                    promoLikeBtn.classList.add('liked');
                    likeImg.style.filter = 'none';
                    likeImg.style.opacity = '1';
                }
                
                localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
            });

            tracksListContainer.appendChild(trackRow);
        });

        musicGrid.appendChild(tracksListContainer);
    }

    // ==========================================
    // ОНОВЛЕНА ЛОГІКА КЕРУВАННЯ ПЛЕЄРОМ
    // ==========================================

    function loadAndPlayTrack(song) {
        if (!song) return;
        
        currentTrackTitle.innerText = song.title;
        currentTrackArtist.innerText = song.artist;
        currentTrackImg.src = song.cover;
        
        currentAudio.src = song.file;
        if (progressFill) progressFill.style.width = '0%';
        
        playTrack();
    }

    function playTrack() {
        if (!currentAudio.src) return;
        const playerBar = document.querySelector('.player-bar');
        if (playerBar) playerBar.classList.add('active');

        currentAudio.play().then(() => {
            isPlaying = true;
            if (playBtnImg) playBtnImg.src = 'assets/pause.png';
            clearInterval(progressInterval);
            progressInterval = setInterval(updateProgress, 250); // Частіший апдейт для плавності
        }).catch(err => console.error("Аудіофайл не знайдено або відхилено браузером:", err));
    }

    function pauseTrack() {
        isPlaying = false;
        if (playBtnImg) playBtnImg.src = 'assets/play.png';
        currentAudio.pause();
        clearInterval(progressInterval);
    }

    function togglePlay() {
        if (isPlaying) pauseTrack(); else playTrack();
    }

    function nextTrack() {
        if (currentPlayingList.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % currentPlayingList.length;
        loadAndPlayTrack(currentPlayingList[currentSongIndex]);
    }

    function prevTrack() {
        if (currentPlayingList.length === 0) return;
        currentSongIndex = (currentSongIndex - 1 + currentPlayingList.length) % currentPlayingList.length;
        loadAndPlayTrack(currentPlayingList[currentSongIndex]);
    }

    function updateProgress() {
        if (currentAudio.duration && progressFill) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }

    // Керування гучністю
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

    // Слухачі для керування плеєром
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);

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

    currentAudio.addEventListener('ended', () => {
        if (isRepeatMode) {
            currentAudio.currentTime = 0;
            playTrack();
        } else {
            nextTrack();
        }
    });

    currentAudio.addEventListener('timeupdate', updateProgress);

    // ==========================================
    // КАТЕГОРІЇ, НАСТРОЇ, ПОШУК ТА НАВІГАЦІЯ
    // ==========================================

    function renderExplore() {
        if (!musicGrid) return;
        
        musicGrid.removeAttribute('style'); 
        
        musicGrid.style.display = 'flex';
        musicGrid.style.flexDirection = 'column';
        musicGrid.style.alignItems = 'flex-start';
        musicGrid.style.justifyContent = 'flex-start';
        musicGrid.style.width = '100%';
        musicGrid.style.transform = 'none'; 
        musicGrid.innerHTML = '';
        
        currentViewMode = "explore";
        setExtraGridsVisibility(false);

        const topCategoriesGrid = document.createElement('div');
        topCategoriesGrid.style.display = 'grid';
        topCategoriesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
        topCategoriesGrid.style.gap = '25px';
        topCategoriesGrid.style.width = '100%';
        topCategoriesGrid.style.marginBottom = '50px'; 

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
                <span style="color: white; font-size: 24px; font-weight: bold; font-family: sans-serif; display: inline-block;">${cat.name}</span>
                <span style="font-size: 50px; align-self: flex-end; display: inline-block;">${cat.icon}</span>
            `;

            expCard.addEventListener('mouseenter', () => {
                expCard.style.transform = 'translateY(-5px) scale(1.02)';
                expCard.style.boxShadow = '0 12px 25px rgba(255,255,255,0.1)';
            });
            expCard.addEventListener('mouseleave', () => {
                expCard.style.transform = 'translateY(0) scale(1)';
                expCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
            });
            expCard.addEventListener('click', () => alert(`Ви відкрили категорію: ${cat.name}`));

            topCategoriesGrid.appendChild(expCard);
        });

        musicGrid.appendChild(topCategoriesGrid);

        const genresHeader = document.createElement('h2');
        genresHeader.innerText = "Настроения и жанры";
        genresHeader.style.color = "#ffffff";
        genresHeader.style.fontSize = "28px";
        genresHeader.style.fontWeight = "bold";
        genresHeader.style.margin = "0 0 20px 0";
        genresHeader.style.fontFamily = "sans-serif";
        musicGrid.appendChild(genresHeader);

        const genresGrid = document.createElement('div');
        genresGrid.style.display = 'grid';
        genresGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))'; 
        genresGrid.style.gap = '15px';
        genresGrid.style.width = '100%';

        moodAndGenres.forEach(item => {
            const genreCard = document.createElement('div');
            genreCard.style.background = '#212121';
            genreCard.style.borderRadius = '8px';
            genreCard.style.padding = '16px 20px';
            genreCard.style.display = 'flex';
            genreCard.style.alignItems = 'center';
            genreCard.style.cursor = 'pointer';
            genreCard.style.borderLeft = `5px solid ${item.color}`; 
            genreCard.style.transition = 'background 0.2s, transform 0.2s';

            genreCard.innerHTML = `
                <span style="color: #ffffff; font-size: 15px; font-weight: 600; font-family: sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.name}
                </span>
            `;

            genreCard.addEventListener('mouseenter', () => {
                genreCard.style.background = '#313131';
                genreCard.style.transform = 'scale(1.02)';
            });
            genreCard.addEventListener('mouseleave', () => {
                genreCard.style.background = '#212121';
                genreCard.style.transform = 'scale(1)';
            });
            genreCard.addEventListener('click', () => alert(`Жанр/Настрій: ${item.name}`));

            genresGrid.appendChild(genreCard);
        });

        musicGrid.appendChild(genresGrid);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const text = item.innerText.trim();
            const heading = document.querySelector('.glow-text');

            if (searchContainer) searchContainer.style.display = 'flex';

            if (text.includes("Огляд")) {
                if (heading) heading.innerText = "Огляд";
                if (moodContainer) moodContainer.style.display = 'none'; 
                renderExplore(); 
            } else {
                if (moodContainer) moodContainer.style.display = 'flex';

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

    function updateSidebarPlaylists() {
        playlistSection.innerHTML = `
            <div class="playlist-item" id="likedPlaylistBtn">
                <div class="playlist-title">Улюблене</div>
                <div class="playlist-sub">★ Автоплейліст</div>
            </div>
        `;

        favoritePlaylists.forEach(plName => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.style.position = 'relative';
            
            item.innerHTML = `
                <div class="playlist-info-block" style="flex: 1; cursor: pointer;">
                    <div class="playlist-title">${plName}</div>
                    <div class="playlist-sub">★ Обраний плейліст</div>
                </div>
                <button class="delete-playlist-btn" data-fav-name="${plName}" title="Видалити з обраного" 
                        style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 0 5px; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity 0.2s;">
                    ×
                </button>
            `;
            
            item.querySelector('.playlist-info-block').addEventListener('click', () => {
                if (plName === "Зарубіжні хіти 2026") {
                    renderPromoPlaylistView();
                }
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
                favoritePlaylists = favoritePlaylists.filter(name => name !== plName);
                localStorage.setItem('favoritePlaylists', JSON.stringify(favoritePlaylists));
                updateSidebarPlaylists();
                if (currentViewMode === "promo-playlist") {
                    renderPromoPlaylistView();
                }
            });

            playlistSection.appendChild(item);
        });

        Object.keys(customPlaylists).forEach(name => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.style.position = 'relative';
            
            item.innerHTML = `
                <div class="playlist-info-block" style="flex: 1; cursor: pointer;">
                    <div class="playlist-title">${name}</div>
                    <div class="playlist-sub">Плейліст • ${customPlaylists[name].length} треків</div>
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
                    localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
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
        message += "Введіть через кому НОВІ номери пісень (зі списку ваших улюблених):\n\n";
        
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
        localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
        updateSidebarPlaylists();
        selectCustomPlaylist(name, element);
    }

    if (btnNewPlaylist) {
        btnNewPlaylist.addEventListener('click', () => {
            if (likedSongs.length === 0) {
                alert("Спочатку додайте хоча б один трек в «Улюблене» за допомогою величезного сердечка!");
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
            localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
            updateSidebarPlaylists();
            alert(`Плейліст "${playlistName.trim()}" успішно створено з обраними треками!`);
        });
    }

    // ==================================================
    // Кнопка закриття нижнього плеєра (панелі)
    // ==================================================
    const playerBar = document.querySelector('.player-bar');
    if (playerBar) {
        const closePlayerBtn = document.createElement('button');
        closePlayerBtn.id = 'closePlayerBtn';
        closePlayerBtn.innerText = '✕';
        closePlayerBtn.title = 'Прибрати плеєр';
        closePlayerBtn.style.cssText = `
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 22px;
            cursor: pointer;
            margin-left: 25px;
            transition: color 0.2s, transform 0.2s;
            line-height: 1;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;

        closePlayerBtn.addEventListener('mouseenter', () => {
            closePlayerBtn.style.color = '#ff4444';
            closePlayerBtn.style.transform = 'scale(1.2)';
        });
        closePlayerBtn.addEventListener('mouseleave', () => {
            closePlayerBtn.style.color = 'rgba(255, 255, 255, 0.5)';
            closePlayerBtn.style.transform = 'scale(1)';
        });

        closePlayerBtn.addEventListener('click', () => {
            pauseTrack();                    // Зупиняємо музику
            currentAudio.src = '';           // Очищаємо аудіофайл
            playerBar.classList.remove('active'); // Ховаємо сам плеєр знизу
        });

        // Додаємо кнопку праворуч (після повзунка гучності)
        playerBar.appendChild(closePlayerBtn);
    }

    updateSidebarPlaylists();
    renderAllHomeSections();
});