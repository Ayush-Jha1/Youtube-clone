// Video player controls functionality
export function initVideoControls() {
    document.addEventListener('click', function(event) {
        // Check if we're on a video page
        const videoPlayer = document.getElementById('video-player');
        if (!videoPlayer) return;
        
        // Play/pause on video click
        if (event.target === videoPlayer) {
            togglePlayPause();
        }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Check if we're on a video page
        const videoPlayer = document.getElementById('video-player');
        if (!videoPlayer) return;
        
        // Focus is not on an input field
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            switch (event.key) {
                case ' ':
                    // Space bar to play/pause
                    event.preventDefault();
                    togglePlayPause();
                    break;
                case 'f':
                    // F key to toggle fullscreen
                    event.preventDefault();
                    toggleFullScreen();
                    break;
                case 'm':
                    // M key to mute/unmute
                    event.preventDefault();
                    toggleMute();
                    break;
                case 'ArrowLeft':
                    // Left arrow to rewind 5 seconds
                    event.preventDefault();
                    seek(-5);
                    break;
                case 'ArrowRight':
                    // Right arrow to fast forward 5 seconds
                    event.preventDefault();
                    seek(5);
                    break;
                case 'ArrowUp':
                    // Up arrow to increase volume
                    event.preventDefault();
                    changeVolume(0.1);
                    break;
                case 'ArrowDown':
                    // Down arrow to decrease volume
                    event.preventDefault();
                    changeVolume(-0.1);
                    break;
            }
        }
    });
    
    // Toggle play/pause
    function togglePlayPause() {
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    }
    
    // Toggle fullscreen
    function toggleFullScreen() {
        const videoPlayer = document.getElementById('video-player');
        
        if (!document.fullscreenElement) {
            if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) {
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) {
                videoPlayer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    // Toggle mute
    function toggleMute() {
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.muted = !videoPlayer.muted;
    }
    
    // Seek forward or backward
    function seek(seconds) {
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.currentTime += seconds;
    }
    
    // Change volume
    function changeVolume(delta) {
        const videoPlayer = document.getElementById('video-player');
        let newVolume = videoPlayer.volume + delta;
        
        // Ensure volume is between 0 and 1
        newVolume = Math.max(0, Math.min(1, newVolume));
        videoPlayer.volume = newVolume;
    }
}