
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, XCircle, Star, Play, Pause, Settings } from 'lucide-react';

const QualityAssurance = () => {
  const [qualityScores, setQualityScores] = useState([
    { id: 'QA-001', call: 'Call #12345', agent: 'Sales Agent', score: 92, status: 'reviewed', reviewer: 'John Manager', issues: 1 },
    { id: 'QA-002', call: 'Call #12346', agent: 'Support Agent', score: 88, status: 'pending', reviewer: '-', issues: 2 },
    { id: 'QA-003', call: 'Call #12347', agent: 'Booking Agent', score: 95, status: 'approved', reviewer: 'Sarah Lead', issues: 0 }
  ]);

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quality Assurance</h1>
          <p className="text-muted-foreground">Monitor and improve call quality and agent performance</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configure QA Rules
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Quality Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.5</div>
            <p className="text-xs text-muted-foreground">+2.3 from last month</p>
            <Progress value={91.5} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">85% of total calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Identified</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-15% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.2%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Quality Reviews</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Score Reviews</CardTitle>
              <CardDescription>Review and manage call quality assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityScores.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.call}</TableCell>
                      <TableCell>{review.agent}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.score}</span>
                          {getScoreBadge(review.score)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        {review.issues > 0 ? (
                          <Badge variant="destructive">{review.issues}</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>{review.reviewer}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Call Monitoring</CardTitle>
              <CardDescription>Monitor ongoing calls in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { agent: 'Sales Agent', status: 'active', duration: '3:24', quality: 'good' },
                  { agent: 'Support Agent', status: 'active', duration: '1:45', quality: 'excellent' },
                  { agent: 'Booking Agent', status: 'idle', duration: '-', quality: '-' }
                ].map((monitor, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{monitor.agent}</CardTitle>
                        <Badge variant={monitor.status === 'active' ? 'default' : 'secondary'}>
                          {monitor.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>Duration: {monitor.duration}</div>
                        <div>Quality: {monitor.quality}</div>
                        {monitor.status === 'active' && (
                          <Button size="sm" className="w-full">Listen In</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Coaching</CardTitle>
              <CardDescription>Coaching recommendations and training materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { agent: 'Sales Agent', focus: 'Closing Techniques', priority: 'high', sessions: 3 },
                  { agent: 'Support Agent', focus: 'Active Listening', priority: 'medium', sessions: 2 },
                  { agent: 'Booking Agent', focus: 'Time Management', priority: 'low', sessions: 1 }
                ].map((coaching, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-medium">{coaching.agent}</h4>
                      <p className="text-sm text-muted-foreground">Focus Area: {coaching.focus}</p>
                      <p className="text-sm text-muted-foreground">Sessions Completed: {coaching.sessions}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={coaching.priority === 'high' ? 'destructive' : coaching.priority === 'medium' ? 'default' : 'secondary'}>
                        {coaching.priority} priority
                      </Badge>
                      <Button size="sm">Schedule Session</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <CardDescription>Track compliance with industry standards and regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">TCPA Compliance</h4>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Progress value={98} className="mb-2" />
                    <p className="text-sm text-muted-foreground">98% compliance rate</p>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">GDPR Compliance</h4>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Progress value={95} className="mb-2" />
                    <p className="text-sm text-muted-foreground">95% compliance rate</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">PCI DSS</h4>
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <Progress value={87} className="mb-2" />
                    <p className="text-sm text-muted-foreground">87% compliance rate</p>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Call Recording Consent</h4>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <Progress value={100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">100% compliance rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance Settings</CardTitle>
              <CardDescription>Configure QA monitoring and evaluation criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic quality scoring</Label>
                  <p className="text-sm text-muted-foreground">Enable AI-powered quality scoring for all calls</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time alerts</Label>
                  <p className="text-sm text-muted-foreground">Send alerts for quality issues during calls</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Minimum quality score threshold</Label>
                <Input defaultValue="75" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Review frequency (%)</Label>
                <Input defaultValue="25" type="number" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityAssurance;
