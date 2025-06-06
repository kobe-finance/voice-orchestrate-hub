
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Play, Pause, Calendar as CalendarIcon, Edit } from "lucide-react";
import { format } from "date-fns";

export const CampaignScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledCampaigns, setScheduledCampaigns] = useState([
    {
      id: 1,
      name: "Q1 Product Launch",
      type: "email",
      scheduledDate: "2024-02-15T10:00:00Z",
      status: "scheduled",
      recipients: 1500,
      timezone: "EST"
    },
    {
      id: 2,
      name: "Weekend Promotion SMS",
      type: "sms",
      scheduledDate: "2024-02-17T09:00:00Z",
      status: "scheduled",
      recipients: 800,
      timezone: "PST"
    },
    {
      id: 3,
      name: "Follow-up Sequence",
      type: "email",
      scheduledDate: "2024-02-20T14:30:00Z",
      status: "paused",
      recipients: 650,
      timezone: "EST"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "bg-blue-100 text-blue-800",
      running: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status] || variants.scheduled}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      email: "bg-purple-100 text-purple-800",
      sms: "bg-orange-100 text-orange-800",
      voice: "bg-green-100 text-green-800"
    };
    return <Badge className={variants[type] || variants.email}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Campaign Scheduler</h3>
          <p className="text-muted-foreground">Manage scheduled and recurring campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Campaign Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Upcoming This Week</h4>
                <div className="space-y-2">
                  {scheduledCampaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-muted-foreground">
                        {format(new Date(campaign.scheduledDate), "MMM d, h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduled Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(campaign.scheduledDate), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{campaign.timezone}</div>
                      </TableCell>
                      <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {campaign.status === "scheduled" ? (
                            <Button variant="ghost" size="icon">
                              <Play className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Campaigns Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-xs text-muted-foreground">2 scheduled, 1 running</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-xs text-muted-foreground">5 email, 3 SMS</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <p className="text-xs text-muted-foreground">Messages in queue</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
