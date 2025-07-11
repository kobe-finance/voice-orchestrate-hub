/**
 * Centralized Error Handling
 * Standardized error types and handling utilities
 */

export class APIClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIClientError';
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  get isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  get isValidationError(): boolean {
    return this.statusCode === 422 || this.code === 'VALIDATION_ERROR';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class AuthenticationError extends APIClientError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIClientError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends APIClientError {
  constructor(
    message: string,
    public validationErrors?: Array<{
      field: string;
      message: string;
      code: string;
    }>
  ) {
    super(message, 422, 'VALIDATION_ERROR', { validationErrors });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIClientError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIClientError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends APIClientError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_ERROR', { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ServerError extends APIClientError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

// Error factory function
export function createAPIError(
  statusCode: number,
  message: string,
  code?: string,
  details?: Record<string, any>
): APIClientError {
  switch (statusCode) {
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 422:
      return new ValidationError(message, details?.validationErrors);
    case 429:
      return new RateLimitError(details?.retryAfter);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message);
    default:
      return new APIClientError(message, statusCode, code, details);
  }
}

// Error handling utilities
export function handleAPIError(error: unknown): APIClientError {
  if (error instanceof APIClientError) {
    return error;
  }

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return new APIClientError('Unable to connect to server. Please check your internet connection.', 0, 'NETWORK_ERROR');
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return new APIClientError('Request timed out. Please try again.', 0, 'TIMEOUT_ERROR');
  }

  if (error instanceof Error) {
    return new APIClientError(error.message, 0, 'UNKNOWN_ERROR');
  }

  return new APIClientError('An unknown error occurred', 0, 'UNKNOWN_ERROR');
}

// Toast notification helpers
export function getErrorMessage(error: APIClientError): string {
  if (error.isAuthError) {
    return 'Authentication required. Please log in again.';
  }

  if (error.isValidationError) {
    return error.details?.validationErrors?.[0]?.message || 'Invalid input provided';
  }

  if (error.isNotFoundError) {
    return 'The requested resource was not found';
  }

  if (error instanceof NetworkError) {
    return 'Connection failed. Please check your internet connection.';
  }

  if (error instanceof TimeoutError) {
    return 'Request timed out. Please try again.';
  }

  if (error instanceof RateLimitError) {
    return 'Too many requests. Please wait before trying again.';
  }

  if (error.isServerError) {
    return 'Server error occurred. Please try again later.';
  }

  return error.message || 'An unexpected error occurred';
}

export function shouldRetry(error: APIClientError): boolean {
  // Retry on server errors and network errors, but not client errors
  return error.isServerError || error instanceof NetworkError || error instanceof TimeoutError;
}

export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
}