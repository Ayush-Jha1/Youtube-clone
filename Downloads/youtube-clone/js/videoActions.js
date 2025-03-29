// Video actions functionality (likes, dislikes, shares, saves)
export function initVideoActions() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initButtons();
    });
    
    // Initialize action buttons
    function initButtons() {
        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        const shareButton = document.getElementById('share-button');
        const saveButton = document.getElementById('save-button');
        
        if (likeButton) {
            likeButton.addEventListener('click', toggleLike);
        }
        
        if (dislikeButton) {
            dislikeButton.addEventListener('click', toggleDislike);
        }
        
        if (shareButton) {
            shareButton.addEventListener('click', shareVideo);
        }
        
        if (saveButton) {
            saveButton.addEventListener('click', toggleSave);
        }
    }
    
    // Get current video ID from URL
    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }
    
    // Update button states based on localStorage
    function updateButtonStates(videoId) {
        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        const saveButton = document.getElementById('save-button');
        
        // Check if video is liked
        const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '{}');
        if (likedVideos[videoId]) {
            likeButton.classList.add('active');
            dislikeButton.classList.remove('active');
        } else {
            likeButton.classList.remove('active');
        }
        
        // Check if video is disliked
        const dislikedVideos = JSON.parse(localStorage.getItem('dislikedVideos') || '{}');
        if (dislikedVideos[videoId]) {
            dislikeButton.classList.add('active');
            likeButton.classList.remove('active');
        } else {
            dislikeButton.classList.remove('active');
        }
        
        // Check if video is saved
        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '{}');
        if (savedVideos[videoId]) {
            saveButton.classList.add('active');
            saveButton.querySelector('span').textContent = 'Saved';
        } else {
            saveButton.classList.remove('active');
            saveButton.querySelector('span').textContent = 'Save';
        }
    }
    
    // Toggle like button
    function toggleLike() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        const likeCount = document.getElementById('like-count');
        const dislikeCount = document.getElementById('dislike-count');
        
        // Get current counts
        let likes = parseInt(likeCount.textContent.replace(/[KM]/g, '')) || 0;
        let dislikes = parseInt(dislikeCount.textContent.replace(/[KM]/g, '')) || 0;
        
        // Get saved state from localStorage
        const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '{}');
        const dislikedVideos = JSON.parse(localStorage.getItem('dislikedVideos') || '{}');
        
        if (likeButton.classList.contains('active')) {
            // Unlike the video
            likeButton.classList.remove('active');
            likes -= 1;
            delete likedVideos[videoId];
        } else {
            // Like the video
            likeButton.classList.add('active');
            likes += 1;
            likedVideos[videoId] = true;
            
            // If disliked, remove dislike
            if (dislikeButton.classList.contains('active')) {
                dislikeButton.classList.remove('active');
                dislikes -= 1;
                delete dislikedVideos[videoId];
            }
        }
        
        // Update counts
        likeCount.textContent = formatNumber(likes);
        dislikeCount.textContent = formatNumber(dislikes);
        
        // Update localStorage
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
        localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos));
    }
    
    // Toggle dislike button
    function toggleDislike() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        const likeButton = document.getElementById('like-button');
        const dislikeButton = document.getElementById('dislike-button');
        const likeCount = document.getElementById('like-count');
        const dislikeCount = document.getElementById('dislike-count');
        
        // Get current counts
        let likes = parseInt(likeCount.textContent.replace(/[KM]/g, '')) || 0;
        let dislikes = parseInt(dislikeCount.textContent.replace(/[KM]/g, '')) || 0;
        
        // Get saved state from localStorage
        const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '{}');
        const dislikedVideos = JSON.parse(localStorage.getItem('dislikedVideos') || '{}');
        
        if (dislikeButton.classList.contains('active')) {
            // Remove dislike
            dislikeButton.classList.remove('active');
            dislikes -= 1;
            delete dislikedVideos[videoId];
        } else {
            // Dislike the video
            dislikeButton.classList.add('active');
            dislikes += 1;
            dislikedVideos[videoId] = true;
            
            // If liked, remove like
            if (likeButton.classList.contains('active')) {
                likeButton.classList.remove('active');
                likes -= 1;
                delete likedVideos[videoId];
            }
        }
        
        // Update counts
        likeCount.textContent = formatNumber(likes);
        dislikeCount.textContent = formatNumber(dislikes);
        
        // Update localStorage
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
        localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos));
    }
    
    // Share video
    function shareVideo() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        const videoUrl = `${window.location.origin}/?v=${videoId}`;
        
        // Check if Navigator Share API is available
        if (navigator.share) {
            navigator.share({
                title: document.getElementById('video-title').textContent,
                text: 'Check out this video!',
                url: videoUrl
            }).catch(error => {
                console.error('Error sharing:', error);
                // Fallback to clipboard copy
                copyToClipboard(videoUrl);
            });
        } else {
            // Fallback to clipboard copy
            copyToClipboard(videoUrl);
        }
    }
    
    // Copy URL to clipboard
    function copyToClipboard(text) {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            // Copy text to clipboard
            document.execCommand('copy');
            alert('Video link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        
        // Clean up
        document.body.removeChild(textArea);
    }
    
    // Toggle save button
    function toggleSave() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        const saveButton = document.getElementById('save-button');
        
        // Get saved state from localStorage
        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '{}');
        
        if (saveButton.classList.contains('active')) {
            // Unsave the video
            saveButton.classList.remove('active');
            saveButton.querySelector('span').textContent = 'Save';
            delete savedVideos[videoId];
        } else {
            // Save the video
            saveButton.classList.add('active');
            saveButton.querySelector('span').textContent = 'Saved';
            savedVideos[videoId] = true;
        }
        
        // Update localStorage
        localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
    }
    
    // Format numbers (e.g., 1,000,000 -> 1M)
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }
}