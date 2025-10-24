// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.storage = new Storage();
        this.progress = this.loadProgress();
        this.sessionStart = Date.now();
        this.currentChallenge = null;
        this.challengeStartTime = null;
    }

    loadProgress() {
        return this.storage.get('userProgress') || {
            challenges: {},
            totalTime: 0,
            totalAttempts: 0,
            completedChallenges: [],
            streakDays: 0,
            lastActiveDate: null,
            statistics: {
                averageTime: 0,
                averageAttempts: 0,
                successRate: 0,
                categoryStats: {}
            }
        };
    }

    startChallenge(challengeId) {
        this.currentChallenge = challengeId;
        this.challengeStartTime = Date.now();
        
        if (!this.progress.challenges[challengeId]) {
            this.progress.challenges[challengeId] = {
                attempts: 0,
                timeSpent: 0,
                bestTime: null,
                completed: false,
                firstAttemptDate: Date.now(),
                lastAttemptDate: Date.now(),
                scores: []
            };
        }
        
        this.progress.challenges[challengeId].lastAttemptDate = Date.now();
    }

    submitAttempt(challengeId, result) {
        const challenge = this.progress.challenges[challengeId];
        const timeSpent = Date.now() - this.challengeStartTime;
        
        challenge.attempts++;
        challenge.timeSpent += timeSpent;
        challenge.scores.push(result.score || 0);
        
        this.progress.totalAttempts++;
        this.progress.totalTime += timeSpent;
        
        // Emit attempt event
        document.dispatchEvent(new CustomEvent('challenge:attempted', {
            detail: { challengeId, attempts: challenge.attempts, timeSpent }
        }));
        
        if (result.valid && !challenge.completed) {
            challenge.completed = true;
            challenge.completionTime = timeSpent;
            challenge.bestTime = challenge.bestTime ? Math.min(challenge.bestTime, timeSpent) : timeSpent;
            
            if (!this.progress.completedChallenges.includes(challengeId)) {
                this.progress.completedChallenges.push(challengeId);
            }
            
            this.updateStreak();
            
            // Emit completion event
            document.dispatchEvent(new CustomEvent('challenge:completed', {
                detail: { 
                    challengeId, 
                    timeSpent, 
                    attempts: challenge.attempts,
                    category: this.getChallengeCategory(challengeId)
                }
            }));
        } else if (result.valid && challenge.bestTime) {
            challenge.bestTime = Math.min(challenge.bestTime, timeSpent);
        }
        
        this.updateStatistics();
        this.saveProgress();
        
        // Emit time recorded event
        document.dispatchEvent(new CustomEvent('time:recorded', {
            detail: {
                totalTime: this.progress.totalTime,
                fastestTime: this.getFastestCompletion()
            }
        }));
        
        // Emit progress updated event
        document.dispatchEvent(new CustomEvent('progress:updated', {
            detail: this.getOverallStats()
        }));
        
        return {
            timeSpent,
            totalAttempts: challenge.attempts,
            bestTime: challenge.bestTime,
            averageScore: this.getAverageScore(challenge.scores)
        };
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = this.progress.lastActiveDate;
        const oldStreak = this.progress.streakDays;
        
        if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
                this.progress.streakDays++;
            } else if (lastActive !== today) {
                this.progress.streakDays = 1;
            }
            
            this.progress.lastActiveDate = today;
            
            // Emit streak updated event if streak changed
            if (oldStreak !== this.progress.streakDays) {
                document.dispatchEvent(new CustomEvent('streak:updated', {
                    detail: { streakDays: this.progress.streakDays, oldStreak }
                }));
            }
        }
    }

    updateStatistics() {
        const challenges = Object.values(this.progress.challenges);
        const completed = challenges.filter(c => c.completed);
        
        this.progress.statistics.successRate = challenges.length > 0 ? 
            (completed.length / challenges.length) * 100 : 0;
        
        this.progress.statistics.averageTime = completed.length > 0 ? 
            completed.reduce((sum, c) => sum + c.completionTime, 0) / completed.length : 0;
        
        this.progress.statistics.averageAttempts = challenges.length > 0 ? 
            challenges.reduce((sum, c) => sum + c.attempts, 0) / challenges.length : 0;
    }

    getCompletionPercentage(totalChallenges) {
        return totalChallenges > 0 ? 
            (this.progress.completedChallenges.length / totalChallenges) * 100 : 0;
    }

    getChallengeStats(challengeId) {
        const challenge = this.progress.challenges[challengeId];
        if (!challenge) return null;
        
        return {
            attempts: challenge.attempts,
            timeSpent: this.formatTime(challenge.timeSpent),
            bestTime: challenge.bestTime ? this.formatTime(challenge.bestTime) : 'N/A',
            completed: challenge.completed,
            averageScore: this.getAverageScore(challenge.scores),
            firstAttempt: new Date(challenge.firstAttemptDate).toLocaleDateString(),
            lastAttempt: new Date(challenge.lastAttemptDate).toLocaleDateString()
        };
    }

    getOverallStats() {
        const challenges = Object.values(this.progress.challenges);
        const completed = challenges.filter(c => c.completed);
        
        return {
            totalChallenges: challenges.length,
            completedChallenges: completed.length,
            completionRate: this.progress.statistics.successRate.toFixed(1),
            totalTime: this.formatTime(this.progress.totalTime),
            averageTime: this.formatTime(this.progress.statistics.averageTime),
            totalAttempts: this.progress.totalAttempts,
            averageAttempts: this.progress.statistics.averageAttempts.toFixed(1),
            streakDays: this.progress.streakDays,
            fastestCompletion: this.getFastestCompletion(),
            slowestCompletion: this.getSlowestCompletion(),
            mostAttempts: this.getMostAttempts()
        };
    }

    getCategoryStats(challenges) {
        const stats = {};
        
        challenges.forEach(challenge => {
            const category = challenge.category;
            const progress = this.progress.challenges[challenge.id];
            
            if (!stats[category]) {
                stats[category] = {
                    total: 0,
                    completed: 0,
                    totalTime: 0,
                    totalAttempts: 0
                };
            }
            
            stats[category].total++;
            
            if (progress) {
                if (progress.completed) stats[category].completed++;
                stats[category].totalTime += progress.timeSpent;
                stats[category].totalAttempts += progress.attempts;
            }
        });
        
        Object.keys(stats).forEach(category => {
            const cat = stats[category];
            cat.completionRate = (cat.completed / cat.total) * 100;
            cat.averageTime = cat.completed > 0 ? cat.totalTime / cat.completed : 0;
            cat.averageAttempts = cat.total > 0 ? cat.totalAttempts / cat.total : 0;
        });
        
        return stats;
    }

    getTimeSpentToday() {
        const today = new Date().toDateString();
        const todayStart = new Date(today).getTime();
        
        return Object.values(this.progress.challenges)
            .filter(c => c.lastAttemptDate >= todayStart)
            .reduce((sum, c) => sum + c.timeSpent, 0);
    }

    getWeeklyProgress() {
        const week = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayProgress = Object.values(this.progress.challenges)
                .filter(c => new Date(c.lastAttemptDate).toDateString() === dateStr)
                .length;
            
            week.push({
                date: dateStr,
                challenges: dayProgress,
                day: date.toLocaleDateString('en', { weekday: 'short' })
            });
        }
        
        return week;
    }

    getFastestCompletion() {
        const completed = Object.values(this.progress.challenges)
            .filter(c => c.completed && c.bestTime);
        
        return completed.length > 0 ? 
            Math.min(...completed.map(c => c.bestTime)) : 0;
    }

    getSlowestCompletion() {
        const completed = Object.values(this.progress.challenges)
            .filter(c => c.completed && c.completionTime);
        
        return completed.length > 0 ? 
            Math.max(...completed.map(c => c.completionTime)) : 0;
    }

    getMostAttempts() {
        const challenges = Object.values(this.progress.challenges);
        return challenges.length > 0 ? 
            Math.max(...challenges.map(c => c.attempts)) : 0;
    }

    getAverageScore(scores) {
        return scores.length > 0 ? 
            (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : 0;
    }

    formatTime(milliseconds) {
        if (!milliseconds) return '0s';
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    exportProgress() {
        return {
            ...this.progress,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    importProgress(data) {
        if (data.version === '1.0') {
            this.progress = data;
            this.saveProgress();
            return true;
        }
        return false;
    }

    resetProgress() {
        this.progress = {
            challenges: {},
            totalTime: 0,
            totalAttempts: 0,
            completedChallenges: [],
            streakDays: 0,
            lastActiveDate: null,
            statistics: {
                averageTime: 0,
                averageAttempts: 0,
                successRate: 0,
                categoryStats: {}
            }
        };
        this.saveProgress();
    }

    saveProgress() {
        this.storage.set('userProgress', this.progress);
    }
    
    getChallengeCategory(challengeId) {
        // Try to get category from challenge system
        if (window.challengeSystem && window.challengeSystem.challenges) {
            const challenge = window.challengeSystem.challenges.find(c => c.id === challengeId);
            return challenge ? challenge.category : 'unknown';
        }
        return 'unknown';
    }
}