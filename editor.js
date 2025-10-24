class CodeEditor {
    constructor() {
        this.editors = {
            html: document.getElementById('htmlEditor'),
            css: document.getElementById('cssEditor'),
            js: document.getElementById('jsEditor')
        };
        this.preview = document.getElementById('preview');
        this.consoleOutput = document.getElementById('consoleOutput');
        this.currentTab = 'html';
        this.templates = {
            html: this.editors.html.value,
            css: this.editors.css.value,
            js: this.editors.js.value
        };
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupEventListeners();
        this.loadSavedCode();
        this.updatePreview();
        this.setupConsoleCapture();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.lang);
            });
        });
    }

    switchTab(lang) {
        // Hide all editors
        Object.values(this.editors).forEach(editor => {
            editor.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected editor and tab
        this.editors[lang].classList.add('active');
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        this.currentTab = lang;
    }

    setupEventListeners() {
        // Auto-save and live preview on input
        Object.entries(this.editors).forEach(([lang, editor]) => {
            editor.addEventListener('input', () => {
                this.saveCode();
                this.updatePreview();
                this.applySyntaxHighlighting(editor, lang);
            });
        });

        // Format button
        document.getElementById('formatBtn').addEventListener('click', () => {
            this.formatCode();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetToTemplate();
        });

        // Refresh preview
        document.getElementById('refreshPreview').addEventListener('click', () => {
            this.updatePreview();
        });

        // Clear console
        document.getElementById('clearConsole').addEventListener('click', () => {
            this.clearConsole();
        });

        // Tab key handling
        Object.values(this.editors).forEach(editor => {
            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 4;
                }
            });
        });
    }

    saveCode() {
        const codeData = {
            html: this.editors.html.value,
            css: this.editors.css.value,
            js: this.editors.js.value,
            timestamp: Date.now()
        };
        localStorage.setItem('codequest_editor', JSON.stringify(codeData));
    }

    loadSavedCode() {
        const saved = localStorage.getItem('codequest_editor');
        if (saved) {
            const codeData = JSON.parse(saved);
            this.editors.html.value = codeData.html || this.templates.html;
            this.editors.css.value = codeData.css || this.templates.css;
            this.editors.js.value = codeData.js || this.templates.js;
        }
    }

    updatePreview() {
        const html = this.editors.html.value;
        const css = this.editors.css.value;
        const js = this.editors.js.value;

        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    // Capture console methods
                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    
                    console.log = function(...args) {
                        parent.postMessage({type: 'console', level: 'log', message: args.join(' ')}, '*');
                        originalLog.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                        parent.postMessage({type: 'console', level: 'error', message: args.join(' ')}, '*');
                        originalError.apply(console, args);
                    };
                    
                    console.warn = function(...args) {
                        parent.postMessage({type: 'console', level: 'warn', message: args.join(' ')}, '*');
                        originalWarn.apply(console, args);
                    };
                    
                    // Capture errors
                    window.addEventListener('error', function(e) {
                        parent.postMessage({
                            type: 'console', 
                            level: 'error', 
                            message: e.filename + ':' + e.lineno + ' ' + e.message
                        }, '*');
                    });
                    
                    try {
                        ${js}
                    } catch(e) {
                        parent.postMessage({
                            type: 'console', 
                            level: 'error', 
                            message: 'JavaScript Error: ' + e.message
                        }, '*');
                    }
                </script>
            </body>
            </html>
        `;

        this.preview.srcdoc = previewContent;
    }

    setupConsoleCapture() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'console') {
                this.addConsoleMessage(event.data.level, event.data.message);
            }
        });
        
        this.checkChallengeMode();
    }
    
    checkChallengeMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentChallenge = localStorage.getItem('current_challenge');
        
        if (urlParams.get('challenge') && currentChallenge) {
            const challenge = JSON.parse(currentChallenge);
            this.loadChallengeTemplate(challenge);
            localStorage.removeItem('current_challenge');
        }
    }
    
    loadChallengeTemplate(challengeData) {
        const { category, challenge } = challengeData;
        
        const header = document.querySelector('.editor-header h1');
        header.textContent = `CodeQuest Editor - ${challenge.title}`;
        
        const controls = document.querySelector('.editor-controls');
        const submitBtn = document.createElement('button');
        submitBtn.id = 'submitChallenge';
        submitBtn.textContent = `Submit (+${challenge.xp} XP)`;
        submitBtn.style.background = '#28a745';
        controls.insertBefore(submitBtn, controls.firstChild);
        
        submitBtn.addEventListener('click', () => {
            this.submitChallenge(category, challenge);
        });
        
        this.loadChallengeCode(category);
    }
    
    loadChallengeCode(category) {
        const templates = {
            html: { html: '<!-- Write your HTML solution here -->\n', css: '/* Add CSS styles */\n', js: '// Add JavaScript\n' },
            css: { html: '<div class="container">\n  <h1>Style me!</h1>\n</div>', css: '/* Write CSS solution */\n.container {\n\n}', js: '' },
            js: { html: '<div id="output"></div>', css: 'body { font-family: Arial; padding: 20px; }', js: '// Write JavaScript solution\nconsole.log("Start!");' },
            projects: { html: '<!DOCTYPE html>\n<html>\n<head><title>Project</title></head>\n<body>\n</body>\n</html>', css: '/* Project styles */\n', js: '// Project JS\n' }
        };
        
        const template = templates[category];
        if (template) {
            this.editors.html.value = template.html;
            this.editors.css.value = template.css;
            this.editors.js.value = template.js;
            this.updatePreview();
        }
        
        this.currentChallengeData = challengeData;
        this.currentChallengeInfo = { category, challenge };
        this.challengeStartTime = Date.now();
        
        const infoPanel = document.createElement('div');
        infoPanel.className = 'challenge-info';
        infoPanel.innerHTML = `
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
            <ul>${challenge.requirements.map(req => `<li>${req}</li>`).join('')}</ul>
        `;
        infoPanel.style.cssText = 'background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
        document.querySelector('.console').insertBefore(infoPanel, document.querySelector('.console-header'));
    }
    
    submitChallenge(category, challenge) {
        const code = {
            html: this.editors.html.value,
            css: this.editors.css.value,
            js: this.editors.js.value
        };
        
        const challengeKey = `${category}_${challenge.id}`;
        
        // Validate solution
        const isValid = challenge.validation ? challenge.validation(code) : this.basicValidation(code);
        
        if (isValid) {
            // Success
            const resultDiv = document.createElement('div');
            resultDiv.className = 'validation-result validation-success';
            resultDiv.textContent = `🎉 Challenge completed! You earned ${challenge.xp} XP!`;
            document.querySelector('.editor-header').appendChild(resultDiv);
            
            // Mark as completed and award XP
            const dashboardData = JSON.parse(localStorage.getItem('codequest_user') || '{}');
            if (dashboardData.xp !== undefined) {
                dashboardData.xp += challenge.xp;
                dashboardData.level = Math.floor(dashboardData.xp / 100) + 1;
                dashboardData.completedLessons++;
                localStorage.setItem('codequest_user', JSON.stringify(dashboardData));
            }
            
            // Record for gamification
            if (window.gamificationSystem) {
                const timeSpent = this.challengeStartTime ? (Date.now() - this.challengeStartTime) / 1000 : 300;
                const usedHint = challengeHints[challengeKey] || false;
                window.gamificationSystem.recordChallengeCompletion(category, challenge.id, timeSpent, usedHint);
            }
            
            // Show confetti animation
            if (window.advancedFeatures) {
                window.advancedFeatures.showConfetti();
            }
            
            setTimeout(() => {
                window.location.href = 'challenges.html';
            }, 2000);
        } else {
            // Failed attempt
            challengeAttempts[challengeKey] = (challengeAttempts[challengeKey] || 0) + 1;
            
            const resultDiv = document.createElement('div');
            resultDiv.className = 'validation-result validation-error';
            resultDiv.textContent = `❌ Try again! Attempt ${challengeAttempts[challengeKey]}/3. Check the requirements.`;
            
            // Remove previous result
            const existing = document.querySelector('.validation-result');
            if (existing) existing.remove();
            
            document.querySelector('.editor-header').appendChild(resultDiv);
            
            // Show solution after 3 attempts
            if (challengeAttempts[challengeKey] >= 3) {
                setTimeout(() => {
                    resultDiv.innerHTML += '<br><strong>Solution unlocked! Return to challenge to view it.</strong>';
                }, 1000);
            }
        }
    }
    
    basicValidation(code) {
        return code.html.trim().length > 20 || code.css.trim().length > 10 || code.js.trim().length > 10;
    }

    addConsoleMessage(level, message) {
        const logElement = document.createElement('div');
        logElement.className = `console-log console-${level}`;
        logElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        this.consoleOutput.appendChild(logElement);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    clearConsole() {
        this.consoleOutput.innerHTML = '';
    }

    formatCode() {
        const currentEditor = this.editors[this.currentTab];
        let code = currentEditor.value;
        
        switch(this.currentTab) {
            case 'html':
                code = this.formatHTML(code);
                break;
            case 'css':
                code = this.formatCSS(code);
                break;
            case 'js':
                code = this.formatJS(code);
                break;
        }
        
        currentEditor.value = code;
        this.saveCode();
        this.updatePreview();
    }

    formatHTML(html) {
        return html
            .replace(/></g, '>\n<')
            .replace(/^\s+|\s+$/g, '')
            .split('\n')
            .map((line, index, array) => {
                const trimmed = line.trim();
                if (!trimmed) return '';
                
                let indent = 0;
                for (let i = 0; i < index; i++) {
                    const prevLine = array[i].trim();
                    if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
                    if (prevLine.match(/<\/[^>]+>$/)) indent--;
                }
                
                if (trimmed.match(/^<\/[^>]+>$/)) indent--;
                return '    '.repeat(Math.max(0, indent)) + trimmed;
            })
            .join('\n');
    }

    formatCSS(css) {
        return css
            .replace(/\s*{\s*/g, ' {\n    ')
            .replace(/;\s*/g, ';\n    ')
            .replace(/\s*}\s*/g, '\n}\n\n')
            .replace(/,\s*/g, ',\n')
            .trim();
    }

    formatJS(js) {
        return js
            .replace(/\s*{\s*/g, ' {\n    ')
            .replace(/;\s*/g, ';\n    ')
            .replace(/\s*}\s*/g, '\n}\n\n')
            .replace(/,\s*/g, ', ')
            .trim();
    }

    applySyntaxHighlighting(editor, lang) {
        // Basic syntax highlighting would require more complex implementation
        // This is a placeholder for the concept
    }

    resetToTemplate() {
        if (confirm('Are you sure you want to reset to the template? This will lose all your changes.')) {
            this.editors.html.value = this.templates.html;
            this.editors.css.value = this.templates.css;
            this.editors.js.value = this.templates.js;
            this.saveCode();
            this.updatePreview();
            this.clearConsole();
        }
    }
}

// Initialize the code editor
const codeEditor = new CodeEditor();