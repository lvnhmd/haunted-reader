/**
 * Interpretation Cache - Prevents duplicate API calls for same text+spirit combinations
 * Implements LRU cache with size limit for cost optimization
 */

/**
 * Simple hash function for cache keys
 */
function hashKey(text, spiritId, type) {
  // Create a simple hash from the combination
  const combined = `${spiritId}:${type}:${text}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Estimate size of cached item in bytes
 */
function estimateSize(item) {
  // Rough estimate: content length + metadata overhead
  return (item.content?.length || 0) + 500;
}

/**
 * LRU Cache implementation
 */
class InterpretationCache {
  constructor(maxSizeBytes = 50 * 1024 * 1024) { // 50MB default
    this.cache = new Map();
    this.maxSize = maxSizeBytes;
    this.currentSize = 0;
  }

  /**
   * Generate cache key
   */
  _generateKey(text, spiritId, type) {
    return hashKey(text, spiritId, type);
  }

  /**
   * Get cached interpretation
   */
  get(text, spiritId, type) {
    const key = this._generateKey(text, spiritId, type);
    
    if (!this.cache.has(key)) {
      return null;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  /**
   * Store interpretation in cache
   */
  set(text, spiritId, type, interpretation) {
    const key = this._generateKey(text, spiritId, type);
    const size = estimateSize(interpretation);

    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldSize = estimateSize(this.cache.get(key));
      this.currentSize -= oldSize;
      this.cache.delete(key);
    }

    // Evict least recently used items if needed
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      const firstKey = this.cache.keys().next().value;
      const firstValue = this.cache.get(firstKey);
      this.currentSize -= estimateSize(firstValue);
      this.cache.delete(firstKey);
    }

    // Add new entry
    this.cache.set(key, interpretation);
    this.currentSize += size;
  }

  /**
   * Check if interpretation is cached
   */
  has(text, spiritId, type) {
    const key = this._generateKey(text, spiritId, type);
    return this.cache.has(key);
  }

  /**
   * Clear all cached interpretations
   */
  clear() {
    this.cache.clear();
    this.currentSize = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
      sizeBytes: this.currentSize,
      maxSizeBytes: this.maxSize,
      utilizationPercent: (this.currentSize / this.maxSize * 100).toFixed(2)
    };
  }
}

// Singleton cache instance
const cache = new InterpretationCache();

export default cache;
export { InterpretationCache };
