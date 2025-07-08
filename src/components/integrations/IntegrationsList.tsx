
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { integrationAPI } from "@/services/integrationAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { IntegrationSetupDialog } from "./IntegrationSetupDialog";
import { useState } from "react";

export const IntegrationsList = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch available integrations from backend
  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => integrationAPI.getIntegrations(),
  });

  // Fetch current credentials from backend
  const { data: credentials = [] } = useQuery({
    queryKey: ['credentials'],
    queryFn: () => integrationAPI.getCredentials(),
  });

  const handleSetupIntegration = (integration: any) => {
    setSelectedIntegration(integration);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedIntegration(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration: any) => {
          const hasCredentials = credentials.some((c: any) => c.integration_id === integration.id);
          
          return (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <Badge variant={hasCredentials ? "default" : "outline"}>
                    {hasCredentials ? "Connected" : "Available"}
                  </Badge>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleSetupIntegration(integration)}
                  variant={hasCredentials ? "outline" : "default"}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {hasCredentials ? "Manage" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <IntegrationSetupDialog
        integration={selectedIntegration}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};
