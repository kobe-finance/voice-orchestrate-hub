
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to VoiceOrchestrate™. Here's an overview of your system.</p>
          </div>
          <QuickActions />
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard 
                title="Total Calls" 
                value="157" 
                change="+12%" 
                trend="increase" 
                description="Calls handled today" 
              />
              <KpiCard 
                title="Avg Handle Time" 
                value="4m 12s" 
                change="-8%" 
                trend="decrease" 
                description="Average call duration" 
              />
              <KpiCard 
                title="Conversion Rate" 
                value="24%" 
                change="+2%" 
                trend="increase" 
                description="Call to conversion" 
              />
              <KpiCard 
                title="CSAT Score" 
                value="4.8/5" 
                change="+0.2" 
                trend="increase" 
                description="Customer satisfaction" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard 
                title="Total Calls" 
                value="1,254" 
                change="+5%" 
                trend="increase" 
                description="Calls handled this week" 
              />
              <KpiCard 
                title="Avg Handle Time" 
                value="3m 45s" 
                change="-10%" 
                trend="decrease" 
                description="Average call duration" 
              />
              <KpiCard 
                title="Conversion Rate" 
                value="26%" 
                change="+1%" 
                trend="increase" 
                description="Call to conversion" 
              />
              <KpiCard 
                title="CSAT Score" 
                value="4.7/5" 
                change="+0.1" 
                trend="increase" 
                description="Customer satisfaction" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard 
                title="Total Calls" 
                value="5,872" 
                change="+8%" 
                trend="increase" 
                description="Calls handled this month" 
              />
              <KpiCard 
                title="Avg Handle Time" 
                value="3m 56s" 
                change="-5%" 
                trend="decrease" 
                description="Average call duration" 
              />
              <KpiCard 
                title="Conversion Rate" 
                value="27%" 
                change="+3%" 
                trend="increase" 
                description="Call to conversion" 
              />
              <KpiCard 
                title="CSAT Score" 
                value="4.6/5" 
                change="0" 
                trend="neutral" 
                description="Customer satisfaction" 
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-3">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="h-3 w-3 rounded-full bg-success-foreground"></div>
                  <div className="font-medium">Sales Agent</div>
                  <div className="ml-auto text-sm text-muted-foreground">Active • Handling 2 calls</div>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="h-3 w-3 rounded-full bg-success-foreground"></div>
                  <div className="font-medium">Support Agent</div>
                  <div className="ml-auto text-sm text-muted-foreground">Active • Handling 1 call</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 rounded-full bg-muted"></div>
                  <div className="font-medium">Booking Agent</div>
                  <div className="ml-auto text-sm text-muted-foreground">Inactive • Scheduled from 9AM-5PM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
