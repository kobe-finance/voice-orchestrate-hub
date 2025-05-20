
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

type IntegrationSetupProps = {
  onUpdate: (data: any) => void;
  initialData: any;
};

// Mock integration data
const availableIntegrations = [
  {
    id: "crm",
    name: "CRM Systems",
    description: "Connect your customer relationship management system",
    options: ["Salesforce", "HubSpot", "Zoho CRM", "Microsoft Dynamics"],
    icon: "💼",
  },
  {
    id: "calendar",
    name: "Calendar & Scheduling",
    description: "Sync with your appointment scheduling systems",
    options: ["Google Calendar", "Microsoft Outlook", "Calendly", "Acuity Scheduling"],
    icon: "📅",
  },
  {
    id: "helpdesk",
    name: "Helpdesk & Ticketing",
    description: "Connect your support ticketing system",
    options: ["Zendesk", "Freshdesk", "ServiceNow", "Jira Service Desk"],
    icon: "🎫",
  },
  {
    id: "communications",
    name: "Communication Platforms",
    description: "Integrate with your existing phone and messaging systems",
    options: ["Twilio", "RingCentral", "Vonage", "8x8"],
    icon: "📞",
  },
];

const IntegrationSetupStep = ({ onUpdate, initialData }: IntegrationSetupProps) => {
  const [selectedIntegrations, setSelectedIntegrations] = useState<Record<string, any>>(
    initialData || {}
  );
  const [activeTab, setActiveTab] = useState("crm");
  const [connecting, setConnecting] = useState<string | null>(null);

  // Handle connecting to an integration
  const handleConnect = (integrationId: string, option: string) => {
    setConnecting(option);
    
    // Simulate API connection
    setTimeout(() => {
      // Update selected integrations
      setSelectedIntegrations(prev => ({
        ...prev,
        [integrationId]: {
          provider: option,
          connected: true,
          timestamp: new Date().toISOString(),
        }
      }));

      // Notify parent component
      onUpdate({
        ...selectedIntegrations,
        [integrationId]: {
          provider: option,
          connected: true,
          timestamp: new Date().toISOString(),
        }
      });

      setConnecting(null);
      toast.success(`Connected to ${option}`);
    }, 1500);
  };

  // Handle disconnecting from an integration
  const handleDisconnect = (integrationId: string) => {
    // Create a new object without the removed integration
    const updatedIntegrations = { ...selectedIntegrations };
    delete updatedIntegrations[integrationId];
    
    setSelectedIntegrations(updatedIntegrations);
    onUpdate(updatedIntegrations);
    toast.info("Integration disconnected");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Connect Your Systems</h2>
        <p className="text-muted-foreground">
          Integrate your existing tools with VoiceOrchestrate™
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          {availableIntegrations.map((integration) => (
            <TabsTrigger 
              key={integration.id} 
              value={integration.id}
              className="flex items-center gap-2"
            >
              <span>{integration.icon}</span>
              <span className="hidden sm:inline">{integration.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableIntegrations.map((integration) => (
          <TabsContent key={integration.id} value={integration.id} className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIntegrations[integration.id] ? (
                  <div className="bg-secondary/40 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Connected to {selectedIntegrations[integration.id].provider}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Connected on {new Date(selectedIntegrations[integration.id].timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm">Select a provider to connect:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {integration.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => handleConnect(integration.id, option)}
                          disabled={connecting === option}
                          className="justify-start h-auto py-3"
                        >
                          {connecting === option ? (
                            <>Connecting...</>
                          ) : (
                            <>{option}</>
                          )}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Don't see your tool? Contact us for custom integrations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="bg-muted/50 rounded-md p-4">
        <h3 className="font-medium mb-2">Integration Summary</h3>
        {Object.keys(selectedIntegrations).length > 0 ? (
          <ul className="space-y-1 text-sm">
            {Object.entries(selectedIntegrations).map(([id, details]: [string, any]) => {
              const integrationName = availableIntegrations.find(i => i.id === id)?.name;
              return (
                <li key={id} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
                  {integrationName}: {details.provider}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No integrations connected yet. These are optional and can be set up later.
          </p>
        )}
      </div>
    </div>
  );
};

export default IntegrationSetupStep;
