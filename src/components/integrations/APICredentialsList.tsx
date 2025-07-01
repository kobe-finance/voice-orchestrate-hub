
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Trash2, Check, X, Edit, Loader2 } from "lucide-react";
import { APICredentialForm } from "./APICredentialForm";
import { useCredentialManagement } from "@/hooks/useCredentialManagement";
import type { IntegrationCredential, Integration } from "@/services/credentialService";

export const APICredentialsList = () => {
  const {
    availableIntegrations,
    userCredentials,
    isLoading,
    isAddingCredential,
    isTestingCredential,
    isDeletingCredential,
    addCredential,
    testCredential,
    deleteCredential,
  } = useCredentialManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<IntegrationCredential | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filteredCredentials = userCredentials.filter((cred) => {
    const integration = availableIntegrations.find(int => int.id === cred.integration_id);
    const integrationName = integration?.name || '';
    return (
      cred.credential_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integrationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddCredential = async (newCredential: any) => {
    if (!selectedIntegration) return;
    
    try {
      await addCredential({
        integration_id: selectedIntegration.id,
        credential_name: newCredential.name,
        credentials: { [newCredential.credentialKey]: newCredential.value }
      });
      setIsAddDialogOpen(false);
      setSelectedIntegration(null);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleDeleteCredential = async () => {
    if (!selectedCredential) return;
    
    try {
      await deleteCredential(selectedCredential.credential_id);
      setIsDeleteDialogOpen(false);
      setSelectedCredential(null);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleTestConnection = async (credentialId: string) => {
    try {
      await testCredential(credentialId);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "untested":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIntegrationName = (integrationId: string) => {
    const integration = availableIntegrations.find(int => int.id === integrationId);
    return integration?.name || 'Unknown Integration';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading credentials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
        </div>
        
        {/* Available Integrations */}
        <div className="flex gap-2">
          {availableIntegrations.slice(0, 3).map((integration) => (
            <Button
              key={integration.id}
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedIntegration(integration);
                setIsAddDialogOpen(true);
              }}
              disabled={isAddingCredential}
            >
              <Key className="mr-2 h-4 w-4" />
              Connect {integration.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credential Name</TableHead>
              <TableHead>Integration</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCredentials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No credentials found. Connect to an integration to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredCredentials.map((cred) => (
                <TableRow key={cred.credential_id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{cred.credential_name}</span>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {getIntegrationName(cred.integration_id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {getIntegrationName(cred.integration_id)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(cred.last_test_status)}`}
                      ></span>
                      <span className="capitalize">{cred.last_test_status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(cred.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTestConnection(cred.credential_id)}
                        disabled={isTestingCredential === cred.credential_id}
                        title="Test Connection"
                      >
                        {isTestingCredential === cred.credential_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedCredential(cred);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={isDeletingCredential}
                        title="Delete"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add New Credential Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Connect to {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your credentials to connect to {selectedIntegration?.name}. Your credentials are encrypted and secure.
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <APICredentialForm
              integration={selectedIntegration}
              onSubmit={handleAddCredential}
              isSubmitting={isAddingCredential}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCredential?.credential_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCredential}
              disabled={isDeletingCredential}
            >
              {isDeletingCredential ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
