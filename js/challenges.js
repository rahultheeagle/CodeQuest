// Challenge System
class ChallengeSystem {
    constructor() {
        this.challenges = [];
        this.userProgress = new Storage().get('challengeProgress') || { completed: [], totalXP: 0 };
        this.progressTracker = new ProgressTracker();
        this.init();
    }

    async init() {
        await this.loadChallenges();
        this.renderChallenges();
    }

    async loadChallenges() {
        try {
            const response = await fetch('data/challenges.json');
            this.challenges = await response.json();
        } catch (error) {
            console.error('Failed to load challenges:', error);
            this.challenges = this.getDefaultChallenges();
        }
    }

    getDefaultChallenges() {
        return [
            {
                id: 1,
                title: "Create Your First Heading",
                category: "html",
                difficulty: "easy",
                xp: 50,
                description: "Create an h1 element with the text 'Hello World'",
                starterCode: "<!-- Write your code here -->",
                solution: "<h1>Hello World</h1>",
                hints: ["Use the h1 tag", "Don't forget to close the tag"]
            }
        ];
    }

    renderChallenges() {
        const container = document.getElementById('challengeContainer');
        if (!container) return;

        container.innerHTML = this.challenges.map(challenge => `
            <div class="challenge-card ${this.isCompleted(challenge.id) ? 'completed' : ''}">
                <div class="challenge-header">
                    <h3>${challenge.title}</h3>
                    <div class="challenge-meta">
                        <span class="badge badge-${challenge.difficulty}">${challenge.difficulty}</span>
                        <span class="xp-badge">${challenge.xp} XP</span>
                    </div>
                </div>
                <p class="challenge-description">${challenge.description}</p>
                <textarea class="code-input" id="code-${challenge.id}" placeholder="Write your code here...">${challenge.starterCode}</textarea>
                <div class="challenge-actions">
                    <button class="btn btn-primary" onclick="challengeSystem.submitChallenge(${challenge.id})">Submit</button>
                    <button class="btn btn-secondary" onclick="challengeSystem.showHint(${challenge.id})">Hint</button>
                    <button class="btn btn-warning" onclick="challengeSystem.showSolution(${challenge.id})">Solution</button>
                </div>
                <div class="challenge-result" id="result-${challenge.id}"></div>
            </div>
        `).join('');
    }

    submitChallenge(id) {
        const challenge = this.challenges.find(c => c.id === id);
        const userCode = document.getElementById(`code-${id}`).value;
        
        // Start tracking if not already started
        if (!this.progressTracker.currentChallenge) {
            this.progressTracker.startChallenge(id);
        }
        
        const result = Validation.validateChallenge(challenge, userCode);
        const progressResult = this.progressTracker.submitAttempt(id, result);
        
        this.showResult(id, result, progressResult);
        
        if (result.valid && !this.isCompleted(id)) {
            this.markCompleted(id, challenge.xp);
        }
    }

    showResult(id, result, progressResult) {
        const resultDiv = document.getElementById(`result-${id}`);
        resultDiv.innerHTML = `
            <div class="result-message ${result.valid ? 'success' : 'error'}">
                ${result.message}
                ${result.valid ? ` (+${result.xp || 0} XP)` : ''}
                <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                    Time: ${this.progressTracker.formatTime(progressResult.timeSpent)} | 
                    Attempts: ${progressResult.totalAttempts}
                    ${progressResult.bestTime ? ` | Best: ${this.progressTracker.formatTime(progressResult.bestTime)}` : ''}
                </div>
            </div>
        `;
    }

    showHint(id) {
        const challenge = this.challenges.find(c => c.id === id);
        if (challenge.hints && challenge.hints.length > 0) {
            Utils.showNotification(challenge.hints[0], 'info');
        }
    }

    showSolution(id) {
        const challenge = this.challenges.find(c => c.id === id);
        document.getElementById(`code-${id}`).value = challenge.solution;
    }

    isCompleted(id) {
        return this.userProgress.completed.includes(id);
    }

    markCompleted(id, xp) {
        this.userProgress.completed.push(id);
        this.userProgress.totalXP += xp;
        new Storage().set('challengeProgress', this.userProgress);
        
        if (window.app) {
            window.app.updateUser({ xp: this.userProgress.totalXP });
            window.app.addActivity(`Completed challenge: ${this.challenges.find(c => c.id === id).title}`);
        }
        
        Utils.showNotification(`Challenge completed! +${xp} XP`, 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.challengeSystem = new ChallengeSystem();
});