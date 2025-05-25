
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Phone, MapPin, Plus, Edit, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  notes: string;
  technicianId: string;
  estimatedCost: number;
}

const AppointmentScheduling: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      serviceType: 'Plumbing Repair',
      date: '2024-01-20',
      time: '09:00',
      duration: 120,
      status: 'confirmed',
      address: '123 Main St, Sydney NSW 2000',
      notes: 'Kitchen sink leak, urgent repair needed',
      technicianId: 'tech_1',
      estimatedCost: 250,
    },
    {
      id: '2',
      customerName: 'Mike Wilson',
      customerPhone: '+1 (555) 987-6543',
      serviceType: 'HVAC Maintenance',
      date: '2024-01-20',
      time: '14:00',
      duration: 90,
      status: 'scheduled',
      address: '456 Oak Ave, Melbourne VIC 3000',
      notes: 'Annual service check',
      technicianId: 'tech_2',
      estimatedCost: 180,
    },
    {
      id: '3',
      customerName: 'Emma Davis',
      customerPhone: '+1 (555) 456-7890',
      serviceType: 'Electrical Installation',
      date: '2024-01-21',
      time: '10:30',
      duration: 180,
      status: 'scheduled',
      address: '789 Pine St, Brisbane QLD 4000',
      notes: 'Install new power outlets in garage',
      technicianId: 'tech_1',
      estimatedCost: 320,
    },
  ]);

  const [selectedDate, setSelectedDate] = useState('2024-01-20');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{appointment.customerName}</h4>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {appointment.customerPhone}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {appointment.time} ({appointment.duration} min)
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {appointment.address}
              </div>
            </div>
            
            <div className="mt-2">
              <span className="font-medium">{appointment.serviceType}</span>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
            
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Estimated: </span>
              <span className="font-medium">${appointment.estimatedCost}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Scheduling</h1>
          <p className="text-muted-foreground">Manage bookings and technician schedules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAppointments.filter(a => a.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
            <span className="text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredAppointments.reduce((sum, a) => sum + a.estimatedCost, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeSlots.length - filteredAppointments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daily Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                  <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Slots */}
                <div className="space-y-2">
                  <h3 className="font-semibold mb-4">Available Time Slots</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const hasAppointment = filteredAppointments.some(apt => apt.time === slot);
                      return (
                        <Button
                          key={slot}
                          variant={hasAppointment ? "secondary" : "outline"}
                          size="sm"
                          disabled={hasAppointment}
                          className="w-full"
                        >
                          {slot}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Appointments */}
                <div className="space-y-2">
                  <h3 className="font-semibold mb-4">Scheduled Appointments</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No appointments scheduled for this date
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Manage all upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                          <p className="font-semibold">{appointment.customerName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.customerPhone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Service</Label>
                          <p className="font-semibold">{appointment.serviceType}</p>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Date & Time</Label>
                          <p className="font-semibold">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time} ({appointment.duration}m)</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Cost</Label>
                          <p className="font-semibold">${appointment.estimatedCost}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentScheduling;
