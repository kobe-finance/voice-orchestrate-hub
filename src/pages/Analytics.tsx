
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BarChart3, TrendingUp, Download, Filter, Calendar, Phone, Clock, Users, Target } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';

const Analytics = () => {
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
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track performance, analyze trends, and optimize your voice AI operations.</p>

        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>
            Date Range
          </Button>
          <Button variant="gradient" leftIcon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Analytics
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agent Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard 
                title="Total Calls Today" 
                value="1,247" 
                change="+8.2%" 
                trend="increase" 
                description="vs yesterday" 
              />
              <KpiCard 
                title="Success Rate" 
                value="94.3%" 
                change="+2.1%" 
                trend="increase" 
                description="Call completion" 
              />
              <KpiCard 
                title="Avg Response Time" 
                value="1.2s" 
                change="-0.3s" 
                trend="decrease" 
                description="First response" 
              />
              <KpiCard 
                title="Revenue Generated" 
                value="$12,450" 
                change="+15.7%" 
                trend="increase" 
                description="This week" 
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card variant="elevated">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Call Volume Trends</h3>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="elevated">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Conversion Rate</span>
                      </div>
                      <span className="text-green-600 font-semibold">68.9%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Avg Call Duration</span>
                      </div>
                      <span className="text-blue-600 font-semibold">4m 32s</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Customer Satisfaction</span>
                      </div>
                      <span className="text-orange-600 font-semibold">4.8/5</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Performance charts coming soon</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detailed performance analytics will be displayed here</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Call Analytics</h3>
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <div className="text-center">
                    <Phone className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Call analytics dashboard</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detailed call metrics and analysis will be shown here</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Agent Performance Metrics</h3>
                <div className="h-96 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <div className="text-center">
                    <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Agent performance tracking</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Individual agent metrics and comparisons will be displayed here</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
