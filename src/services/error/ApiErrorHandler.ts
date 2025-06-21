/**
 * API Error Handler Service
 * 
 * This service provides standardized error handling for API requests
 * with consistent error messages, error logging, and recovery strategies.
 */

import { dataCache } from '../cache/DataCache';

export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  AUTH = 'authentication',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  UNEXPECTED = 'unexpected',
}

export interface ApiError {
  type: ErrorType;
  message: string;
  originalError?: any;
  code?: string;
  traceId?: string;
  data?: any;
}

interface ErrorHandlingOptions {
  useCache?: boolean;
  cacheKey?: string;
  cacheTtl?: number;
  retries?: number;
  retryDelay?: number;
  fallbackData?: any;
  suppressError?: boolean;
}

const DEFAULT_OPTIONS: ErrorHandlingOptions = {
  useCache: true,
  retries: 0,
  retryDelay: 1000,
  suppressError: false,
};

class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private errorLoggingEndpoint?: string;
  
  private constructor() {
    this.errorLoggingEndpoint = import.meta.env.VITE_ERROR_LOGGING_ENDPOINT;
  }
  
  static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler();
    }
    return ApiErrorHandler.instance;
  }
  
  /**
   * Format error based on type
   */
  formatApiError(error: any): ApiError {
    // Network error (offline)
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network connection unavailable. Please check your internet connection.',
        originalError: error,
      };
    }
    
    // Timeout error
    if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED') {
      return {
        type: ErrorType.TIMEOUT,
        message: 'Request timed out. Please try again later.',
        originalError: error,
      };
    }
    
    // Handle Supabase specific errors
    if (error.code && error.message) {
      // Authentication errors
      if (
        error.code === 'PGRST301' || 
        error.code === 'PGRST302' ||
        error.code === '401' ||
        error.message.includes('JWT expired')
      ) {
        return {
          type: ErrorType.AUTH,
          message: 'Your session has expired. Please sign in again.',
          code: error.code,
          originalError: error,
        };
      }
      
      // Permission errors
      if (
        error.code === 'PGRST403' || 
        error.code === '403' ||
        error.message.includes('permission denied')
      ) {
        return {
          type: ErrorType.AUTH,
          message: 'You do not have permission to perform this action.',
          code: error.code,
          originalError: error,
        };
      }
      
      // Not found errors
      if (error.code === 'PGRST404' || error.code === '404') {
        return {
          type: ErrorType.NOT_FOUND,
          message: 'The requested resource was not found.',
          code: error.code,
          originalError: error,
        };
      }
      
      // Validation errors
      if (error.code === 'PGRST400' || error.code === '400' || error.code === '422') {
        return {
          type: ErrorType.VALIDATION,
          message: 'Validation error. Please check your input.',
          code: error.code,
          data: error.details || error.errors,
          originalError: error,
        };
      }
      
      // Conflict errors
      if (error.code === 'PGRST409' || error.code === '409') {
        return {
          type: ErrorType.CONFLICT,
          message: 'A conflict occurred with your request.',
          code: error.code,
          originalError: error,
        };
      }
      
      // Rate limit errors
      if (error.code === 'PGRST429' || error.code === '429') {
        return {
          type: ErrorType.RATE_LIMIT,
          message: 'Rate limit exceeded. Please try again later.',
          code: error.code,
          originalError: error,
        };
      }
      
      // Server errors
      if (
        error.code.startsWith('PGRST5') || 
        error.code.startsWith('5')
      ) {
        return {
          type: ErrorType.SERVER,
          message: 'Server error. Please try again later.',
          code: error.code,
          originalError: error,
        };
      }
    }
    
    // Fallback for unknown errors
    return {
      type: ErrorType.UNEXPECTED,
      message: 'An unexpected error occurred. Please try again.',
      originalError: error,
      traceId: this.generateTraceId(),
    };
  }
  
  /**
   * Log error to monitoring service
   */
  async logError(error: ApiError): Promise<void> {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
      return;
    }
    
    // In production, send to error logging endpoint if available
    if (this.errorLoggingEndpoint) {
      try {
        const errorData = {
          ...error,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        };
        
        // Send error data to logging endpoint
        await fetch(this.errorLoggingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData),
          // Use keepalive to ensure the request completes even if the page is unloading
          keepalive: true,
        });
      } catch (loggingError) {
        // Fail silently - we don't want errors in error logging to cause more problems
        console.error('Error logging failed:', loggingError);
      }
    }
  }
  
  /**
   * Handle API error with recovery options
   */
  async handleApiError<T>(
    error: any,
    options: ErrorHandlingOptions = {},
    retryFn?: () => Promise<T>
  ): Promise<{ error: ApiError; data?: T }> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const formattedError = this.formatApiError(error);
    
    // Log error (unless suppressed)
    if (!opts.suppressError) {
      await this.logError(formattedError);
    }
    
    // Check if we should retry the request
    if (opts.retries && opts.retries > 0 && retryFn) {
      if (
        formattedError.type === ErrorType.NETWORK || 
        formattedError.type === ErrorType.TIMEOUT ||
        formattedError.type === ErrorType.SERVER
      ) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
        
        try {
          // Retry the request with one fewer retry
          return retryFn().then(data => ({ data, error: null }));
        } catch (retryError) {
          // If retry fails, handle with one fewer retry
          return this.handleApiError(
            retryError,
            { ...opts, retries: opts.retries - 1 },
            retryFn
          );
        }
      }
    }
    
    // Try to recover from cache if enabled and cache key provided
    if (opts.useCache && opts.cacheKey) {
      const cachedData = dataCache.get<T>(opts.cacheKey);
      if (cachedData) {
        return {
          error: formattedError,
          data: cachedData,
        };
      }
    }
    
    // Use fallback data if provided
    if (opts.fallbackData !== undefined) {
      return {
        error: formattedError,
        data: opts.fallbackData,
      };
    }
    
    // Otherwise, just return the error
    return { error: formattedError };
  }
  
  /**
   * Generate a trace ID for error tracking
   */
  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Check if user should be redirected based on error
   */
  shouldRedirect(error: ApiError): boolean {
    return error.type === ErrorType.AUTH;
  }
  
  /**
   * Get appropriate redirect URL based on error
   */
  getRedirectUrl(error: ApiError): string {
    if (error.type === ErrorType.AUTH) {
      return '/login?session=expired';
    }
    
    return '/error';
  }
}

export const apiErrorHandler = ApiErrorHandler.getInstance();
export default ApiErrorHandler;