import { initVideoControls } from "./videoControls.js";
import { initVideoActions } from "./videoActions.js";
import { initDarkMode } from "./darkMode.js";
import { initSidebar } from "./sidebar.js";

const homePage = document.getElementById("home-page");
const videoPage = document.getElementById("video-page");
const videosContainer = document.getElementById("videos-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

document.addEventListener("DOMContentLoaded", () => {
  initializeFromUrl();
  initDarkMode();
  initVideoControls();
  initVideoActions();
  initSidebar();
  setupEventListeners();
  loadVideos();
});

function setupEventListeners() {
  searchButton?.addEventListener("click", () => {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) performSearch(searchQuery);
  });

  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) performSearch(searchQuery);
    }
  });

  document.querySelector(".logo")?.addEventListener("click", navigateToHome);
  document
    .querySelector(".sidebar-item.active")
    ?.addEventListener("click", navigateToHome);
}

function initializeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");

  if (videoId) {
    navigateToVideo(videoId);
  } else {
    navigateToHome();
  }
}

// Update your navigateToHome function
export function navigateToHome() {
  homePage.classList.add("active");
  videoPage.classList.remove("active");

  window.history.pushState({}, "", "/");
  document.title = "YouTube Clone";

  // Clear any video content to prevent memory leaks
  const videoPlayer = document.getElementById("video-player");
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.src = "";
  }

  setTimeout(() => loadVideos(), 50);
}

// Update your navigateToVideo function
export function navigateToVideo(videoId) {
  // First load the video data
  loadVideoById(videoId);

  // Then switch the view
  homePage.classList.remove("active");
  videoPage.classList.add("active");

  // Update URL
  window.history.pushState({}, "", `?v=${videoId}`);
}

async function loadVideos() {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) throw new Error("Failed to fetch videos");
    const videos = await response.json();
    displayVideos(videos);
  } catch (error) {
    console.error("Error loading videos:", error);
  }
}

async function loadVideoById(videoId) {
  try {
    // First make sure we're on the video page
    videoPage.classList.add("active");
    homePage.classList.remove("active");

    const response = await fetch(`/api/videos/${videoId}`);
    if (!response.ok) throw new Error("Failed to fetch video");
    const video = await response.json();

    document.title = `${video.title} - YouTube Clone`;
    const videoPlayer = document.getElementById("video-player");
    if (videoPlayer) {
      videoPlayer.src = video.videoUrl;
      videoPlayer.poster = video.thumbnailUrl;
    }

    document.getElementById("video-title").textContent = video.title;
    document.getElementById("video-views").textContent = formatNumber(
      video.views
    );
    document.getElementById("video-date").textContent = formatDate(
      video.uploadDate
    );
    document.getElementById("like-count").textContent = formatNumber(
      video.likes
    );
    document.getElementById("dislike-count").textContent = formatNumber(
      video.dislikes
    );
    document.getElementById("channel-name").textContent = video.channelName;
    document.getElementById("channel-avatar").src = video.channelAvatarUrl;
    document.getElementById("video-description").textContent =
      video.description;

    loadRecommendedVideos(videoId);

    setTimeout(() => {
      if (typeof initVideoActions === "function") initVideoActions();
    }, 200);

    setTimeout(connectVideoActionButtons, 500);

    setTimeout(() => {
      if (window.videoActions && window.videoActions.updateButtonStates) {
        window.videoActions.updateButtonStates(videoId);
      }
    }, 300);

    setTimeout(updateButtonStates, 300);
  } catch (error) {
    console.error("Error loading video:", error);
  }
}

function updateButtonStates() {
  const videoId = new URLSearchParams(window.location.search).get("v");
  const likedVideos = JSON.parse(localStorage.getItem("likedVideos") || "{}");
  const dislikedVideos = JSON.parse(
    localStorage.getItem("dislikedVideos") || "{}"
  );
  const channelName =
    document.getElementById("channel-name")?.textContent || "";
  const channelId = channelName.replace(/\s+/g, "_").toLowerCase();
  const subscribedChannels = JSON.parse(
    localStorage.getItem("subscribedChannels") || "{}"
  );

  const likeButton = document.getElementById("like-button");
  if (likeButton) {
    likeButton.classList[likedVideos[videoId] ? "add" : "remove"]("active");
  }

  const dislikeButton = document.getElementById("dislike-button");
  if (dislikeButton) {
    dislikeButton.classList[dislikedVideos[videoId] ? "add" : "remove"](
      "active"
    );
  }

  const subscribeButton = document.querySelector(".subscribe-button");
  if (subscribeButton && channelId) {
    if (subscribedChannels[channelId]) {
      subscribeButton.classList.add("subscribed");
      subscribeButton.textContent = "Subscribed";
    } else {
      subscribeButton.classList.remove("subscribed");
      subscribeButton.textContent = "Subscribe";
    }
  }
}

async function loadRecommendedVideos(currentVideoId) {
  if (!videoPage.classList.contains("active")) return;

  try {
    const response = await fetch("/api/videos");
    if (!response.ok) throw new Error("Failed to fetch videos");

    const videos = await response.json();
    const recommendedVideos = videos.filter(
      (video) => video.id !== parseInt(currentVideoId)
    );
    const recommendedContainer = document.getElementById(
      "recommended-container"
    );

    recommendedContainer.innerHTML = "";
    recommendedVideos.forEach((video) => {
      const videoElement = document.createElement("div");
      videoElement.className = "recommended-video";
      videoElement.dataset.id = video.id;
      videoElement.innerHTML = `
        <div class="recommended-thumbnail">
          <img src="${video.thumbnailUrl}" alt="${video.title}">
          <div class="duration">${video.duration}</div>
        </div>
        <div class="recommended-details">
          <h4>${video.title}</h4>
          <div class="recommended-channel">${video.channelName}</div>
          <div class="recommended-stats">
            ${formatNumber(video.views)} views • ${formatTimeAgo(
        video.uploadDate
      )}
          </div>
        </div>
      `;
      videoElement.addEventListener("click", () => navigateToVideo(video.id));
      recommendedContainer.appendChild(videoElement);
    });
  } catch (error) {
    console.error("Error loading recommended videos:", error);
  }
}

async function performSearch(query) {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) throw new Error("Failed to fetch videos");

    const videos = await response.json();
    const filteredVideos = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.channelName.toLowerCase().includes(query.toLowerCase())
    );

    displayVideos(filteredVideos, query);
  } catch (error) {
    console.error("Error searching videos:", error);
  }
}

function displayVideos(videos, searchQuery = null) {
  const container = document.getElementById("videos-container");
  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        ${
          searchQuery
            ? `No results found for "${searchQuery}"`
            : "No videos available"
        }
      </div>
    `;
    return;
  }

  videos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.className = "video-card";
    videoElement.dataset.id = video.id;

    videoElement.innerHTML = `
      <div class="thumbnail">
        <img src="${video.thumbnailUrl}" alt="${video.title}">
        <div class="duration">${video.duration}</div>
      </div>
      <div class="video-details">
        <div class="channel-avatar">
          <img src="${video.channelAvatarUrl}" alt="${video.channelName}">
        </div>
        <div class="video-meta">
          <h3>${video.title}</h3>
          <div class="channel-name">${video.channelName}</div>
          <div class="video-stats">
            ${formatNumber(video.views)} views • ${formatTimeAgo(
      video.uploadDate
    )}
          </div>
        </div>
      </div>
    `;

    videoElement.addEventListener("click", () => navigateToVideo(video.id));
    container.appendChild(videoElement);
  });
}

function connectVideoActionButtons() {
  if (!videoPage.classList.contains("active")) return;

  const videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId) return;

  const likeButton = document.getElementById("like-button");
  const dislikeButton = document.getElementById("dislike-button");
  const subscribeButton = document.querySelector(".subscribe-button");

  if (likeButton) {
    const newLikeButton = likeButton.cloneNode(true);
    likeButton.parentNode.replaceChild(newLikeButton, likeButton);
    newLikeButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.videoActions && window.videoActions.toggleLike) {
        window.videoActions.toggleLike();
      }
    });
  }

  if (dislikeButton) {
    const newDislikeButton = dislikeButton.cloneNode(true);
    dislikeButton.parentNode.replaceChild(newDislikeButton, dislikeButton);
    newDislikeButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.videoActions && window.videoActions.toggleDislike) {
        window.videoActions.toggleDislike();
      }
    });
  }

  if (subscribeButton) {
    const newSubscribeButton = subscribeButton.cloneNode(true);
    subscribeButton.parentNode.replaceChild(
      newSubscribeButton,
      subscribeButton
    );
    newSubscribeButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.videoActions && window.videoActions.toggleSubscribe) {
        window.videoActions.toggleSubscribe();
      }
    });
  }

  setTimeout(() => {
    if (window.videoActions && window.videoActions.updateButtonStates) {
      window.videoActions.updateButtonStates(videoId);
    }
  }, 100);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

document.addEventListener(
  "click",
  (e) => {
    const logoElement = e.target.closest(".logo");
    if (logoElement) {
      e.preventDefault();
      e.stopPropagation();
      navigateToHome();
      setTimeout(() => loadVideos(), 200);
      return false;
    }
  },
  true
);
