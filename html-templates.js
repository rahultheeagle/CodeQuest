class HTMLTemplateSystem {
    constructor() {
        this.templates = new Map();
        this.init();
    }

    init() {
        this.registerTemplates();
    }

    // Template Registration
    registerTemplates() {
        // Challenge Card Template
        this.templates.set('challengeCard', {
            template: `
                <article class="challenge-card" data-challenge-id="{{id}}" role="article" aria-labelledby="challenge-{{id}}-title">
                    <header class="challenge-header">
                        <div class="challenge-icon" aria-hidden="true">{{icon}}</div>
                        <div class="challenge-meta">
                            <h3 id="challenge-{{id}}-title" class="challenge-title">{{title}}</h3>
                            <p class="challenge-description">{{description}}</p>
                        </div>
                        <div class="challenge-badges">
                            <span class="badge badge-{{difficulty}}" aria-label="Difficulty: {{difficulty}}">{{difficulty}}</span>
                            <span class="badge badge-primary" aria-label="Experience points: {{xp}}">+{{xp}} XP</span>
                        </div>
                    </header>
                    <div class="challenge-content">
                        <div class="challenge-progress" role="progressbar" aria-valuenow="{{progress}}" aria-valuemin="0" aria-valuemax="100" aria-label="Challenge progress">
                            <div class="progress-bar" style="width: {{progress}}%"></div>
                            <span class="sr-only">{{progress}}% complete</span>
                        </div>
                        <div class="challenge-requirements">
                            <h4 class="sr-only">Requirements:</h4>
                            <ul class="requirements-list" role="list">
                                {{#each requirements}}
                                <li role="listitem">{{this}}</li>
                                {{/each}}
                            </ul>
                        </div>
                    </div>
                    <footer class="challenge-actions">
                        <button class="btn btn-primary challenge-start" 
                                data-challenge="{{id}}" 
                                aria-describedby="challenge-{{id}}-title"
                                {{#if completed}}disabled{{/if}}>
                            {{#if completed}}
                                <i class="fas fa-check" aria-hidden="true"></i> Completed
                            {{else}}
                                <i class="fas fa-play" aria-hidden="true"></i> Start Challenge
                            {{/if}}
                        </button>
                        {{#if completed}}
                        <button class="btn btn-secondary challenge-review" data-challenge="{{id}}">
                            <i class="fas fa-eye" aria-hidden="true"></i> Review
                        </button>
                        {{/if}}
                    </footer>
                </article>
            `,
            styles: `
                .challenge-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                    transition: all var(--transition-base);
                    box-shadow: var(--shadow-sm);
                }
                .challenge-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
                .challenge-header {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-4);
                    margin-bottom: var(--space-4);
                }
                .challenge-icon {
                    font-size: var(--font-size-3xl);
                    flex-shrink: 0;
                }
                .challenge-meta {
                    flex: 1;
                }
                .challenge-title {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-2);
                    color: var(--text-primary);
                }
                .challenge-description {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }
                .challenge-badges {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }
                .challenge-progress {
                    margin-bottom: var(--space-4);
                }
                .requirements-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .requirements-list li {
                    padding: var(--space-1) 0;
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }
                .requirements-list li::before {
                    content: "✓";
                    color: var(--accent-success);
                    margin-right: var(--space-2);
                }
                .challenge-actions {
                    display: flex;
                    gap: var(--space-3);
                    margin-top: var(--space-4);
                }
            `
        });

        // User Profile Form Template
        this.templates.set('userProfileForm', {
            template: `
                <form class="user-profile-form" id="userProfileForm" novalidate aria-labelledby="profile-form-title">
                    <header class="form-header">
                        <h2 id="profile-form-title" class="form-title">User Profile Setup</h2>
                        <p class="form-description">Complete your profile to get started with CodeQuest</p>
                    </header>
                    
                    <fieldset class="form-section" aria-labelledby="basic-info-legend">
                        <legend id="basic-info-legend" class="form-legend">Basic Information</legend>
                        
                        <div class="form-group">
                            <label for="username" class="form-label">
                                Username <span class="required" aria-label="required">*</span>
                            </label>
                            <input type="text" 
                                   id="username" 
                                   name="username" 
                                   class="input" 
                                   required 
                                   minlength="3" 
                                   maxlength="20"
                                   pattern="[a-zA-Z0-9_]+"
                                   aria-describedby="username-help username-error"
                                   autocomplete="username">
                            <small id="username-help" class="form-help">3-20 characters, letters, numbers, and underscores only</small>
                            <div id="username-error" class="form-error" role="alert" aria-live="polite"></div>
                        </div>

                        <div class="form-group">
                            <label for="email" class="form-label">
                                Email Address <span class="required" aria-label="required">*</span>
                            </label>
                            <input type="email" 
                                   id="email" 
                                   name="email" 
                                   class="input" 
                                   required
                                   aria-describedby="email-help email-error"
                                   autocomplete="email">
                            <small id="email-help" class="form-help">We'll use this for progress updates</small>
                            <div id="email-error" class="form-error" role="alert" aria-live="polite"></div>
                        </div>

                        <div class="form-group">
                            <label for="experience" class="form-label">Programming Experience</label>
                            <select id="experience" name="experience" class="input" aria-describedby="experience-help">
                                <option value="">Select your level</option>
                                <option value="beginner">Beginner - New to programming</option>
                                <option value="intermediate">Intermediate - Some experience</option>
                                <option value="advanced">Advanced - Experienced developer</option>
                            </select>
                            <small id="experience-help" class="form-help">This helps us customize your learning path</small>
                        </div>
                    </fieldset>

                    <fieldset class="form-section" aria-labelledby="preferences-legend">
                        <legend id="preferences-legend" class="form-legend">Learning Preferences</legend>
                        
                        <div class="form-group">
                            <fieldset class="checkbox-group" aria-labelledby="interests-legend">
                                <legend id="interests-legend" class="checkbox-legend">Areas of Interest</legend>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="interests" value="html" class="checkbox">
                                    <span class="checkmark"></span>
                                    HTML & Semantic Markup
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="interests" value="css" class="checkbox">
                                    <span class="checkmark"></span>
                                    CSS & Styling
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="interests" value="javascript" class="checkbox">
                                    <span class="checkmark"></span>
                                    JavaScript & Interactivity
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="interests" value="responsive" class="checkbox">
                                    <span class="checkmark"></span>
                                    Responsive Design
                                </label>
                            </fieldset>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="notifications" value="true" class="checkbox" checked>
                                <span class="checkmark"></span>
                                Send me progress updates and tips
                            </label>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="terms" value="true" class="checkbox" required aria-describedby="terms-error">
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="form-link">Terms of Service</a> and <a href="#" class="form-link">Privacy Policy</a> <span class="required" aria-label="required">*</span>
                            </label>
                            <div id="terms-error" class="form-error" role="alert" aria-live="polite"></div>
                        </div>
                    </fieldset>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-user-plus" aria-hidden="true"></i>
                            Create Profile
                        </button>
                        <button type="button" class="btn btn-secondary" id="resetForm">
                            <i class="fas fa-undo" aria-hidden="true"></i>
                            Reset Form
                        </button>
                    </div>
                </form>
            `,
            styles: `
                .user-profile-form {
                    max-width: 600px;
                    margin: 0 auto;
                    background: var(--bg-secondary);
                    padding: var(--space-8);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-lg);
                }
                .form-header {
                    text-align: center;
                    margin-bottom: var(--space-8);
                }
                .form-title {
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                }
                .form-description {
                    color: var(--text-secondary);
                }
                .form-section {
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                    margin-bottom: var(--space-6);
                }
                .form-legend {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    padding: 0 var(--space-3);
                }
                .checkbox-group {
                    border: none;
                    padding: 0;
                }
                .checkbox-legend {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-medium);
                    margin-bottom: var(--space-3);
                }
                .required {
                    color: var(--accent-error);
                }
                .form-link {
                    color: var(--primary-500);
                    text-decoration: underline;
                }
                .form-link:hover {
                    color: var(--primary-600);
                }
            `
        });

        // Navigation Menu Template
        this.templates.set('navigationMenu', {
            template: `
                <nav class="main-navigation" role="navigation" aria-label="Main navigation">
                    <div class="nav-container">
                        <div class="nav-brand">
                            <a href="/" class="brand-link" aria-label="CodeQuest Home">
                                <i class="fas fa-code" aria-hidden="true"></i>
                                <span class="brand-text">CodeQuest</span>
                            </a>
                        </div>
                        
                        <button class="nav-toggle" 
                                aria-expanded="false" 
                                aria-controls="nav-menu"
                                aria-label="Toggle navigation menu">
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                        </button>

                        <div class="nav-menu" id="nav-menu" role="menubar">
                            {{#each menuItems}}
                            <div class="nav-item" role="none">
                                {{#if submenu}}
                                <button class="nav-link nav-dropdown-toggle" 
                                        role="menuitem" 
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        aria-controls="submenu-{{id}}">
                                    <i class="{{icon}}" aria-hidden="true"></i>
                                    {{label}}
                                    <i class="fas fa-chevron-down nav-arrow" aria-hidden="true"></i>
                                </button>
                                <div class="nav-submenu" id="submenu-{{id}}" role="menu" aria-labelledby="nav-{{id}}">
                                    {{#each submenu}}
                                    <a href="{{url}}" class="nav-sublink" role="menuitem">
                                        <i class="{{icon}}" aria-hidden="true"></i>
                                        {{label}}
                                    </a>
                                    {{/each}}
                                </div>
                                {{else}}
                                <a href="{{url}}" class="nav-link" role="menuitem">
                                    <i class="{{icon}}" aria-hidden="true"></i>
                                    {{label}}
                                </a>
                                {{/if}}
                            </div>
                            {{/each}}
                        </div>

                        <div class="nav-actions">
                            <button class="btn btn-icon theme-toggle" aria-label="Toggle dark mode">
                                <i class="fas fa-moon" aria-hidden="true"></i>
                            </button>
                            <div class="user-menu">
                                <button class="user-avatar" aria-expanded="false" aria-haspopup="true">
                                    <img src="{{userAvatar}}" alt="{{userName}}" class="avatar-img">
                                    <span class="user-name">{{userName}}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            `,
            styles: `
                .main-navigation {
                    background: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-light);
                    box-shadow: var(--shadow-sm);
                    position: sticky;
                    top: 0;
                    z-index: var(--z-sticky);
                }
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-4) var(--space-6);
                }
                .nav-brand {
                    display: flex;
                    align-items: center;
                }
                .brand-link {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    text-decoration: none;
                    color: var(--primary-500);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                }
                .nav-toggle {
                    display: none;
                    flex-direction: column;
                    gap: 4px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: var(--space-2);
                }
                .hamburger-line {
                    width: 24px;
                    height: 2px;
                    background: var(--text-primary);
                    transition: all var(--transition-fast);
                }
                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: var(--space-6);
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    color: var(--text-secondary);
                    text-decoration: none;
                    border-radius: var(--radius-base);
                    transition: all var(--transition-fast);
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: var(--font-size-base);
                }
                .nav-link:hover, .nav-link:focus {
                    color: var(--text-primary);
                    background: var(--bg-tertiary);
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                }
                .user-avatar {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: var(--space-2);
                    border-radius: var(--radius-base);
                }
                .avatar-img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }
                @media (max-width: 768px) {
                    .nav-toggle { display: flex; }
                    .nav-menu { 
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--bg-secondary);
                        flex-direction: column;
                        padding: var(--space-4);
                        box-shadow: var(--shadow-md);
                    }
                    .nav-menu.open { display: flex; }
                }
            `
        });
    }

    // Template Rendering with Handlebars-like syntax
    render(templateName, data = {}) {
        const template = this.templates.get(templateName);
        if (!template) {
            console.error(`Template "${templateName}" not found`);
            return '';
        }

        let html = template.template;

        // Simple template replacement
        html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });

        // Handle conditionals {{#if condition}}
        html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
            return data[condition] ? content : '';
        });

        // Handle each loops {{#each array}}
        html = html.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, itemTemplate) => {
            const array = data[arrayName];
            if (!Array.isArray(array)) return '';
            
            return array.map(item => {
                let itemHtml = itemTemplate;
                // Replace {{this}} with item value
                itemHtml = itemHtml.replace(/\{\{this\}\}/g, item);
                // Replace object properties
                if (typeof item === 'object') {
                    Object.keys(item).forEach(key => {
                        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                        itemHtml = itemHtml.replace(regex, item[key] || '');
                    });
                }
                return itemHtml;
            }).join('');
        });

        return html;
    }

    // Inject template styles
    injectStyles(templateName) {
        const template = this.templates.get(templateName);
        if (!template || !template.styles) return;

        const styleId = `template-styles-${templateName}`;
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = template.styles;
        document.head.appendChild(style);
    }

    // Generate challenge cards dynamically
    generateChallengeCards(challenges, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.injectStyles('challengeCard');
        
        container.innerHTML = challenges.map(challenge => 
            this.render('challengeCard', challenge)
        ).join('');

        // Add event listeners
        container.querySelectorAll('.challenge-start').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = e.target.dataset.challenge;
                this.handleChallengeStart(challengeId);
            });
        });
    }

    // Generate user profile form
    generateUserProfileForm(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.injectStyles('userProfileForm');
        container.innerHTML = this.render('userProfileForm');

        // Setup form validation
        this.setupFormValidation('userProfileForm');
    }

    // Generate navigation menu
    generateNavigation(menuData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.injectStyles('navigationMenu');
        container.innerHTML = this.render('navigationMenu', menuData);

        // Setup navigation interactions
        this.setupNavigationInteractions();
    }

    // Form validation setup
    setupFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm(form);
        });

        // Reset button
        const resetBtn = form.querySelector('#resetForm');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                form.reset();
                this.clearFormErrors(form);
            });
        }
    }

    validateField(input) {
        const errorElement = document.getElementById(input.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error')));
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Pattern validation
        if (input.hasAttribute('pattern') && input.value) {
            const pattern = new RegExp(input.getAttribute('pattern'));
            if (!pattern.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid format';
            }
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Length validation
        if (input.hasAttribute('minlength') && input.value.length < parseInt(input.getAttribute('minlength'))) {
            isValid = false;
            errorMessage = `Minimum ${input.getAttribute('minlength')} characters required`;
        }

        // Update UI
        if (isValid) {
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
            if (errorElement) errorElement.textContent = '';
        } else {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            if (errorElement) errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.handleFormSubmit(form);
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
        }
    }

    clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
        });
        form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.name === 'interests') {
                if (!data.interests) data.interests = [];
                if (checkbox.checked) {
                    data.interests = Array.isArray(data.interests) ? data.interests : [data.interests];
                    data.interests.push(checkbox.value);
                }
            }
        });

        console.log('Form submitted:', data);
        alert('Profile created successfully!');
    }

    handleChallengeStart(challengeId) {
        console.log('Starting challenge:', challengeId);
        // Integrate with existing challenge system
        if (window.challengeSystem) {
            // Navigate to challenge
        }
    }

    setupNavigationInteractions() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('open');
                navMenu.classList.toggle('open');
                navToggle.setAttribute('aria-expanded', !isOpen);
            });
        }
    }
}

// Initialize template system
const templateSystem = new HTMLTemplateSystem();

// Expose for global use
window.templateSystem = templateSystem;