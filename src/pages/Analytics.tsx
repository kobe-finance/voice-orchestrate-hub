
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, PieChart, LineChart, Download, RefreshCw, Filter, Phone, Clock, Users, DollarSign } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for charts
  const callVolumeData = [
    { date: '2025-05-19', calls: 145, conversions: 35, duration: 4.2 },
    { date: '2025-05-20', calls: 162, conversions: 42, duration: 4.5 },
    { date: '2025-05-21', calls: 178, conversions: 48, duration: 3.8 },
    { date: '2025-05-22', calls: 155, conversions: 38, duration: 4.1 },
    { date: '2025-05-23', calls: 189, conversions: 52, duration: 4.6 },
    { date: '2025-05-24', calls: 201, conversions: 58, duration: 4.3 },
    { date: '2025-05-25', calls: 167, conversions: 45, duration: 4.0 }
  ];

  const agentPerformanceData = [
    { agent: 'Sales Agent', calls: 324, avgDuration: 4.2, satisfaction: 4.8 },
    { agent: 'Support Agent', calls: 267, avgDuration: 6.1, satisfaction: 4.6 },
    { agent: 'Booking Agent', calls: 189, avgDuration: 3.5, satisfaction: 4.9 }
  ];

  const intentDistributionData = [
    { name: 'Product Inquiry', value: 35, color: '#2563EB' },
    { name: 'Support Request', value: 28, color: '#F97316' },
    { name: 'Booking', value: 22, color: '#10B981' },
    { name: 'Complaint', value: 10, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#6B7280' }
  ];

  const realtimeData = [
    { time: '09:00', activeCalls: 12, queueLength: 3 },
    { time: '09:30', activeCalls: 18, queueLength: 5 },
    { time: '10:00', activeCalls: 25, queueLength: 8 },
    { time: '10:30', activeCalls: 22, queueLength: 4 },
    { time: '11:00', activeCalls: 31, queueLength: 12 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Business Intelligence</h1>
          <p className="text-muted-foreground">Comprehensive insights and analytics for your voice operations</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last Day</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,287</div>
            <p className="text-xs text-muted-foreground">+12.5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.4%</div>
            <p className="text-xs text-muted-foreground">+3.2% improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 52s</div>
            <p className="text-xs text-muted-foreground">-8% more efficient</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">+0.2 increase</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume & Conversions</CardTitle>
                <CardDescription>Track call volume and conversion trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#F97316" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intent Distribution</CardTitle>
                <CardDescription>Breakdown of customer call intents</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie dataKey="value" data={intentDistributionData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                      {intentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Comparison</CardTitle>
              <CardDescription>Compare performance metrics across different agents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agent" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#2563EB" />
                  <Bar dataKey="avgDuration" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Call Activity</CardTitle>
                <CardDescription>Real-time call volume and queue status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="activeCalls" stackId="1" stroke="#2563EB" fill="#2563EB" />
                    <Area type="monotone" dataKey="queueLength" stackId="2" stroke="#F97316" fill="#F97316" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Metrics</CardTitle>
                <CardDescription>Live performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-muted-foreground">Active Calls</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-muted-foreground">In Queue</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-blue-600">3.2s</div>
                    <div className="text-sm text-muted-foreground">Avg Wait Time</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance analysis and benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-muted-foreground">First Call Resolution</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Machine learning insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium">Peak Hour Optimization</h4>
                  <p className="text-sm text-muted-foreground">Consider adding 2 more agents during 2-4 PM to reduce wait times by 23%</p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium">Script Performance</h4>
                  <p className="text-sm text-muted-foreground">The updated greeting script increased conversion rates by 15%</p>
                </div>
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-medium">Customer Sentiment Trend</h4>
                  <p className="text-sm text-muted-foreground">Sentiment has improved by 12% after implementing new follow-up procedures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create and schedule custom analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Weekly Performance Report', schedule: 'Every Monday', lastRun: '2025-05-20' },
                  { name: 'Monthly KPI Dashboard', schedule: 'First of month', lastRun: '2025-05-01' },
                  { name: 'Agent Efficiency Report', schedule: 'Bi-weekly', lastRun: '2025-05-15' }
                ].map((report, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>Schedule: {report.schedule}</div>
                        <div>Last Run: {report.lastRun}</div>
                        <Button size="sm" className="w-full">View Report</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
