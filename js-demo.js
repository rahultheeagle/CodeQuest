// JavaScript Demo Implementation
document.addEventListener('DOMContentLoaded', () => {
  const { EventManager, DOMRenderer, AsyncManager, ErrorHandler } = window.CodeQuest;
  
  // Sample data
  let currentUser = null;
  let currentChallenge = null;
  let achievements = [];

  // Initialize demo
  initializeDemo();

  function initializeDemo() {
    setupTemplates();
    setupComponents();
    setupEventListeners();
    createAchievements();
    renderAchievements();
  }

  // Template setup
  function setupTemplates() {
    DOMRenderer.template('userProfile', `
      <div class="user-profile">
        <div class="user-info">
          <div class="user-avatar">{{initials}}</div>
          <div class="user-details">
            <h4>{{name}}</h4>
            <p>{{email}}</p>
            <p>ID: {{id}}</p>
          </div>
        </div>
      </div>
    `);

    DOMRenderer.template('challengeResult', `
      <div class="challenge-result {{status}}">
        <strong>{{message}}</strong>
        <p>Attempts: {{attempts}}</p>
      </div>
    `);
  }

  // Component setup
  function setupComponents() {
    DOMRenderer.component('achievementCard', (props) => {
      return DOMRenderer.createElement('div', {
        class: `achievement-card ${props.unlocked ? 'unlocked' : ''}`,
        'data-achievement': props.id
      }, [
        DOMRenderer.createElement('div', { class: 'achievement-icon' }, [props.icon || '🏆']),
        DOMRenderer.createElement('div', { class: 'achievement-name' }, [props.name]),
        DOMRenderer.createElement('div', { class: 'achievement-description' }, [props.description]),
        DOMRenderer.createElement('div', { class: 'achievement-points' }, [`${props.points} points`])
      ]);
    });
  }

  // Event listeners
  function setupEventListeners() {
    EventManager.on('action', handleAction);
    EventManager.on('formSubmitted', handleFormSubmission);
    EventManager.on('storageChanged', handleStorageChange);

    // Custom event listener
    document.addEventListener('user:profileUpdated', (e) => {
      showNotification('User profile updated!', 'success');
    });
  }

  // Action handler
  async function handleAction({ type, target }) {
    try {
      switch (type) {
        case 'test-es6':
          testES6Features();
          break;
        case 'test-async':
          await testAsyncOperations();
          break;
        case 'validate-challenge':
          validateChallenge();
          break;
        case 'trigger-event':
          triggerCustomEvent();
          break;
        case 'test-delegation':
          testEventDelegation();
          break;
        case 'render-template':
          renderTemplate();
          break;
        case 'create-component':
          createComponent();
          break;
        case 'fade-in':
          fadeInElement();
          break;
        case 'fade-out':
          fadeOutElement();
          break;
        case 'trigger-error':
          triggerError();
          break;
        case 'trigger-promise-error':
          triggerPromiseError();
          break;
        case 'safe-async':
          testSafeAsync();
          break;
        case 'safe-dom':
          testSafeDom();
          break;
        case 'check-achievements':
          checkAchievements();
          break;
      }
    } catch (error) {
      ErrorHandler.logError({
        type: 'action',
        message: error.message,
        action: type
      });
    }
  }

  // ES6+ Features Demo
  function testES6Features() {
    const { ModernJS } = window.CodeQuest;
    
    // Test destructuring and arrow functions
    const userData = { 
      name: 'John Doe', 
      email: 'john@example.com',
      preferences: { theme: 'dark', language: 'es' }
    };
    
    const processed = ModernJS.processUserData(userData);
    const message = ModernJS.formatMessage(processed, 'Welcome!', 'Enjoy coding!');
    
    const output = document.getElementById('es6-output');
    output.textContent = `Processed Data: ${JSON.stringify(processed, null, 2)}\n\nMessage: ${message}`;
  }

  // Async Operations Demo
  async function testAsyncOperations() {
    const loading = document.getElementById('async-loading');
    const output = document.getElementById('async-output');
    
    loading.style.display = 'block';
    output.textContent = '';

    try {
      // Simulate multiple async operations
      const operations = [
        () => AsyncManager.delay(500).then(() => ({ data: 'Operation 1 complete' })),
        () => AsyncManager.delay(800).then(() => ({ data: 'Operation 2 complete' })),
        () => AsyncManager.delay(300).then(() => ({ data: 'Operation 3 complete' }))
      ];

      const results = await AsyncManager.batch(operations, 2);
      
      output.textContent = `Batch Results:\n${results.map((r, i) => `${i + 1}. ${r.data}`).join('\n')}`;
      
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
    } finally {
      loading.style.display = 'none';
    }
  }

  // Form submission handler
  function handleFormSubmission({ success, data, error }) {
    if (success) {
      // Create user instance
      const { User } = window.CodeQuest;
      currentUser = new User(data.name, data.email);
      
      const userOutput = document.getElementById('user-output');
      const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      DOMRenderer.render('userProfile', {
        ...currentUser.profile,
        initials
      }, userOutput);
      
      showNotification('User created successfully!', 'success');
    } else {
      showNotification(`Error: ${error}`, 'error');
    }
  }

  // Challenge validation
  function validateChallenge() {
    const { Challenge } = window.CodeQuest;
    
    if (!currentChallenge) {
      currentChallenge = new Challenge('Test Challenge', 'javascript', 'easy');
    }
    
    const code = document.getElementById('challenge-code').value;
    const result = currentChallenge.validate(code);
    
    const output = document.getElementById('challenge-output');
    DOMRenderer.render('challengeResult', {
      status: result.valid ? 'success' : 'error',
      message: result.message,
      attempts: currentChallenge.attempts
    }, output);
  }

  // Event handling demos
  function triggerCustomEvent() {
    const event = new CustomEvent('demo:customEvent', {
      detail: { timestamp: new Date().toISOString(), message: 'Custom event triggered!' }
    });
    
    document.dispatchEvent(event);
    logEvent('Custom Event', event.detail);
  }

  function testEventDelegation() {
    const button = document.createElement('button');
    button.textContent = 'Dynamic Button';
    button.dataset.action = 'dynamic-action';
    button.className = 'btn btn--primary';
    
    document.getElementById('event-log').appendChild(button);
    logEvent('Event Delegation', 'Dynamic button added with data-action');
  }

  function logEvent(type, data) {
    const log = document.getElementById('event-log');
    const item = document.createElement('div');
    item.className = 'event-item';
    item.textContent = `[${new Date().toLocaleTimeString()}] ${type}: ${JSON.stringify(data)}`;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  // DOM manipulation demos
  function renderTemplate() {
    const sampleData = {
      name: 'Template User',
      email: 'template@example.com',
      id: 'temp-123',
      initials: 'TU'
    };
    
    DOMRenderer.render('userProfile', sampleData, '#dynamic-content');
    showNotification('Template rendered!', 'info');
  }

  function createComponent() {
    const container = document.getElementById('dynamic-content');
    const achievement = DOMRenderer.createComponent('achievementCard', {
      id: 'dynamic-achievement',
      name: 'Dynamic Component',
      description: 'Created using component system',
      points: 25,
      unlocked: true,
      icon: '⚡'
    });
    
    container.innerHTML = '';
    container.appendChild(achievement);
    showNotification('Component created!', 'info');
  }

  // Animation demos
  function fadeInElement() {
    const target = document.getElementById('animation-target');
    DOMRenderer.fadeIn(target, 500);
  }

  function fadeOutElement() {
    const target = document.getElementById('animation-target');
    DOMRenderer.fadeOut(target, 500);
  }

  // Error handling demos
  function triggerError() {
    throw new Error('Simulated JavaScript error for testing');
  }

  function triggerPromiseError() {
    Promise.reject(new Error('Simulated promise rejection'));
  }

  async function testSafeAsync() {
    const result = await ErrorHandler.safeAsync(
      () => Promise.reject(new Error('Safe async test error')),
      'Fallback value'
    );
    
    document.getElementById('safe-output').textContent = `Safe Async Result: ${result}`;
  }

  function testSafeDom() {
    const result = ErrorHandler.safeDom(
      () => document.querySelector('#nonexistent').textContent,
      'Element not found'
    );
    
    document.getElementById('safe-output').textContent = `Safe DOM Result: ${result}`;
  }

  // Achievement system
  function createAchievements() {
    const { Achievement } = window.CodeQuest;
    
    achievements = [
      new Achievement('First Steps', 'Complete your first action', (data) => data.actionsCount >= 1, 10),
      new Achievement('ES6 Explorer', 'Test ES6+ features', (data) => data.es6Tested, 15),
      new Achievement('Async Master', 'Complete async operations', (data) => data.asyncTested, 20),
      new Achievement('Form Validator', 'Submit a valid form', (data) => data.formsSubmitted >= 1, 15),
      new Achievement('Error Handler', 'Trigger error handling', (data) => data.errorsTriggered >= 1, 10),
      new Achievement('Component Creator', 'Create dynamic components', (data) => data.componentsCreated >= 1, 25)
    ];
  }

  function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
      const card = DOMRenderer.createComponent('achievementCard', achievement);
      container.appendChild(card);
    });
  }

  function checkAchievements() {
    const userData = getUserData();
    let newUnlocks = 0;
    
    achievements.forEach(achievement => {
      if (achievement.check(userData)) {
        newUnlocks++;
        showNotification(`Achievement unlocked: ${achievement.name}!`, 'success');
      }
    });
    
    if (newUnlocks === 0) {
      showNotification('No new achievements unlocked', 'info');
    }
    
    renderAchievements();
    updateUserData({ achievementsUnlocked: achievements.filter(a => a.unlocked).length });
  }

  // User data management
  function getUserData() {
    const stored = localStorage.getItem('js-demo-data');
    return stored ? JSON.parse(stored) : {
      actionsCount: 0,
      es6Tested: false,
      asyncTested: false,
      formsSubmitted: 0,
      errorsTriggered: 0,
      componentsCreated: 0,
      achievementsUnlocked: 0
    };
  }

  function updateUserData(updates) {
    const current = getUserData();
    const updated = { ...current, ...updates };
    localStorage.setItem('js-demo-data', JSON.stringify(updated));
  }

  // Storage change handler
  function handleStorageChange({ key, newValue }) {
    if (key === 'js-demo-data') {
      showNotification('Demo data updated!', 'info');
    }
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Track user actions
  document.addEventListener('click', (e) => {
    if (e.target.dataset.action) {
      const userData = getUserData();
      updateUserData({ 
        actionsCount: userData.actionsCount + 1,
        [`${e.target.dataset.action.replace('-', '')}Tested`]: true
      });
    }
  });

  // Custom event listeners for tracking
  document.addEventListener('demo:customEvent', (e) => {
    logEvent('Custom Event Received', e.detail);
  });

  // Initialize with sample data
  setTimeout(() => {
    showNotification('JavaScript Demo loaded successfully!', 'success');
  }, 500);
});