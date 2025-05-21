
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Key, Trash2, Check, X, Edit, BarChart4, Shield, Clock, Tag } from "lucide-react";
import { APICredentialForm } from "./APICredentialForm";

// Mock data for demonstration
const mockCredentials = [
  { 
    id: "1", 
    name: "OpenAI API Key", 
    value: "sk-••••••••••••••••••••••••", 
    category: "llm", 
    subCategory: "openai",
    status: "connected", 
    lastUsed: "2025-05-20T10:30:00", 
    created: "2025-04-15T08:20:00" 
  },
  { 
    id: "2", 
    name: "Deepgram API Key", 
    value: "dg-••••••••••••••••••••", 
    category: "voice", 
    subCategory: "deepgram",
    status: "expired", 
    lastUsed: "2025-05-15T14:45:00", 
    created: "2025-02-10T11:35:00" 
  },
  { 
    id: "3", 
    name: "Twilio Auth Token", 
    value: "tw-••••••••••••••••••••", 
    category: "telephony", 
    subCategory: "twilio",
    status: "connected", 
    lastUsed: "2025-05-21T09:15:00", 
    created: "2025-03-22T16:40:00" 
  },
  { 
    id: "4", 
    name: "Salesforce API Key", 
    value: "sf-••••••••••••••••••••", 
    category: "crm", 
    subCategory: "salesforce",
    status: "connected", 
    lastUsed: "2025-05-18T17:20:00", 
    created: "2025-01-05T10:10:00" 
  },
];

export const APICredentialsList = () => {
  const [credentials, setCredentials] = useState(mockCredentials);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCredential = (newCredential: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setCredentials([...credentials, { ...newCredential, id, status: "connected", created: new Date().toISOString() }]);
    setIsAddDialogOpen(false);
    toast.success("API credential added successfully");
  };

  const handleEditCredential = (updatedCredential: any) => {
    setCredentials(
      credentials.map((cred) =>
        cred.id === selectedCredential.id ? { ...cred, ...updatedCredential } : cred
      )
    );
    setIsEditDialogOpen(false);
    toast.success("API credential updated successfully");
  };

  const handleDeleteCredential = () => {
    setCredentials(credentials.filter((cred) => cred.id !== selectedCredential.id));
    setIsDeleteDialogOpen(false);
    toast.success("API credential deleted successfully");
  };

  const handleTestConnection = (id: string) => {
    // Simulating connection test
    setTimeout(() => {
      toast.success("Connection tested successfully");
    }, 1000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "expired":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Key className="mr-2 h-4 w-4" /> Add New Credential
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credential Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Masked Value</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCredentials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No credentials found. Add a new credential to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredCredentials.map((cred) => (
                <TableRow key={cred.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{cred.name}</span>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {cred.category} / {cred.subCategory}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit">
                        {cred.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        {cred.subCategory}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono">
                    {cred.value}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(
                          cred.status
                        )}`}
                      ></span>
                      <span className="capitalize">{cred.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(cred.lastUsed)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedCredential(cred);
                          setIsEditDialogOpen(true);
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTestConnection(cred.id)}
                        title="Test Connection"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedCredential(cred);
                          setIsDeleteDialogOpen(true);
                        }}
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
            <DialogTitle>Add New API Credential</DialogTitle>
            <DialogDescription>
              Enter the details for your new API credential. Your credentials are encrypted and never exposed.
            </DialogDescription>
          </DialogHeader>
          <APICredentialForm onSubmit={handleAddCredential} />
        </DialogContent>
      </Dialog>

      {/* Edit Credential Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit API Credential</DialogTitle>
            <DialogDescription>
              Update the details for your API credential. Leave the value field empty to keep the current value.
            </DialogDescription>
          </DialogHeader>
          {selectedCredential && (
            <APICredentialForm
              initialValues={selectedCredential}
              onSubmit={handleEditCredential}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete API Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this credential? This action cannot be undone.
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
