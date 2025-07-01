
import React from "react";
import { APICredentialsList } from "@/components/integrations/APICredentialsList";
import { PageLayout } from "@/components/layouts/PageLayout";

const APIKeyManagement = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "API Key Management" }
  ];

  return (
    <PageLayout
      title="API Credential Management"
      description="Securely manage your integration API keys and credentials. Connect to external services like OpenAI, Salesforce, and more."
      breadcrumbs={breadcrumbs}
    >
      <APICredentialsList />
    </PageLayout>
  );
};

export default APIKeyManagement;
