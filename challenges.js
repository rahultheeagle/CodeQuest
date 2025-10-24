class ChallengeSystem {
    constructor() {
        this.challenges = challengeData;
        
        this.userProgress = this.loadProgress();
        this.init();
    }

    loadProgress() {
        const defaultProgress = {
            html: [],
            css: [],
            js: [],
            projects: []
        };
        return JSON.parse(localStorage.getItem('codequest_challenges') || JSON.stringify(defaultProgress));
    }

    saveProgress() {
        localStorage.setItem('codequest_challenges', JSON.stringify(this.userProgress));
    }

    init() {
        this.updateOverallProgress();
        this.updateCategoryProgress();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Category card clicks
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.showChallenges(category);
            });
        });

        // Back to categories
        document.getElementById('backToCategories').addEventListener('click', () => {
            this.showCategories();
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Start challenge
        document.getElementById('startChallenge').addEventListener('click', () => {
            this.startChallenge();
        });

        // Get hint
        document.getElementById('getHint').addEventListener('click', () => {
            this.getHint();
        });

        // View solution
        document.getElementById('viewSolution').addEventListener('click', () => {
            this.viewSolution();
        });

        // Click outside modal to close
        document.getElementById('challengeModal').addEventListener('click', (e) => {
            if (e.target.id === 'challengeModal') {
                this.closeModal();
            }
        });
    }

    updateOverallProgress() {
        const totalChallenges = 35; // 10+10+10+5
        const completedChallenges = Object.values(this.userProgress).flat().length;
        document.getElementById('userProgress').textContent = `Progress: ${completedChallenges}/${totalChallenges}`;
    }

    updateCategoryProgress() {
        Object.keys(this.challenges).forEach(category => {
            const card = document.querySelector(`[data-category="${category}"]`);
            const totalChallenges = this.challenges[category].length;
            const completedChallenges = this.userProgress[category].length;
            const percentage = (completedChallenges / totalChallenges) * 100;
            
            const progressText = card.querySelector('.progress-text');
            const progressFill = card.querySelector('.progress-fill');
            
            progressText.textContent = `${completedChallenges}/${totalChallenges} completed`;
            progressFill.style.width = `${percentage}%`;
        });
    }

    showChallenges(category) {
        document.querySelector('.categories-grid').style.display = 'none';
        document.getElementById('challengeList').style.display = 'block';
        
        const categoryTitles = {
            html: 'HTML Basics Challenges',
            css: 'CSS Styling Challenges',
            js: 'JavaScript Fundamentals Challenges',
            projects: 'Mini-Projects Challenges'
        };
        
        document.getElementById('categoryTitle').textContent = categoryTitles[category];
        
        const challengesGrid = document.getElementById('challengesGrid');
        challengesGrid.innerHTML = '';
        
        this.challenges[category].forEach((challenge, index) => {
            const isCompleted = this.userProgress[category].includes(challenge.id);
            const isLocked = index > 0 && !this.userProgress[category].includes(this.challenges[category][index - 1].id);
            
            const challengeItem = document.createElement('div');
            challengeItem.className = `challenge-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
            
            challengeItem.innerHTML = `
                <div class="challenge-number">${isCompleted ? '✓' : challenge.id}</div>
                <h4>${challenge.title}</h4>
                <p>${challenge.description}</p>
                <span class="challenge-difficulty difficulty-${challenge.difficulty}">${challenge.difficulty.toUpperCase()}</span>
                <div style="margin-top: 10px; font-weight: bold; color: #667eea;">+${challenge.xp} XP</div>
            `;
            
            if (!isLocked) {
                challengeItem.addEventListener('click', () => {
                    this.showChallengeModal(category, challenge);
                });
            }
            
            challengesGrid.appendChild(challengeItem);
        });
        
        this.currentCategory = category;
    }

    showCategories() {
        document.querySelector('.categories-grid').style.display = 'grid';
        document.getElementById('challengeList').style.display = 'none';
    }

    showChallengeModal(category, challenge) {
        this.currentChallenge = { category, challenge };
        
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengeDescription').textContent = challenge.description;
        
        const requirementsHtml = `
            <h4>Requirements:</h4>
            <ul>
                ${challenge.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
            <p><strong>Reward:</strong> +${challenge.xp} XP</p>
        `;
        document.getElementById('challengeRequirements').innerHTML = requirementsHtml;
        
        const isCompleted = this.userProgress[category].includes(challenge.id);
        const challengeKey = `${category}_${challenge.id}`;
        const attempts = challengeAttempts[challengeKey] || 0;
        const hintUsed = challengeHints[challengeKey] || false;
        
        document.getElementById('startChallenge').textContent = isCompleted ? 'Practice Again' : 'Start Challenge';
        document.getElementById('getHint').style.display = isCompleted || hintUsed ? 'none' : 'block';
        document.getElementById('viewSolution').style.display = (isCompleted || attempts >= 3) ? 'block' : 'none';
        
        // Show challenge status
        if (attempts > 0 || hintUsed) {
            document.getElementById('challengeStatus').style.display = 'block';
            document.getElementById('attemptCount').textContent = attempts;
            document.getElementById('hintUsed').style.display = hintUsed ? 'block' : 'none';
        } else {
            document.getElementById('challengeStatus').style.display = 'none';
        }
        
        document.getElementById('challengeModal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('challengeModal').style.display = 'none';
    }

    startChallenge() {
        // Store challenge data for editor
        localStorage.setItem('current_challenge', JSON.stringify(this.currentChallenge));
        
        // Navigate to editor
        window.location.href = 'editor.html?challenge=true';
    }

    getHint() {
        const { category, challenge } = this.currentChallenge;
        const challengeKey = `${category}_${challenge.id}`;
        
        if (confirm(`Get a hint for this challenge? This will cost 5 XP.`)) {
            // Deduct XP
            const dashboardData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
            if (dashboardData.xp >= 5) {
                dashboardData.xp -= 5;
                localStorage.setItem('codequest_user', JSON.stringify(dashboardData));
                
                // Mark hint as used
                challengeHints[challengeKey] = true;
                
                // Show hint
                const hintHtml = `<div class="hint-content"><strong>💡 Hint:</strong> ${challenge.hint}</div>`;
                document.getElementById('challengeRequirements').innerHTML += hintHtml;
                
                // Update UI
                document.getElementById('getHint').style.display = 'none';
                document.getElementById('hintUsed').style.display = 'block';
                document.getElementById('challengeStatus').style.display = 'block';
            } else {
                alert('Not enough XP! You need at least 5 XP to get a hint.');
            }
        }
    }

    viewSolution() {
        const { challenge } = this.currentChallenge;
        
        // Show solution in modal
        const solutionHtml = `
            <div class="solution-content">
                <h4>💡 Solution:</h4>
                <div><strong>HTML:</strong><pre>${challenge.solution.html}</pre></div>
                ${challenge.solution.css ? `<div><strong>CSS:</strong><pre>${challenge.solution.css}</pre></div>` : ''}
                ${challenge.solution.js ? `<div><strong>JavaScript:</strong><pre>${challenge.solution.js}</pre></div>` : ''}
            </div>
        `;
        document.getElementById('challengeRequirements').innerHTML += solutionHtml;
        
        document.getElementById('viewSolution').style.display = 'none';
    }

    completeChallenge(category, challengeId, xpEarned) {
        if (!this.userProgress[category].includes(challengeId)) {
            this.userProgress[category].push(challengeId);
            this.saveProgress();
            this.updateOverallProgress();
            this.updateCategoryProgress();
            
            // Award XP to user dashboard
            const dashboardData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
            if (dashboardData.xp !== undefined) {
                dashboardData.xp += xpEarned;
                dashboardData.level = Math.floor(dashboardData.xp / 100) + 1;
                dashboardData.completedLessons++;
                localStorage.setItem('codequest_user', JSON.stringify(dashboardData));
            }
            
            return true;
        }
        return false;
    }
}

// Initialize the challenge system
const challengeSystem = new ChallengeSystem();

// Expose for external use
window.challengeSystem = challengeSystem;