// Sidebar functionality (hamburger menu)
export function initSidebar() {
  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
  });

  // Call immediately as well for faster initialization
  setupSidebar();

  function setupSidebar() {
    console.log("Setting up sidebar"); // Debugging log
    const menuIcon = document.querySelector(".menu-icon");
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".container");

    if (!menuIcon || !sidebar || !container) {
      console.log("Sidebar elements not found, retrying later"); // Debugging log
      return;
    }

    console.log("Found all required elements for sidebar"); // Debugging log

    // Set up click handler for menu icon
    menuIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleSidebar();
    });

    // Close sidebar when clicking outside of it (on mobile)
    document.addEventListener("click", function (event) {
      // If sidebar is open and click is outside sidebar and not on menu icon
      const isSidebarOpen = sidebar.classList.contains("active");
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnMenuIcon = menuIcon.contains(event.target);

      if (isSidebarOpen && !isClickInsideSidebar && !isClickOnMenuIcon) {
        toggleSidebar();
      }
    });

    // Check initial screen size to set appropriate sidebar state
    checkScreenSize();

    // Update sidebar state when window is resized
    window.addEventListener("resize", checkScreenSize);

    // Set initial state based on localStorage or default to expanded on desktop
    const sidebarState = localStorage.getItem("sidebarOpen");
    if (window.innerWidth > 1200) {
      if (sidebarState === "false") {
        sidebar.classList.remove("active");
        container.classList.remove("sidebar-open");
      } else {
        sidebar.classList.add("active");
        container.classList.add("sidebar-open");
      }
    }
  }

  function toggleSidebar() {
    console.log("Toggling sidebar"); // Debugging log
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".container");

    sidebar.classList.toggle("active");
    container.classList.toggle("sidebar-open");

    // Store sidebar state in localStorage
    const isSidebarOpen = sidebar.classList.contains("active");
    localStorage.setItem("sidebarOpen", isSidebarOpen ? "true" : "false");

    console.log("Sidebar is now:", isSidebarOpen ? "open" : "closed"); // Debugging log
  }

  function checkScreenSize() {
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".container");

    // On smaller screens, sidebar should be closed by default
    if (window.innerWidth <= 1200) {
      sidebar.classList.remove("active");
      container.classList.remove("sidebar-open");
    } else {
      // On larger screens, respect user's previous choice
      const sidebarState = localStorage.getItem("sidebarOpen");

      if (sidebarState === "false") {
        sidebar.classList.remove("active");
        container.classList.remove("sidebar-open");
      } else {
        sidebar.classList.add("active");
        container.classList.add("sidebar-open");
      }
    }
  }
}

// Auto-initialize
initSidebar();
