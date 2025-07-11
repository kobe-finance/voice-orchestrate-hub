/**
 * Main API Service Export
 * Consolidates all API services into a single interface
 */

export { APIClient, APIClientError, apiClient } from './base';
export { IntegrationsAPI, integrationsAPI } from './integrations';
export { OrganizationsAPI, organizationsAPI } from './organizations';
export { AnalyticsAPI, analyticsAPI } from './analytics';

// Re-export all types
export type * from './types';

// Consolidated API interface
export interface APIServices {
  integrations: IntegrationsAPI;
  organizations: OrganizationsAPI;
  analytics: AnalyticsAPI;
}

// Main API service factory
import { IntegrationsAPI } from './integrations';
import { OrganizationsAPI } from './organizations';
import { AnalyticsAPI } from './analytics';

class APIService implements APIServices {
  integrations = new IntegrationsAPI();
  organizations = new OrganizationsAPI();
  analytics = new AnalyticsAPI();
}

// Export singleton instance
export const api = new APIService();

// Backwards compatibility exports
export { integrationAPI } from '../api/integrationClient';
export { credentialService } from '../credentialService';
export { backendService } from '../backendService';

// Default export
export default api;