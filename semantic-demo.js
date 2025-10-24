class SemanticHTMLDemo {
    constructor() {
        this.mockChallenges = [
            {
                id: 1,
                title: "HTML Document Structure",
                description: "Create a proper HTML5 document with semantic elements",
                icon: "🏗️",
                difficulty: "easy",
                xp: 50,
                progress: 100,
                completed: true,
                requirements: [
                    "Use DOCTYPE html declaration",
                    "Include proper head section with meta tags",
                    "Structure content with semantic elements",
                    "Add proper ARIA labels where needed"
                ]
            },
            {
                id: 2,
                title: "Accessible Navigation",
                description: "Build navigation with proper ARIA attributes and keyboard support",
                icon: "🧭",
                difficulty: "medium",
                xp: 75,
                progress: 60,
                completed: false,
                requirements: [
                    "Use nav element with role and aria-label",
                    "Implement proper menu structure",
                    "Add keyboard navigation support",
                    "Include skip links for accessibility"
                ]
            },
            {
                id: 3,
                title: "Form Accessibility",
                description: "Create accessible forms with validation and error handling",
                icon: "📝",
                difficulty: "hard",
                xp: 100,
                progress: 0,
                completed: false,
                requirements: [
                    "Use fieldset and legend elements",
                    "Associate labels with form controls",
                    "Implement ARIA error messaging",
                    "Add proper validation feedback"
                ]
            }
        ];

        this.navigationData = {
            menuItems: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    url: 'index.html',
                    icon: 'fas fa-home'
                },
                {
                    id: 'challenges',
                    label: 'Challenges',
                    url: 'challenges.html',
                    icon: 'fas fa-trophy'
                },
                {
                    id: 'learn',
                    label: 'Learn',
                    icon: 'fas fa-graduation-cap',
                    submenu: [
                        {
                            label: 'Resources',
                            url: 'resources.html',
                            icon: 'fas fa-book'
                        },
                        {
                            label: 'Tutorials',
                            url: 'tutorials.html',
                            icon: 'fas fa-play-circle'
                        }
                    ]
                },
                {
                    id: 'tools',
                    label: 'Tools',
                    icon: 'fas fa-tools',
                    submenu: [
                        {
                            label: 'Code Editor',
                            url: 'editor.html',
                            icon: 'fas fa-code'
                        },
                        {
                            label: 'UI Components',
                            url: 'ui-components.html',
                            icon: 'fas fa-puzzle-piece'
                        }
                    ]
                }
            ],
            userName: 'Demo User',
            userAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateNavigation();
        this.displayCurrentMetadata();
        this.setupSEODemo();
        this.addAnimations();
    }

    setupEventListeners() {
        // Generate challenge cards
        document.getElementById('generateChallenges')?.addEventListener('click', () => {
            this.generateChallengeCards();
        });

        // Show profile form
        document.getElementById('showProfileForm')?.addEventListener('click', () => {
            this.showProfileForm();
        });

        // Update metadata
        document.getElementById('updateMetadata')?.addEventListener('click', () => {
            this.updatePageMetadata();
        });
    }

    generateNavigation() {
        if (window.templateSystem) {
            window.templateSystem.generateNavigation(
                this.navigationData,
                'navigation-container'
            );
        }
    }

    generateChallengeCards() {
        const section = document.querySelector('.challenges-section');
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });

        if (window.templateSystem) {
            window.templateSystem.generateChallengeCards(
                this.mockChallenges,
                'challenge-cards-container'
            );
        }

        // Add animation
        setTimeout(() => {
            const cards = document.querySelectorAll('.challenge-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('slide-up');
                }, index * 100);
            });
        }, 100);

        // Update SEO for challenges
        if (window.seoManager) {
            window.seoManager.updatePageMeta({
                title: 'Interactive HTML Challenges',
                description: 'Practice semantic HTML with interactive coding challenges. Learn proper HTML5 structure and accessibility.',
                keywords: 'HTML challenges, semantic HTML, HTML5, accessibility, web development'
            });
        }
    }

    showProfileForm() {
        const section = document.querySelector('.profile-section');
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });

        if (window.templateSystem) {
            window.templateSystem.generateUserProfileForm('profile-form-container');
        }

        // Add animation
        setTimeout(() => {
            const form = document.querySelector('.user-profile-form');
            if (form) {
                form.classList.add('fade-in');
            }
        }, 100);
    }

    displayCurrentMetadata() {
        const metadataDisplay = document.getElementById('metadata-display');
        if (!metadataDisplay) return;

        const metadata = this.getCurrentPageMetadata();
        
        metadataDisplay.innerHTML = Object.entries(metadata)
            .map(([key, value]) => `
                <div class="metadata-item">
                    <div class="metadata-label">${key}:</div>
                    <div class="metadata-value">${value}</div>
                </div>
            `).join('');
    }

    getCurrentPageMetadata() {
        const metadata = {};
        
        // Basic meta tags
        metadata['Title'] = document.title;
        metadata['Description'] = document.querySelector('meta[name="description"]')?.content || 'Not set';
        metadata['Keywords'] = document.querySelector('meta[name="keywords"]')?.content || 'Not set';
        metadata['Viewport'] = document.querySelector('meta[name="viewport"]')?.content || 'Not set';
        metadata['Charset'] = document.querySelector('meta[charset]')?.getAttribute('charset') || 'Not set';
        
        // Open Graph
        metadata['OG Title'] = document.querySelector('meta[property="og:title"]')?.content || 'Not set';
        metadata['OG Description'] = document.querySelector('meta[property="og:description"]')?.content || 'Not set';
        metadata['OG Image'] = document.querySelector('meta[property="og:image"]')?.content || 'Not set';
        
        // Twitter Card
        metadata['Twitter Card'] = document.querySelector('meta[name="twitter:card"]')?.content || 'Not set';
        metadata['Twitter Title'] = document.querySelector('meta[name="twitter:title"]')?.content || 'Not set';
        
        // Canonical
        metadata['Canonical URL'] = document.querySelector('link[rel="canonical"]')?.href || 'Not set';
        
        // Structured Data
        const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
        metadata['Structured Data Scripts'] = structuredData.length;
        
        return metadata;
    }

    updatePageMetadata() {
        if (window.seoManager) {
            // Update with demo data
            window.seoManager.updatePageMeta({
                title: 'Semantic HTML Demo - Updated',
                description: 'Updated demonstration of semantic HTML5, accessibility features, and SEO optimization techniques.',
                keywords: 'semantic HTML, HTML5, accessibility, SEO, web standards, ARIA, structured data',
                breadcrumbs: [
                    { name: 'Home', url: window.location.origin },
                    { name: 'Demos', url: `${window.location.origin}/demos` },
                    { name: 'Semantic HTML', url: window.location.href }
                ],
                course: {
                    name: 'Semantic HTML Mastery',
                    description: 'Learn proper HTML structure and accessibility',
                    level: 'Intermediate',
                    duration: 'PT2H',
                    rating: 4.8,
                    ratingCount: 150
                }
            });

            // Refresh metadata display
            setTimeout(() => {
                this.displayCurrentMetadata();
                this.showUpdateNotification();
            }, 500);
        }
    }

    showUpdateNotification() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>Page metadata updated successfully!</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-success);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-toast);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    setupSEODemo() {
        // Demonstrate structured data
        this.addDemoStructuredData();
        
        // Setup performance hints
        this.setupPerformanceHints();
        
        // Add breadcrumb navigation
        this.addBreadcrumbNavigation();
    }

    addDemoStructuredData() {
        const demoData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Semantic HTML Demo",
            "description": "Interactive demonstration of semantic HTML5 elements and accessibility features",
            "url": window.location.href,
            "mainEntity": {
                "@type": "LearningResource",
                "name": "Semantic HTML Tutorial",
                "description": "Learn proper HTML structure and accessibility",
                "educationalLevel": "Intermediate",
                "learningResourceType": "Interactive Tutorial",
                "teaches": [
                    "Semantic HTML5 elements",
                    "ARIA attributes",
                    "Form accessibility",
                    "SEO optimization"
                ]
            },
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": window.location.origin
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Semantic HTML Demo",
                        "item": window.location.href
                    }
                ]
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(demoData);
        document.head.appendChild(script);
    }

    setupPerformanceHints() {
        // Add resource hints for better performance
        const hints = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
            { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            document.head.appendChild(link);
        });
    }

    addBreadcrumbNavigation() {
        // Add visual breadcrumb navigation
        const breadcrumb = document.createElement('nav');
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        breadcrumb.className = 'breadcrumb-nav';
        breadcrumb.innerHTML = `
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="index.html" class="breadcrumb-link">Home</a>
                </li>
                <li class="breadcrumb-item">
                    <span class="breadcrumb-separator" aria-hidden="true">/</span>
                    <span class="breadcrumb-current" aria-current="page">Semantic HTML Demo</span>
                </li>
            </ol>
        `;

        // Insert after header
        const header = document.querySelector('.site-header');
        if (header) {
            header.insertAdjacentElement('afterend', breadcrumb);
        }

        // Add breadcrumb styles
        const breadcrumbStyles = `
            .breadcrumb-nav {
                background: var(--bg-tertiary);
                padding: var(--space-3) var(--space-6);
                border-bottom: 1px solid var(--border-light);
            }
            .breadcrumb-list {
                display: flex;
                align-items: center;
                list-style: none;
                margin: 0;
                padding: 0;
                max-width: 1200px;
                margin: 0 auto;
            }
            .breadcrumb-item {
                display: flex;
                align-items: center;
            }
            .breadcrumb-link {
                color: var(--primary-500);
                text-decoration: none;
                font-size: var(--font-size-sm);
            }
            .breadcrumb-link:hover {
                text-decoration: underline;
            }
            .breadcrumb-separator {
                margin: 0 var(--space-2);
                color: var(--text-muted);
            }
            .breadcrumb-current {
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            }
        `;

        const style = document.createElement('style');
        style.textContent = breadcrumbStyles;
        document.head.appendChild(style);
    }

    addAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('.examples-section, .seo-section').forEach(section => {
            observer.observe(section);
        });
    }

    // Accessibility helpers
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

    // Form validation demo
    validateDemoForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.setAttribute('aria-invalid', 'true');
                this.showFieldError(input, 'This field is required');
            } else {
                input.setAttribute('aria-invalid', 'false');
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        const errorId = input.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'form-error';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.setAttribute('aria-describedby', errorId);
    }

    clearFieldError(input) {
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.remove();
        }
        input.removeAttribute('aria-describedby');
    }
}

// Initialize the demo
document.addEventListener('DOMContentLoaded', () => {
    const demo = new SemanticHTMLDemo();
    
    // Expose for debugging
    window.semanticDemo = demo;
});

// Add slide animations CSS
const animationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }
`;

const style = document.createElement('style');
style.textContent = animationStyles;
document.head.appendChild(style);