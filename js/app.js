// Main Application
class App {
    constructor() {
        this.storage = new Storage();
        this.user = this.storage.get('user') || { name: 'Learner', xp: 0, level: 1 };
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.loadStats();
        this.loadRecentActivity();
    }

    loadUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.innerHTML = `
                <span>${this.user.name}</span>
                <span>Level ${this.user.level}</span>
                <span>${this.user.xp} XP</span>
            `;
        }
    }

    loadStats() {
        const statsGrid = document.getElementById('statsGrid');
        if (statsGrid) {
            const stats = this.getStats();
            statsGrid.innerHTML = stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-number">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }
    }

    getStats() {
        const challenges = this.storage.get('challenges') || [];
        const completed = challenges.filter(c => c.completed).length;
        
        return [
            { label: 'Challenges Completed', value: completed },
            { label: 'Total XP', value: this.user.xp },
            { label: 'Current Level', value: this.user.level },
            { label: 'Streak Days', value: this.storage.get('streak') || 0 }
        ];
    }

    loadRecentActivity() {
        const recentActivity = document.getElementById('recentActivity');
        if (recentActivity) {
            const activities = this.storage.get('activities') || [];
            recentActivity.innerHTML = `
                <div class="card">
                    <h3>Recent Activity</h3>
                    ${activities.slice(0, 5).map(activity => `
                        <div class="activity-item">
                            <span>${activity.text}</span>
                            <span>${Utils.timeAgo(activity.timestamp)}</span>
                        </div>
                    `).join('') || '<p>No recent activity</p>'}
                </div>
            `;
        }
    }

    updateUser(updates) {
        this.user = { ...this.user, ...updates };
        this.storage.set('user', this.user);
        this.loadUserInfo();
    }

    addActivity(text) {
        const activities = this.storage.get('activities') || [];
        activities.unshift({ text, timestamp: Date.now() });
        this.storage.set('activities', activities.slice(0, 50));
        this.loadRecentActivity();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Initialize dashboard functionality
    initializeDashboard();
});

// Dashboard initialization
function initializeDashboard() {
    updateUserProfile();
    updateProgressStats();
    updateAchievementBadges();
    updateLearningPath();
}

function updateUserProfile() {
    const storage = new Storage();
    const user = storage.get('user') || { name: 'Learner', xp: 0, level: 1 };
    const streak = storage.get('streak') || 0;
    
    // Update username and level
    const usernameEl = document.getElementById('username');
    const levelEl = document.getElementById('level');
    if (usernameEl) usernameEl.textContent = user.name;
    if (levelEl) levelEl.textContent = `Level ${user.level}`;
    
    // Update XP bar
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    if (xpFill && xpText) {
        const xpForNextLevel = user.level * 100;
        const currentXP = user.xp % 100;
        const percentage = (currentXP / 100) * 100;
        
        xpFill.style.width = `${percentage}%`;
        xpText.textContent = `${currentXP} / 100 XP`;
    }
    
    // Update streak
    const streakCount = document.getElementById('streakCount');
    if (streakCount) streakCount.textContent = streak;
}

function updateProgressStats() {
    const storage = new Storage();
    const challenges = storage.get('challenges') || [];
    const completedCount = challenges.filter(c => c.completed).length;
    const totalXP = storage.get('user')?.xp || 0;
    
    const completedLessons = document.getElementById('completedLessons');
    const totalXPEl = document.getElementById('totalXP');
    
    if (completedLessons) completedLessons.textContent = completedCount;
    if (totalXPEl) totalXPEl.textContent = totalXP;
}

function updateAchievementBadges() {
    const badgeContainer = document.getElementById('badgeContainer');
    if (!badgeContainer) return;
    
    const storage = new Storage();
    const achievements = storage.get('achievements') || [];
    
    if (achievements.length === 0) {
        badgeContainer.innerHTML = '<p>No achievements yet. Complete challenges to earn badges!</p>';
        return;
    }
    
    badgeContainer.innerHTML = achievements.slice(0, 6).map(achievement => `
        <div class="badge" title="${achievement.description}">
            <span class="badge-icon">${achievement.icon}</span>
            <span class="badge-name">${achievement.name}</span>
        </div>
    `).join('');
}

function updateLearningPath() {
    const pathContainer = document.getElementById('pathContainer');
    if (!pathContainer) return;
    
    const storage = new Storage();
    const user = storage.get('user') || { level: 1 };
    const challenges = storage.get('challenges') || [];
    const completedCount = challenges.filter(c => c.completed).length;
    
    const pathSteps = [
        { name: 'HTML Basics', completed: completedCount >= 3, level: 1 },
        { name: 'CSS Styling', completed: completedCount >= 6, level: 2 },
        { name: 'JavaScript Logic', completed: completedCount >= 10, level: 3 },
        { name: 'Advanced Concepts', completed: completedCount >= 15, level: 4 }
    ];
    
    pathContainer.innerHTML = pathSteps.map(step => `
        <div class="path-step ${step.completed ? 'completed' : ''} ${user.level >= step.level ? 'available' : 'locked'}">
            <div class="step-icon">${step.completed ? '✅' : step.level <= user.level ? '🎯' : '🔒'}</div>
            <div class="step-name">${step.name}</div>
            <div class="step-level">Level ${step.level}</div>
        </div>
    `).join('');
}