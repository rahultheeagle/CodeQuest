class UserDashboard {
    constructor() {
        this.userData = this.loadUserData();
        this.achievements = [
            { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', xpRequired: 10 },
            { id: 'streak_3', name: 'Consistent', description: '3-day learning streak', xpRequired: 50 },
            { id: 'level_2', name: 'Rising Star', description: 'Reach Level 2', xpRequired: 100 },
            { id: 'lessons_10', name: 'Dedicated', description: 'Complete 10 lessons', xpRequired: 200 }
        ];
        this.learningPath = [
            { id: 1, title: 'HTML Basics', description: 'Learn HTML fundamentals', xpReward: 50, completed: false },
            { id: 2, title: 'CSS Styling', description: 'Master CSS properties', xpReward: 75, completed: false },
            { id: 3, title: 'JavaScript Intro', description: 'JavaScript basics', xpReward: 100, completed: false },
            { id: 4, title: 'DOM Manipulation', description: 'Interactive web pages', xpReward: 125, completed: false },
            { id: 5, title: 'Advanced JS', description: 'ES6+ features', xpReward: 150, completed: false }
        ];
        this.init();
    }

    loadUserData() {
        const defaultData = {
            username: 'Learner',
            xp: 0,
            level: 1,
            completedLessons: 0,
            streak: 0,
            lastLoginDate: null,
            earnedBadges: [],
            completedPaths: []
        };
        return JSON.parse(localStorage.getItem('codequest_user') || JSON.stringify(defaultData));
    }

    saveUserData() {
        localStorage.setItem('codequest_user', JSON.stringify(this.userData));
    }

    init() {
        this.updateStreak();
        this.renderProfile();
        this.renderAchievements();
        this.renderProgress();
        this.renderLearningPath();
        this.addTestButtons();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.userData.lastLoginDate;
        
        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastLogin === yesterday.toDateString()) {
                this.userData.streak++;
            } else if (lastLogin !== null) {
                this.userData.streak = 1;
            } else {
                this.userData.streak = 1;
            }
            
            this.userData.lastLoginDate = today;
            this.saveUserData();
        }
    }

    calculateLevel() {
        return Math.floor(this.userData.xp / 100) + 1;
    }

    addXP(amount) {
        this.userData.xp += amount;
        this.userData.level = this.calculateLevel();
        this.checkAchievements();
        this.saveUserData();
        this.renderProfile();
        this.renderAchievements();
        this.renderProgress();
    }

    completeLesson(pathId) {
        const path = this.learningPath.find(p => p.id === pathId);
        if (path && !path.completed) {
            path.completed = true;
            this.userData.completedLessons++;
            this.userData.completedPaths.push(pathId);
            this.addXP(path.xpReward);
            this.renderLearningPath();
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userData.earnedBadges.includes(achievement.id)) {
                let earned = false;
                
                switch(achievement.id) {
                    case 'first_lesson':
                        earned = this.userData.completedLessons >= 1;
                        break;
                    case 'streak_3':
                        earned = this.userData.streak >= 3;
                        break;
                    case 'level_2':
                        earned = this.userData.level >= 2;
                        break;
                    case 'lessons_10':
                        earned = this.userData.completedLessons >= 10;
                        break;
                }
                
                if (earned) {
                    this.userData.earnedBadges.push(achievement.id);
                }
            }
        });
    }

    renderProfile() {
        document.getElementById('username').textContent = this.userData.username;
        document.getElementById('level').textContent = `Level ${this.userData.level}`;
        
        const currentLevelXP = (this.userData.level - 1) * 100;
        const nextLevelXP = this.userData.level * 100;
        const progressXP = this.userData.xp - currentLevelXP;
        const neededXP = nextLevelXP - currentLevelXP;
        
        const xpFill = document.getElementById('xpFill');
        const xpText = document.getElementById('xpText');
        
        const percentage = (progressXP / neededXP) * 100;
        xpFill.style.width = `${percentage}%`;
        xpText.textContent = `${progressXP} / ${neededXP} XP`;
        
        document.getElementById('streakCount').textContent = this.userData.streak;
    }

    renderAchievements() {
        const container = document.getElementById('badgeContainer');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `badge ${this.userData.earnedBadges.includes(achievement.id) ? 'earned' : ''}`;
            badge.textContent = achievement.name;
            badge.title = achievement.description;
            container.appendChild(badge);
        });
    }

    renderProgress() {
        document.getElementById('completedLessons').textContent = this.userData.completedLessons;
        document.getElementById('totalXP').textContent = this.userData.xp;
    }

    renderLearningPath() {
        const container = document.getElementById('pathContainer');
        container.innerHTML = '';
        
        this.learningPath.forEach((path, index) => {
            const isCompleted = this.userData.completedPaths.includes(path.id);
            const isUnlocked = index === 0 || this.userData.completedPaths.includes(this.learningPath[index - 1].id);
            const isCurrent = !isCompleted && isUnlocked;
            
            const pathItem = document.createElement('div');
            pathItem.className = `path-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
            
            pathItem.innerHTML = `
                <div class="path-icon ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}">
                    ${isCompleted ? '✓' : !isUnlocked ? '🔒' : '▶'}
                </div>
                <div class="path-info">
                    <h4>${path.title}</h4>
                    <p>${path.description} (+${path.xpReward} XP)</p>
                </div>
            `;
            
            if (isCurrent) {
                pathItem.style.cursor = 'pointer';
                pathItem.addEventListener('click', () => this.completeLesson(path.id));
            }
            
            container.appendChild(pathItem);
        });
    }

    addTestButtons() {
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'position: fixed; bottom: 20px; right: 20px; display: flex; gap: 10px;';
        testDiv.innerHTML = `
            <button onclick="dashboard.addXP(25)" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">+25 XP</button>
            <button onclick="dashboard.resetProgress()" style="padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset</button>
        `;
        document.body.appendChild(testDiv);
    }

    resetProgress() {
        localStorage.removeItem('codequest_user');
        location.reload();
    }
}

const dashboard = new UserDashboard();