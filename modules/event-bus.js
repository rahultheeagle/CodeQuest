// Event Bus Module - Centralized event management
export class EventBus {
  constructor() {
    this.events = new Map();
    this.middlewares = [];
    this.history = [];
    this.maxHistory = 100;
  }

  // Event subscription
  on(event, callback, options = {}) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    const listener = { callback, options, id: this.generateId() };
    this.events.get(event).add(listener);
    
    return () => this.off(event, listener.id);
  }

  // One-time event subscription
  once(event, callback) {
    return this.on(event, callback, { once: true });
  }

  // Event unsubscription
  off(event, listenerId) {
    const listeners = this.events.get(event);
    if (listeners) {
      for (const listener of listeners) {
        if (listener.id === listenerId) {
          listeners.delete(listener);
          break;
        }
      }
    }
  }

  // Event emission
  async emit(event, data = null) {
    const eventObj = {
      type: event,
      data,
      timestamp: new Date(),
      id: this.generateId()
    };

    // Apply middlewares
    for (const middleware of this.middlewares) {
      try {
        await middleware(eventObj);
      } catch (error) {
        console.error('Middleware error:', error);
      }
    }

    // Store in history
    this.addToHistory(eventObj);

    // Notify listeners
    const listeners = this.events.get(event);
    if (listeners) {
      const promises = [];
      
      for (const listener of listeners) {
        try {
          const result = listener.callback(eventObj);
          if (result instanceof Promise) {
            promises.push(result);
          }
          
          // Remove one-time listeners
          if (listener.options.once) {
            listeners.delete(listener);
          }
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
      
      // Wait for async listeners
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    }

    return eventObj;
  }

  // Middleware system
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // Event history
  addToHistory(event) {
    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getHistory(eventType = null) {
    return eventType 
      ? this.history.filter(e => e.type === eventType)
      : [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  // Utility methods
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  hasListeners(event) {
    const listeners = this.events.get(event);
    return listeners && listeners.size > 0;
  }

  getListenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.size : 0;
  }

  getAllEvents() {
    return Array.from(this.events.keys());
  }

  // Batch operations
  emitBatch(events) {
    return Promise.all(events.map(({ event, data }) => this.emit(event, data)));
  }

  // Event namespacing
  namespace(prefix) {
    return {
      on: (event, callback, options) => this.on(`${prefix}:${event}`, callback, options),
      once: (event, callback) => this.once(`${prefix}:${event}`, callback),
      off: (event, listenerId) => this.off(`${prefix}:${event}`, listenerId),
      emit: (event, data) => this.emit(`${prefix}:${event}`, data)
    };
  }
}

// Event patterns and utilities
export class EventPatterns {
  static createThrottledEmitter(eventBus, event, delay = 100) {
    let timeout;
    let lastData;

    return (data) => {
      lastData = data;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        eventBus.emit(event, lastData);
      }, delay);
    };
  }

  static createDebouncedEmitter(eventBus, event, delay = 300) {
    let timeout;

    return (data) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        eventBus.emit(event, data);
      }, delay);
    };
  }

  static createBatchEmitter(eventBus, event, batchSize = 10, maxWait = 1000) {
    let batch = [];
    let timeout;

    return (data) => {
      batch.push(data);

      if (batch.length >= batchSize) {
        eventBus.emit(event, batch);
        batch = [];
        clearTimeout(timeout);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          if (batch.length > 0) {
            eventBus.emit(event, batch);
            batch = [];
          }
          timeout = null;
        }, maxWait);
      }
    };
  }
}

// Common middleware
export const commonMiddleware = {
  logger: (event) => {
    console.log(`[EventBus] ${event.type}:`, event.data);
  },

  validator: (requiredFields = []) => (event) => {
    if (event.data && typeof event.data === 'object') {
      for (const field of requiredFields) {
        if (!(field in event.data)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
    }
  },

  transformer: (transformFn) => (event) => {
    if (event.data) {
      event.data = transformFn(event.data);
    }
  },

  filter: (filterFn) => (event) => {
    if (!filterFn(event)) {
      event.cancelled = true;
    }
  }
};