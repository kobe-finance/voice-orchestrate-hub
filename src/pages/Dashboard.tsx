
import React from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, Phone } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";

const Dashboard = () => {
  const breadcrumbs = [
    { label: "Dashboard" }
  ];

  const actions = <QuickActions />;

  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to VoiceOrchestrate™. Here's an overview of your voice AI system."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      {/* Welcome Card */}
      <Card variant="gradient" className="p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Sparkles className="h-6 w-6 text-primary/60" />
        </div>
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your voice AI agents are performing excellently today. Here's what's happening across your system.
          </p>
          <Button variant="gradient" size="sm" leftIcon={<TrendingUp className="h-4 w-4" />}>
            View Detailed Analytics
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-6">
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
        
        <TabsContent value="weekly" className="mt-6">
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
        
        <TabsContent value="monthly" className="mt-6">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" className="lg:col-span-2">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Voice Agent Status</h3>
              <Button variant="outline" size="sm" leftIcon={<Phone className="h-4 w-4" />}>
                New Agent
              </Button>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <div className="font-medium">Sales Agent</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Optimized for lead qualification</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Active</div>
                  <div className="text-xs text-gray-500">Handling 2 calls</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <div>
                    <div className="font-medium">Support Agent</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Customer service specialist</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Active</div>
                  <div className="text-xs text-gray-500">Handling 1 call</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <div>
                    <div className="font-medium">Booking Agent</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Appointment scheduling</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</div>
                  <div className="text-xs text-gray-500">9AM-5PM</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </div>
          <div className="px-6 pb-6">
            <ActivityTimeline />
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="interactive" className="group">
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Active Users</h3>
            <p className="text-2xl font-bold text-primary">1,247</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">+12% from last month</p>
          </div>
        </Card>

        <Card variant="interactive" className="group">
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Revenue Growth</h3>
            <p className="text-2xl font-bold text-green-600">+28%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quarterly increase</p>
          </div>
        </Card>

        <Card variant="interactive" className="group">
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
              <Sparkles className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">AI Accuracy</h3>
            <p className="text-2xl font-bold text-orange-600">96.8%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Understanding rate</p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
