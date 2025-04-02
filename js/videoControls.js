// Basic video player controls functionality
export function initVideoControls() {
  // Set up video player when DOM is loaded
  setupVideoControls();

  function setupVideoControls() {
    const videoPlayer = document.getElementById("video-player");

    if (videoPlayer) {
      // Add click event for basic play/pause
      videoPlayer.addEventListener("click", (event) => {
        event.preventDefault();
        togglePlayPause();
      });

      // Visual indicators for player state
      videoPlayer.addEventListener("pause", showPlayIndicator);
      videoPlayer.addEventListener("play", hidePlayIndicator);
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    const videoPlayer = document.getElementById("video-player");

    if (videoPlayer.paused) {
      videoPlayer.play();
      hidePlayIndicator();
    } else {
      videoPlayer.pause();
      showPlayIndicator();
    }
  }

  // Show play indicator
  function showPlayIndicator() {
    let playIndicator = document.querySelector(".play-indicator");

    if (!playIndicator) {
      playIndicator = document.createElement("div");
      playIndicator.className = "play-indicator";
      playIndicator.innerHTML = '<i class="fas fa-play"></i>';

      const videoPlayerContainer = document.querySelector(".video-player");
      if (videoPlayerContainer) {
        videoPlayerContainer.appendChild(playIndicator);
      }
    }

    playIndicator.style.display = "flex";
  }

  // Hide play indicator
  function hidePlayIndicator() {
    const playIndicator = document.querySelector(".play-indicator");
    if (playIndicator) {
      playIndicator.style.display = "none";
    }
  }

  // Toggle fullscreen - simplified
  function toggleFullScreen() {
    const videoPlayer = document.getElementById("video-player");

    if (!document.fullscreenElement) {
      videoPlayer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Toggle mute
  function toggleMute() {
    const videoPlayer = document.getElementById("video-player");
    videoPlayer.muted = !videoPlayer.muted;
  }
}

// Initialize the video controls
initVideoControls();
