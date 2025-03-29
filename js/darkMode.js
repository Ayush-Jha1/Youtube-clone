// Dark mode functionality
export function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Apply dark mode if it was enabled previously
    if (isDarkMode) {
        enableDarkMode();
    }
    
    // Dark mode toggle click event
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    // Enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    }
    
    // Disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        darkModeToggle.querySelector('i').classList.remove('fa-sun');
        darkModeToggle.querySelector('i').classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}