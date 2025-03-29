// Video player controls functionality
export function initVideoControls() {
  // Initialize immediately and also when DOM is loaded
  setupVideoControls();

  document.addEventListener("DOMContentLoaded", () => {
    setupVideoControls();
  });

  function setupVideoControls() {
    console.log("Setting up video controls"); // Debugging log
    const videoPlayer = document.getElementById("video-player");

    // If we have a video player, add click event for play/pause
    if (videoPlayer) {
      console.log("Video player found"); // Debugging log

      // Define the handler inline to avoid scope issues
      const clickHandler = function (event) {
        console.log("Video clicked"); // Debugging log
        event.preventDefault();
        event.stopPropagation();
        togglePlayPause();
      };

      // Remove any existing event listeners (in case of double initialization)
      videoPlayer.removeEventListener("click", clickHandler);

      // Add the click event with a direct function reference
      videoPlayer.addEventListener("click", clickHandler);

      // Add a visual indicator when video is paused
      videoPlayer.removeEventListener("pause", showPlayIndicator);
      videoPlayer.addEventListener("pause", showPlayIndicator);

      videoPlayer.removeEventListener("play", hidePlayIndicator);
      videoPlayer.addEventListener("play", hidePlayIndicator);

      // Store the handler directly on the element for debugging
      videoPlayer.clickHandler = clickHandler;

      console.log("Click handler attached to video");
    }

    // Make sure spacebar is properly handled at document level
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown, { capture: true });
  }

  // Keep this for compatibility
  function handleVideoClick(event) {
    console.log("Video click handler called");
    event.preventDefault();
    event.stopPropagation();
    togglePlayPause();
  }

  // Handle keyboard shortcuts with capture phase to get event before other handlers
  function handleKeyDown(event) {
    console.log("Key pressed:", event.key); // Debugging log

    // Check if we're on a video page
    const videoPlayer = document.getElementById("video-player");
    if (!videoPlayer) return;

    // Focus is not on an input field
    if (
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      if (event.code === "Space" || event.key === " ") {
        // Space bar to play/pause - using both event.code and event.key for better compatibility
        console.log("Space detected, toggling play/pause"); // Debugging log
        event.preventDefault();
        togglePlayPause();
        return false;
      }

      // Rest of your keyboard shortcuts
      switch (event.key) {
        case "f":
          event.preventDefault();
          toggleFullScreen();
          break;
        case "m":
          event.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          event.preventDefault();
          seek(-5);
          break;
        case "ArrowRight":
          event.preventDefault();
          seek(5);
          break;
        case "ArrowUp":
          event.preventDefault();
          changeVolume(0.1);
          break;
        case "ArrowDown":
          event.preventDefault();
          changeVolume(-0.1);
          break;
      }
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    const videoPlayer = document.getElementById("video-player");
    console.log("Toggle play/pause, current state:", videoPlayer.paused); // Debugging log

    if (videoPlayer.paused) {
      videoPlayer
        .play()
        .catch((err) => console.error("Error playing video:", err));
      hidePlayIndicator();
    } else {
      videoPlayer.pause();
      showPlayIndicator();
    }
  }

  // Show play indicator overlay
  function showPlayIndicator() {
    let playIndicator = document.querySelector(".play-indicator");
    if (!playIndicator) {
      playIndicator = document.createElement("div");
      playIndicator.className = "play-indicator";
      playIndicator.innerHTML = '<i class="fas fa-play"></i>';

      const videoContainer = document.querySelector(".video-container");
      if (videoContainer) {
        videoContainer.appendChild(playIndicator);
      } else {
        // Fallback to appending to video's parent if .video-container not found
        const videoPlayer = document.getElementById("video-player");
        if (videoPlayer && videoPlayer.parentNode) {
          videoPlayer.parentNode.appendChild(playIndicator);
        }
      }
    }
    playIndicator.style.display = "flex";

    // Fade out after 1 second
    setTimeout(() => {
      playIndicator.style.opacity = "0";
    }, 1000);
  }

  // Hide play indicator
  function hidePlayIndicator() {
    const playIndicator = document.querySelector(".play-indicator");
    if (playIndicator) {
      playIndicator.style.display = "none";
      playIndicator.style.opacity = "1";
    }
  }

  // Keep existing functions
  function toggleFullScreen() {
    const videoPlayer = document.getElementById("video-player");

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

  function toggleMute() {
    const videoPlayer = document.getElementById("video-player");
    videoPlayer.muted = !videoPlayer.muted;
  }

  function seek(seconds) {
    const videoPlayer = document.getElementById("video-player");
    videoPlayer.currentTime += seconds;
  }

  function changeVolume(delta) {
    const videoPlayer = document.getElementById("video-player");
    let newVolume = videoPlayer.volume + delta;

    // Ensure volume is between 0 and 1
    newVolume = Math.max(0, Math.min(1, newVolume));
    videoPlayer.volume = newVolume;
  }
}

// Auto-initialize - this ensures the function runs
initVideoControls();
