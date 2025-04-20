// bloxdhop_game_hub/frontend/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Game Category Filter
    const categoryButtons = document.querySelectorAll('.category-btn');
    const gameCards = document.querySelectorAll('.game-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter games
            gameCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Game Play Functionality
    const playButtons = document.querySelectorAll('.play-btn');
    const gameViewer = document.getElementById('game-viewer');
    const gameFrame = document.getElementById('game-frame');
    const gameTitle = document.getElementById('game-title');
    const closeGameBtn = document.getElementById('close-game');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameName = this.dataset.game;
            const gameUrl = this.dataset.url;
            
            // Update game viewer
            gameTitle.textContent = gameName;
            gameFrame.src = gameUrl;
            gameViewer.classList.remove('hidden');
            
            // Add to recently played
            addToRecentlyPlayed(gameName, gameUrl);
        });
    });
    
    closeGameBtn.addEventListener('click', function() {
        gameViewer.classList.add('hidden');
        gameFrame.src = '';
    });
    
    fullscreenBtn.addEventListener('click', function() {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) {
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) {
            gameFrame.msRequestFullscreen();
        }
    });

    // Recently Played Games
    function addToRecentlyPlayed(name, url) {
        let recentGames = JSON.parse(localStorage.getItem('recentGames')) || [];
        
        // Remove if already exists
        recentGames = recentGames.filter(game => game.url !== url);
        
        // Add to beginning
        recentGames.unshift({ name, url });
        
        // Keep only last 5
        if (recentGames.length > 5) {
            recentGames = recentGames.slice(0, 5);
        }
        
        localStorage.setItem('recentGames', JSON.stringify(recentGames));
        updateRecentlyPlayed();
    }
    
    function updateRecentlyPlayed() {
        const recentGamesContainer = document.getElementById('recent-games');
        const recentGames = JSON.parse(localStorage.getItem('recentGames')) || [];
        
        recentGamesContainer.innerHTML = '';
        
        recentGames.forEach(game => {
            const gameElement = document.createElement('a');
            gameElement.href = '#';
            gameElement.className = 'block px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700';
            gameElement.innerHTML = `<i class="fas fa-gamepad mr-2"></i>${game.name}`;
            gameElement.addEventListener('click', (e) => {
                e.preventDefault();
                gameTitle.textContent = game.name;
                gameFrame.src = game.url;
                gameViewer.classList.remove('hidden');
            });
            recentGamesContainer.appendChild(gameElement);
        });
    }
    
    // Initialize
    updateRecentlyPlayed();
    
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        gameCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // 移除移动端300ms点击延迟
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }
    
    // 移动端手势支持
    gameCards.forEach(card => {
        let touchStartY = 0;
        let touchEndY = 0;
        
        card.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
            this.style.transition = 'none';
        }, { passive: true });
        
        card.addEventListener('touchmove', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchEndY - touchStartY;
            if (deltaY < 0 && Math.abs(deltaY) < 20) {
                this.style.transform = `translateY(${deltaY}px)`;
            }
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = '';
        }, { passive: true });
    });
    
    // 移动端模态框优化
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        let touchStartY = 0;
        let touchEndY = 0;
        
        modal.addEventListener('touchstart', function(e) {
            if (e.target === this) {
                touchStartY = e.changedTouches[0].screenY;
            }
        }, { passive: true });
        
        modal.addEventListener('touchend', function(e) {
            if (e.target === this) {
                touchEndY = e.changedTouches[0].screenY;
                if (touchEndY - touchStartY > 100) {
                    // 向下滑动关闭模态框
                    closeCurrentModal();
                }
            }
        }, { passive: true });
    });
});

// 移动端屏幕方向变化处理
window.addEventListener('orientationchange', function() {
    // 重新调整游戏容器大小
    const gameContainer = document.querySelector('#gameModal .flex-1');
    if (gameContainer) {
        setTimeout(() => {
            const windowHeight = window.innerHeight;
            const headerHeight = document.querySelector('#gameModal .flex-col').offsetTop;
            gameContainer.style.height = `${windowHeight - headerHeight}px`;
        }, 100);
    }
});

// 移动端全屏API支持
function toggleFullscreen(element) {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// 优化移动端图片加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 移动端性能优化
function optimizeForMobile() {
    // 减少粒子效果数量
    if (window.innerWidth < 768) {
        if (window.pJSDom && window.pJSDom[0]) {
            const particlesJS = window.pJSDom[0].pJS;
            particlesJS.particles.number.value = 30;
            particlesJS.fn.particlesRefresh();
        }
    }
    
    // 优化滚动性能
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // 执行滚动相关的操作
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// 初始化移动端优化
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    optimizeForMobile();
});
