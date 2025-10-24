// User Management Module
export class UserManager {
  constructor() {
    this.users = new Map();
    this.currentUser = null;
    this.eventTarget = new EventTarget();
  }

  // User CRUD operations
  createUser({ name, email, preferences = {} }) {
    const user = new User(name, email, preferences);
    this.users.set(user.id, user);
    this.emit('userCreated', user);
    return user;
  }

  getUser(id) {
    return this.users.get(id);
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (user) {
      Object.assign(user, updates);
      this.emit('userUpdated', user);
    }
    return user;
  }

  deleteUser(id) {
    const deleted = this.users.delete(id);
    if (deleted) {
      this.emit('userDeleted', { id });
    }
    return deleted;
  }

  // Authentication simulation
  async login(email, password) {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (user && await this.validatePassword(password)) {
      this.currentUser = user;
      this.emit('userLoggedIn', user);
      return user;
    }
    throw new Error('Invalid credentials');
  }

  logout() {
    const user = this.currentUser;
    this.currentUser = null;
    this.emit('userLoggedOut', user);
  }

  async validatePassword(password) {
    // Simulate password validation
    return new Promise(resolve => {
      setTimeout(() => resolve(password.length >= 6), 100);
    });
  }

  // Event system
  on(event, callback) {
    this.eventTarget.addEventListener(event, callback);
  }

  emit(event, data) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

class User {
  #privateData = new Map();

  constructor(name, email, preferences = {}) {
    this.id = this.generateId();
    this.name = name;
    this.email = email;
    this.preferences = { theme: 'light', language: 'en', ...preferences };
    this.createdAt = new Date();
    this.lastActive = new Date();
    this.#privateData.set('sessionToken', this.generateToken());
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateToken() {
    return btoa(Math.random().toString()).substr(10, 20);
  }

  get sessionToken() {
    return this.#privateData.get('sessionToken');
  }

  updateActivity() {
    this.lastActive = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      preferences: this.preferences,
      createdAt: this.createdAt,
      lastActive: this.lastActive
    };
  }
}