import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Mail, MessageSquare, Users, BarChart, Clock, Target } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { CampaignWizard } from '@/components/marketing/CampaignWizard';
import { CampaignScheduler } from '@/components/marketing/CampaignScheduler';
import { ContactListManager } from '@/components/marketing/ContactListManager';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'scheduled' | 'completed';
  type: 'email' | 'sms' | 'push';
  targetAudience: string;
  startDate: string;
  endDate: string;
}

const MarketingAutomation = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'campaign-1',
      name: 'Welcome Email Series',
      status: 'active',
      type: 'email',
      targetAudience: 'New Subscribers',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    {
      id: 'campaign-2',
      name: 'Summer SMS Promotion',
      status: 'scheduled',
      type: 'sms',
      targetAudience: 'All Customers',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
    },
  ]);

  const [newCampaignModalOpen, setNewCampaignModalOpen] = useState(false);
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);
  const [contactListModalOpen, setContactListModalOpen] = useState(false);

  const openNewCampaignModal = () => setNewCampaignModalOpen(true);
  const closeNewCampaignModal = () => setNewCampaignModalOpen(false);
  const openSchedulerModal = () => setSchedulerModalOpen(true);
  const closeSchedulerModal = () => setSchedulerModalOpen(false);
  const openContactListModal = () => setContactListModalOpen(true);
  const closeContactListModal = () => setContactListModalOpen(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Marketing Automation</h1>
          <p className="text-muted-foreground">Automate marketing campaigns and customer engagement</p>
        </div>
        <Button onClick={openNewCampaignModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge variant="secondary">{campaign.type}</Badge>
                  </div>
                  <CardDescription>
                    Target: {campaign.targetAudience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Clock className="h-4 w-4 mr-1 inline-block" />
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                    <Badge variant="default">{campaign.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Lists</CardTitle>
              <CardDescription>Manage and segment your contact lists</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openContactListModal}>
                <Users className="mr-2 h-4 w-4" />
                Manage Contacts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Create and manage email templates for campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure global automation preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Automation settings configuration will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CampaignWizard open={newCampaignModalOpen} onClose={closeNewCampaignModal} />
      <CampaignScheduler open={schedulerModalOpen} onClose={closeSchedulerModal} />
      <ContactListManager open={contactListModalOpen} onClose={closeContactListModal} />
    </div>
  );
};

export default MarketingAutomation;
