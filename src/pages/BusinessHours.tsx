import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, Phone, MessageSquare } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

interface BusinessHour {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'company' | 'personal';
}

const BusinessHours: React.FC = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: 'Monday', enabled: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Tuesday', enabled: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Wednesday', enabled: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Thursday', enabled: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Friday', enabled: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Saturday', enabled: false, openTime: '09:00', closeTime: '15:00' },
    { day: 'Sunday', enabled: false, openTime: '10:00', closeTime: '14:00' },
  ]);

  const [afterHoursSettings, setAfterHoursSettings] = useState({
    enabled: true,
    message: "Thank you for calling! We're currently closed. Our business hours are Monday-Friday 8AM-6PM. Please leave a message and we'll get back to you.",
    voicemailEnabled: true,
    emergencyNumber: '+1 (555) 999-0000',
    autoResponse: true,
  });

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year\'s Day', date: '2024-01-01', type: 'national' },
    { id: '2', name: 'Christmas Day', date: '2024-12-25', type: 'national' },
    { id: '3', name: 'Company Training Day', date: '2024-03-15', type: 'company' },
  ]);

  const [timezone, setTimezone] = useState('America/New_York');

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: any) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const addHoliday = () => {
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name: 'New Holiday',
      date: new Date().toISOString().split('T')[0],
      type: 'company',
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Business Hours Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Hours Management</h1>
            <p className="text-muted-foreground">Configure operating hours and after-hours handling</p>
          </div>
        </div>

      <Tabs defaultValue="hours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="after-hours">After Hours</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>Set your business operating hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Australia/Sydney">AEST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {businessHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <span className="font-medium">{hour.day}</span>
                    </div>
                    
                    <Switch
                      checked={hour.enabled}
                      onCheckedChange={(checked) => updateBusinessHour(index, 'enabled', checked)}
                    />
                    
                    {hour.enabled ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) => updateBusinessHour(index, 'openTime', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => updateBusinessHour(index, 'closeTime', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Closed</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button>Save Business Hours</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="after-hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                After Hours Configuration
              </CardTitle>
              <CardDescription>Configure how calls are handled outside business hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable After Hours Handling</Label>
                  <p className="text-sm text-muted-foreground">Automatically handle calls when closed</p>
                </div>
                <Switch
                  checked={afterHoursSettings.enabled}
                  onCheckedChange={(checked) => 
                    setAfterHoursSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              {afterHoursSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="after-hours-message">After Hours Message</Label>
                    <textarea
                      id="after-hours-message"
                      value={afterHoursSettings.message}
                      onChange={(e) => 
                        setAfterHoursSettings(prev => ({ ...prev, message: e.target.value }))
                      }
                      className="w-full p-3 border rounded-md resize-none h-24"
                      placeholder="Enter the message to play when calls come in after hours..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Enable Voicemail</Label>
                      <p className="text-sm text-muted-foreground">Allow callers to leave messages</p>
                    </div>
                    <Switch
                      checked={afterHoursSettings.voicemailEnabled}
                      onCheckedChange={(checked) => 
                        setAfterHoursSettings(prev => ({ ...prev, voicemailEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-number">Emergency Contact Number</Label>
                    <Input
                      id="emergency-number"
                      value={afterHoursSettings.emergencyNumber}
                      onChange={(e) => 
                        setAfterHoursSettings(prev => ({ ...prev, emergencyNumber: e.target.value }))
                      }
                      placeholder="+1 (555) 999-0000"
                    />
                    <p className="text-sm text-muted-foreground">For urgent calls, provide this number</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Auto-Response SMS</Label>
                      <p className="text-sm text-muted-foreground">Send SMS with business hours info</p>
                    </div>
                    <Switch
                      checked={afterHoursSettings.autoResponse}
                      onCheckedChange={(checked) => 
                        setAfterHoursSettings(prev => ({ ...prev, autoResponse: checked }))
                      }
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button>Save After Hours Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Holiday Schedule
              </CardTitle>
              <CardDescription>Manage holidays and special closure dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={addHoliday}>Add Holiday</Button>
              </div>

              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={holiday.name}
                        onChange={(e) => {
                          const updated = holidays.map(h => 
                            h.id === holiday.id ? { ...h, name: e.target.value } : h
                          );
                          setHolidays(updated);
                        }}
                        placeholder="Holiday name"
                      />
                      
                      <Input
                        type="date"
                        value={holiday.date}
                        onChange={(e) => {
                          const updated = holidays.map(h => 
                            h.id === holiday.id ? { ...h, date: e.target.value } : h
                          );
                          setHolidays(updated);
                        }}
                      />
                      
                      <Select
                        value={holiday.type}
                        onValueChange={(value: 'national' | 'company' | 'personal') => {
                          const updated = holidays.map(h => 
                            h.id === holiday.id ? { ...h, type: value } : h
                          );
                          setHolidays(updated);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">National Holiday</SelectItem>
                          <SelectItem value="company">Company Holiday</SelectItem>
                          <SelectItem value="personal">Personal Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Badge variant="outline" className="capitalize">
                      {holiday.type}
                    </Badge>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHoliday(holiday.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button>Save Holiday Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default BusinessHours;
