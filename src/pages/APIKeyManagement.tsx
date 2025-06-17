
import React from "react";
import { Layout } from "@/components/Layout";
import { APICredentialsList } from "@/components/integrations/APICredentialsList";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const APIKeyManagement = () => {
  return (
    <Layout>
      <div className="container py-6 max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Key Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader
          title="API Credential Management"
          description="Securely manage your integration API keys and credentials"
          className="mb-6"
        />
        <APICredentialsList />
      </div>
    </Layout>
  );
};

export default APIKeyManagement;
