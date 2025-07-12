
import React from "react";
import { APICredentialsList } from "@/components/integrations/APICredentialsList";
import { BackendConnectionDiagnostic } from "@/components/test/BackendConnectionDiagnostic";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="diagnostics">Connection Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="space-y-6">
          <APICredentialsList />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-6">
          <BackendConnectionDiagnostic />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default APIKeyManagement;
