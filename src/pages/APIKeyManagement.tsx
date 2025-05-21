
import React from "react";
import { Layout } from "@/components/Layout";
import { APICredentialsList } from "@/components/integrations/APICredentialsList";
import { PageHeader } from "@/components/ui/page-header";

const APIKeyManagement = () => {
  return (
    <Layout>
      <div className="container py-6 max-w-7xl mx-auto">
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
