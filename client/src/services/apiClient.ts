import { API_BASE_URL, DEMO_CONFIG } from '../constants/config';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  userId?: string;
}

export const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', headers = {}, body, userId = DEMO_CONFIG.demoUserId } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (userId) {
    reqHeaders['x-user-id'] = userId;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      const errorMessage = json.error?.message || json.message || `Request failed with status ${response.status}`;
      const error: any = new Error(errorMessage);
      error.code = json.error?.code || 'API_ERROR';
      error.status = response.status;
      throw error;
    }

    return json.data as T;
  } catch (err: any) {
    if (err.status) {
      throw err;
    }
    const networkError: any = new Error('Network error. Failed to connect to Feedants backend server.');
    networkError.code = 'NETWORK_ERROR';
    throw networkError;
  }
};
