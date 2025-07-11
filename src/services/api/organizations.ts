/**
 * Organization/Tenant API Service
 * Handles organization and tenant management API calls
 */

import { apiClient } from './base';
import type {
  Organization,
  OrganizationMember,
  CreateOrganizationRequest,
  TenantContext,
  User,
  PaginatedRequest,
  PaginatedResponse
} from './types';

export class OrganizationsAPI {
  // Organization Management
  async getOrganizations(): Promise<Organization[]> {
    return apiClient.get<Organization[]>('/organizations');
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    return apiClient.get<Organization>(`/organizations/${organizationId}`);
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    return apiClient.post<Organization>('/organizations', data);
  }

  async updateOrganization(organizationId: string, data: Partial<CreateOrganizationRequest>): Promise<Organization> {
    return apiClient.put<Organization>(`/organizations/${organizationId}`, data);
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    return apiClient.delete<void>(`/organizations/${organizationId}`);
  }

  // Tenant Context Management
  async switchTenant(tenantId: string): Promise<TenantContext> {
    return apiClient.post<TenantContext>('/organizations/switch-tenant', { tenant_id: tenantId });
  }

  async getCurrentTenantContext(): Promise<TenantContext> {
    return apiClient.get<TenantContext>('/organizations/current-context');
  }

  // Member Management
  async getOrganizationMembers(organizationId: string, params?: PaginatedRequest): Promise<PaginatedResponse<OrganizationMember>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiClient.get<PaginatedResponse<OrganizationMember>>(
      `/organizations/${organizationId}/members${query ? `?${query}` : ''}`
    );
  }

  async addOrganizationMember(organizationId: string, data: {
    email: string;
    role: 'admin' | 'member' | 'viewer';
  }): Promise<OrganizationMember> {
    return apiClient.post<OrganizationMember>(`/organizations/${organizationId}/members`, data);
  }

  async updateMemberRole(organizationId: string, memberId: string, role: string): Promise<OrganizationMember> {
    return apiClient.patch<OrganizationMember>(`/organizations/${organizationId}/members/${memberId}`, { role });
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    return apiClient.delete<void>(`/organizations/${organizationId}/members/${memberId}`);
  }

  // Invitations
  async sendInvitation(organizationId: string, data: {
    email: string;
    role: 'admin' | 'member' | 'viewer';
  }): Promise<{ invitation_id: string }> {
    return apiClient.post<{ invitation_id: string }>(`/organizations/${organizationId}/invitations`, data);
  }

  async acceptInvitation(token: string): Promise<OrganizationMember> {
    return apiClient.post<OrganizationMember>('/organizations/invitations/accept', { token });
  }

  async getInvitations(organizationId: string): Promise<Array<{
    id: string;
    email: string;
    role: string;
    expires_at: string;
    created_at: string;
  }>> {
    return apiClient.get<Array<{
      id: string;
      email: string;
      role: string;
      expires_at: string;
      created_at: string;
    }>>(`/organizations/${organizationId}/invitations`);
  }

  async revokeInvitation(organizationId: string, invitationId: string): Promise<void> {
    return apiClient.delete<void>(`/organizations/${organizationId}/invitations/${invitationId}`);
  }

  // Organization Settings
  async updateSettings(organizationId: string, settings: Record<string, any>): Promise<Organization> {
    return apiClient.patch<Organization>(`/organizations/${organizationId}/settings`, { settings });
  }

  async getSettings(organizationId: string): Promise<Record<string, any>> {
    return apiClient.get<Record<string, any>>(`/organizations/${organizationId}/settings`);
  }
}

export const organizationsAPI = new OrganizationsAPI();