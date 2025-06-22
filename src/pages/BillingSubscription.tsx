
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CreditCard, Receipt, Settings, Crown, Zap, Shield, Sparkles, Download } from 'lucide-react';
import { ModernTable } from '@/components/ui/table-modern';

const BillingSubscription = () => {
  const currentPlan = {
    name: 'Professional',
    price: '$99',
    period: 'month',
    features: ['Unlimited Voice Agents', 'Advanced Analytics', 'Priority Support', 'Custom Integrations'],
    usage: {
      calls: { used: 8540, limit: 10000 },
      agents: { used: 5, limit: 10 },
      storage: { used: 2.4, limit: 5 }
    }
  };

  const billingHistory = [
    { id: '1', date: '2024-01-15', amount: '$99.00', status: 'paid', invoice: 'INV-001' },
    { id: '2', date: '2023-12-15', amount: '$99.00', status: 'paid', invoice: 'INV-002' },
    { id: '3', date: '2023-11-15', amount: '$99.00', status: 'paid', invoice: 'INV-003' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'month',
      features: ['5 Voice Agents', 'Basic Analytics', 'Email Support'],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: 'month',
      features: ['Unlimited Voice Agents', 'Advanced Analytics', 'Priority Support', 'Custom Integrations'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'month',
      features: ['Everything in Pro', 'Dedicated Support', 'SLA Guarantee', 'Custom Development'],
      popular: false
    }
  ];

  const tableColumns = [
    { key: 'date', title: 'Date', sortable: true },
    { key: 'invoice', title: 'Invoice', sortable: false },
    { key: 'amount', title: 'Amount', sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'paid' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Download
        </Button>
      )
    }
  ];

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
                  <BreadcrumbPage>Billing & Subscription</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
                Billing & Subscription
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your subscription, payment methods, and billing information.</p>
            </div>
          </div>
          <Button variant="gradient" leftIcon={<Crown className="h-4 w-4" />}>
            Upgrade Plan
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Billing History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan Card */}
            <Card variant="gradient" className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Crown className="h-6 w-6 text-primary/60" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Current Plan: {currentPlan.name}</CardTitle>
                    <CardDescription>
                      ${currentPlan.price}/{currentPlan.period} • Next billing: February 15, 2024
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full">
                      Change Plan
                    </Button>
                    <Button variant="ghost" className="w-full text-red-600 hover:text-red-700">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.name} variant={plan.popular ? "gradient" : "elevated"} className="relative">
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Badge variant="default" className="bg-gradient-to-r from-primary to-primary-600">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        {plan.price}
                        {plan.price !== 'Custom' && <span className="text-sm font-normal">/{plan.period}</span>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Shield className="h-3 w-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={plan.popular ? "default" : "outline"} 
                        className="w-full"
                        disabled={plan.name === currentPlan.name}
                      >
                        {plan.name === currentPlan.name ? "Current Plan" : "Choose Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Voice Calls</CardTitle>
                  <CardDescription>Monthly usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {currentPlan.usage.calls.used.toLocaleString()} / {currentPlan.usage.calls.limit.toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(currentPlan.usage.calls.used / currentPlan.usage.calls.limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {Math.round((currentPlan.usage.calls.used / currentPlan.usage.calls.limit) * 100)}% used
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Active Agents</CardTitle>
                  <CardDescription>Current deployment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {currentPlan.usage.agents.used} / {currentPlan.usage.agents.limit}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(currentPlan.usage.agents.used / currentPlan.usage.agents.limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {Math.round((currentPlan.usage.agents.used / currentPlan.usage.agents.limit) * 100)}% used
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Storage</CardTitle>
                  <CardDescription>Data & recordings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {currentPlan.usage.storage.used}GB / {currentPlan.usage.storage.limit}GB
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {Math.round((currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100)}% used
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card variant="elevated" padding="none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <CardDescription>Your recent invoices and payments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ModernTable
                  data={billingHistory}
                  columns={tableColumns}
                  searchable={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                        <Badge variant="default">Primary</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Update Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Billing Settings
                  </CardTitle>
                  <CardDescription>Configure billing preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border bg-muted/30">
                      <h4 className="font-medium mb-2">Billing Address</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Business St<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Update Billing Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingSubscription;
