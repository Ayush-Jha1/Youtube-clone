// Watch history functionality
export function initWatchHistory() {
    // Expose functions to global scope for access from other modules
    window.watchHistory = {
        addToWatchHistory,
        getWatchHistory,
        incrementVideoViews,
        getVideoViewCount,
        clearWatchHistory
    };
    
    // Initialize sidebar history count
    updateHistoryCount();
    
    // Add video to watch history
    function addToWatchHistory(videoId, videoData) {
        if (!videoId || !videoData) return;
        
        // Get existing history
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        
        // Check if video is already in history
        const existingIndex = history.findIndex(item => item.id === videoId);
        
        // If already exists, remove it (to add it again at the top)
        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }
        
        // Add video to top of history with timestamp
        history.unshift({
            id: videoId,
            title: videoData.title,
            thumbnailUrl: videoData.thumbnailUrl,
            channelName: videoData.channelName,
            channelAvatarUrl: videoData.channelAvatarUrl,
            duration: videoData.duration,
            viewedAt: new Date().toISOString()
        });
        
        // Limit history size to 50 items
        if (history.length > 50) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('watchHistory', JSON.stringify(history));
        
        // Update history count in sidebar
        updateHistoryCount();
    }
    
    // Increment video view count
    function incrementVideoViews(videoId) {
        if (!videoId) return;
        
        // Get existing view counts
        const viewCounts = JSON.parse(localStorage.getItem('videoViewCounts') || '{}');
        
        // Increment count
        viewCounts[videoId] = (viewCounts[videoId] || 0) + 1;
        
        // Save to localStorage
        localStorage.setItem('videoViewCounts', JSON.stringify(viewCounts));
    }
    
    // Get watch history
    function getWatchHistory() {
        return JSON.parse(localStorage.getItem('watchHistory') || '[]');
    }
    
    // Get video view count
    function getVideoViewCount(videoId) {
        if (!videoId) return 0;
        
        const viewCounts = JSON.parse(localStorage.getItem('videoViewCounts') || '{}');
        return viewCounts[videoId] || 0;
    }
    
    // Clear watch history
    function clearWatchHistory() {
        localStorage.removeItem('watchHistory');
        updateHistoryCount();
    }
    
    // Update history count in sidebar
    function updateHistoryCount() {
        const history = getWatchHistory();
        const historyItem = document.querySelector('.sidebar-item:has(i.fa-history)');
        
        if (historyItem && history.length > 0) {
            // Check if count badge already exists
            let countBadge = historyItem.querySelector('.history-count');
            
            if (!countBadge) {
                // Create count badge
                countBadge = document.createElement('span');
                countBadge.className = 'history-count';
                historyItem.appendChild(countBadge);
            }
            
            // Update count
            countBadge.textContent = history.length;
        }
    }
}