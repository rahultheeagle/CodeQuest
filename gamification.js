class GamificationSystem {
    constructor() {
        this.achievements = [
            { id: 'first_challenge', name: 'First Steps', description: 'Complete your first challenge', icon: '🎯', reward: 25, condition: (stats) => stats.challengesCompleted >= 1 },
            { id: 'streak_10', name: '10-Day Streak Master', description: 'Maintain a 10-day learning streak', icon: '🔥', reward: 100, condition: (stats) => stats.maxStreak >= 10 },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a challenge in under 5 minutes', icon: '⚡', reward: 50, condition: (stats) => stats.fastestTime <= 300 },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 5 challenges without using hints', icon: '💎', reward: 75, condition: (stats) => stats.noHintChallenges >= 5 },
            { id: 'night_owl', name: 'Night Owl', description: 'Complete challenges after 10 PM', icon: '🦉', reward: 40, condition: (stats) => stats.nightChallenges >= 3 },
            { id: 'html_master', name: 'HTML Master', description: 'Complete all HTML challenges', icon: '🏗️', reward: 150, condition: (stats) => stats.htmlCompleted >= 10 },
            { id: 'css_wizard', name: 'CSS Wizard', description: 'Complete all CSS challenges', icon: '🎨', reward: 150, condition: (stats) => stats.cssCompleted >= 10 },
            { id: 'js_ninja', name: 'JavaScript Ninja', description: 'Complete all JS challenges', icon: '⚡', reward: 150, condition: (stats) => stats.jsCompleted >= 10 },
            { id: 'project_builder', name: 'Project Builder', description: 'Complete all mini-projects', icon: '🚀', reward: 200, condition: (stats) => stats.projectsCompleted >= 5 },
            { id: 'xp_collector', name: 'XP Collector', description: 'Earn 1000 total XP', icon: '💰', reward: 100, condition: (stats) => stats.totalXP >= 1000 },
            { id: 'daily_warrior', name: 'Daily Warrior', description: 'Complete 7 daily challenges', icon: '📅', reward: 125, condition: (stats) => stats.dailyChallenges >= 7 },
            { id: 'hint_saver', name: 'Hint Saver', description: 'Complete 10 challenges without hints', icon: '🧠', reward: 100, condition: (stats) => stats.noHintChallenges >= 10 },
            { id: 'level_up', name: 'Level Up', description: 'Reach Level 5', icon: '📈', reward: 75, condition: (stats) => stats.level >= 5 },
            { id: 'consistent', name: 'Consistent Learner', description: 'Complete challenges 5 days in a row', icon: '📚', reward: 60, condition: (stats) => stats.maxStreak >= 5 },
            { id: 'challenger', name: 'Challenge Accepted', description: 'Complete 25 total challenges', icon: '🏆', reward: 150, condition: (stats) => stats.challengesCompleted >= 25 },
            { id: 'early_bird', name: 'Early Bird', description: 'Complete challenges before 8 AM', icon: '🌅', reward: 40, condition: (stats) => stats.earlyChallenges >= 3 }
        ];
        
        this.mockLeaderboard = [
            { name: 'CodeMaster', xp: 2500, level: 25 },
            { name: 'WebWizard', xp: 2200, level: 22 },
            { name: 'JSNinja', xp: 1950, level: 19 },
            { name: 'CSSGuru', xp: 1800, level: 18 },
            { name: 'HTMLHero', xp: 1650, level: 16 },
            { name: 'DevPro', xp: 1400, level: 14 },
            { name: 'Coder123', xp: 1200, level: 12 },
            { name: 'WebDev', xp: 1000, level: 10 }
        ];
        
        this.userStats = this.loadUserStats();
        this.powerups = this.loadPowerups();
        this.dailyChallenge = this.generateDailyChallenge();
        this.init();
    }

    loadUserStats() {
        const defaultStats = {
            challengesCompleted: 0,
            maxStreak: 0,
            fastestTime: Infinity,
            noHintChallenges: 0,
            nightChallenges: 0,
            earlyChallenges: 0,
            htmlCompleted: 0,
            cssCompleted: 0,
            jsCompleted: 0,
            projectsCompleted: 0,
            totalXP: 0,
            level: 1,
            dailyChallenges: 0,
            earnedAchievements: []
        };
        return JSON.parse(localStorage.getItem('codequest_stats') || JSON.stringify(defaultStats));
    }

    loadPowerups() {
        const defaultPowerups = {
            themes: false,
            freeHints: 0,
            skipTokens: 0
        };
        return JSON.parse(localStorage.getItem('codequest_powerups') || JSON.stringify(defaultPowerups));
    }

    generateDailyChallenge() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('daily_challenge_date');
        
        if (saved === today) {
            return JSON.parse(localStorage.getItem('daily_challenge'));
        }
        
        const challenges = [
            { title: 'Speed Builder', description: 'Create a responsive card layout in under 10 minutes', bonus: 50, category: 'css' },
            { title: 'DOM Master', description: 'Build an interactive todo list with local storage', bonus: 75, category: 'js' },
            { title: 'Form Validator', description: 'Create a contact form with validation', bonus: 60, category: 'html' },
            { title: 'Animation Expert', description: 'Create smooth CSS animations', bonus: 65, category: 'css' },
            { title: 'API Explorer', description: 'Fetch and display data from a mock API', bonus: 80, category: 'js' }
        ];
        
        const dailyChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        localStorage.setItem('daily_challenge', JSON.stringify(dailyChallenge));
        localStorage.setItem('daily_challenge_date', today);
        
        return dailyChallenge;
    }

    init() {
        this.setupNavigation();
        this.renderAchievements();
        this.renderLeaderboard();
        this.renderDailyChallenge();
        this.renderPowerups();
        this.updateUserStats();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.dataset.section).classList.add('active');
            });
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievementsGrid');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const isEarned = this.userStats.earnedAchievements.includes(achievement.id);
            const progress = this.calculateAchievementProgress(achievement);
            
            const card = document.createElement('div');
            card.className = `achievement-card ${isEarned ? 'earned' : 'locked'}`;
            
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <div class="achievement-progress">
                    <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="achievement-reward">+${achievement.reward} XP</div>
                ${isEarned ? '<div style="color: #28a745; font-weight: bold; margin-top: 10px;">✓ EARNED</div>' : ''}
            `;
            
            container.appendChild(card);
        });
    }

    calculateAchievementProgress(achievement) {
        const stats = this.userStats;
        
        switch(achievement.id) {
            case 'first_challenge': return Math.min(100, (stats.challengesCompleted / 1) * 100);
            case 'streak_10': return Math.min(100, (stats.maxStreak / 10) * 100);
            case 'perfectionist': return Math.min(100, (stats.noHintChallenges / 5) * 100);
            case 'night_owl': return Math.min(100, (stats.nightChallenges / 3) * 100);
            case 'html_master': return Math.min(100, (stats.htmlCompleted / 10) * 100);
            case 'css_wizard': return Math.min(100, (stats.cssCompleted / 10) * 100);
            case 'js_ninja': return Math.min(100, (stats.jsCompleted / 10) * 100);
            case 'project_builder': return Math.min(100, (stats.projectsCompleted / 5) * 100);
            case 'xp_collector': return Math.min(100, (stats.totalXP / 1000) * 100);
            case 'daily_warrior': return Math.min(100, (stats.dailyChallenges / 7) * 100);
            case 'hint_saver': return Math.min(100, (stats.noHintChallenges / 10) * 100);
            case 'level_up': return Math.min(100, (stats.level / 5) * 100);
            case 'consistent': return Math.min(100, (stats.maxStreak / 5) * 100);
            case 'challenger': return Math.min(100, (stats.challengesCompleted / 25) * 100);
            case 'early_bird': return Math.min(100, (stats.earlyChallenges / 3) * 100);
            default: return 0;
        }
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboardList');
        const userData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
        
        // Add current user to leaderboard
        const currentUser = {
            name: userData.username || 'You',
            xp: userData.xp || 0,
            level: userData.level || 1,
            isCurrentUser: true
        };
        
        const allUsers = [...this.mockLeaderboard, currentUser].sort((a, b) => b.xp - a.xp);
        
        container.innerHTML = '';
        
        allUsers.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = `leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`;
            
            const rank = index + 1;
            const rankClass = rank <= 3 ? 'top3' : '';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            
            item.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${rankIcon}${rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-level">Level ${user.level}</div>
                </div>
                <div class="leaderboard-xp">${user.xp} XP</div>
            `;
            
            container.appendChild(item);
        });
        
        document.getElementById('refreshLeaderboard').addEventListener('click', () => {
            this.renderLeaderboard();
        });
    }

    renderDailyChallenge() {
        document.getElementById('dailyTitle').textContent = this.dailyChallenge.title;
        document.getElementById('dailyDescription').textContent = this.dailyChallenge.description;
        document.getElementById('dailyBonus').textContent = this.dailyChallenge.bonus;
        
        this.updateDailyTimer();
        setInterval(() => this.updateDailyTimer(), 1000);
        
        document.getElementById('startDaily').addEventListener('click', () => {
            localStorage.setItem('daily_challenge_active', JSON.stringify(this.dailyChallenge));
            window.location.href = 'editor.html?daily=true';
        });
    }

    updateDailyTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('dailyTimer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    renderPowerups() {
        document.querySelectorAll('.powerup-btn').forEach(btn => {
            const card = btn.closest('.powerup-card');
            const powerupType = card.dataset.powerup;
            const cost = parseInt(btn.dataset.cost);
            
            const userData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
            const userXP = userData.xp || 0;
            
            if (this.powerups[powerupType] === true || this.powerups[powerupType] > 0) {
                card.classList.add('owned');
                btn.textContent = 'Owned';
                btn.disabled = true;
            } else if (userXP < cost) {
                btn.disabled = true;
                btn.textContent = 'Not enough XP';
            }
            
            btn.addEventListener('click', () => {
                this.buyPowerup(powerupType, cost, btn, card);
            });
        });
    }

    buyPowerup(type, cost, btn, card) {
        const userData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
        
        if (userData.xp >= cost) {
            userData.xp -= cost;
            localStorage.setItem('codequest_user', JSON.stringify(userData));
            
            switch(type) {
                case 'themes':
                    this.powerups.themes = true;
                    break;
                case 'hints':
                    this.powerups.freeHints += 5;
                    break;
                case 'skip':
                    this.powerups.skipTokens += 1;
                    break;
            }
            
            localStorage.setItem('codequest_powerups', JSON.stringify(this.powerups));
            
            card.classList.add('owned');
            btn.textContent = 'Owned';
            btn.disabled = true;
            
            alert(`Power-up purchased! ${cost} XP deducted.`);
        }
    }

    updateUserStats() {
        const userData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
        this.userStats.totalXP = userData.xp || 0;
        this.userStats.level = userData.level || 1;
        
        // Check for new achievements
        this.achievements.forEach(achievement => {
            if (!this.userStats.earnedAchievements.includes(achievement.id)) {
                if (achievement.condition(this.userStats)) {
                    this.userStats.earnedAchievements.push(achievement.id);
                    userData.xp += achievement.reward;
                    localStorage.setItem('codequest_user', JSON.stringify(userData));
                    this.showAchievementNotification(achievement);
                }
            }
        });
        
        localStorage.setItem('codequest_stats', JSON.stringify(this.userStats));
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ffd700, #ffed4e);
            padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000; animation: slideIn 0.5s ease;
        `;
        notification.innerHTML = `
            <div style="font-size: 2rem; text-align: center;">${achievement.icon}</div>
            <div style="font-weight: bold; margin: 10px 0;">Achievement Unlocked!</div>
            <div>${achievement.name}</div>
            <div style="color: #666; font-size: 0.9rem;">+${achievement.reward} XP</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Method to be called when challenge is completed
    recordChallengeCompletion(category, challengeId, timeSpent, usedHint) {
        this.userStats.challengesCompleted++;
        
        if (timeSpent < this.userStats.fastestTime) {
            this.userStats.fastestTime = timeSpent;
        }
        
        if (!usedHint) {
            this.userStats.noHintChallenges++;
        }
        
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
            this.userStats.nightChallenges++;
        }
        if (hour >= 5 && hour <= 8) {
            this.userStats.earlyChallenges++;
        }
        
        switch(category) {
            case 'html': this.userStats.htmlCompleted++; break;
            case 'css': this.userStats.cssCompleted++; break;
            case 'js': this.userStats.jsCompleted++; break;
            case 'projects': this.userStats.projectsCompleted++; break;
        }
        
        this.updateUserStats();
        this.renderAchievements();
    }
}

// Initialize gamification system
const gamificationSystem = new GamificationSystem();

// Expose for external use
window.gamificationSystem = gamificationSystem;