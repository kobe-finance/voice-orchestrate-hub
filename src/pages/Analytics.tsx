
import React from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const analyticsData = [
  { name: "Jan", calls: 400, duration: 240 },
  { name: "Feb", calls: 300, duration: 180 },
  { name: "Mar", calls: 500, duration: 320 },
  { name: "Apr", calls: 280, duration: 250 },
  { name: "May", calls: 590, duration: 370 },
  { name: "Jun", calls: 490, duration: 300 },
  { name: "Jul", calls: 600, duration: 410 },
];

const performanceData = [
  { name: "Mon", responseTime: 1.2, accuracy: 92 },
  { name: "Tue", responseTime: 1.5, accuracy: 89 },
  { name: "Wed", responseTime: 0.9, accuracy: 94 },
  { name: "Thu", responseTime: 1.1, accuracy: 91 },
  { name: "Fri", responseTime: 1.3, accuracy: 88 },
  { name: "Sat", responseTime: 0.8, accuracy: 95 },
  { name: "Sun", responseTime: 1.0, accuracy: 93 },
];

const Analytics = () => {
  return (
    <Layout>
      <div className="container py-6 max-w-7xl mx-auto">
        <PageHeader
          title="Analytics Dashboard"
          description="Voice agent performance metrics and insights"
          className="mb-6"
        />
        
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="users">User Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,160</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Call Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3m 24s</div>
                  <p className="text-xs text-muted-foreground">-0.8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,485</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Usage Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" name="Calls" fill="#2563EB" />
                    <Bar dataKey="duration" name="Duration (min)" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.1s</div>
                  <p className="text-xs text-muted-foreground">-0.2s from last period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">91.8%</div>
                  <p className="text-xs text-muted-foreground">+1.4% from last period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-xs text-muted-foreground">+3.2% from last period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground">-0.8% from last period</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="responseTime" name="Response Time (s)" fill="#2563EB" />
                    <Bar yAxisId="right" dataKey="accuracy" name="Accuracy (%)" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Top User Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>United States</span>
                      <span className="font-medium">42%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>United Kingdom</span>
                      <span className="font-medium">18%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Canada</span>
                      <span className="font-medium">11%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Germany</span>
                      <span className="font-medium">9%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Australia</span>
                      <span className="font-medium">7%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Mobile</span>
                      <span className="font-medium">64%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Desktop</span>
                      <span className="font-medium">28%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tablet</span>
                      <span className="font-medium">8%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Very Satisfied</span>
                      <span className="font-medium">47%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Satisfied</span>
                      <span className="font-medium">35%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Neutral</span>
                      <span className="font-medium">12%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dissatisfied</span>
                      <span className="font-medium">5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Very Dissatisfied</span>
                      <span className="font-medium">1%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
