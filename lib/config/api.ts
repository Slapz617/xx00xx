// API Configuration with headers and key management
export const API_CONFIG = {
  defaultHeaders: {
    'Content-Type': 'application/json',
    'x-api-key': '', // enter api key here
  },
  
  // Different service configurations
  services: {
    jupiter: {
      baseURL: 'https://quote-api.jup.ag/v6',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_JUPITER_API_KEY || '',
      }
    },
    birdeye: {
      baseURL: 'https://public-api.birdeye.so',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '',
      }
    },
    coingecko: {
      baseURL: 'https://api.coingecko.com/api/v3',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '',
      }
    },
    meteora: {
      baseURL: 'https://app.meteora.ag/api',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_METEORA_API_KEY || '',
      }
    },
    custom: {
      baseURL: process.env.NEXT_PUBLIC_CUSTOM_API_URL || '',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_CUSTOM_API_KEY || '',
      }
    }
  }
};

// Get headers for specific service or default
export const getApiHeaders = (service?: keyof typeof API_CONFIG.services, customApiKey?: string) => {
  if (service && API_CONFIG.services[service]) {
    const serviceConfig = API_CONFIG.services[service];
    return {
      ...serviceConfig.headers,
      ...(customApiKey && { 'x-api-key': customApiKey })
    };
  }
  
  return {
    ...API_CONFIG.defaultHeaders,
    ...(customApiKey && { 'x-api-key': customApiKey })
  };
};

// API request wrapper with proper headers
export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(service?: keyof typeof API_CONFIG.services, customApiKey?: string) {
    if (service && API_CONFIG.services[service]) {
      this.baseURL = API_CONFIG.services[service].baseURL;
      this.headers = getApiHeaders(service, customApiKey);
    } else {
      this.baseURL = '';
      this.headers = getApiHeaders(undefined, customApiKey);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Update API key dynamically
  setApiKey(apiKey: string) {
    this.headers['x-api-key'] = apiKey;
  }

  // Update headers
  updateHeaders(newHeaders: Record<string, string>) {
    this.headers = { ...this.headers, ...newHeaders };
  }
}

// Convenience functions for quick API calls
export const makeApiRequest = async <T>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
    apiKey?: string;
  } = {}
): Promise<T> => {
  const { method = 'GET', data, headers = {}, apiKey } = options;
  
  const requestHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Service-specific API clients
export const jupiterApi = new ApiClient('jupiter');
export const birdeyeApi = new ApiClient('birdeye');
export const coingeckoApi = new ApiClient('coingecko');
export const meteoraApi = new ApiClient('meteora');
export const customApi = new ApiClient('custom');