// Achievement System with Event Listening and Animations
class AchievementSystem {
    constructor() {
        this.achievements = [
            { id: 'first_steps', name: 'First Steps', description: 'Complete your first challenge', icon: '🎯', condition: (data) => data.completedChallenges >= 1, points: 10, xp: 50 },
            { id: 'quick_learner', name: 'Quick Learner', description: 'Complete a challenge in under 30 seconds', icon: '⚡', condition: (data) => data.fastestTime > 0 && data.fastestTime < 30000, points: 25, xp: 100 },
            { id: 'persistent', name: 'Persistent', description: 'Make 10 attempts on challenges', icon: '💪', condition: (data) => data.totalAttempts >= 10, points: 15, xp: 75 },
            { id: 'html_novice', name: 'HTML Novice', description: 'Complete 3 HTML challenges', icon: '📄', condition: (data) => data.htmlCompleted >= 3, points: 30, xp: 150 },
            { id: 'css_stylist', name: 'CSS Stylist', description: 'Complete 3 CSS challenges', icon: '🎨', condition: (data) => data.cssCompleted >= 3, points: 30, xp: 150 },
            { id: 'js_coder', name: 'JS Coder', description: 'Complete 3 JavaScript challenges', icon: '⚡', condition: (data) => data.jsCompleted >= 3, points: 30, xp: 150 },
            { id: 'streak_starter', name: 'Streak Starter', description: 'Maintain a 3-day streak', icon: '🔥', condition: (data) => data.streakDays >= 3, points: 20, xp: 100 },
            { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🏆', condition: (data) => data.streakDays >= 7, points: 50, xp: 250 },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 5 challenges on first try', icon: '✨', condition: (data) => data.firstTryCompletions >= 5, points: 40, xp: 200 },
            { id: 'time_saver', name: 'Time Saver', description: 'Spend over 1 hour coding', icon: '⏰', condition: (data) => data.totalTime >= 3600000, points: 35, xp: 175 },
            { id: 'code_master', name: 'Code Master', description: 'Complete 10 challenges', icon: '👑', condition: (data) => data.completedChallenges >= 10, points: 100, xp: 500 },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a challenge in under 10 seconds', icon: '🚀', condition: (data) => data.fastestTime > 0 && data.fastestTime < 10000, points: 50, xp: 250 }
        ];
        
        this.storage = new Storage();
        this.unlockedAchievements = this.storage.get('achievements') || [];
        this.eventListeners = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for challenge completion events
        document.addEventListener('challenge:completed', (e) => {
            this.handleChallengeCompleted(e.detail);
        });

        // Listen for challenge attempt events
        document.addEventListener('challenge:attempted', (e) => {
            this.handleChallengeAttempted(e.detail);
        });

        // Listen for streak events
        document.addEventListener('streak:updated', (e) => {
            this.handleStreakUpdated(e.detail);
        });

        // Listen for time events
        document.addEventListener('time:recorded', (e) => {
            this.handleTimeRecorded(e.detail);
        });

        // Listen for progress events
        document.addEventListener('progress:updated', (e) => {
            this.checkAllAchievements(e.detail);
        });
    }

    handleChallengeCompleted(data) {
        const achievementData = this.gatherAchievementData();
        achievementData.completedChallenges = (achievementData.completedChallenges || 0) + 1;
        
        // Check for category-specific completions
        if (data.category === 'html') achievementData.htmlCompleted = (achievementData.htmlCompleted || 0) + 1;
        if (data.category === 'css') achievementData.cssCompleted = (achievementData.cssCompleted || 0) + 1;
        if (data.category === 'javascript') achievementData.jsCompleted = (achievementData.jsCompleted || 0) + 1;
        
        // Check for first-try completion
        if (data.attempts === 1) {
            achievementData.firstTryCompletions = (achievementData.firstTryCompletions || 0) + 1;
        }
        
        this.checkAllAchievements(achievementData);
    }

    handleChallengeAttempted(data) {
        const achievementData = this.gatherAchievementData();
        achievementData.totalAttempts = (achievementData.totalAttempts || 0) + 1;
        this.checkAllAchievements(achievementData);
    }

    handleStreakUpdated(data) {
        const achievementData = this.gatherAchievementData();
        achievementData.streakDays = data.streakDays;
        this.checkAllAchievements(achievementData);
    }

    handleTimeRecorded(data) {
        const achievementData = this.gatherAchievementData();
        achievementData.totalTime = data.totalTime;
        achievementData.fastestTime = data.fastestTime;
        this.checkAllAchievements(achievementData);
    }

    gatherAchievementData() {
        const progressTracker = window.progressTracker || new ProgressTracker();
        const stats = progressTracker.getOverallStats();
        
        return {
            completedChallenges: stats.completedChallenges || 0,
            totalAttempts: stats.totalAttempts || 0,
            totalTime: this.parseTime(stats.totalTime) || 0,
            fastestTime: this.parseTime(stats.fastestCompletion) || 0,
            streakDays: stats.streakDays || 0,
            htmlCompleted: this.getCategoryCount('html'),
            cssCompleted: this.getCategoryCount('css'),
            jsCompleted: this.getCategoryCount('javascript'),
            firstTryCompletions: this.getFirstTryCompletions()
        };
    }

    parseTime(timeString) {
        if (!timeString || timeString === '0s') return 0;
        
        let milliseconds = 0;
        const hours = timeString.match(/(\d+)h/);
        const minutes = timeString.match(/(\d+)m/);
        const seconds = timeString.match(/(\d+)s/);
        
        if (hours) milliseconds += parseInt(hours[1]) * 3600000;
        if (minutes) milliseconds += parseInt(minutes[1]) * 60000;
        if (seconds) milliseconds += parseInt(seconds[1]) * 1000;
        
        return milliseconds;
    }

    getCategoryCount(category) {
        const progressTracker = window.progressTracker || new ProgressTracker();
        const challenges = Object.entries(progressTracker.progress.challenges);
        
        return challenges.filter(([id, data]) => {
            const challenge = this.getChallengeById(parseInt(id));
            return challenge && challenge.category === category && data.completed;
        }).length;
    }

    getChallengeById(id) {
        const challengeSystem = window.challengeSystem;
        return challengeSystem ? challengeSystem.challenges.find(c => c.id === id) : null;
    }

    getFirstTryCompletions() {
        const progressTracker = window.progressTracker || new ProgressTracker();
        const challenges = Object.values(progressTracker.progress.challenges);
        return challenges.filter(c => c.completed && c.attempts === 1).length;
    }

    checkAllAchievements(userData) {
        const newUnlocks = [];
        
        this.achievements.forEach(achievement => {
            if (!this.isUnlocked(achievement.id) && achievement.condition(userData)) {
                this.unlockAchievement(achievement);
                newUnlocks.push(achievement);
            }
        });

        return newUnlocks;
    }

    unlockAchievement(achievement) {
        const unlockedAchievement = {
            ...achievement,
            unlockedAt: Date.now()
        };
        
        this.unlockedAchievements.push(unlockedAchievement);
        this.storage.set('achievements', this.unlockedAchievements);
        
        // Show unlock animation
        this.showUnlockAnimation(achievement);
        
        // Award XP if progress tracker exists
        if (window.progressTracker) {
            // Emit XP award event
            document.dispatchEvent(new CustomEvent('xp:awarded', {
                detail: { amount: achievement.xp, source: 'achievement', name: achievement.name }
            }));
        }
        
        // Add to activity log
        if (window.app) {
            window.app.addActivity(`🏆 Unlocked achievement: ${achievement.name}`);
        }
        
        // Emit achievement unlocked event
        document.dispatchEvent(new CustomEvent('achievement:unlocked', {
            detail: unlockedAchievement
        }));
    }

    showUnlockAnimation(achievement) {
        // Create achievement popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-content">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-title">Achievement Unlocked!</div>
                <div class="achievement-popup-name">${achievement.name}</div>
                <div class="achievement-popup-description">${achievement.description}</div>
                <div class="achievement-popup-reward">+${achievement.points} points • +${achievement.xp} XP</div>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('achievement-styles')) {
            const styles = document.createElement('style');
            styles.id = 'achievement-styles';
            styles.textContent = `
                .achievement-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    z-index: 10000;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    text-align: center;
                    min-width: 300px;
                    animation: achievementUnlock 3s ease-out forwards;
                }
                
                .achievement-popup-content {
                    position: relative;
                }
                
                .achievement-popup-icon {
                    font-size: 4rem;
                    margin-bottom: 15px;
                    animation: bounce 0.6s ease-out 0.5s both;
                }
                
                .achievement-popup-title {
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease-out 1s both;
                }
                
                .achievement-popup-name {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 8px;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease-out 1.2s both;
                }
                
                .achievement-popup-description {
                    font-size: 1rem;
                    margin-bottom: 15px;
                    opacity: 0.9;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease-out 1.4s both;
                }
                
                .achievement-popup-reward {
                    font-size: 0.9rem;
                    background: rgba(255,255,255,0.2);
                    padding: 8px 15px;
                    border-radius: 20px;
                    display: inline-block;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease-out 1.6s both;
                }
                
                @keyframes achievementUnlock {
                    0% { transform: translate(-50%, -50%) scale(0) rotate(180deg); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1) rotate(0deg); opacity: 1; }
                    70% { transform: translate(-50%, -50%) scale(0.95) rotate(0deg); }
                    85% { transform: translate(-50%, -50%) scale(1.02) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-20px); }
                    60% { transform: translateY(-10px); }
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .achievement-popup.hide {
                    animation: achievementHide 0.5s ease-out forwards;
                }
                
                @keyframes achievementHide {
                    to { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(popup);
        
        // Play sound effect if available
        this.playUnlockSound();
        
        // Remove popup after animation
        setTimeout(() => {
            popup.classList.add('hide');
            setTimeout(() => popup.remove(), 500);
        }, 2500);
    }

    playUnlockSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if audio fails
        } catch (e) {
            // Ignore audio errors
        }
    }

    isUnlocked(achievementId) {
        return this.unlockedAchievements.some(a => a.id === achievementId);
    }

    getUnlockedAchievements() {
        return this.unlockedAchievements;
    }

    getTotalPoints() {
        return this.unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0);
    }

    getTotalXP() {
        return this.unlockedAchievements.reduce((total, achievement) => total + (achievement.xp || 0), 0);
    }

    getProgress() {
        return {
            unlocked: this.unlockedAchievements.length,
            total: this.achievements.length,
            percentage: (this.unlockedAchievements.length / this.achievements.length) * 100,
            points: this.getTotalPoints(),
            xp: this.getTotalXP()
        };
    }

    renderAchievements(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.achievements.map(achievement => {
            const unlocked = this.isUnlocked(achievement.id);
            const unlockedData = unlocked ? this.unlockedAchievements.find(a => a.id === achievement.id) : null;
            
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" data-id="${achievement.id}">
                    <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                    <div class="achievement-content">
                        <h4 class="achievement-name">${achievement.name}</h4>
                        <p class="achievement-description">${achievement.description}</p>
                        <div class="achievement-reward">
                            <span class="achievement-points">${achievement.points} points</span>
                            <span class="achievement-xp">+${achievement.xp} XP</span>
                        </div>
                        ${unlocked ? `<div class="achievement-date">Unlocked ${new Date(unlockedData.unlockedAt).toLocaleDateString()}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Trigger achievement check manually
    triggerCheck() {
        const data = this.gatherAchievementData();
        return this.checkAllAchievements(data);
    }

    // Reset all achievements (for testing)
    resetAchievements() {
        this.unlockedAchievements = [];
        this.storage.set('achievements', this.unlockedAchievements);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});