import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, MapPin, Calendar, Users, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

interface Technician {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  skills: string[];
  location: string;
}

interface ServiceRequest {
  id: string;
  customer: string;
  type: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  address: string;
  technician?: string;
}

const FieldServiceIntegration = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: '1', name: 'John Smith', status: 'available', skills: ['HVAC', 'Electrical'], location: 'North Region' },
    { id: '2', name: 'Maria Garcia', status: 'busy', skills: ['Plumbing', 'Installation'], location: 'Central Region' },
    { id: '3', name: 'David Chen', status: 'available', skills: ['Electrical', 'Security Systems'], location: 'East Region' },
    { id: '4', name: 'Sarah Johnson', status: 'offline', skills: ['Appliance Repair', 'HVAC'], location: 'West Region' },
  ]);

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    { 
      id: 'SR-1001', 
      customer: 'Acme Corp', 
      type: 'HVAC Repair', 
      status: 'assigned', 
      priority: 'high',
      scheduledDate: '2023-06-15 10:00 AM',
      address: '123 Business Ave, Suite 100',
      technician: '1'
    },
    { 
      id: 'SR-1002', 
      customer: 'HomeGoods Store', 
      type: 'Electrical Issue', 
      status: 'pending', 
      priority: 'medium',
      scheduledDate: '2023-06-16 2:30 PM',
      address: '456 Market St'
    },
    { 
      id: 'SR-1003', 
      customer: 'City Hospital', 
      type: 'Security System', 
      status: 'in-progress', 
      priority: 'urgent',
      scheduledDate: '2023-06-15 1:15 PM',
      address: '789 Healthcare Blvd',
      technician: '3'
    },
  ]);

  const [integrationSettings, setIntegrationSettings] = useState({
    autoAssign: true,
    notifyCustomers: true,
    requirePhotos: true,
    gpsTracking: true
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'busy':
        return <Badge className="bg-orange-100 text-orange-800">Busy</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getTechnicianName = (id?: string) => {
    if (!id) return 'Unassigned';
    const tech = technicians.find(t => t.id === id);
    return tech ? tech.name : 'Unknown';
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
            <BreadcrumbPage>Field Service Integration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Field Service Management</h1>
          <p className="text-muted-foreground">Manage technicians, service requests, and field operations</p>
        </div>
        <Button>
          <Wrench className="mr-2 h-4 w-4" />
          New Service Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 12 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-15min from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="map">Field Map</TabsTrigger>
          <TabsTrigger value="settings">Integration Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
              <CardDescription>Manage and track field service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{request.id}</span>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{request.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{request.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Technician</p>
                        <p className="font-medium">{getTechnicianName(request.technician)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Scheduled</p>
                        <p className="font-medium">{request.scheduledDate}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {request.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Technicians</CardTitle>
              <CardDescription>Manage technician availability and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicians.map((tech) => (
                  <div key={tech.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{tech.name}</p>
                          <p className="text-sm text-muted-foreground">{tech.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(tech.status)}
                        <Button variant="outline" size="sm">Assign</Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {tech.skills.map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Operations Map</CardTitle>
              <CardDescription>Real-time location of technicians and service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">Map integration will be displayed here</p>
                  <Button className="mt-4" variant="outline">Load Map</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure field service management preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Automatic Assignment</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign technicians based on skills and location</p>
                </div>
                <Switch 
                  checked={integrationSettings.autoAssign}
                  onCheckedChange={(checked) => 
                    setIntegrationSettings(prev => ({ ...prev, autoAssign: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Customer Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automated updates to customers</p>
                </div>
                <Switch 
                  checked={integrationSettings.notifyCustomers}
                  onCheckedChange={(checked) => 
                    setIntegrationSettings(prev => ({ ...prev, notifyCustomers: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Require Photos</Label>
                  <p className="text-sm text-muted-foreground">Technicians must upload photos before marking jobs complete</p>
                </div>
                <Switch 
                  checked={integrationSettings.requirePhotos}
                  onCheckedChange={(checked) => 
                    setIntegrationSettings(prev => ({ ...prev, requirePhotos: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">GPS Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track technician locations in real-time</p>
                </div>
                <Switch 
                  checked={integrationSettings.gpsTracking}
                  onCheckedChange={(checked) => 
                    setIntegrationSettings(prev => ({ ...prev, gpsTracking: checked }))
                  }
                />
              </div>

              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldServiceIntegration;
