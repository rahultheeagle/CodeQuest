class CSSArchitectureDemo {
    constructor() {
        this.currentTheme = 'light';
        this.sidebarVisible = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimationDemos();
        this.setupResponsiveDemo();
        this.initializeTheme();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Layout toggle
        document.getElementById('layoutToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Button demos
        document.getElementById('successBtn')?.addEventListener('click', (e) => {
            this.triggerSuccessAnimation(e.target);
        });

        document.getElementById('errorBtn')?.addEventListener('click', (e) => {
            this.triggerErrorAnimation(e.target);
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Intersection Observer for animations
        this.setupScrollAnimations();
    }

    // Theme Management
    toggleTheme() {
        const themes = ['light', 'dark', 'high-contrast'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 
                           theme === 'high-contrast' ? 'fas fa-adjust' : 'fas fa-moon';
        }

        // Store preference
        localStorage.setItem('css-demo-theme', theme);
        
        // Announce theme change
        this.showNotification(`Switched to ${theme} theme`, 'success');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('css-demo-theme') || 'light';
        this.setTheme(savedTheme);
    }

    // Layout Management
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appLayout = document.getElementById('appLayout');
        
        this.sidebarVisible = !this.sidebarVisible;
        
        if (this.sidebarVisible) {
            sidebar.classList.remove('hidden');
            appLayout.classList.remove('app-layout-no-sidebar');
        } else {
            sidebar.classList.add('hidden');
            appLayout.classList.add('app-layout-no-sidebar');
        }

        // Update button icon
        const layoutToggle = document.getElementById('layoutToggle');
        const icon = layoutToggle?.querySelector('i');
        if (icon) {
            icon.className = this.sidebarVisible ? 'fas fa-bars' : 'fas fa-times';
        }
    }

    // Animation Demos
    setupAnimationDemos() {
        // Auto-trigger some animations on load
        setTimeout(() => {
            this.triggerSuccessAnimation(document.getElementById('successCard'));
        }, 1000);

        setTimeout(() => {
            this.triggerErrorAnimation(document.getElementById('errorCard'));
        }, 2000);
    }

    triggerAnimation(animationType) {
        const target = document.getElementById('animationTarget');
        if (!target) return;

        // Remove existing animation classes
        target.className = target.className.replace(/animate-\w+/g, '');
        
        // Add new animation class
        target.classList.add(`animate-${animationType}`);
        
        // Remove animation class after completion
        setTimeout(() => {
            target.classList.remove(`animate-${animationType}`);
        }, 1000);
    }

    triggerSuccessAnimation(element) {
        if (!element) return;
        
        element.classList.add('animate-success');
        setTimeout(() => {
            element.classList.remove('animate-success');
        }, 600);
    }

    triggerErrorAnimation(element) {
        if (!element) return;
        
        element.classList.add('animate-error');
        setTimeout(() => {
            element.classList.remove('animate-error');
        }, 600);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all cards for scroll animations
        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }

    // Responsive Demo
    setupResponsiveDemo() {
        // Add resize listener to demonstrate responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            this.updateResponsiveInfo();
        }, 250));

        this.updateResponsiveInfo();
    }

    updateResponsiveInfo() {
        const width = window.innerWidth;
        let breakpoint = 'xs';
        
        if (width >= 1280) breakpoint = 'xl';
        else if (width >= 1024) breakpoint = 'lg';
        else if (width >= 768) breakpoint = 'md';
        else if (width >= 640) breakpoint = 'sm';
        
        // Update any responsive indicators
        console.log(`Current breakpoint: ${breakpoint} (${width}px)`);
    }

    // CSS Variable Manipulation Demo
    demonstrateCSSVariables() {
        const root = document.documentElement;
        
        // Temporarily change some CSS variables
        root.style.setProperty('--primary-500', '#ff6b6b');
        root.style.setProperty('--grid-gap', '2rem');
        
        setTimeout(() => {
            // Reset to original values
            root.style.removeProperty('--primary-500');
            root.style.removeProperty('--grid-gap');
        }, 3000);
        
        this.showNotification('CSS Variables updated temporarily', 'info');
    }

    // Grid Layout Demos
    demonstrateGridLayouts() {
        const gridContainer = document.querySelector('.grid-auto-fit');
        if (!gridContainer) return;

        // Add more items dynamically
        for (let i = 4; i <= 6; i++) {
            const newCard = document.createElement('div');
            newCard.className = 'card card--interactive animate-scale-in';
            newCard.innerHTML = `
                <div class="card__body text-center">
                    <i class="fas fa-plus text-2xl text-primary mb-2"></i>
                    <h4 class="font-semibold">Dynamic ${i}</h4>
                    <p class="text-sm text-secondary">Added via JavaScript</p>
                </div>
            `;
            gridContainer.appendChild(newCard);
        }

        setTimeout(() => {
            // Remove the added items
            const dynamicCards = gridContainer.querySelectorAll('.card:nth-child(n+4)');
            dynamicCards.forEach(card => {
                card.classList.add('animate-fade-out');
                setTimeout(() => card.remove(), 300);
            });
        }, 5000);
    }

    // Component State Management
    toggleComponentState(element, state) {
        element.classList.remove('loading', 'success', 'error');
        if (state) {
            element.classList.add(state);
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type} animate-slide-in-right`;
        notification.innerHTML = `
            <div class="flex items-center gap-3 p-4 bg-secondary border rounded-lg shadow-lg">
                <i class="fas fa-${this.getNotificationIcon(type)} text-${type}"></i>
                <span>${message}</span>
                <button class="ml-auto text-secondary hover:text-primary" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Position notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('animate-slide-out-right');
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Performance Monitoring
    measurePerformance() {
        const start = performance.now();
        
        // Simulate some CSS operations
        document.querySelectorAll('.card').forEach(card => {
            card.style.transform = 'translateY(-2px)';
        });
        
        requestAnimationFrame(() => {
            document.querySelectorAll('.card').forEach(card => {
                card.style.transform = '';
            });
            
            const end = performance.now();
            console.log(`CSS operations took ${end - start} milliseconds`);
        });
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // CSS Class Utilities
    addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }

    removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }

    toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }

    // Media Query Helpers
    isMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    isTablet() {
        return window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
    }

    isDesktop() {
        return window.matchMedia('(min-width: 1024px)').matches;
    }

    // Accessibility Helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// Global functions for demo buttons
function triggerAnimation(type) {
    window.cssDemo.triggerAnimation(type);
}

function setTheme(theme) {
    window.cssDemo.setTheme(theme);
}

// Initialize demo
document.addEventListener('DOMContentLoaded', () => {
    window.cssDemo = new CSSArchitectureDemo();
});

// Add additional animation styles
const additionalStyles = `
    .animate-fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    .animate-slide-out-right {
        animation: slideOutRight 0.3s ease-out forwards;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification {
        pointer-events: auto;
    }
    
    .text-success { color: var(--accent-success); }
    .text-error { color: var(--accent-error); }
    .text-warning { color: var(--accent-warning); }
    .text-info { color: var(--accent-info); }
`;

const style = document.createElement('style');
style.textContent = additionalStyles;
document.head.appendChild(style);