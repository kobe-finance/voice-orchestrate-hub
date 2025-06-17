import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, DollarSign, FileText, Calendar, Download, Eye } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  date: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'draft';
}

const FinancialInvoicing = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', number: 'INV-2024-001', customer: 'Acme Corp', date: '2024-01-15', amount: 1200, status: 'paid' },
    { id: '2', number: 'INV-2024-002', customer: 'Beta Inc', date: '2024-02-01', amount: 850, status: 'unpaid' },
    { id: '3', number: 'INV-2024-003', customer: 'Gamma Ltd', date: '2024-02-15', amount: 2100, status: 'draft' },
  ]);

  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    number: '',
    customer: '',
    date: '',
    amount: 0,
    status: 'draft',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({ ...prev, [name]: value }));
  };

  const addInvoice = () => {
    const newId = Date.now().toString();
    setInvoices(prev => [...prev, { id: newId, ...newInvoice }]);
    setNewInvoice({ number: '', customer: '', date: '', amount: 0, status: 'draft' });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Financial & Invoicing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Financial & Invoicing</h1>
          <p className="text-muted-foreground">Manage invoices and financial transactions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>View and manage all invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{invoice.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{invoice.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${invoice.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{invoice.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Invoice</CardTitle>
              <CardDescription>Create a new invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Invoice Number</Label>
                  <Input
                    type="text"
                    id="number"
                    name="number"
                    value={newInvoice.number}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    type="text"
                    id="customer"
                    name="customer"
                    value={newInvoice.customer}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={newInvoice.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newInvoice.amount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setNewInvoice(prev => ({ ...prev, amount: value }));
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={newInvoice.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addInvoice}>
                <Plus className="h-4 w-4 mr-2" />
                Add Invoice
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate financial reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation tools will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure financial and invoicing settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings configuration options will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialInvoicing;
