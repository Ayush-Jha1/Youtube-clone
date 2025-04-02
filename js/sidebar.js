// Sidebar functionality (hamburger menu)
export function initSidebar() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSidebar);
  } else {
    setupSidebar();
  }

  function setupSidebar() {
    const menuIcon = document.querySelector(".menu-icon");
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".container");

    if (!menuIcon || !sidebar || !container) return;

    // Set up click handler for menu icon
    menuIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSidebar(sidebar, container);
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
      const isSidebarOpen = sidebar.classList.contains("active");
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnMenuIcon = menuIcon.contains(event.target);

      if (isSidebarOpen && !isClickInsideSidebar && !isClickOnMenuIcon) {
        toggleSidebar(sidebar, container);
      }
    });

    // Apply initial state based on localStorage or default to open
    applyInitialState(sidebar, container);
  }

  function applyInitialState(sidebar, container) {
    const sidebarState = localStorage.getItem("sidebarOpen");

    // Default to open if no state is stored
    if (sidebarState === "false") {
      sidebar.classList.remove("active");
      container.classList.remove("sidebar-open");
    } else {
      sidebar.classList.add("active");
      container.classList.add("sidebar-open");
    }
  }

  function toggleSidebar(sidebar, container) {
    sidebar.classList.toggle("active");
    container.classList.toggle("sidebar-open");

    // Store sidebar state in localStorage
    const isSidebarOpen = sidebar.classList.contains("active");
    localStorage.setItem("sidebarOpen", isSidebarOpen ? "true" : "false");
  }
}
