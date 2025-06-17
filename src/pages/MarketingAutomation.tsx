
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-modern';
import { Button } from '@/components/ui/button-modern';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Mail, Users, Calendar, BarChart3 } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

// Mock components for ContactListManager and CampaignScheduler
const ContactListManager = () => (
  <Card variant="elevated">
    <CardHeader>
      <CardTitle>Contact List Manager</CardTitle>
      <CardDescription>Manage your contact lists here</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Contact list management interface will be here.</p>
    </CardContent>
  </Card>
);

const CampaignScheduler = () => (
  <Card variant="elevated">
    <CardHeader>
      <CardTitle>Campaign Scheduler</CardTitle>
      <CardDescription>Schedule your marketing campaigns</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Campaign scheduling interface will be here.</p>
    </CardContent>
  </Card>
);

// Mock CampaignWizard component
const CampaignWizard = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-md shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Campaign Wizard</h2>
      <p className="text-muted-foreground">This is a mock campaign wizard.</p>
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push';
  status: 'active' | 'paused' | 'draft';
  contactCount: number;
  sentCount: number;
  openRate: number;
}

const MarketingAutomation = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Welcome Email Series',
      description: 'Introduce new users to our platform',
      type: 'email',
      status: 'active',
      contactCount: 500,
      sentCount: 450,
      openRate: 25,
    },
    {
      id: '2',
      name: 'Summer Sale SMS Blast',
      description: 'Promote our summer sale via SMS',
      type: 'sms',
      status: 'paused',
      contactCount: 1200,
      sentCount: 0,
      openRate: 0,
    },
    {
      id: '3',
      name: 'New Feature Push Notification',
      description: 'Notify users about our latest feature',
      type: 'push',
      status: 'draft',
      contactCount: 800,
      sentCount: 0,
      openRate: 0,
    },
  ]);
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);

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
              <BreadcrumbPage>Marketing Automation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
          Marketing Automation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage automated marketing campaigns</p>

        <Button variant="gradient" onClick={() => setShowCampaignWizard(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Create Campaign
        </Button>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contact Lists
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'outline'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{campaign.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contacts:</span>
                        <span>{campaign.contactCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sent:</span>
                        <span>{campaign.sentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opens:</span>
                        <span>{campaign.openRate}%</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View Reports</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <ContactListManager />
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-4">
            <CampaignScheduler />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Marketing Analytics</CardTitle>
                <CardDescription>Overview of your marketing performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Marketing analytics dashboard will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showCampaignWizard && (
          <CampaignWizard onClose={() => setShowCampaignWizard(false)} />
        )}
      </div>
    </div>
  );
};

export default MarketingAutomation;
