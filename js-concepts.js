// Real-world JavaScript concepts implementation

// 1. Local Storage Utility
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Parse error:', error);
            return null;
        }
    },
    
    remove: (key) => localStorage.removeItem(key),
    
    clear: () => localStorage.clear(),
    
    exists: (key) => localStorage.getItem(key) !== null
};

// 2. Array Utilities
const ArrayUtils = {
    formatUsers: (users) => users.map(user => user.name),
    
    getActiveUsers: (users) => users.filter(user => user.active),
    
    getTotalScore: (scores) => scores.reduce((sum, score) => sum + score, 0),
    
    logUsers: (users) => users.forEach(user => console.log(`User: ${user.name}`)),
    
    sortBy: (array, key) => [...array].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    }),
    
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }
};

// 3. Template Literals
const Templates = {
    userCard: (user) => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Score: ${user.score || 'N/A'}</p>
            <p>Status: ${user.active ? 'Active' : 'Inactive'}</p>
        </div>
    `,
    
    notification: (message, type = 'info') => `
        <div class="notification notification--${type}">
            ${message}
        </div>
    `,
    
    listItem: (item, index) => `
        <div class="item" data-id="${item.id || index}">
            <span class="text">${item.name || item.text}</span>
            <button class="btn btn--sm btn--secondary" data-action="edit">Edit</button>
            <button class="btn btn--sm btn--danger" data-action="delete">Delete</button>
        </div>
    `
};

// 4. Event Delegation Handler
class EventDelegator {
    constructor(container) {
        this.container = container;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action && this[action]) {
                this[action](e.target, e);
            }
        });
    }
    
    edit(target, event) {
        const item = target.closest('.item');
        const text = item.querySelector('.text');
        const currentText = text.textContent;
        
        const input = document.createElement('input');
        input.value = currentText;
        input.className = 'form-control';
        
        text.replaceWith(input);
        input.focus();
        
        input.addEventListener('blur', () => {
            text.textContent = input.value;
            input.replaceWith(text);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
    
    delete(target, event) {
        const item = target.closest('.item');
        if (confirm('Delete this item?')) {
            item.remove();
        }
    }
}

// 5. Async Operations
const AsyncOps = {
    // Simulate API call
    fetchUser: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id,
                    name: `User ${id}`,
                    email: `user${id}@example.com`
                });
            }, 1000);
        });
    },
    
    fetchProfile: (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    bio: 'Software developer',
                    location: 'New York',
                    joinDate: new Date().toISOString()
                });
            }, 800);
        });
    },
    
    loadUserData: async (id) => {
        try {
            const user = await AsyncOps.fetchUser(id);
            const profile = await AsyncOps.fetchProfile(user.id);
            return { ...user, ...profile };
        } catch (error) {
            throw new Error(`Failed to load user data: ${error.message}`);
        }
    },
    
    // Parallel requests
    loadMultipleUsers: async (ids) => {
        try {
            const users = await Promise.all(
                ids.map(id => AsyncOps.fetchUser(id))
            );
            return users;
        } catch (error) {
            throw new Error(`Failed to load users: ${error.message}`);
        }
    }
};

// 6. JSON Handler
const JSONHandler = {
    save: (key, data) => {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            localStorage.setItem(key, jsonString);
            return true;
        } catch (error) {
            console.error('JSON save error:', error);
            return false;
        }
    },
    
    load: (key) => {
        try {
            const jsonString = localStorage.getItem(key);
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (error) {
            console.error('JSON parse error:', error);
            return null;
        }
    },
    
    export: (data) => {
        return JSON.stringify(data, null, 2);
    },
    
    validate: (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch {
            return false;
        }
    }
};

// 7. Date Utilities
const DateUtils = {
    now: () => new Date(),
    
    format: (date, options = {}) => {
        const defaults = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(date);
    },
    
    timeAgo: (date) => {
        const now = Date.now();
        const diff = now - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    isToday: (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },
    
    isSameWeek: (date1, date2) => {
        const week1 = DateUtils.getWeekNumber(date1);
        const week2 = DateUtils.getWeekNumber(date2);
        return week1 === week2;
    },
    
    getWeekNumber: (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
};

// 8. Validators with RegEx
const Validators = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s\-\(\)]{10,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    url: /^https?:\/\/.+/,
    
    validate: (value, type) => {
        const regex = Validators[type];
        return regex ? regex.test(value) : false;
    },
    
    sanitize: (str) => {
        return str.replace(/[<>\"'&]/g, (match) => {
            const map = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;'
            };
            return map[match];
        });
    },
    
    extractEmails: (text) => {
        return text.match(Validators.email) || [];
    },
    
    isStrongPassword: (password) => {
        return Validators.validate(password, 'password');
    }
};

// 9. Custom Event Emitter
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        // Custom DOM event
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
        
        // Internal event system
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// 10. Complete User Management System
class UserManager {
    constructor() {
        this.users = Storage.get('users') || [];
        this.emitter = new EventEmitter();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.emitter.on('userAdded', (user) => {
            this.showNotification(`User ${user.name} added successfully!`, 'success');
        });
        
        this.emitter.on('userDeleted', (user) => {
            this.showNotification(`User ${user.name} deleted`, 'error');
        });
    }
    
    addUser(userData) {
        const user = {
            id: Date.now(),
            ...userData,
            createdAt: new Date(),
            active: true
        };
        
        this.users.push(user);
        this.saveUsers();
        this.emitter.emit('userAdded', user);
        this.render();
        
        return user;
    }
    
    deleteUser(id) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex > -1) {
            const user = this.users[userIndex];
            this.users.splice(userIndex, 1);
            this.saveUsers();
            this.emitter.emit('userDeleted', user);
            this.render();
        }
    }
    
    searchUsers(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.users.filter(user => 
            user.name.toLowerCase().includes(lowercaseQuery) ||
            user.email.toLowerCase().includes(lowercaseQuery)
        );
    }
    
    saveUsers() {
        Storage.set('users', this.users);
    }
    
    render() {
        const container = document.getElementById('app');
        if (!container) return;
        
        const stats = this.getStats();
        const usersHtml = this.users.map(user => Templates.userCard(user)).join('');
        
        container.innerHTML = `
            <div class="stats">
                <h3>User Statistics</h3>
                <p>Total Users: ${stats.total}</p>
                <p>Active Users: ${stats.active}</p>
                <p>Average Score: ${stats.averageScore}</p>
            </div>
            <div class="users-grid">
                ${usersHtml || '<p>No users found</p>'}
            </div>
        `;
    }
    
    getStats() {
        const total = this.users.length;
        const active = this.users.filter(u => u.active).length;
        const totalScore = this.users.reduce((sum, u) => sum + (u.score || 0), 0);
        const averageScore = total > 0 ? Math.round(totalScore / total) : 0;
        
        return { total, active, averageScore };
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the demo
document.addEventListener('DOMContentLoaded', () => {
    // Initialize user management system
    const userManager = new UserManager();
    
    // Setup form handler
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                score: parseInt(formData.get('score')) || 0
            };
            
            userManager.addUser(userData);
            e.target.reset();
        });
    }
    
    // Setup event delegation for items container
    const itemsContainer = document.getElementById('items-container');
    if (itemsContainer) {
        new EventDelegator(itemsContainer);
    }
    
    // Initial render
    userManager.render();
    
    // Make available globally for testing
    window.conceptsDemo = { userManager };
});