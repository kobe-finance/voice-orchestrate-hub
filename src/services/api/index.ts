/**
 * Main API Service Export
 * Consolidates all API services into a single interface
 */

export { APIClient, apiClient } from './base';
export { IntegrationsAPI, integrationsAPI } from './integrations';
export { OrganizationsAPI, organizationsAPI } from './organizations';
export { AnalyticsAPI, analyticsAPI } from './analytics';
export { AgentsAPI, agentsAPI } from './agents';

// Export error classes
export { 
  APIClientError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  AuthorizationError,
  ValidationError as APIValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  createAPIError,
  handleAPIError,
  getErrorMessage,
  shouldRetry,
  getRetryDelay
} from './errors';

// Re-export all types
export type * from './types';

// Consolidated API interface
export interface APIServices {
  integrations: IntegrationsAPI;
  organizations: OrganizationsAPI;
  analytics: AnalyticsAPI;
  agents: AgentsAPI;
}

// Main API service factory
import { IntegrationsAPI } from './integrations';
import { OrganizationsAPI } from './organizations';
import { AnalyticsAPI } from './analytics';
import { AgentsAPI } from './agents';

class APIService implements APIServices {
  integrations = new IntegrationsAPI();
  organizations = new OrganizationsAPI();
  analytics = new AnalyticsAPI();
  agents = new AgentsAPI();
}

// Export singleton instance
export const api = new APIService();

// Backwards compatibility exports
export { integrationAPI } from '../api/integrationClient';
export { credentialService } from '../credentialService';
export { backendService } from '../backendService';

// Default export
export default api;