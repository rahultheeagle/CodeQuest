// ES6+ Features & Modern JavaScript Architecture

// 1. ES6+ FEATURES
class ModernJS {
  // Arrow functions & destructuring
  static processUserData = ({ name, email, preferences = {} }) => {
    const { theme = 'light', language = 'en' } = preferences;
    return { name, email, theme, language };
  };

  // Template literals & spread operator
  static formatMessage = (user, ...messages) => 
    `Hello ${user.name}! ${messages.join(' ')}`;

  // Async/await with error handling
  static async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch failed:', error.message);
      throw error;
    }
  }
}

// 2. OBJECT-ORIENTED CLASSES
class User {
  #privateData = new Map(); // Private fields

  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    this.#privateData.set('id', Math.random().toString(36).substr(2, 9));
  }

  // Getters/setters
  get id() { return this.#privateData.get('id'); }
  get profile() { return { name: this.name, email: this.email, id: this.id }; }

  // Methods
  updateProfile({ name, email }) {
    if (name) this.name = name;
    if (email) this.email = email;
    this.emit('profileUpdated', this.profile);
  }

  // Event emitter pattern
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(`user:${event}`, { detail: data }));
  }
}

class Challenge {
  static difficulties = ['easy', 'medium', 'hard'];
  static categories = ['html', 'css', 'javascript'];

  constructor(title, category, difficulty, code = '') {
    this.id = Date.now().toString();
    this.title = title;
    this.category = category;
    this.difficulty = difficulty;
    this.code = code;
    this.completed = false;
    this.attempts = 0;
  }

  validate(userCode) {
    this.attempts++;
    // Simulated validation logic
    const isValid = userCode.trim().length > 10;
    if (isValid) {
      this.completed = true;
      this.completedAt = new Date();
    }
    return { valid: isValid, message: isValid ? 'Success!' : 'Code too short' };
  }

  static fromJSON(data) {
    return Object.assign(new Challenge(), data);
  }
}

class Achievement {
  constructor(name, description, condition, points = 10) {
    this.id = name.toLowerCase().replace(/\s+/g, '-');
    this.name = name;
    this.description = description;
    this.condition = condition;
    this.points = points;
    this.unlocked = false;
    this.unlockedAt = null;
  }

  check(userData) {
    if (this.unlocked) return false;
    
    const unlocked = this.condition(userData);
    if (unlocked) {
      this.unlocked = true;
      this.unlockedAt = new Date();
      return true;
    }
    return false;
  }
}

// 3. EVENT HANDLING SYSTEM
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Click delegation
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Input handling with debouncing
    document.addEventListener('input', this.debounce(this.handleInput.bind(this), 300));
    
    // Form submission
    document.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Storage events
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Custom events
    document.addEventListener('user:profileUpdated', this.handleUserUpdate.bind(this));
  }

  handleClick(e) {
    const { target } = e;
    const action = target.dataset.action;
    
    if (action) {
      e.preventDefault();
      this.emit('action', { type: action, target, event: e });
    }
  }

  handleInput(e) {
    const { target } = e;
    if (target.matches('[data-validate]')) {
      this.validateField(target);
    }
  }

  handleSubmit(e) {
    const form = e.target;
    if (form.matches('[data-ajax]')) {
      e.preventDefault();
      this.submitForm(form);
    }
  }

  handleStorageChange(e) {
    this.emit('storageChanged', { key: e.key, oldValue: e.oldValue, newValue: e.newValue });
  }

  handleUserUpdate(e) {
    console.log('User profile updated:', e.detail);
  }

  // Utility methods
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

  validateField(field) {
    const rules = field.dataset.validate.split('|');
    const errors = [];

    rules.forEach(rule => {
      const [type, param] = rule.split(':');
      if (!this.validators[type]?.(field.value, param)) {
        errors.push(this.getErrorMessage(type, param));
      }
    });

    this.showFieldErrors(field, errors);
  }

  validators = {
    required: value => value.trim().length > 0,
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    min: (value, length) => value.length >= parseInt(length),
    max: (value, length) => value.length <= parseInt(length)
  };

  getErrorMessage(type, param) {
    const messages = {
      required: 'This field is required',
      email: 'Please enter a valid email',
      min: `Minimum ${param} characters required`,
      max: `Maximum ${param} characters allowed`
    };
    return messages[type] || 'Invalid input';
  }

  showFieldErrors(field, errors) {
    const errorContainer = field.parentNode.querySelector('.field-errors') || 
      this.createErrorContainer(field);
    
    errorContainer.innerHTML = errors.map(error => 
      `<span class="error">${error}</span>`
    ).join('');
    
    field.classList.toggle('invalid', errors.length > 0);
  }

  createErrorContainer(field) {
    const container = document.createElement('div');
    container.className = 'field-errors';
    field.parentNode.appendChild(container);
    return container;
  }

  async submitForm(form) {
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Simulated API call
      const response = await this.simulateAPI(data);
      this.emit('formSubmitted', { success: true, data: response });
      
    } catch (error) {
      this.emit('formSubmitted', { success: false, error: error.message });
    }
  }

  async simulateAPI(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({ id: Date.now(), ...data, status: 'success' });
        } else {
          reject(new Error('Simulated API error'));
        }
      }, 1000);
    });
  }

  // Event emitter
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }
}

// 4. DOM MANIPULATION
class DOMRenderer {
  constructor() {
    this.templates = new Map();
    this.components = new Map();
  }

  // Template system
  template(name, html) {
    this.templates.set(name, html);
  }

  render(templateName, data = {}, container) {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    const rendered = this.interpolate(template, data);
    
    if (container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      container.innerHTML = rendered;
    }
    
    return rendered;
  }

  interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : '';
    });
  }

  // Component system
  component(name, factory) {
    this.components.set(name, factory);
  }

  createComponent(name, props = {}) {
    const factory = this.components.get(name);
    if (!factory) throw new Error(`Component ${name} not found`);
    
    return factory(props);
  }

  // DOM utilities
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('data-') || ['id', 'class', 'type', 'placeholder'].includes(key)) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  }

  // Animation utilities
  animate(element, keyframes, options = {}) {
    return element.animate(keyframes, {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
      ...options
    });
  }

  fadeIn(element, duration = 300) {
    return this.animate(element, [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration });
  }

  fadeOut(element, duration = 300) {
    return this.animate(element, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration });
  }
}

// 5. ASYNC OPERATIONS & ERROR HANDLING
class AsyncManager {
  constructor() {
    this.cache = new Map();
    this.pending = new Map();
  }

  // Cached async operations
  async cachedFetch(url, options = {}) {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (this.pending.has(cacheKey)) {
      return this.pending.get(cacheKey);
    }

    const promise = this.fetchWithRetry(url, options);
    this.pending.set(cacheKey, promise);

    try {
      const result = await promise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.pending.delete(cacheKey);
    }
  }

  // Retry mechanism
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        lastError = error;
        if (i < maxRetries) {
          await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
        }
      }
    }

    throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError.message}`);
  }

  // Timer utilities
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), ms)
      )
    ]);
  }

  // Batch operations
  async batch(operations, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const operation of operations) {
      const promise = Promise.resolve(operation()).then(result => {
        executing.splice(executing.indexOf(promise), 1);
        return result;
      });

      results.push(promise);
      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }

    return Promise.all(results);
  }
}

// 6. ERROR HANDLING SYSTEM
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
    this.errors = [];
  }

  setupGlobalHandlers() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
  }

  handleError(event) {
    this.logError({
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  }

  handleRejection(event) {
    this.logError({
      type: 'promise',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack
    });
  }

  logError(error) {
    const errorObj = {
      ...error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorObj);
    console.error('Error logged:', errorObj);
    
    // Show user-friendly message
    this.showUserMessage('An error occurred. Please try again.', 'error');
  }

  showUserMessage(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Wrapper for safe async operations
  async safeAsync(operation, fallback = null) {
    try {
      return await operation();
    } catch (error) {
      this.logError({
        type: 'async',
        message: error.message,
        stack: error.stack
      });
      return fallback;
    }
  }

  // Wrapper for safe DOM operations
  safeDom(operation, fallback = null) {
    try {
      return operation();
    } catch (error) {
      this.logError({
        type: 'dom',
        message: error.message,
        stack: error.stack
      });
      return fallback;
    }
  }
}

// 7. MODULE EXPORTS
export {
  ModernJS,
  User,
  Challenge,
  Achievement,
  EventManager,
  DOMRenderer,
  AsyncManager,
  ErrorHandler
};

// Global instances for immediate use
window.CodeQuest = {
  EventManager: new EventManager(),
  DOMRenderer: new DOMRenderer(),
  AsyncManager: new AsyncManager(),
  ErrorHandler: new ErrorHandler()
};