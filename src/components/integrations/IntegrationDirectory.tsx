
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  popular: boolean;
  connected: boolean;
}

interface IntegrationDirectoryProps {
  searchQuery: string;
  selectedCategory: string | null;
  viewType: "grid" | "list";
}

export const IntegrationDirectory: React.FC<IntegrationDirectoryProps> = ({
  searchQuery,
  selectedCategory,
  viewType,
}) => {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Mock integration data
  const integrations: Integration[] = [
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect to Salesforce CRM to synchronize customer data and interactions",
      category: "crm",
      logo: "https://placekitten.com/100/100?image=1",
      popular: true,
      connected: false,
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Integrate with HubSpot for marketing, sales, and customer service",
      category: "crm",
      logo: "https://placekitten.com/100/100?image=2",
      popular: true,
      connected: false,
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Connect voice agents to Zoom meetings and webinars",
      category: "telephony",
      logo: "https://placekitten.com/100/100?image=3",
      popular: true,
      connected: false,
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "Power voice communications with Twilio's telephony services",
      category: "telephony",
      logo: "https://placekitten.com/100/100?image=4",
      popular: true,
      connected: false,
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      description: "Allow voice agents to manage and schedule appointments",
      category: "scheduling",
      logo: "https://placekitten.com/100/100?image=5",
      popular: true,
      connected: false,
    },
    {
      id: "calendly",
      name: "Calendly",
      description: "Integrate with Calendly for simplified appointment scheduling",
      category: "scheduling",
      logo: "https://placekitten.com/100/100?image=6",
      popular: false,
      connected: false,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Connect to Mailchimp for email marketing campaigns",
      category: "email",
      logo: "https://placekitten.com/100/100?image=7",
      popular: false,
      connected: false,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Create custom automation workflows with thousands of apps",
      category: "webhook",
      logo: "https://placekitten.com/100/100?image=8",
      popular: true,
      connected: false,
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Integrate with QuickBooks for accounting and financial data",
      category: "accounting",
      logo: "https://placekitten.com/100/100?image=9",
      popular: false,
      connected: false,
    }
  ];

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? integration.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenDetails = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsDetailOpen(true);
  };

  const handleConnectIntegration = () => {
    if (!selectedIntegration) return;
    
    setIsDetailOpen(false);
    setIsSetupOpen(true);
  };

  const handleFinishSetup = () => {
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsSetupOpen(false);
      toast.success(`Successfully connected to ${selectedIntegration?.name}`);
    }, 1500);
  };

  return (
    <>
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden">
                    <img 
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {integration.popular && (
                      <Badge variant="secondary" className="text-xs mt-1">Popular</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {integration.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetails(integration)}
                >
                  Details
                </Button>
                <Button
                  variant={integration.connected ? "secondary" : "default"}
                  size="sm"
                  onClick={() => {
                    if (!integration.connected) {
                      handleOpenDetails(integration);
                    }
                  }}
                >
                  {integration.connected ? "Connected" : "Connect"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Integration</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIntegrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden">
                        <img 
                          src={integration.logo}
                          alt={`${integration.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{integration.name}</span>
                      {integration.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {integration.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleOpenDetails(integration)}
                    >
                      Details
                    </Button>
                    <Button
                      variant={integration.connected ? "secondary" : "default"}
                      size="sm"
                      onClick={() => {
                        if (!integration.connected) {
                          handleOpenDetails(integration);
                        }
                      }}
                    >
                      {integration.connected ? "Connected" : "Connect"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Integration Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden">
                    <img 
                      src={selectedIntegration.logo}
                      alt={`${selectedIntegration.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <DialogTitle>{selectedIntegration.name}</DialogTitle>
                </div>
                <DialogDescription>{selectedIntegration.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted/40 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Integration Benefits</h4>
                  <ul className="space-y-1 text-sm list-disc pl-5">
                    <li>Seamless data synchronization</li>
                    <li>Real-time conversation context</li>
                    <li>Automated workflow triggers</li>
                    <li>Custom event handling</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll need administrator access to your {selectedIntegration.name} account and API credentials to complete this integration.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Documentation</h4>
                  <a 
                    href="#" 
                    className="text-sm text-primary flex items-center hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View integration documentation <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnectIntegration}>
                  Connect {selectedIntegration.name}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Setup Wizard Sheet */}
      <Sheet open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          {selectedIntegration && (
            <>
              <SheetHeader>
                <SheetTitle>Connect to {selectedIntegration.name}</SheetTitle>
                <SheetDescription>
                  Follow these steps to connect your {selectedIntegration.name} account
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Generate API Credentials</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Log in to your {selectedIntegration.name} account and generate API credentials
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Enter API Keys</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter the API key and secret from {selectedIntegration.name}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="grid w-full items-center gap-1.5">
                          <label htmlFor="apiKey" className="text-sm font-medium">
                            API Key
                          </label>
                          <input
                            id="apiKey"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter API Key"
                          />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <label htmlFor="apiSecret" className="text-sm font-medium">
                            API Secret
                          </label>
                          <input
                            id="apiSecret"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter API Secret"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Configure Permissions</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select the data access permissions for this integration
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="readData" 
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                            defaultChecked
                          />
                          <label htmlFor="readData" className="text-sm">
                            Read data
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="writeData" 
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="writeData" className="text-sm">
                            Write data
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="deleteData" 
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="deleteData" className="text-sm">
                            Delete data
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-md p-4">
                  <h4 className="text-sm font-medium">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit our documentation for detailed instructions on connecting {selectedIntegration.name}.
                  </p>
                  <a
                    href="#"
                    className="text-sm text-primary flex items-center mt-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View setup guide <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSetupOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFinishSetup} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
