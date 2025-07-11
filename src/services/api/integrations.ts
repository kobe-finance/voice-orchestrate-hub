/**
 * Integration API Service
 * Handles all integration-related API calls
 */

import { apiClient } from './base';
import type {
  Integration,
  IntegrationCredential,
  CreateCredentialRequest,
  TestCredentialRequest,
  TestCredentialResponse,
  UserIntegration,
  InstallIntegrationRequest,
  PaginatedRequest,
  PaginatedResponse,
  DispatchRequest,
  DispatchResponse,
  QuotaUsage,
  SetQuotaRequest
} from './types';

export class IntegrationsAPI {
  // Integration Management
  async getIntegrations(params?: PaginatedRequest & { category?: string; search?: string }): Promise<Integration[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiClient.get<Integration[]>(`/integrations${query ? `?${query}` : ''}`);
  }

  async getIntegration(integrationId: string): Promise<Integration> {
    return apiClient.get<Integration>(`/integrations/${integrationId}`);
  }

  async getFormSchema(integrationId: string): Promise<Record<string, any>> {
    return apiClient.get<Record<string, any>>(`/integrations/${integrationId}/form-schema`);
  }

  // Credential Management
  async getCredentials(): Promise<IntegrationCredential[]> {
    return apiClient.get<IntegrationCredential[]>('/integrations/credentials');
  }

  async getCredential(credentialId: string): Promise<IntegrationCredential> {
    return apiClient.get<IntegrationCredential>(`/integrations/credentials/${credentialId}`);
  }

  async createCredential(data: CreateCredentialRequest): Promise<IntegrationCredential> {
    return apiClient.post<IntegrationCredential>('/integrations/credentials', data);
  }

  async updateCredential(credentialId: string, data: Partial<CreateCredentialRequest>): Promise<IntegrationCredential> {
    return apiClient.put<IntegrationCredential>(`/integrations/credentials/${credentialId}`, data);
  }

  async deleteCredential(credentialId: string): Promise<void> {
    return apiClient.delete<void>(`/integrations/credentials/${credentialId}`);
  }

  async testCredential(data: TestCredentialRequest): Promise<TestCredentialResponse> {
    return apiClient.post<TestCredentialResponse>('/integrations/credentials/test', data);
  }

  // User Integration Management
  async getUserIntegrations(): Promise<UserIntegration[]> {
    return apiClient.get<UserIntegration[]>('/integrations/user-integrations');
  }

  async getUserIntegration(userIntegrationId: string): Promise<UserIntegration> {
    return apiClient.get<UserIntegration>(`/integrations/user-integrations/${userIntegrationId}`);
  }

  async installIntegration(data: InstallIntegrationRequest): Promise<UserIntegration> {
    return apiClient.post<UserIntegration>('/integrations/install', data);
  }

  async uninstallIntegration(userIntegrationId: string): Promise<void> {
    return apiClient.delete<void>(`/integrations/user-integrations/${userIntegrationId}`);
  }

  async updateIntegrationConfig(userIntegrationId: string, config: Record<string, any>): Promise<UserIntegration> {
    return apiClient.patch<UserIntegration>(`/integrations/user-integrations/${userIntegrationId}`, { config });
  }

  // Dispatch/Orchestration
  async dispatch(data: DispatchRequest): Promise<DispatchResponse> {
    return apiClient.post<DispatchResponse>('/integrations/dispatch', data);
  }

  // Quota Management
  async getCredentialQuota(credentialId: string): Promise<QuotaUsage[]> {
    return apiClient.get<QuotaUsage[]>(`/integrations/credentials/${credentialId}/quota`);
  }

  async setCredentialQuota(credentialId: string, data: SetQuotaRequest): Promise<QuotaUsage> {
    return apiClient.post<QuotaUsage>(`/integrations/credentials/${credentialId}/quota`, data);
  }
}

export const integrationsAPI = new IntegrationsAPI();