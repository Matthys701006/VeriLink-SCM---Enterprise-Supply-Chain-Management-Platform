import { usePerformance } from '../../contexts/PerformanceContext';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

class DataCache {
  private static instance: DataCache;
  private cache: Map<string, CacheEntry<any>>;
  private defaultTtlMs: number = 5 * 60 * 1000; // 5 minutes default TTL
  
  private constructor() {
    this.cache = new Map();
    
    // Clear expired cache entries periodically
    setInterval(() => {
      this.clearExpiredEntries();
    }, 60 * 1000); // Check every minute
  }
  
  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }
  
  /**
   * Set a value in the cache with optional TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs Time to live in milliseconds (optional, defaults to 5 minutes)
   */
  set<T>(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttlMs;
    
    this.cache.set(key, {
      data: value,
      timestamp,
      expiresAt
    });
  }
  
  /**
   * Get a value from the cache
   * @param key Cache key
   * @param recordMetric Whether to record cache hit/miss metric
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string, recordMetric: boolean = true): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    // Check if entry exists and is not expired
    if (entry && entry.expiresAt > Date.now()) {
      if (recordMetric) {
        // In a component, usePerformance().recordCacheHit(true) would be called
        // Here we just log since this is a service
        console.log(`Cache hit for key: ${key}`);
      }
      return entry.data;
    }
    
    if (recordMetric) {
      // In a component, usePerformance().recordCacheHit(false) would be called
      console.log(`Cache miss for key: ${key}`);
    }
    
    // Remove expired entry if it exists
    if (entry) {
      this.cache.delete(key);
    }
    
    return undefined;
  }
  
  /**
   * Remove an entry from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Clear expired entries from the cache
   */
  clearExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  getStats(): { size: number; memoryUsageEstimate: string } {
    const size = this.cache.size;
    
    // Estimate memory usage (rough approximation)
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      // Key size + timestamp + expiresAt + rough estimate of data size
      totalSize += key.length * 2; // 2 bytes per character
      totalSize += 16; // timestamp and expiresAt (8 bytes each)
      
      // Rough estimation of data size based on JSON stringification
      const jsonSize = JSON.stringify(entry.data).length * 2;
      totalSize += jsonSize;
    }
    
    // Convert to human-readable format
    const memoryUsageEstimate = this.formatBytes(totalSize);
    
    return {
      size,
      memoryUsageEstimate
    };
  }
  
  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const dataCache = DataCache.getInstance();
export default DataCache;