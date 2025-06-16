import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Users, Clock, TrendingUp } from 'lucide-react';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface ActiveCall {
  id: string;
  customerName: string;
  customerPhone: string;
  status: 'ringing' | 'active' | 'hold' | 'transferring';
  duration: number;
  agentName: string;
  startTime: Date;
  isRecording: boolean;
  isMuted: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const CallManagement: React.FC = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    queuedCalls: 0,
    avgWaitTime: 0,
  });

  const { isConnected, sendMessage, subscribe } = useWebSocket();

  useEffect(() => {
    // Subscribe to real-time call updates
    const unsubscribe = subscribe('call_update', (payload) => {
      setActiveCalls(payload.activeCalls || []);
      setStats(payload.stats || stats);
    });

    // Load initial data
    loadCallData();

    return unsubscribe;
  }, []);

  const loadCallData = () => {
    // Mock data for active calls
    const mockCalls: ActiveCall[] = [
      {
        id: 'call_1',
        customerName: 'Sarah Johnson',
        customerPhone: '+1 (555) 123-4567',
        status: 'active',
        duration: 145,
        agentName: 'AI Agent 1',
        startTime: new Date(Date.now() - 145000),
        isRecording: true,
        isMuted: false,
        sentiment: 'positive',
      },
      {
        id: 'call_2',
        customerName: 'Mike Wilson',
        customerPhone: '+1 (555) 987-6543',
        status: 'hold',
        duration: 89,
        agentName: 'AI Agent 2',
        startTime: new Date(Date.now() - 89000),
        isRecording: true,
        isMuted: false,
        sentiment: 'neutral',
      },
    ];

    setActiveCalls(mockCalls);
    setStats({
      totalCalls: 127,
      activeCalls: mockCalls.length,
      queuedCalls: 3,
      avgWaitTime: 12,
    });
  };

  const handleCallAction = (callId: string, action: string) => {
    if (isConnected) {
      sendMessage({
        type: 'call_action',
        payload: { callId, action },
        timestamp: Date.now(),
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Call Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
                Call Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage live calls in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCalls}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queued Calls</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.queuedCalls}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWaitTime}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Active Calls</CardTitle>
          <CardDescription>Real-time call monitoring and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCalls.map((call) => (
              <div key={call.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{call.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`capitalize ${call.status === 'active' ? 'border-green-200 text-green-700' : ''}`}>
                      {call.status}
                    </Badge>
                    <Badge className={getSentimentColor(call.sentiment)}>
                      {call.sentiment}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Agent: {call.agentName}</span>
                    <span>Duration: {formatDuration(call.duration)}</span>
                    <span>Recording: {call.isRecording ? 'ON' : 'OFF'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={call.isMuted ? "destructive" : "outline"}
                      onClick={() => handleCallAction(call.id, 'toggle_mute')}
                    >
                      {call.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallAction(call.id, 'toggle_recording')}
                    >
                      {call.isRecording ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={call.status === 'hold' ? "default" : "outline"}
                      onClick={() => handleCallAction(call.id, call.status === 'hold' ? 'resume' : 'hold')}
                    >
                      {call.status === 'hold' ? 'Resume' : 'Hold'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCallAction(call.id, 'end_call')}
                    >
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {activeCalls.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active calls at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallManagement;
