/**
 * Advanced API Key Management System
 * Demonstrates secure patterns for handling API keys in production applications
 */

class ApiKeyManager {
    constructor() {
        this.keys = new Map();
        this.keyRotationInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    /**
     * Add an API key with metadata
     * @param {string} service - Service identifier
     * @param {string} key - API key
     * @param {Object} config - Configuration options
     */
    addKey(service, key, config = {}) {
        this.keys.set(service, {
            key,
            createdAt: Date.now(),
            lastUsed: null,
            usageCount: 0,
            rateLimit: config.rateLimit || { requests: 100, window: 60000 },
            environment: config.environment || 'development',
            autoRotate: config.autoRotate || false,
            ...config
        });
    }

    /**
     * Get API key for a service
     * @param {string} service - Service identifier
     * @returns {string|null} API key or null if not found
     */
    getKey(service) {
        const keyData = this.keys.get(service);
        if (!keyData) {
            console.warn(`API key not found for service: ${service}`);
            return null;
        }

        // Update usage statistics
        keyData.lastUsed = Date.now();
        keyData.usageCount++;

        // Check if key needs rotation
        if (keyData.autoRotate && this.shouldRotateKey(keyData)) {
            this.scheduleKeyRotation(service);
        }

        return keyData.key;
    }

    /**
     * Check if a key should be rotated
     * @param {Object} keyData - Key data object
     * @returns {boolean} Whether key should be rotated
     */
    shouldRotateKey(keyData) {
        const age = Date.now() - keyData.createdAt;
        return age > this.keyRotationInterval;
    }

    /**
     * Schedule key rotation (placeholder for actual implementation)
     * @param {string} service - Service identifier
     */
    async scheduleKeyRotation(service) {
        console.log(`Scheduling key rotation for service: ${service}`);
        // In a real implementation, this would trigger a secure key rotation process
        // This might involve calling an API to generate a new key, updating configuration, etc.
    }

    /**
     * Remove a key from the manager
     * @param {string} service - Service identifier
     */
    removeKey(service) {
        this.keys.delete(service);
    }

    /**
     * Get usage statistics for all keys
     * @returns {Object} Usage statistics
     */
    getUsageStats() {
        const stats = {};
        for (const [service, data] of this.keys.entries()) {
            stats[service] = {
                usageCount: data.usageCount,
                lastUsed: data.lastUsed,
                age: Date.now() - data.createdAt,
                environment: data.environment
            };
        }
        return stats;
    }

    /**
     * Validate API key format
     * @param {string} key - API key to validate
     * @param {string} format - Expected format (e.g., 'jwt', 'uuid', 'hex')
     * @returns {boolean} Whether key is valid
     */
    validateKeyFormat(key, format = 'generic') {
        if (!key || typeof key !== 'string') return false;

        const formats = {
            jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            hex: /^[a-fA-F0-9]+$/,
            base64: /^[A-Za-z0-9+/]+=*$/,
            generic: /^[A-Za-z0-9_-]{16,}$/ // At least 16 alphanumeric characters
        };

        return formats[format] ? formats[format].test(key) : formats.generic.test(key);
    }
}

/**
 * Environment-specific API configuration
 */
class EnvironmentConfig {
    constructor(environment = 'development') {
        this.environment = environment;
        this.config = this.getConfigForEnvironment(environment);
    }

    getConfigForEnvironment(env) {
        const configs = {
            development: {
                apiTimeout: 30000,
                retryAttempts: 3,
                logLevel: 'debug',
                rateLimiting: false,
                encryptKeys: false
            },
            staging: {
                apiTimeout: 15000,
                retryAttempts: 2,
                logLevel: 'info',
                rateLimiting: true,
                encryptKeys: true
            },
            production: {
                apiTimeout: 10000,
                retryAttempts: 1,
                logLevel: 'error',
                rateLimiting: true,
                encryptKeys: true
            }
        };

        return configs[env] || configs.development;
    }

    getTimeout() {
        return this.config.apiTimeout;
    }

    getRetryAttempts() {
        return this.config.retryAttempts;
    }

    shouldEncryptKeys() {
        return this.config.encryptKeys;
    }

    shouldRateLimit() {
        return this.config.rateLimiting;
    }
}

/**
 * Secure HTTP client with automatic key management
 */
class SecureHttpClient {
    constructor(keyManager, environmentConfig) {
        this.keyManager = keyManager;
        this.envConfig = environmentConfig;
        this.requestQueue = [];
        this.rateLimiters = new Map();
    }

    /**
     * Make an authenticated API request
     * @param {string} service - Service identifier
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async request(service, endpoint, options = {}) {
        const apiKey = this.keyManager.getKey(service);
        if (!apiKey) {
            throw new Error(`API key not found for service: ${service}`);
        }

        // Check rate limiting
        if (this.envConfig.shouldRateLimit() && !this.checkRateLimit(service)) {
            throw new Error(`Rate limit exceeded for service: ${service}`);
        }

        const requestConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                ...options.headers
            },
            timeout: this.envConfig.getTimeout(),
            ...options
        };

        let lastError;
        const maxRetries = this.envConfig.getRetryAttempts();

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.makeRequest(endpoint, requestConfig);
                return response;
            } catch (error) {
                lastError = error;
                
                // Don't retry on client errors (4xx) except 429 (rate limit)
                if (error.status >= 400 && error.status < 500 && error.status !== 429) {
                    break;
                }

                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    await this.delay(1000 * Math.pow(2, attempt));
                }
            }
        }

        throw lastError;
    }

    /**
     * Make the actual HTTP request
     * @param {string} url - Request URL
     * @param {Object} config - Request configuration
     * @returns {Promise} Response promise
     */
    async makeRequest(url, config) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }

    /**
     * Check rate limiting for a service
     * @param {string} service - Service identifier
     * @returns {boolean} Whether request is within rate limit
     */
    checkRateLimit(service) {
        if (!this.rateLimiters.has(service)) {
            this.rateLimiters.set(service, {
                requests: [],
                maxRequests: 100,
                windowMs: 60000
            });
        }

        const limiter = this.rateLimiters.get(service);
        const now = Date.now();
        const windowStart = now - limiter.windowMs;

        // Remove old requests
        limiter.requests = limiter.requests.filter(timestamp => timestamp > windowStart);

        // Check if under limit
        if (limiter.requests.length >= limiter.maxRequests) {
            return false;
        }

        // Add current request
        limiter.requests.push(now);
        return true;
    }

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Delay promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Example usage and initialization
 */
function initializeApiKeySystem() {
    // Create instances
    const keyManager = new ApiKeyManager();
    const envConfig = new EnvironmentConfig(process.env.NODE_ENV || 'development');
    const httpClient = new SecureHttpClient(keyManager, envConfig);

    // Add API keys (in real app, these would come from environment variables)
    keyManager.addKey('github', process.env.GITHUB_API_KEY, {
        environment: envConfig.environment,
        autoRotate: true,
        rateLimit: { requests: 5000, window: 3600000 } // 5000 requests per hour
    });

    keyManager.addKey('stripe', process.env.STRIPE_SECRET_KEY, {
        environment: envConfig.environment,
        autoRotate: false // Stripe keys are manually rotated
    });

    keyManager.addKey('openai', process.env.OPENAI_API_KEY, {
        environment: envConfig.environment,
        autoRotate: true,
        rateLimit: { requests: 100, window: 60000 } // 100 requests per minute
    });

    return { keyManager, envConfig, httpClient };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ApiKeyManager,
        EnvironmentConfig,
        SecureHttpClient,
        initializeApiKeySystem
    };
}

// Example usage in browser
if (typeof window !== 'undefined') {
    window.ApiKeySystem = {
        ApiKeyManager,
        EnvironmentConfig,
        SecureHttpClient,
        initializeApiKeySystem
    };
}