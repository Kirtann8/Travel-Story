// Simple in-memory cache for frequently accessed data
class Cache {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

// Create cache instances
export const analyticsCache = new Cache(300000); // 5 minutes
export const imageCache = new Cache(600000); // 10 minutes

// Cache wrapper for API calls
export const withCache = (cacheInstance, key, asyncFn) => {
  return async (...args) => {
    if (cacheInstance.has(key)) {
      return cacheInstance.get(key);
    }
    
    const result = await asyncFn(...args);
    cacheInstance.set(key, result);
    return result;
  };
};