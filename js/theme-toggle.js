// Theme Toggle System
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.setupEventListeners();
    }

    createToggleButton() {
        const toggle = document.createElement('button');
        toggle.id = 'themeToggle';
        toggle.className = 'theme-toggle';
        toggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        toggle.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
        
        // Add to header if it exists
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(toggle);
        } else {
            document.body.appendChild(toggle);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'themeToggle') {
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            toggle.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--primary', '#4a5568');
            document.documentElement.style.setProperty('--secondary', '#2d3748');
            document.documentElement.style.setProperty('--light', '#1a202c');
            document.documentElement.style.setProperty('--dark', '#f7fafc');
            document.documentElement.style.setProperty('--border', '#4a5568');
            document.documentElement.style.setProperty('--shadow', '0 2px 4px rgba(0,0,0,0.3)');
            document.body.style.background = 'linear-gradient(135deg, #2d3748, #4a5568)';
        } else {
            document.documentElement.style.setProperty('--primary', '#667eea');
            document.documentElement.style.setProperty('--secondary', '#764ba2');
            document.documentElement.style.setProperty('--light', '#f8f9fa');
            document.documentElement.style.setProperty('--dark', '#343a40');
            document.documentElement.style.setProperty('--border', '#dee2e6');
            document.documentElement.style.setProperty('--shadow', '0 2px 4px rgba(0,0,0,0.1)');
            document.body.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
    }
}

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});