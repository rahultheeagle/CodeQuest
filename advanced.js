class AdvancedFeatures {
    constructor() {
        this.timer = { start: 0, elapsed: 0, running: false, interval: null };
        this.sessionStart = Date.now();
        this.settings = this.loadSettings();
        this.codeHistory = [];
        this.builtCode = [];
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupCodeExecutor();
        this.setupDragDrop();
        this.setupTimer();
        this.setupDataManagement();
        this.setupSearch();
        this.setupSettings();
        this.updateStatistics();
        this.drawProgressChart();
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = this.settings.theme || 'light';
        
        this.applyTheme(currentTheme);
        
        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            this.settings.theme = newTheme;
            this.saveSettings();
        });
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Code Execution Engine
    setupCodeExecutor() {
        const runBtn = document.getElementById('runCode');
        const validateBtn = document.getElementById('validateCode');
        const clearBtn = document.getElementById('clearOutput');
        const codeInput = document.getElementById('codeInput');
        const output = document.getElementById('codeOutput');

        runBtn.addEventListener('click', () => {
            this.executeCode(codeInput.value, output);
        });

        validateBtn.addEventListener('click', () => {
            this.validateCode(codeInput.value, output);
        });

        clearBtn.addEventListener('click', () => {
            output.textContent = '';
        });
    }

    executeCode(code, outputElement) {
        try {
            // Save to history
            this.codeHistory.push({ code, timestamp: Date.now() });
            
            // Capture console output
            const originalLog = console.log;
            const originalError = console.error;
            let output = '';
            
            console.log = (...args) => {
                output += args.join(' ') + '\\n';
                originalLog.apply(console, args);
            };
            
            console.error = (...args) => {
                output += 'Error: ' + args.join(' ') + '\\n';
                originalError.apply(console, args);
            };

            // Safe execution using Function constructor
            const safeCode = `
                "use strict";
                ${code}
            `;
            
            const func = new Function(safeCode);
            const result = func();
            
            if (result !== undefined) {
                output += 'Return value: ' + result + '\\n';
            }
            
            // Restore console
            console.log = originalLog;
            console.error = originalError;
            
            outputElement.textContent = output || 'Code executed successfully (no output)';
            this.showToast('Code executed successfully!', 'success');
            
        } catch (error) {
            outputElement.textContent = 'Error: ' + error.message;
            this.showToast('Code execution failed: ' + error.message, 'error');
        }
    }

    validateCode(code, outputElement) {
        const validationRules = [
            { test: /console\\.log/, message: 'Contains console.log statement' },
            { test: /let|const|var/, message: 'Uses variable declaration' },
            { test: /function|=>/, message: 'Contains function definition' },
            { test: /if|else/, message: 'Uses conditional logic' },
            { test: /for|while/, message: 'Contains loop structure' }
        ];

        const results = validationRules.map(rule => ({
            passed: rule.test.test(code),
            message: rule.message
        }));

        const passedCount = results.filter(r => r.passed).length;
        const score = Math.round((passedCount / validationRules.length) * 100);

        let output = `Validation Score: ${score}%\\n\\n`;
        results.forEach(result => {
            output += `${result.passed ? '✓' : '✗'} ${result.message}\\n`;
        });

        outputElement.textContent = output;
        this.showToast(`Validation complete: ${score}%`, score >= 60 ? 'success' : 'warning');
    }

    // Drag & Drop Code Builder
    setupDragDrop() {
        const blocks = document.querySelectorAll('.code-block');
        const dropZone = document.getElementById('dropZone');
        const executeBtn = document.getElementById('executeBuiltCode');

        blocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.dataset.code);
                e.dataTransfer.setData('text/html', block.textContent);
            });
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const code = e.dataTransfer.getData('text/plain');
            const label = e.dataTransfer.getData('text/html');
            
            this.builtCode.push(code);
            
            const droppedBlock = document.createElement('div');
            droppedBlock.className = 'dropped-block';
            droppedBlock.textContent = label;
            droppedBlock.addEventListener('click', () => {
                const index = Array.from(dropZone.children).indexOf(droppedBlock) - 1;
                this.builtCode.splice(index, 1);
                droppedBlock.remove();
            });
            
            dropZone.appendChild(droppedBlock);
            
            if (dropZone.children.length === 1) {
                dropZone.querySelector('p').style.display = 'none';
            }
        });

        executeBtn.addEventListener('click', () => {
            const combinedCode = this.builtCode.join('\\n');
            if (combinedCode.trim()) {
                this.executeCode(combinedCode, document.getElementById('codeOutput'));
                this.showToast('Visual code executed!', 'success');
            } else {
                this.showToast('No code blocks to execute', 'warning');
            }
        });
    }

    // Timer System
    setupTimer() {
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        const resetBtn = document.getElementById('resetTimer');
        const timerDisplay = document.getElementById('currentTimer');

        startBtn.addEventListener('click', () => {
            if (!this.timer.running) {
                this.timer.start = Date.now() - this.timer.elapsed;
                this.timer.running = true;
                this.timer.interval = setInterval(() => {
                    this.timer.elapsed = Date.now() - this.timer.start;
                    this.updateTimerDisplay();
                }, 1000);
                this.showToast('Timer started', 'success');
            }
        });

        pauseBtn.addEventListener('click', () => {
            if (this.timer.running) {
                clearInterval(this.timer.interval);
                this.timer.running = false;
                this.showToast('Timer paused', 'warning');
            }
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(this.timer.interval);
            this.timer = { start: 0, elapsed: 0, running: false, interval: null };
            this.updateTimerDisplay();
            this.showToast('Timer reset', 'success');
        });

        this.updateTimerDisplay();
        this.updateSessionStats();
        setInterval(() => this.updateSessionStats(), 60000); // Update every minute
    }

    updateTimerDisplay() {
        const display = document.getElementById('currentTimer');
        const time = this.formatTime(this.timer.elapsed);
        display.textContent = time;
    }

    updateSessionStats() {
        const sessionTime = Math.floor((Date.now() - this.sessionStart) / 60000);
        document.getElementById('sessionTime').textContent = sessionTime + 'm';
        
        const today = new Date().toDateString();
        const todayData = JSON.parse(localStorage.getItem('daily_time') || '{}');
        const todayTime = (todayData[today] || 0) + sessionTime;
        document.getElementById('todayTime').textContent = todayTime + 'm';
        
        // Save today's time
        todayData[today] = todayTime;
        localStorage.setItem('daily_time', JSON.stringify(todayData));
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / 60000) % 60;
        const hours = Math.floor(ms / 3600000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Data Management
    setupDataManagement() {
        const exportBtn = document.getElementById('exportData');
        const importBtn = document.getElementById('importData');
        const importFile = document.getElementById('importFile');
        const resetBtn = document.getElementById('resetData');

        exportBtn.addEventListener('click', () => this.exportData());
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', (e) => this.importData(e.target.files[0]));
        resetBtn.addEventListener('click', () => this.resetAllData());

        this.updateDataInfo();
    }

    exportData() {
        const data = {
            user: JSON.parse(localStorage.getItem('codequest_user') || '{}'),
            challenges: JSON.parse(localStorage.getItem('codequest_challenges') || '{}'),
            stats: JSON.parse(localStorage.getItem('codequest_stats') || '{}'),
            settings: this.settings,
            codeHistory: this.codeHistory,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
        localStorage.setItem('last_backup', new Date().toISOString());
        this.updateDataInfo();
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('This will overwrite all current data. Continue?')) {
                    if (data.user) localStorage.setItem('codequest_user', JSON.stringify(data.user));
                    if (data.challenges) localStorage.setItem('codequest_challenges', JSON.stringify(data.challenges));
                    if (data.stats) localStorage.setItem('codequest_stats', JSON.stringify(data.stats));
                    if (data.settings) {
                        this.settings = data.settings;
                        this.saveSettings();
                    }
                    if (data.codeHistory) this.codeHistory = data.codeHistory;

                    this.showToast('Data imported successfully!', 'success');
                    this.updateStatistics();
                    this.updateDataInfo();
                }
            } catch (error) {
                this.showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    }

    resetAllData() {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
            if (confirm('This will permanently delete your progress, settings, and code history. Continue?')) {
                localStorage.clear();
                this.codeHistory = [];
                this.builtCode = [];
                this.settings = { theme: 'light', autosave: 60, notifications: true };
                this.saveSettings();
                
                this.showToast('All data has been reset', 'success');
                this.updateStatistics();
                this.updateDataInfo();
                
                setTimeout(() => location.reload(), 2000);
            }
        }
    }

    updateDataInfo() {
        const lastBackup = localStorage.getItem('last_backup');
        document.getElementById('lastBackup').textContent = lastBackup ? 
            new Date(lastBackup).toLocaleDateString() : 'Never';
        
        const dataSize = new Blob([JSON.stringify(localStorage)]).size;
        document.getElementById('dataSize').textContent = Math.round(dataSize / 1024) + ' KB';
    }

    // Search & Filter
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const difficultyFilter = document.getElementById('difficultyFilter');
        const topicFilter = document.getElementById('topicFilter');
        const resultsContainer = document.getElementById('searchResults');

        const performSearch = () => {
            const query = searchInput.value.toLowerCase();
            const difficulty = difficultyFilter.value;
            const topic = topicFilter.value;

            // Mock challenge data for search
            const challenges = [
                { title: 'HTML Structure', difficulty: 'easy', topic: 'html', description: 'Learn basic HTML structure' },
                { title: 'CSS Flexbox', difficulty: 'medium', topic: 'css', description: 'Master flexbox layout' },
                { title: 'JavaScript Variables', difficulty: 'easy', topic: 'js', description: 'Understand JS variables' },
                { title: 'Responsive Design', difficulty: 'hard', topic: 'css', description: 'Create responsive layouts' },
                { title: 'DOM Manipulation', difficulty: 'medium', topic: 'js', description: 'Interact with the DOM' }
            ];

            const filtered = challenges.filter(challenge => {
                const matchesQuery = !query || challenge.title.toLowerCase().includes(query) || 
                                   challenge.description.toLowerCase().includes(query);
                const matchesDifficulty = !difficulty || challenge.difficulty === difficulty;
                const matchesTopic = !topic || challenge.topic === topic;
                
                return matchesQuery && matchesDifficulty && matchesTopic;
            });

            resultsContainer.innerHTML = '';
            
            if (filtered.length === 0) {
                resultsContainer.innerHTML = '<div class="search-result-item">No challenges found</div>';
                return;
            }

            filtered.forEach(challenge => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <strong>${challenge.title}</strong>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        ${challenge.description} • ${challenge.difficulty} • ${challenge.topic.toUpperCase()}
                    </div>
                `;
                item.addEventListener('click', () => {
                    this.showToast(`Opening ${challenge.title}`, 'success');
                });
                resultsContainer.appendChild(item);
            });
        };

        searchInput.addEventListener('input', performSearch);
        difficultyFilter.addEventListener('change', performSearch);
        topicFilter.addEventListener('change', performSearch);
        
        performSearch(); // Initial search
    }

    // Settings Management
    setupSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');

        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
            this.loadSettingsUI();
        });

        closeSettings.addEventListener('click', () => {
            settingsModal.style.display = 'none';
            this.saveSettingsFromUI();
        });

        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
                this.saveSettingsFromUI();
            }
        });
    }

    loadSettingsUI() {
        document.getElementById('themeSelect').value = this.settings.theme || 'light';
        document.getElementById('autosaveInterval').value = this.settings.autosave || 60;
        document.getElementById('enableNotifications').checked = this.settings.notifications !== false;
    }

    saveSettingsFromUI() {
        this.settings.theme = document.getElementById('themeSelect').value;
        this.settings.autosave = parseInt(document.getElementById('autosaveInterval').value);
        this.settings.notifications = document.getElementById('enableNotifications').checked;
        this.saveSettings();
        this.applyTheme(this.settings.theme);
    }

    loadSettings() {
        return JSON.parse(localStorage.getItem('codequest_settings') || '{"theme":"light","autosave":60,"notifications":true}');
    }

    saveSettings() {
        localStorage.setItem('codequest_settings', JSON.stringify(this.settings));
    }

    // Statistics & Analytics
    updateStatistics() {
        const userData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
        const challengeData = JSON.parse(localStorage.getItem('codequest_challenges') || '{}');
        
        const totalChallenges = Object.values(challengeData).flat().length;
        const totalTime = this.calculateTotalTime();
        const successRate = totalChallenges > 0 ? Math.round((totalChallenges / 35) * 100) : 0;

        document.getElementById('totalTime').textContent = this.formatTimeHours(totalTime);
        document.getElementById('completedCount').textContent = totalChallenges;
        document.getElementById('successRate').textContent = successRate + '%';
    }

    calculateTotalTime() {
        const dailyTime = JSON.parse(localStorage.getItem('daily_time') || '{}');
        return Object.values(dailyTime).reduce((sum, time) => sum + time, 0);
    }

    formatTimeHours(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    drawProgressChart() {
        const canvas = document.getElementById('progressChart');
        const ctx = canvas.getContext('2d');
        
        // Simple progress chart
        const data = [10, 25, 40, 60, 75, 85, 90]; // Mock progress data
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - (value / 100) * (height - 40) - 20;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#667eea';
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - (value / 100) * (height - 40) - 20;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        if (!this.settings.notifications) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // Confetti Animation
    showConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // gravity
                
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                
                if (particle.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // Animated Progress Bar
    animateProgress(element, targetPercent) {
        const progressBar = element.querySelector('.progress-fill-animated');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = targetPercent + '%';
            }, 100);
        }
    }
}

// Initialize Advanced Features
const advancedFeatures = new AdvancedFeatures();

// Expose for external use
window.advancedFeatures = advancedFeatures;