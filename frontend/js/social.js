
// bloxdhop_game_hub/frontend/js/social.js
document.addEventListener('DOMContentLoaded', function() {
    const socialShareButtons = document.querySelectorAll('.social-share');
    const gameViewer = document.getElementById('game-viewer');
    const gameTitle = document.getElementById('game-title');
    const gameFrame = document.getElementById('game-frame');
    
    // Current page URL and title for sharing
    const pageUrl = window.location.href;
    const defaultTitle = 'BloxdHop Game Hub - Play Free Online Games';
    
    socialShareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const network = this.dataset.network;
            let shareUrl = '';
            let shareText = '';
            
            // Check if a game is currently being played
            const isGameOpen = !gameViewer.classList.contains('hidden');
            const currentGameTitle = isGameOpen ? gameTitle.textContent : defaultTitle;
            const currentGameUrl = isGameOpen ? gameFrame.src : pageUrl;
            
            switch(network) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentGameUrl)}`;
                    window.open(shareUrl, 'facebook-share-dialog', 'width=800,height=600');
                    break;
                case 'twitter':
                    shareText = isGameOpen 
                        ? `Check out ${currentGameTitle} on BloxdHop Game Hub!` 
                        : 'Play awesome free online games at BloxdHop Game Hub!';
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentGameUrl)}`;
                    window.open(shareUrl, 'twitter-share-dialog', 'width=800,height=600');
                    break;
                case 'reddit':
                    shareText = isGameOpen 
                        ? `${currentGameTitle} - Awesome game on BloxdHop` 
                        : 'BloxdHop Game Hub - Play Free Online Games';
                    shareUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentGameUrl)}`;
                    window.open(shareUrl, 'reddit-share-dialog', 'width=800,height=600');
                    break;
                default:
                    console.log('Unknown social network');
            }
            
            // Track social shares
            trackSocialShare(network, isGameOpen ? currentGameTitle : 'homepage');
        });
    });
    
    // Function to track social shares (could be integrated with analytics)
    function trackSocialShare(network, content) {
        console.log(`Shared ${content} on ${network}`);
        // Here you would typically send this data to your analytics platform
    }
    
    // Add click animation to social buttons
    socialShareButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add to favorites functionality
    const addFavoriteBtn = document.getElementById('add-favorite');
    if (addFavoriteBtn) {
        addFavoriteBtn.addEventListener('click', function() {
            if (gameViewer.classList.contains('hidden')) return;
            
            const gameName = gameTitle.textContent;
            const gameUrl = gameFrame.src;
            
            let favorites = JSON.parse(localStorage.getItem('gameFavorites')) || [];
            
            // Check if already favorited
            const isFavorited = favorites.some(fav => fav.url === gameUrl);
            
            if (isFavorited) {
                // Remove from favorites
                favorites = favorites.filter(fav => fav.url !== gameUrl);
                this.innerHTML = '<i class="fas fa-star mr-2"></i>Add to Favorites';
                this.classList.remove('bg-yellow-600');
                this.classList.add('bg-yellow-500');
            } else {
                // Add to favorites
                favorites.push({ name: gameName, url: gameUrl });
                this.innerHTML = '<i class="fas fa-star mr-2"></i>Added to Favorites';
                this.classList.remove('bg-yellow-500');
                this.classList.add('bg-yellow-600');
            }
            
            localStorage.setItem('gameFavorites', JSON.stringify(favorites));
            
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg';
            feedback.textContent = isFavorited ? 'Removed from favorites!' : 'Added to favorites!';
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        });
    }
});
