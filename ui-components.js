class UIComponentsManager {
    constructor() {
        this.theme = localStorage.getItem('ui-theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupCollapsibles();
        this.setupKeyboardNavigation();
        this.setupFormValidation();
        this.setupToasts();
        this.setupAccessibility();
        this.applyTheme(this.theme);
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('ui-theme', this.theme);
        this.showToast(`Switched to ${this.theme} theme`, 'success');
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isOpen = navList.classList.contains('open');
                navList.classList.toggle('open');
                menuToggle.setAttribute('aria-expanded', !isOpen);
                
                // Update icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                    navList.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navList.classList.contains('open')) {
                    navList.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                }
            });
        }
    }

    // Collapsible Panels
    setupCollapsibles() {
        const collapsibles = document.querySelectorAll('[data-collapsible]');
        
        collapsibles.forEach(collapsible => {
            const header = collapsible.querySelector('.collapsible-header');
            const content = collapsible.querySelector('.collapsible-content');
            
            if (header && content) {
                header.addEventListener('click', () => {
                    this.toggleCollapsible(collapsible, header, content);
                });

                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleCollapsible(collapsible, header, content);
                    }
                });
            }
        });
    }

    toggleCollapsible(collapsible, header, content) {
        const isOpen = collapsible.classList.contains('open');
        
        collapsible.classList.toggle('open');
        header.setAttribute('aria-expanded', !isOpen);
        
        if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = '0';
        }

        // Announce to screen readers
        this.announceToScreenReader(
            isOpen ? 'Panel collapsed' : 'Panel expanded'
        );
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            // Skip links navigation
            if (e.key === 'Tab' && !e.shiftKey) {
                const skipLinks = document.querySelectorAll('.skip-link');
                if (skipLinks.length > 0 && document.activeElement === document.body) {
                    e.preventDefault();
                    skipLinks[0].focus();
                }
            }

            // Modal escape handling
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
                if (openModals.length > 0) {
                    this.closeModal(openModals[openModals.length - 1]);
                }
            }
        });

        // Focus trap for modals
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        });
    }

    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('input-error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.showToast('Form submitted successfully!', 'success');
        } else {
            this.showToast('Please fix the errors in the form', 'error');
            // Focus first invalid field
            const firstError = form.querySelector('.input-error');
            if (firstError) {
                firstError.focus();
            }
        }
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update UI
        if (isValid) {
            input.classList.remove('input-error');
            this.removeFieldError(input);
        } else {
            input.classList.add('input-error');
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    showFieldError(input, message) {
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.textContent = message;
        } else {
            const errorElement = document.createElement('small');
            errorElement.className = 'form-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
    }

    removeFieldError(input) {
        const errorElement = input.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Toast Notifications
    setupToasts() {
        // Demo toast on page load
        setTimeout(() => {
            this.showToast('Welcome to the CodeQuest UI System!', 'success');
        }, 1000);
    }

    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, duration);

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Announce dynamic content changes
        this.setupLiveRegions();
        
        // Enhanced focus indicators
        this.setupFocusIndicators();
        
        // Skip links functionality
        this.setupSkipLinks();
        
        // Progress bar announcements
        this.setupProgressAnnouncements();
    }

    setupLiveRegions() {
        // Create live region for announcements
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupFocusIndicators() {
        // Enhanced focus for interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }

    setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.announceToScreenReader(`Skipped to ${target.textContent || targetId}`);
                }
            });
        });
    }

    setupProgressAnnouncements() {
        const progressBars = document.querySelectorAll('[role="progressbar"]');
        
        progressBars.forEach(progressBar => {
            const observer = new MutationObserver(() => {
                const value = progressBar.getAttribute('aria-valuenow');
                const max = progressBar.getAttribute('aria-valuemax');
                if (value && max) {
                    const percentage = Math.round((value / max) * 100);
                    this.announceToScreenReader(`Progress: ${percentage}%`);
                }
            });

            observer.observe(progressBar, {
                attributes: true,
                attributeFilter: ['aria-valuenow']
            });
        });
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('fade-in');
            
            // Focus first focusable element
            const focusableElement = modal.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElement) {
                focusableElement.focus();
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            this.announceToScreenReader('Modal opened');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('fade-in');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            this.announceToScreenReader('Modal closed');
        }
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

    // Animation utilities
    animateElement(element, animation, duration = 300) {
        element.style.animation = `${animation} ${duration}ms ease`;
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    }

    // Responsive utilities
    isMobile() {
        return window.innerWidth <= 768;
    }

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }
}

// Initialize UI Components Manager
const uiManager = new UIComponentsManager();

// Expose for external use
window.uiManager = uiManager;

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .focused {
        outline: 2px solid var(--primary-500) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);