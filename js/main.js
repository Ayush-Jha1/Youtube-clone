import { initVideoControls } from "./videoControls.js";
import { initVideoActions } from "./videoActions.js";
import { initComments } from "./comments.js";
import { initDarkMode } from "./darkMode.js";
import { initWatchHistory } from "./watchHistory.js";
import { initSidebar } from "./sidebar.js"; // Add this import

// DOM elements
const homePage = document.getElementById("home-page");
const videoPage = document.getElementById("video-page");
const videosContainer = document.getElementById("videos-container");
const recommendedContainer = document.getElementById("recommended-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const categoryChips = document.querySelectorAll(".category-chip");

// Initialize components
document.addEventListener("DOMContentLoaded", () => {
  initializeFromUrl();
  initDarkMode();
  initVideoControls();
  initVideoActions();
  initComments();
  initWatchHistory();
  initSidebar(); // Add this initialization
  setupEventListeners();
  loadVideos();
});

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
      performSearch(searchQuery);
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }
  });

  // Category filter functionality
  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      categoryChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.textContent;
      if (category === "All") {
        loadVideos();
      } else {
        filterVideosByCategory(category);
      }
    });
  });

  // Home navigation
  document.querySelector(".logo").addEventListener("click", navigateToHome);
  document
    .querySelector(".sidebar-item.active")
    .addEventListener("click", navigateToHome);
}

// Check URL for video ID on page load
function initializeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");

  if (videoId) {
    navigateToVideo(videoId);
  } else {
    navigateToHome();
  }
}

// Navigate to home page
export function navigateToHome() {
  homePage.classList.add("active");
  videoPage.classList.remove("active");
  window.history.pushState({}, "", "/");
  document.title = "YouTube Clone";
}

// Navigate to video page
export function navigateToVideo(videoId) {
  loadVideoById(videoId);
  homePage.classList.remove("active");
  videoPage.classList.add("active");
  window.history.pushState({}, "", `?v=${videoId}`);
}

// Load all videos
async function loadVideos() {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const videos = await response.json();
    displayVideos(videos);
  } catch (error) {
    console.error("Error loading videos:", error);
  }
}

// Load video by ID
async function loadVideoById(videoId) {
  try {
    const response = await fetch(`/api/videos/${videoId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch video");
    }

    const video = await response.json();
    document.title = `${video.title} - YouTube Clone`;

    // Update video player
    const videoPlayer = document.getElementById("video-player");
    videoPlayer.src = video.videoUrl;
    videoPlayer.poster = video.thumbnailUrl;

    // Update video details
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

    // Add to watch history
    const watchHistory = window.watchHistory || {
      addToWatchHistory: () => {},
      incrementVideoViews: () => {},
    };
    watchHistory.addToWatchHistory(parseInt(videoId), video);
    watchHistory.incrementVideoViews(parseInt(videoId));

    // Load comments and recommended videos
    loadComments(videoId);
    loadRecommendedVideos(videoId);
  } catch (error) {
    console.error("Error loading video:", error);
  }
}

// Load comments for a video
async function loadComments(videoId) {
  try {
    const response = await fetch(`/api/videos/${videoId}/comments`);
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const comments = await response.json();
    const commentsContainer = document.getElementById("comments-container");
    document.getElementById("comments-count").textContent = comments.length;

    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.className = "comment";
      commentElement.innerHTML = `
                <div class="user-avatar">
                    <img src="${comment.avatarUrl}" alt="${comment.username}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-username">${
                          comment.username
                        }</span>
                        <span class="comment-date">${formatCommentDate(
                          comment.postedDate
                        )}</span>
                    </div>
                    <div class="comment-text">${comment.comment}</div>
                    <div class="comment-actions">
                        <div class="comment-action" data-action="like" data-id="${
                          comment.id
                        }">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${formatNumber(comment.likes)}</span>
                        </div>
                        <div class="comment-action" data-action="dislike" data-id="${
                          comment.id
                        }">
                            <i class="fas fa-thumbs-down"></i>
                            <span>${formatNumber(comment.dislikes)}</span>
                        </div>
                        <div class="comment-action">
                            <span>Reply</span>
                        </div>
                    </div>
                </div>
            `;
      commentsContainer.appendChild(commentElement);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

// Load recommended videos
async function loadRecommendedVideos(currentVideoId) {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

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

// Filter videos by category
function filterVideosByCategory(category) {
  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach((card) => {
    const videoCategory = card.dataset.category || "";
    if (videoCategory === category || category === "All") {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Search functionality
async function performSearch(query) {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

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

// Display videos in grid
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
    videoElement.dataset.category = video.category || "Uncategorized";

    videoElement.innerHTML = `
            <div class="thumbnail">
                <img src="${video.thumbnailUrl}" alt="${video.title}">
                <div class="duration">${video.duration}</div>
            </div>
            <div class="video-details">
                <div class="channel-avatar">
                    <img src="${video.channelAvatarUrl}" alt="${
      video.channelName
    }">
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

// Format numbers (e.g., 1,000,000 -> 1M)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

// Format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Format comment dates
function formatCommentDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format time ago (e.g., 2 days ago)
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
