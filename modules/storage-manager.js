// Storage Manager Module - Advanced local storage with encryption and sync
export class StorageManager {
  constructor(options = {}) {
    this.prefix = options.prefix || 'codequest_';
    this.encrypt = options.encrypt || false;
    this.syncEnabled = options.sync || false;
    this.eventTarget = new EventTarget();
    this.cache = new Map();
    this.setupStorageListener();
  }

  // Basic operations
  set(key, value, options = {}) {
    try {
      const fullKey = this.prefix + key;
      const data = {
        value,
        timestamp: Date.now(),
        expires: options.expires ? Date.now() + options.expires : null,
        encrypted: this.encrypt
      };

      const serialized = JSON.stringify(data);
      const stored = this.encrypt ? this.encryptData(serialized) : serialized;
      
      localStorage.setItem(fullKey, stored);
      this.cache.set(key, data);
      
      this.emit('set', { key, value, options });
      return true;
    } catch (error) {
      this.emit('error', { operation: 'set', key, error });
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        if (!this.isExpired(cached)) {
          return cached.value;
        } else {
          this.remove(key);
          return defaultValue;
        }
      }

      const fullKey = this.prefix + key;
      const stored = localStorage.getItem(fullKey);
      
      if (!stored) return defaultValue;

      const decrypted = this.encrypt ? this.decryptData(stored) : stored;
      const data = JSON.parse(decrypted);
      
      if (this.isExpired(data)) {
        this.remove(key);
        return defaultValue;
      }

      this.cache.set(key, data);
      this.emit('get', { key, value: data.value });
      return data.value;
    } catch (error) {
      this.emit('error', { operation: 'get', key, error });
      return defaultValue;
    }
  }

  remove(key) {
    try {
      const fullKey = this.prefix + key;
      const existed = localStorage.getItem(fullKey) !== null;
      
      localStorage.removeItem(fullKey);
      this.cache.delete(key);
      
      if (existed) {
        this.emit('remove', { key });
      }
      return existed;
    } catch (error) {
      this.emit('error', { operation: 'remove', key, error });
      return false;
    }
  }

  clear() {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => {
        localStorage.removeItem(this.prefix + key);
      });
      
      this.cache.clear();
      this.emit('clear', { keys });
      return true;
    } catch (error) {
      this.emit('error', { operation: 'clear', error });
      return false;
    }
  }

  // Advanced operations
  has(key) {
    return this.get(key) !== null;
  }

  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  getAll() {
    const result = {};
    this.getAllKeys().forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  // Batch operations
  setBatch(items) {
    const results = {};
    Object.entries(items).forEach(([key, value]) => {
      results[key] = this.set(key, value);
    });
    return results;
  }

  getBatch(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.get(key);
    });
    return results;
  }

  removeBatch(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.remove(key);
    });
    return results;
  }

  // Expiration handling
  isExpired(data) {
    return data.expires && Date.now() > data.expires;
  }

  cleanExpired() {
    const keys = this.getAllKeys();
    let cleaned = 0;
    
    keys.forEach(key => {
      const data = this.cache.get(key);
      if (data && this.isExpired(data)) {
        this.remove(key);
        cleaned++;
      }
    });
    
    this.emit('cleanExpired', { cleaned });
    return cleaned;
  }

  // Encryption (simple XOR for demo - use proper encryption in production)
  encryptData(data) {
    const key = 'codequest-secret-key';
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  decryptData(encrypted) {
    const key = 'codequest-secret-key';
    const data = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  }

  // Storage events
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith(this.prefix)) {
        const key = e.key.substring(this.prefix.length);
        this.cache.delete(key);
        this.emit('storageChange', {
          key,
          oldValue: e.oldValue,
          newValue: e.newValue
        });
      }
    });
  }

  // Event system
  on(event, callback) {
    this.eventTarget.addEventListener(event, callback);
  }

  emit(event, data) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  // Import/Export
  export() {
    return {
      data: this.getAll(),
      timestamp: Date.now(),
      version: '1.0'
    };
  }

  import(exportData) {
    try {
      if (exportData.version !== '1.0') {
        throw new Error('Unsupported export version');
      }
      
      this.clear();
      this.setBatch(exportData.data);
      this.emit('import', { count: Object.keys(exportData.data).length });
      return true;
    } catch (error) {
      this.emit('error', { operation: 'import', error });
      return false;
    }
  }

  // Storage quota management
  getStorageInfo() {
    let used = 0;
    this.getAllKeys().forEach(key => {
      const item = localStorage.getItem(this.prefix + key);
      used += item ? item.length : 0;
    });

    return {
      used,
      available: this.getAvailableSpace(),
      keys: this.getAllKeys().length
    };
  }

  getAvailableSpace() {
    try {
      const test = 'x'.repeat(1024);
      let size = 0;
      while (true) {
        localStorage.setItem('__test__', test.repeat(size++));
      }
    } catch (e) {
      localStorage.removeItem('__test__');
      return size * 1024;
    }
  }
}

// Specialized storage classes
export class UserStorage extends StorageManager {
  constructor() {
    super({ prefix: 'user_', encrypt: true });
  }

  setUserData(userId, data) {
    return this.set(userId, data, { expires: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  getUserData(userId) {
    return this.get(userId, {});
  }
}

export class CacheStorage extends StorageManager {
  constructor() {
    super({ prefix: 'cache_' });
  }

  setCache(key, data, ttl = 3600000) { // 1 hour default
    return this.set(key, data, { expires: ttl });
  }

  getCache(key) {
    return this.get(key);
  }
}

export class SettingsStorage extends StorageManager {
  constructor() {
    super({ prefix: 'settings_' });
  }

  getSetting(key, defaultValue) {
    return this.get(key, defaultValue);
  }

  setSetting(key, value) {
    return this.set(key, value);
  }

  getTheme() {
    return this.getSetting('theme', 'light');
  }

  setTheme(theme) {
    return this.setSetting('theme', theme);
  }
}