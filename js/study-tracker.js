// Real Study Tracking System
class StudyTracker {
    constructor() {
        this.storage = new Storage();
        this.currentSession = {
            startTime: Date.now(),
            activeChallenge: null,
            codeAttempts: 0
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.startSessionTracking();
    }

    // Only track actual completions
    completeChallenge(challengeId, userCode, testResults) {
        const allTestsPassed = testResults.every(test => test.passed);
        
        if (!allTestsPassed) {
            return { success: false, message: 'Complete all requirements to mark as finished' };
        }

        const progress = this.storage.get('studyProgress') || {};
        const challengeKey = `challenge_${challengeId}`;
        
        // Only mark complete if truly completed
        progress[challengeKey] = {
            completed: true,
            completedAt: Date.now(),
            finalCode: userCode,
            attempts: (progress[challengeKey]?.attempts || 0) + 1,
            timeSpent: this.calculateTimeSpent(challengeId)
        };

        this.storage.set('studyProgress', progress);
        this.updateStats();
        
        return { success: true, message: 'Challenge completed successfully!' };
    }

    // Track project completion with validation
    completeProject(projectId, projectFiles, requirements) {
        const validation = this.validateProject(projectFiles, requirements);
        
        if (!validation.isComplete) {
            return { 
                success: false, 
                message: `Project incomplete: ${validation.missing.join(', ')}` 
            };
        }

        const progress = this.storage.get('studyProgress') || {};
        const projectKey = `project_${projectId}`;
        
        progress[projectKey] = {
            completed: true,
            completedAt: Date.now(),
            files: projectFiles,
            timeSpent: this.calculateTimeSpent(projectId)
        };

        this.storage.set('studyProgress', progress);
        this.updateStats();
        
        return { success: true, message: 'Project completed successfully!' };
    }

    validateProject(files, requirements) {
        const missing = [];
        const isComplete = requirements.every(req => {
            switch(req.type) {
                case 'file':
                    if (!files[req.name]) {
                        missing.push(`Missing file: ${req.name}`);
                        return false;
                    }
                    return true;
                case 'content':
                    if (!files[req.file] || !files[req.file].includes(req.content)) {
                        missing.push(`Missing content in ${req.file}: ${req.content}`);
                        return false;
                    }
                    return true;
                case 'function':
                    if (!files[req.file] || !this.containsFunction(files[req.file], req.name)) {
                        missing.push(`Missing function: ${req.name}`);
                        return false;
                    }
                    return true;
                default:
                    return true;
            }
        });

        return { isComplete, missing };
    }

    containsFunction(code, functionName) {
        const patterns = [
            new RegExp(`function\\s+${functionName}\\s*\\(`),
            new RegExp(`const\\s+${functionName}\\s*=`),
            new RegExp(`let\\s+${functionName}\\s*=`),
            new RegExp(`${functionName}\\s*:\\s*function`)
        ];
        return patterns.some(pattern => pattern.test(code));
    }

    calculateTimeSpent(itemId) {
        const sessions = this.storage.get('studySessions') || [];
        return sessions
            .filter(s => s.itemId === itemId)
            .reduce((total, s) => total + (s.endTime - s.startTime), 0);
    }

    startItemSession(itemId, itemType) {
        this.currentSession.activeItem = itemId;
        this.currentSession.itemType = itemType;
        this.currentSession.startTime = Date.now();
    }

    endItemSession() {
        if (!this.currentSession.activeItem) return;

        const sessions = this.storage.get('studySessions') || [];
        sessions.push({
            itemId: this.currentSession.activeItem,
            itemType: this.currentSession.itemType,
            startTime: this.currentSession.startTime,
            endTime: Date.now(),
            date: new Date().toDateString()
        });

        this.storage.set('studySessions', sessions);
        this.currentSession.activeItem = null;
    }

    getProgress() {
        const progress = this.storage.get('studyProgress') || {};
        const completed = Object.keys(progress).filter(key => progress[key].completed);
        
        return {
            totalCompleted: completed.length,
            challenges: completed.filter(k => k.startsWith('challenge_')).length,
            projects: completed.filter(k => k.startsWith('project_')).length,
            totalTimeStudied: this.getTotalStudyTime(),
            currentStreak: this.calculateStreak(),
            completionRate: this.getCompletionRate()
        };
    }

    getTotalStudyTime() {
        const sessions = this.storage.get('studySessions') || [];
        return sessions.reduce((total, s) => total + (s.endTime - s.startTime), 0);
    }

    calculateStreak() {
        const sessions = this.storage.get('studySessions') || [];
        const today = new Date().toDateString();
        const uniqueDates = [...new Set(sessions.map(s => s.date))].sort();
        
        let streak = 0;
        let currentDate = new Date();
        
        for (let i = uniqueDates.length - 1; i >= 0; i--) {
            const sessionDate = new Date(uniqueDates[i]);
            const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
                streak++;
                currentDate = sessionDate;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getCompletionRate() {
        const progress = this.storage.get('studyProgress') || {};
        const attempted = Object.keys(progress).length;
        const completed = Object.keys(progress).filter(key => progress[key].completed).length;
        
        return attempted > 0 ? Math.round((completed / attempted) * 100) : 0;
    }

    updateStats() {
        const stats = this.getProgress();
        
        // Update dashboard elements
        const elements = {
            'completedLessons': stats.challenges,
            'totalXP': stats.totalCompleted * 50,
            'streakCount': stats.currentStreak,
            'totalProjects': stats.projects
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update progress bars
        this.updateProgressBars(stats);
    }

    updateProgressBars(stats) {
        const xpFill = document.getElementById('xpFill');
        const xpText = document.getElementById('xpText');
        
        if (xpFill && xpText) {
            const totalXP = stats.totalCompleted * 50;
            const level = Math.floor(totalXP / 100) + 1;
            const currentLevelXP = totalXP % 100;
            
            xpFill.style.width = `${currentLevelXP}%`;
            xpText.textContent = `${currentLevelXP} / 100 XP (Level ${level})`;
        }
    }

    loadProgress() {
        this.updateStats();
    }

    startSessionTracking() {
        // Track page visibility for accurate time measurement
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.endItemSession();
            }
        });

        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            this.endItemSession();
        });
    }

    // Export study data
    exportProgress() {
        const data = {
            progress: this.storage.get('studyProgress') || {},
            sessions: this.storage.get('studySessions') || [],
            stats: this.getProgress(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import study data
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.storage.set('studyProgress', data.progress);
                this.storage.set('studySessions', data.sessions);
                this.updateStats();
                alert('Progress imported successfully!');
            } catch (error) {
                alert('Invalid file format');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize study tracker
document.addEventListener('DOMContentLoaded', () => {
    window.studyTracker = new StudyTracker();
});