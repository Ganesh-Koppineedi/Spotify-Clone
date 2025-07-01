document.addEventListener('DOMContentLoaded', function() {
    // Sample music data
    const songs = [{

            title: "Harty",
            artist: "The Weeknd",
            cover: "assets/images/cover1.jpg",
            file: "assets/music/hearty.mp3",
            duration: "2:34"
        },
        {

            title: "Moon Light Drive",
            artist: "The Weeknd",
            cover: "assets/images/cover1.jpg",
            file: "assets/music/moonlightdrive.mp3",
            duration: "04:09"
        },

        {
            title: "Legacy",
            artist: "Dua Lipa",
            cover: "assets/images/cover1.jpg",
            file: "assets/music/legacy.mp3",
            duration: "3:53"

        },

        {
            title: "Aashiqui (The Love Theme)",
            artist: "Arjit Singh",
            cover: "assets/images/cover3.jpeg",
            file: "assets/music/Aashiqui (The Love Theme).mp3",
            duration: "2:42"
        },

        {
            title: "Aasan Nahin Yaha",
            artist: "Arjit Singh",
            cover: "assets/images/cover3.jpeg",
            file: "assets/music/Aasan Nahin Yahan.mp3",
            duration: "3:23"
        },

        {
            title: "Tum Hi Ho",
            artist: "Arjit Singh",
            cover: "assets/images/cover3.jpeg",
            file: "assets/music/Tum Hi Ho.mp3 ",
            duration: "4: 15 "
        }
    ];

    // DOM Elements
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const albumCover = document.getElementById('album-cover');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const volumeControl = document.getElementById('volume');
    const playlistGrid = document.querySelector('.playlist-grid');
    const recentTracks = document.querySelector('.recent-tracks');

    // Current song index
    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize the player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderPlaylists();
        renderRecentTracks();
    }

    // Load song
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.file;
        albumCover.src = song.cover;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        durationEl.textContent = song.duration;
    }

    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Update current time
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Set volume
    function setVolume() {
        audio.volume = this.value;
    }

    // Render playlists
    function renderPlaylists() {
        playlistGrid.innerHTML = '';

        // Group songs by artist
        const artists = [...new Set(songs.map(song => song.artist))];

        artists.forEach(artist => {
            const artistSongs = songs.filter(song => song.artist === artist);
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${artistSongs[0].cover}" alt="${artist}">
                <h3>${artist}</h3>
                <p>Artist</p>
            `;
            playlistItem.addEventListener('click', () => {
                // Play the first song by this artist
                const firstSongIndex = songs.findIndex(song => song.artist === artist);
                currentSongIndex = firstSongIndex;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistGrid.appendChild(playlistItem);
        });
    }

    // Render recent tracks
    function renderRecentTracks() {
        recentTracks.innerHTML = '';

        songs.forEach((song, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="track-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            trackItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            recentTracks.appendChild(trackItem);
        });
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);

    progressContainer.addEventListener('click', setProgress);
    volumeControl.addEventListener('input', setVolume);

    // Initialize player
    initPlayer();
});