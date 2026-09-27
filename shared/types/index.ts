// Shared API and domain contracts between client and server

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp?: string;
}

export interface HealthStatusResponse {
  success: boolean;
  message: string;
}
