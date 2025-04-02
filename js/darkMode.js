/**
 * Dark mode functionality
 * Manages user preference for dark/light theme and persists it
 */
export function initDarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (!darkModeToggle) return; // Guard clause for missing element

  const icon = darkModeToggle.querySelector("i");
  const body = document.body;

  // Initialize based on localStorage or system preference
  const userPreference = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Apply dark mode if saved or user prefers dark mode
  if (
    userPreference === "enabled" ||
    (userPreference === null && prefersDark)
  ) {
    applyDarkMode();
  } else {
    applyLightMode();
  }

  // Toggle mode on click
  darkModeToggle.addEventListener("click", toggleDarkMode);

  // Core functions
  function toggleDarkMode() {
    if (body.classList.contains("dark-mode")) {
      applyLightMode();
    } else {
      applyDarkMode();
    }
  }

  function applyDarkMode() {
    body.classList.add("dark-mode");
    updateIcon("sun");
    localStorage.setItem("darkMode", "enabled");
  }

  function applyLightMode() {
    body.classList.remove("dark-mode");
    updateIcon("moon");
    localStorage.setItem("darkMode", "disabled");
  }

  function updateIcon(type) {
    if (!icon) return;
    icon.className = type === "sun" ? "fas fa-sun" : "fas fa-moon";
  }
}
