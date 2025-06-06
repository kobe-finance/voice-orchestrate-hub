
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Download, Trash2, Edit, Users, Search } from "lucide-react";

export const ContactListManager = () => {
  const [contactLists, setContactLists] = useState([
    { id: 1, name: "Newsletter Subscribers", contacts: 1234, lastUpdated: "2024-01-15", tags: ["newsletter", "active"] },
    { id: 2, name: "Product Updates", contacts: 856, lastUpdated: "2024-01-10", tags: ["product", "updates"] },
    { id: 3, name: "VIP Customers", contacts: 123, lastUpdated: "2024-01-12", tags: ["vip", "premium"] },
    { id: 4, name: "Trial Users", contacts: 445, lastUpdated: "2024-01-08", tags: ["trial", "new"] }
  ]);

  const [selectedList, setSelectedList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredLists = contactLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Contact Lists</h3>
          <p className="text-muted-foreground">Manage your contact lists and segments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contact List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="listName">List Name</Label>
                <Input id="listName" placeholder="e.g., Q1 2024 Leads" />
              </div>
              <div>
                <Label htmlFor="listDescription">Description</Label>
                <Input id="listDescription" placeholder="Brief description of this list" />
              </div>
              <div>
                <Label htmlFor="listTags">Tags</Label>
                <Input id="listTags" placeholder="Comma-separated tags" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create List
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contact lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLists.map((list) => (
          <Card key={list.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{list.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{list.contacts.toLocaleString()} contacts</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {list.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {list.lastUpdated}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Upload className="mr-1 h-3 w-3" />
                    Import
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedList && (
        <Card>
          <CardHeader>
            <CardTitle>List Details - {selectedList.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>+1234567890</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-800">Active</Badge></TableCell>
                  <TableCell>2024-01-10</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>+1234567891</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-800">Active</Badge></TableCell>
                  <TableCell>2024-01-09</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
