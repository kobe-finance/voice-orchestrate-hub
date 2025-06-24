
import React, { useEffect } from "react";
import { APICredentialsList } from "@/components/integrations/APICredentialsList";
import { PageLayout } from "@/components/layouts/PageLayout";
import { PageLoading } from "@/components/ui/page-loading";
import { PageError } from "@/components/ui/page-error";
import { usePageState } from "@/hooks/usePageState";

const APIKeyManagement = () => {
  const { isLoading, error, setLoading, setError } = usePageState({ initialLoading: true });

  useEffect(() => {
    // Simulate loading API credentials
    const loadCredentials = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch credentials here
        // const response = await fetchAPICredentials();
        
        setLoading(false);
      } catch (err) {
        setError({
          message: 'Failed to load API credentials. Please check your permissions and try again.',
          code: 'CREDENTIALS_LOAD_ERROR',
          retry: loadCredentials
        });
      }
    };

    loadCredentials();
  }, [setLoading, setError]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "API Key Management" }
  ];

  if (error) {
    return (
      <PageLayout
        title="API Credential Management"
        breadcrumbs={breadcrumbs}
      >
        <PageError error={error} />
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        title="API Credential Management"
        description="Securely manage your integration API keys and credentials"
        breadcrumbs={breadcrumbs}
      >
        <PageLoading type="skeleton" />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="API Credential Management"
      description="Securely manage your integration API keys and credentials"
      breadcrumbs={breadcrumbs}
    >
      <APICredentialsList />
    </PageLayout>
  );
};

export default APIKeyManagement;
