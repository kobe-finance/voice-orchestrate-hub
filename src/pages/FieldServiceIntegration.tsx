
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Truck, MapPin, Clock, Wrench, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';

const FieldServiceIntegration = () => {
  const [serviceTickets, setServiceTickets] = useState([
    { id: 'FST-001', customer: 'ABC Manufacturing', technician: 'John Smith', status: 'scheduled', priority: 'high', location: 'Downtown Factory', scheduledTime: '2025-05-25 10:00 AM' },
    { id: 'FST-002', customer: 'Tech Solutions Inc', technician: 'Sarah Wilson', status: 'in-progress', priority: 'medium', location: 'Office Complex', scheduledTime: '2025-05-25 2:00 PM' },
    { id: 'FST-003', customer: 'Global Industries', technician: 'Mike Johnson', status: 'completed', priority: 'low', location: 'Warehouse District', scheduledTime: '2025-05-24 9:00 AM' }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Field Service Integration</h1>
          <p className="text-muted-foreground">Manage field service operations and technician dispatch</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Service
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians Active</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">of 15 available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m</div>
            <p className="text-xs text-muted-foreground">-12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Service Tickets</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Tickets</CardTitle>
              <CardDescription>Manage and track field service tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>{ticket.technician}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {ticket.location}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.scheduledTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Management</CardTitle>
              <CardDescription>Monitor technician status and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'John Smith', status: 'active', tickets: 3, location: 'Downtown' },
                  { name: 'Sarah Wilson', status: 'active', tickets: 2, location: 'Midtown' },
                  { name: 'Mike Johnson', status: 'break', tickets: 1, location: 'Warehouse District' }
                ].map((technician, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{technician.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={technician.status === 'active' ? 'default' : 'secondary'}>
                          {technician.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>Active Tickets: {technician.tickets}</div>
                        <div>Current Location: {technician.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Service Integrations</CardTitle>
              <CardDescription>Connect with field service management platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'ServiceTitan', connected: true, logo: '🔧' },
                  { name: 'FieldEdge', connected: false, logo: '⚡' },
                  { name: 'Jobber', connected: true, logo: '📋' },
                  { name: 'ServiceMax', connected: false, logo: '🛠️' }
                ].map((integration, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.logo}</span>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                        </div>
                        {integration.connected ? (
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        ) : (
                          <Badge variant="secondary">Not Connected</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant={integration.connected ? "outline" : "default"} className="w-full">
                        {integration.connected ? "Manage" : "Connect"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Service Settings</CardTitle>
              <CardDescription>Configure field service automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-dispatch technicians</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign tickets to available technicians</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Send customer notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify customers of technician arrival</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Default response time (minutes)</Label>
                <Input defaultValue="30" type="number" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldServiceIntegration;
