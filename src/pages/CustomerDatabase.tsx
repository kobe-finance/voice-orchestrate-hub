import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Search, Filter, Edit, Phone, Mail, MapPin, Calendar, User } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '91234',
    country: 'USA',
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '456-789-0123',
    address: '456 Elm St',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
    country: 'USA',
    status: 'inactive',
    createdAt: '2023-02-15',
    updatedAt: '2023-02-15',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '789-012-3456',
    address: '789 Oak St',
    city: 'Smallville',
    state: 'KS',
    zip: '66604',
    country: 'USA',
    status: 'pending',
    createdAt: '2023-03-20',
    updatedAt: '2023-03-20',
  },
];

const CustomerDatabase: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleOpenDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div>
      <PageHeader title="Customer Database">
        Manage and view your customer information.
      </PageHeader>

      <Card className="w-full">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Customer List</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search customers..."
              className="max-w-md"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                {/* Add Customer Form Here */}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              {selectedCustomer && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      defaultValue={selectedCustomer.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      defaultValue={selectedCustomer.email}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      defaultValue={selectedCustomer.phone}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      defaultValue={selectedCustomer.address}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      City
                    </Label>
                    <Input
                      type="text"
                      id="city"
                      defaultValue={selectedCustomer.city}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">
                      State
                    </Label>
                    <Input
                      type="text"
                      id="state"
                      defaultValue={selectedCustomer.state}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zip" className="text-right">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      id="zip"
                      defaultValue={selectedCustomer.zip}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Country
                    </Label>
                    <Input
                      type="text"
                      id="country"
                      defaultValue={selectedCustomer.country}
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="notes">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right mt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Customer notes..."
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="grid gap-4 py-4">
                <p>Customer history will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDatabase;
