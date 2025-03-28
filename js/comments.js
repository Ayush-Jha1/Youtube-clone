// Comments functionality
export function initComments() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initVideoComments();
    });
    
    // Initialize comments functionality
    function initVideoComments() {
        const commentInput = document.getElementById('comment-input');
        const postButton = document.getElementById('post-comment');
        const cancelButton = document.querySelector('.cancel-btn');
        
        if (commentInput && postButton) {
            // Show/hide comment buttons based on input focus
            commentInput.addEventListener('focus', () => {
                document.querySelector('.comment-buttons').style.display = 'flex';
            });
            
            // Post comment button
            postButton.addEventListener('click', () => {
                addComment();
            });
            
            // Cancel button
            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    commentInput.value = '';
                    document.querySelector('.comment-buttons').style.display = 'none';
                });
            }
            
            // Handle comment actions (like, dislike)
            document.addEventListener('click', (event) => {
                const commentAction = event.target.closest('.comment-action');
                if (commentAction) {
                    const action = commentAction.dataset.action;
                    const commentId = commentAction.dataset.id;
                    
                    if (action && commentId) {
                        const videoId = getCurrentVideoId();
                        
                        if (action === 'like') {
                            likeComment(videoId, commentId);
                        } else if (action === 'dislike') {
                            dislikeComment(videoId, commentId);
                        }
                    }
                }
            });
            
            // Initialize comment counts
            updateCommentCount(getCurrentVideoId());
        }
    }
    
    // Get current video ID from URL
    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }
    
    // Add a new comment
    function addComment() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value.trim();
        
        if (commentText) {
            // Create comment data
            const newComment = {
                id: Date.now(), // Use timestamp as unique ID
                videoId: parseInt(videoId),
                username: 'Current User',
                avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
                comment: commentText,
                likes: 0,
                dislikes: 0,
                postedDate: new Date().toISOString()
            };
            
            // Save to localStorage
            saveComment(videoId, newComment);
            
            // Display the new comment
            displayComment(newComment);
            
            // Clear input and hide buttons
            commentInput.value = '';
            document.querySelector('.comment-buttons').style.display = 'none';
            
            // Update comment count
            updateCommentCount(videoId);
        }
    }
    
    // Save comment to localStorage
    function saveComment(videoId, comment) {
        // Get existing comments
        const allComments = JSON.parse(localStorage.getItem('videoComments') || '{}');
        
        // Initialize array for this video if it doesn't exist
        if (!allComments[videoId]) {
            allComments[videoId] = [];
        }
        
        // Add new comment
        allComments[videoId].push(comment);
        
        // Save back to localStorage
        localStorage.setItem('videoComments', JSON.stringify(allComments));
    }
    
    // Display a comment in the UI
    function displayComment(comment) {
        const commentsContainer = document.getElementById('comments-container');
        
        // Create comment element
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.id = comment.id;
        
        commentElement.innerHTML = `
            <div class="user-avatar">
                <img src="${comment.avatarUrl}" alt="${comment.username}">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-username">${comment.username}</span>
                    <span class="comment-date">${formatCommentDate(comment.postedDate)}</span>
                </div>
                <div class="comment-text">${comment.comment}</div>
                <div class="comment-actions">
                    <div class="comment-action" data-action="like" data-id="${comment.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${formatNumber(comment.likes)}</span>
                    </div>
                    <div class="comment-action" data-action="dislike" data-id="${comment.id}">
                        <i class="fas fa-thumbs-down"></i>
                        <span>${formatNumber(comment.dislikes)}</span>
                    </div>
                    <div class="comment-action">
                        <span>Reply</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add to beginning of comments list
        commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
    }
    
    // Display all comments for a video
    function displayComments(videoId) {
        // Get comments from localStorage
        const allComments = JSON.parse(localStorage.getItem('videoComments') || '{}');
        const videoComments = allComments[videoId] || [];
        
        // Get API comments
        fetch(`/api/videos/${videoId}/comments`)
            .then(response => response.json())
            .then(apiComments => {
                // Combine both comment sources
                const combinedComments = [...apiComments, ...videoComments];
                
                // Sort by date (newest first)
                combinedComments.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                
                // Update comments container
                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.innerHTML = '';
                
                combinedComments.forEach(comment => {
                    displayComment(comment);
                });
                
                // Update comment count
                document.getElementById('comments-count').textContent = combinedComments.length;
            })
            .catch(error => {
                console.error('Error loading comments:', error);
                
                // Fallback to just local comments
                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.innerHTML = '';
                
                videoComments.forEach(comment => {
                    displayComment(comment);
                });
                
                document.getElementById('comments-count').textContent = videoComments.length;
            });
    }
    
    // Update comment count
    function updateCommentCount(videoId) {
        if (!videoId) return;
        
        // Get comments from localStorage
        const allComments = JSON.parse(localStorage.getItem('videoComments') || '{}');
        const videoComments = allComments[videoId] || [];
        
        // Get API comment count
        fetch(`/api/videos/${videoId}/comments`)
            .then(response => response.json())
            .then(apiComments => {
                const totalCount = apiComments.length + videoComments.length;
                document.getElementById('comments-count').textContent = totalCount;
            })
            .catch(error => {
                console.error('Error getting comment count:', error);
                document.getElementById('comments-count').textContent = videoComments.length;
            });
    }
    
    // Like a comment
    function likeComment(videoId, commentId) {
        const commentEl = document.querySelector(`.comment-action[data-action="like"][data-id="${commentId}"]`);
        const dislikeEl = document.querySelector(`.comment-action[data-action="dislike"][data-id="${commentId}"]`);
        
        if (!commentEl) return;
        
        // Store user interactions with comments
        const commentInteractions = JSON.parse(localStorage.getItem('commentInteractions') || '{}');
        if (!commentInteractions[commentId]) {
            commentInteractions[commentId] = { liked: false, disliked: false };
        }
        
        const likeCountEl = commentEl.querySelector('span');
        const dislikeCountEl = dislikeEl.querySelector('span');
        
        let likeCount = parseInt(likeCountEl.textContent) || 0;
        let dislikeCount = parseInt(dislikeCountEl.textContent) || 0;
        
        if (commentEl.classList.contains('active')) {
            // Unlike the comment
            commentEl.classList.remove('active');
            likeCount -= 1;
            commentInteractions[commentId].liked = false;
        } else {
            // Like the comment
            commentEl.classList.add('active');
            likeCount += 1;
            commentInteractions[commentId].liked = true;
            
            // If disliked, remove dislike
            if (dislikeEl.classList.contains('active')) {
                dislikeEl.classList.remove('active');
                dislikeCount -= 1;
                commentInteractions[commentId].disliked = false;
            }
        }
        
        // Update count display
        likeCountEl.textContent = formatNumber(likeCount);
        dislikeCountEl.textContent = formatNumber(dislikeCount);
        
        // Save to localStorage
        localStorage.setItem('commentInteractions', JSON.stringify(commentInteractions));
    }
    
    // Dislike a comment
    function dislikeComment(videoId, commentId) {
        const likeEl = document.querySelector(`.comment-action[data-action="like"][data-id="${commentId}"]`);
        const dislikeEl = document.querySelector(`.comment-action[data-action="dislike"][data-id="${commentId}"]`);
        
        if (!dislikeEl) return;
        
        // Store user interactions with comments
        const commentInteractions = JSON.parse(localStorage.getItem('commentInteractions') || '{}');
        if (!commentInteractions[commentId]) {
            commentInteractions[commentId] = { liked: false, disliked: false };
        }
        
        const likeCountEl = likeEl.querySelector('span');
        const dislikeCountEl = dislikeEl.querySelector('span');
        
        let likeCount = parseInt(likeCountEl.textContent) || 0;
        let dislikeCount = parseInt(dislikeCountEl.textContent) || 0;
        
        if (dislikeEl.classList.contains('active')) {
            // Remove dislike
            dislikeEl.classList.remove('active');
            dislikeCount -= 1;
            commentInteractions[commentId].disliked = false;
        } else {
            // Dislike the comment
            dislikeEl.classList.add('active');
            dislikeCount += 1;
            commentInteractions[commentId].disliked = true;
            
            // If liked, remove like
            if (likeEl.classList.contains('active')) {
                likeEl.classList.remove('active');
                likeCount -= 1;
                commentInteractions[commentId].liked = false;
            }
        }
        
        // Update count display
        likeCountEl.textContent = formatNumber(likeCount);
        dislikeCountEl.textContent = formatNumber(dislikeCount);
        
        // Save to localStorage
        localStorage.setItem('commentInteractions', JSON.stringify(commentInteractions));
    }
    
    // Format comment date
    function formatCommentDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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