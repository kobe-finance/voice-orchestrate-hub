
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { ChartLine, ChartPie, ChartBarHorizontal, Calendar, Download } from "lucide-react";

// Analytics data
const analyticsData = [
  { name: "Jan", calls: 400, duration: 240, completed: 380, transferred: 20, csat: 4.2 },
  { name: "Feb", calls: 300, duration: 180, completed: 280, transferred: 20, csat: 4.0 },
  { name: "Mar", calls: 500, duration: 320, completed: 460, transferred: 40, csat: 4.3 },
  { name: "Apr", calls: 280, duration: 250, completed: 250, transferred: 30, csat: 4.1 },
  { name: "May", calls: 590, duration: 370, completed: 540, transferred: 50, csat: 4.4 },
  { name: "Jun", calls: 490, duration: 300, completed: 450, transferred: 40, csat: 4.2 },
  { name: "Jul", calls: 600, duration: 410, completed: 550, transferred: 50, csat: 4.5 },
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

// Intent recognition data
const intentRecognitionData = [
  { name: "Correctly Identified", value: 85 },
  { name: "Partially Identified", value: 10 },
  { name: "Misidentified", value: 5 },
];

const COLORS = ['#10B981', '#FBBF24', '#EF4444'];

// Detailed call data for tables
const callDetailsData = [
  { id: "C-1001", date: "2023-07-01", duration: "4m 12s", agent: "Sales Agent", outcome: "Completed", satisfaction: 5 },
  { id: "C-1002", date: "2023-07-01", duration: "2m 45s", agent: "Support Agent", outcome: "Transferred", satisfaction: 3 },
  { id: "C-1003", date: "2023-07-02", duration: "6m 20s", agent: "Sales Agent", outcome: "Completed", satisfaction: 4 },
  { id: "C-1004", date: "2023-07-02", duration: "3m 15s", agent: "Booking Agent", outcome: "Completed", satisfaction: 5 },
  { id: "C-1005", date: "2023-07-03", duration: "1m 50s", agent: "Support Agent", outcome: "Incomplete", satisfaction: 2 },
  { id: "C-1006", date: "2023-07-03", duration: "5m 10s", agent: "Sales Agent", outcome: "Completed", satisfaction: 4 },
  { id: "C-1007", date: "2023-07-04", duration: "2m 30s", agent: "Support Agent", outcome: "Completed", satisfaction: 5 },
];

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");
  
  const handleExportData = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    console.log("Exporting analytics data...");
    alert("Analytics data export started. Your file will download shortly.");
  };

  return (
    <Layout>
      <div className="container py-6 max-w-7xl mx-auto">
        <PageHeader
          title="Call Analytics Dashboard"
          description="Comprehensive analysis of your voice agents' performance"
          className="mb-6"
        />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Custom Date Range</span>
            </Button>
          </div>
          
          <Button onClick={handleExportData} className="flex items-center gap-2">
            <Download size={18} />
            <span>Export Data</span>
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Agent Performance</TabsTrigger>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="details">Call Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
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
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92.4%</div>
                  <p className="text-xs text-muted-foreground">+1.6% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.3/5</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChartLine className="mr-2" size={20} /> Call Volume Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChartPie className="mr-2" size={20} /> Intent Recognition Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={intentRecognitionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {intentRecognitionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBarHorizontal className="mr-2" size={20} /> Monthly Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" name="Calls" fill="#2563EB" />
                    <Bar dataKey="completed" name="Completed" fill="#10B981" />
                    <Bar dataKey="transferred" name="Transferred" fill="#F97316" />
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

          <TabsContent value="engagement" className="space-y-4">
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
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Satisfaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callDetailsData.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.id}</TableCell>
                        <TableCell>{call.date}</TableCell>
                        <TableCell>{call.duration}</TableCell>
                        <TableCell>{call.agent}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              call.outcome === "Completed"
                                ? "bg-green-100 text-green-800"
                                : call.outcome === "Transferred"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {call.outcome}
                          </span>
                        </TableCell>
                        <TableCell>{call.satisfaction}/5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
