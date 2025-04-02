// Video actions functionality (likes, dislikes, subscribe)
export function initVideoActions() {
  // Expose functions globally
  window.videoActions = {
    toggleLike,
    toggleDislike,
    toggleSubscribe,
    updateButtonStates,
  };

  // Initialize buttons
  initButtons();

  // Initialize action buttons with simpler event handling
  function initButtons() {
    attachClickHandler("like-button", toggleLike);
    attachClickHandler("dislike-button", toggleDislike);
    attachClickHandler(".subscribe-button", toggleSubscribe, true);
  }

  // Helper to attach click handlers
  function attachClickHandler(selector, handler, isClass = false) {
    const element = isClass
      ? document.querySelector(selector)
      : document.getElementById(selector);

    if (element) {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        handler();
      });
    }
  }

  // Get current video ID from URL
  function getCurrentVideoId() {
    return new URLSearchParams(window.location.search).get("v");
  }

  // Update button states
  function updateButtonStates() {
    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");
    const subscribeButton = document.querySelector(".subscribe-button");

    if (likeButton) likeButton.classList.remove("active");
    if (dislikeButton) dislikeButton.classList.remove("active");

    if (subscribeButton) {
      subscribeButton.classList.remove("subscribed");
      subscribeButton.textContent = "Subscribe";
    }
  }

  // Handle like button toggle
  function toggleLike() {
    if (!getCurrentVideoId()) return;

    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");
    const likeCount = document.getElementById("like-count");
    const dislikeCount = document.getElementById("dislike-count");

    if (!likeButton || !dislikeButton) return;

    let likes = parseCount(likeCount.textContent);
    let dislikes = parseCount(dislikeCount.textContent);
    const likeIcon = likeButton.querySelector("i");

    if (likeButton.classList.contains("active")) {
      likeButton.classList.remove("active");
      likes -= 1;
    } else {
      likeButton.classList.add("active");
      likeIcon.classList.add("animate");
      likes += 1;

      if (dislikeButton.classList.contains("active")) {
        dislikeButton.classList.remove("active");
        dislikes -= 1;
      }
    }

    likeCount.textContent = formatNumber(Math.max(0, likes));
    dislikeCount.textContent = formatNumber(Math.max(0, dislikes));

    setTimeout(() => likeIcon.classList.remove("animate"), 500);
  }

  // Handle dislike button toggle
  function toggleDislike() {
    if (!getCurrentVideoId()) return;

    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");
    const likeCount = document.getElementById("like-count");
    const dislikeCount = document.getElementById("dislike-count");

    if (!likeButton || !dislikeButton) return;

    let likes = parseCount(likeCount.textContent);
    let dislikes = parseCount(dislikeCount.textContent);
    const dislikeIcon = dislikeButton.querySelector("i");

    if (dislikeButton.classList.contains("active")) {
      dislikeButton.classList.remove("active");
      dislikes -= 1;
    } else {
      dislikeButton.classList.add("active");
      dislikeIcon.classList.add("animate");
      dislikes += 1;

      if (likeButton.classList.contains("active")) {
        likeButton.classList.remove("active");
        likes -= 1;
      }
    }

    likeCount.textContent = formatNumber(Math.max(0, likes));
    dislikeCount.textContent = formatNumber(Math.max(0, dislikes));

    setTimeout(() => dislikeIcon.classList.remove("animate"), 500);
  }

  // Handle subscribe button toggle
  function toggleSubscribe() {
    const subscribeButton = document.querySelector(".subscribe-button");
    if (!subscribeButton) return;

    subscribeButton.classList.add("subscribe-animation");
    setTimeout(
      () => subscribeButton.classList.remove("subscribe-animation"),
      500
    );

    if (subscribeButton.classList.contains("subscribed")) {
      subscribeButton.classList.remove("subscribed");
      subscribeButton.textContent = "Subscribe";
    } else {
      subscribeButton.classList.add("subscribed");
      subscribeButton.textContent = "Subscribed";
    }
  }

  // Format numbers helper
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }

  // Parse counts with K/M suffixes
  function parseCount(countStr) {
    if (!countStr) return 0;
    countStr = countStr.trim();

    if (countStr.endsWith("K"))
      return parseFloat(countStr.replace("K", "")) * 1000;
    if (countStr.endsWith("M"))
      return parseFloat(countStr.replace("M", "")) * 1000000;
    return parseInt(countStr) || 0;
  }
}
