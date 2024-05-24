// Updated audios object with a volume property
const audios = {
    rain: createAudioElement('/sound/Rain.mp3', 0.5),
    song: createAudioElement('/sound/Song.m4a', 0.5),
    tree: createAudioElement('/sound/tree.mp3', 0.5),
    keyboard: createAudioElement('/sound/keyboard.mp3', 0.5),
    air: createAudioElement('/sound/air.mp3', 0.5),
    book: createAudioElement('/sound/book.mp3', 0.5),
    song2: createAudioElement('/sound/song2.mp3', 0.5),
    song3: createAudioElement('/sound/song3.mp3', 0.5),
    song4: createAudioElement('/sound/song4.mp3', 0.5),
    train: createAudioElement('/sound/train.m4a', 0.5),
    lofi: createAudioElement('/sound/lofi.mp3', 0.5),
};

function createAudioElement(src, defaultVolume) {
    const audio = new Audio(src);
    audio.volume = defaultVolume; // Set default volume
    audio.lastVolume = defaultVolume; // Store last volume
    audio.loop = true; // Set the audio to loop
    audio.addEventListener('ended', function () {
        this.currentTime = 0; // Restart audio when it ends
        this.play();
    });
    return audio;
}



// Function to play/pause audio and show/hide volume control and rain video
function togglePlayPause(soundName) {
    const audio = audios[soundName];
    const fadeDuration = 0.5; // in seconds
    const volumeStep = 0.1; // Step for volume change
    const rainVideo = document.querySelector('.video.rain');
    const noRainVideo = document.querySelector('.video.no-rain');

    if (audio.paused) {
        // Fade in the selected sound
        audio.volume = audio.lastVolume || 0;
        audio.play();
        fadeIn(audio, fadeDuration, volumeStep);

        // Show volume control
        const volumeContainer = document.getElementById(soundName + 'VolumeContainer');
        volumeContainer.style.display = 'block';

        // Show rain video with transition only if playing rain sound
        if (soundName === 'rain') {
            rainVideo.style.opacity = 1;
            rainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out';
            noRainVideo.style.opacity = 0;
            noRainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out'; // Apply transition to no-rain video
        }
    } else {
        // Fade out the selected sound
        fadeOut(audio, fadeDuration, volumeStep);

        // Hide volume control
        const volumeContainer = document.getElementById(soundName + 'VolumeContainer');
        volumeContainer.style.display = 'none';

        // Show no-rain video when sound is paused
        noRainVideo.style.opacity = 1;
        noRainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out'; // Apply transition to no-rain video
        rainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out'; // Apply transition to rain video
    }
}

// Function to fade in audio
function fadeIn(audio, duration, step) {
    let volume = audio.volume;
    const interval = setInterval(function () {
        if (volume < audio.lastVolume) {
            volume += step;
            if (volume > audio.lastVolume) volume = audio.lastVolume;
            audio.volume = volume;
        } else {
            clearInterval(interval);
        }
    }, duration * 1000 / 10); // 10 steps for the duration
}

// Function to fade out audio
function fadeOut(audio, duration, step) {
    let volume = audio.volume;
    const interval = setInterval(function () {
        if (volume > 0) {
            volume -= step;
            if (volume < 0) volume = 0;
            audio.volume = volume;
        } else {
            clearInterval(interval);
            audio.pause();
        }
    }, duration * 1000 / 10); // 10 steps for the duration
}

// Event listener for play button
document.querySelectorAll('.playButton').forEach(button => {
    button.addEventListener('click', function () {
        const soundName = this.getAttribute('data-sound');
        togglePlayPause(soundName);
        // Add transition class to audio element
        audios[soundName].classList.toggle('transition');
    });
});

// Function to handle volume change
function changeVolume(soundName, volume) {
    const audio = audios[soundName];
    audio.volume = volume / 100;
    audio.lastVolume = volume / 100; // Update last volume
}

// Event listener for volume slider
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function () {
        const soundName = this.getAttribute('data-sound');
        const volume = this.value;
        changeVolume(soundName, volume);
    });
});

// Smooth horizontal scrolling on touch devices
document.addEventListener("touchstart", function (event) {
    var touchStartX = event.touches[0].clientX;
    var scrollLeft = this.scrollLeft;

    document.addEventListener("touchmove", function (event) {
        var touchEndX = event.touches[0].clientX;
        var scrollAmount = touchStartX - touchEndX;
        this.scrollLeft = scrollLeft + scrollAmount;
    }, { passive: true });
}, { passive: true });
