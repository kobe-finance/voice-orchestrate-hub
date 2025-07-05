
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Key, Trash2, Check, X, Edit, Loader2 } from "lucide-react";
import { APICredentialForm } from "./APICredentialForm";
import { useCredentialManagement } from "@/hooks/useCredentialManagement";
import { Loading } from "@/components/ui/loading";
import IntegrationStatusIndicator from "./IntegrationStatusIndicator";
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
      handleCloseAddDialog();
    } catch (error) {
      console.error('Add credential error:', error);
      // Error is handled by the hook with toast
    }
  };

  const handleDeleteCredential = async () => {
    if (!selectedCredential) return;
    
    try {
      await deleteCredential(selectedCredential.credential_id);
      setIsDeleteDialogOpen(false);
      setSelectedCredential(null);
    } catch (error) {
      console.error('Delete credential error:', error);
      // Error is handled by the hook with toast
    }
  };

  const handleTestConnection = async (credentialId: string) => {
    try {
      await testCredential(credentialId);
    } catch (error) {
      console.error('Test connection error:', error);
      // Error is handled by the hook with toast
    }
  };

  const handleOpenAddDialog = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedIntegration(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string, credentialId: string) => {
    if (isTestingCredential === credentialId) {
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Testing...
        </Badge>
      );
    }

    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <X className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Needs Testing
          </Badge>
        );
    }
  };

  const getIntegrationName = (integrationId: string) => {
    const integration = availableIntegrations.find(int => int.id === integrationId);
    return integration?.name || 'Unknown Integration';
  };

  if (isLoading) {
    return <Loading text="Loading credentials..." className="py-8" />;
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
        
        <div className="flex gap-2">
          {availableIntegrations.slice(0, 3).map((integration) => (
            <Button
              key={integration.id}
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog(integration)}
              disabled={isAddingCredential}
              loading={isAddingCredential}
            >
              {!isAddingCredential && <Key className="mr-2 h-4 w-4" />}
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
                    {getStatusBadge(cred.last_test_status || 'untested', cred.credential_id)}
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
                        loading={isTestingCredential === cred.credential_id}
                        title="Test Connection"
                      >
                        {isTestingCredential !== cred.credential_id && (
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
          <DialogClose 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={handleCloseAddDialog}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
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
              onCancel={handleCloseAddDialog}
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
          <div className="flex justify-end gap-2 pt-4">
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
              loading={isDeletingCredential}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
