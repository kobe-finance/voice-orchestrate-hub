
import React from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { IntegrationsList } from "@/components/integrations/IntegrationsList";

const IntegrationsPage = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Integrations" }
  ];

  return (
    <PageLayout
      title="Integration Management"
      description="Connect and manage your third-party integrations using our intelligent backend orchestration."
      breadcrumbs={breadcrumbs}
    >
      <IntegrationsList />
    </PageLayout>
  );
};

export default IntegrationsPage;
