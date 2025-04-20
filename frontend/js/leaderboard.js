
// bloxdhop_game_hub/frontend/js/leaderboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Leaderboard data for each category
    const leaderboardData = {
        'all': [
            { name: 'ProGamer123', score: 9850, avatar: 'https://picsum.photos/50/50?random=101' },
            { name: 'NinjaPlayer', score: 8720, avatar: 'https://picsum.photos/50/50?random=102' },
            { name: 'BloxdMaster', score: 7650, avatar: 'https://picsum.photos/50/50?random=103' },
            { name: 'SpeedRunner', score: 6540, avatar: 'https://picsum.photos/50/50?random=104' },
            { name: 'GameChamp', score: 5430, avatar: 'https://picsum.photos/50/50?random=105' }
        ],
        'car': [
            { name: 'TurboDriver', score: 12500, avatar: 'https://picsum.photos/50/50?random=201' },
            { name: 'DriftKing', score: 11200, avatar: 'https://picsum.photos/50/50?random=202' },
            { name: 'SpeedDemon', score: 9800, avatar: 'https://picsum.photos/50/50?random=203' },
            { name: 'RoadRacer', score: 8700, avatar: 'https://picsum.photos/50/50?random=204' },
            { name: 'NitroBoost', score: 7600, avatar: 'https://picsum.photos/50/50?random=205' }
        ],
        'soccer': [
            { name: 'GoalMachine', score: 9800, avatar: 'https://picsum.photos/50/50?random=301' },
            { name: 'StrikerPro', score: 8900, avatar: 'https://picsum.photos/50/50?random=302' },
            { name: 'BallWizard', score: 7800, avatar: 'https://picsum.photos/50/50?random=303' },
            { name: 'SoccerStar', score: 6700, avatar: 'https://picsum.photos/50/50?random=304' },
            { name: 'FootyKing', score: 5600, avatar: 'https://picsum.photos/50/50?random=305' }
        ],
        'io': [
            { name: 'BloxdHopPro', score: 15600, avatar: 'https://picsum.photos/50/50?random=401' },
            { name: 'IOChampion', score: 14300, avatar: 'https://picsum.photos/50/50?random=402' },
            { name: 'MultiplayerX', score: 13200, avatar: 'https://picsum.photos/50/50?random=403' },
            { name: 'LastSurvivor', score: 12100, avatar: 'https://picsum.photos/50/50?random=404' },
            { name: 'AgarMaster', score: 11000, avatar: 'https://picsum.photos/50/50?random=405' }
        ],
        '2-player': [
            { name: 'DuelMaster', score: 8700, avatar: 'https://picsum.photos/50/50?random=501' },
            { name: 'VersusKing', score: 7600, avatar: 'https://picsum.photos/50/50?random=502' },
            { name: 'BattlePro', score: 6500, avatar: 'https://picsum.photos/50/50?random=503' },
            { name: 'PvPExpert', score: 5400, avatar: 'https://picsum.photos/50/50?random=504' },
            { name: 'FightClub', score: 4300, avatar: 'https://picsum.photos/50/50?random=505' }
        ],
        'action': [
            { name: 'ActionHero', score: 11200, avatar: 'https://picsum.photos/50/50?random=601' },
            { name: 'CombatElite', score: 10100, avatar: 'https://picsum.photos/50/50?random=602' },
            { name: 'AdventureX', score: 9000, avatar: 'https://picsum.photos/50/50?random=603' },
            { name: 'PlatformKing', score: 7900, avatar: 'https://picsum.photos/50/50?random=604' },
            { name: 'JumpMaster', score: 6800, avatar: 'https://picsum.photos/50/50?random=605' }
        ],
        'fps': [
            { name: 'SniperPro', score: 13400, avatar: 'https://picsum.photos/50/50?random=701' },
            { name: 'HeadshotX', score: 12300, avatar: 'https://picsum.photos/50/50?random=702' },
            { name: 'FragMaster', score: 11200, avatar: 'https://picsum.photos/50/50?random=703' },
            { name: 'TriggerHappy', score: 10100, avatar: 'https://picsum.photos/50/50?random=704' },
            { name: 'ScopeKing', score: 9000, avatar: 'https://picsum.photos/50/50?random=705' }
        ]
    };

    // Update leaderboard based on category
    function updateLeaderboard(category = 'all') {
        const leaderboardContainer = document.getElementById('leaderboard');
        const players = leaderboardData[category] || leaderboardData['all'];
        
        leaderboardContainer.innerHTML = '';
        
        players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'flex items-center p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700';
            
            playerElement.innerHTML = `
                <div class="flex-shrink-0 mr-3">
                    <img src="${player.avatar}" alt="${player.name}" class="w-8 h-8 rounded-full">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate ${index === 0 ? 'text-yellow-500' : ''}">
                        ${index + 1}. ${player.name}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        ${player.score.toLocaleString()} pts
                    </p>
                </div>
                ${index === 0 ? '<span class="ml-2 text-yellow-500"><i class="fas fa-crown"></i></span>' : ''}
            `;
            
            leaderboardContainer.appendChild(playerElement);
        });
    }

    // Initialize with default category
    updateLeaderboard();

    // Listen for category changes
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            updateLeaderboard(category);
        });
    });

    // Simulate live updates every 30 seconds
    setInterval(() => {
        // Randomly update scores to simulate live gameplay
        Object.keys(leaderboardData).forEach(category => {
            leaderboardData[category].forEach(player => {
                player.score += Math.floor(Math.random() * 100);
            });
            // Re-sort after updating scores
            leaderboardData[category].sort((a, b) => b.score - a.score);
        });
        
        // Get current active category
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
        updateLeaderboard(activeCategory);
    }, 30000);
});
