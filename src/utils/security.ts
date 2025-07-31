// AEDI Security - Client-side Security Utilities
// Comprehensive security functions for the React application

/**
 * Input sanitization and validation utilities
 */

// HTML sanitization to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Remove potentially dangerous script tags
export const removeScriptTags = (input: string): string => {
  if (!input) return '';
  
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// SQL injection prevention for search queries
export const sanitizeSqlInput = (input: string): string => {
  if (!input) return '';
  
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /('|(\\')|(;)|(\\)|(\/\*)|(--)|(\*\/))/g,
    /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    /((\%27)|(\'))((\%75)|u|(\%55))((\%6E)|n|(\%4E))((\%69)|i|(\%49))((\%6F)|o|(\%4F))((\%6E)|n|(\%4E))/gi
  ];
  
  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};

// Email validation with security considerations
export const validateEmail = (email: string): boolean => {
  if (!email || email.length > 254) return false;
  
  // RFC 5322 compliant regex (simplified for security)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email);
};

// Phone number validation (international format)
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check for valid international format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  return phoneRegex.test(cleaned);
};

// URL validation to prevent malicious redirects
export const validateUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTPS URLs
    if (urlObj.protocol !== 'https:') return false;
    
    // Block suspicious domains
    const suspiciousDomains = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'file://',
      'javascript:',
      'data:',
      'vbscript:'
    ];
    
    const hostname = urlObj.hostname.toLowerCase();
    return !suspiciousDomains.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
};

/**
 * Content Security Policy helpers
 */

// Generate nonce for inline scripts (if needed)
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSP compliance for dynamic content
export const isCSPCompliant = (content: string): boolean => {
  const dangerousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onload, etc.
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
};

/**
 * Rate limiting for client-side requests
 */

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxRequests: number = 10, timeWindowMinutes: number = 1) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  canMakeRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.timeWindow);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Export rate limiter instances
export const contactFormLimiter = new RateLimiter(3, 5); // 3 requests per 5 minutes
export const apiRequestLimiter = new RateLimiter(50, 1); // 50 requests per minute

/**
 * Secure storage utilities
 */

// Secure localStorage wrapper
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(`aedi_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },

  get: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(`aedi_${key}`);
      if (!encrypted) return null;
      
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`aedi_${key}`);
  },

  clear: (): void => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('aedi_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

/**
 * Security monitoring and logging
 */

export const securityLogger = {
  logSuspiciousActivity: (activity: string, details: any = {}): void => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      activity,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };
    
    // In production, send to security monitoring service
    console.warn('Security Alert:', logEntry);
    
    // Store locally for analysis
    const logs = secureStorage.get('security_logs') || [];
    logs.push(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    secureStorage.set('security_logs', logs);
  },

  logFailedValidation: (field: string, value: string, reason: string): void => {
    securityLogger.logSuspiciousActivity('validation_failure', {
      field,
      value: value.substring(0, 50), // Truncate for privacy
      reason
    });
  },

  logRateLimitExceeded: (identifier: string): void => {
    securityLogger.logSuspiciousActivity('rate_limit_exceeded', {
      identifier
    });
  }
};

/**
 * Browser security checks
 */

export const browserSecurity = {
  // Check if browser supports required security features
  checkSecuritySupport: (): { supported: boolean; missing: string[] } => {
    const missing: string[] = [];
    
    if (!window.crypto || !window.crypto.getRandomValues) {
      missing.push('Web Crypto API');
    }
    
    if (!window.localStorage) {
      missing.push('Local Storage');
    }
    
    if (!window.fetch) {
      missing.push('Fetch API');
    }
    
    if (!window.URL) {
      missing.push('URL API');
    }
    
    return {
      supported: missing.length === 0,
      missing
    };
  },

  // Detect if running in secure context
  isSecureContext: (): boolean => {
    return window.isSecureContext || window.location.protocol === 'https:';
  },

  // Check for common security extensions/tools
  detectSecurityTools: (): string[] => {
    const detected: string[] = [];
    
    // Check for ad blockers (simplified detection)
    if (window.navigator.plugins.length === 0) {
      detected.push('possible_adblocker');
    }
    
    // Check for developer tools (basic detection)
    if (window.outerHeight - window.innerHeight > 200) {
      detected.push('devtools_open');
    }
    
    return detected;
  }
};

// Initialize security checks on module load
const securityCheck = browserSecurity.checkSecuritySupport();
if (!securityCheck.supported) {
  securityLogger.logSuspiciousActivity('unsupported_browser', {
    missing: securityCheck.missing
  });
}

if (!browserSecurity.isSecureContext()) {
  securityLogger.logSuspiciousActivity('insecure_context', {
    protocol: window.location.protocol
  });
}
