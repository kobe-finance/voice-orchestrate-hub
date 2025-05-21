
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubscriptionPlan, UserSubscription } from '@/types/subscription';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlanComparisonProps {
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription;
  onChangePlan: (planId: string) => void;
}

export function PlanComparison({ plans, currentSubscription, onChangePlan }: PlanComparisonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  
  const filteredPlans = plans.filter(plan => plan.billingPeriod === selectedBillingPeriod);
  const currentPlanId = currentSubscription?.planId;

  // Group features across all plans for comparison
  const allFeatures = Array.from(
    new Set(
      plans.flatMap(plan => plan.features.map(feature => feature.name))
    )
  );

  const getDiscountPercentage = (monthlyPrice: number, annualPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - annualPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} variant="outline">
        Compare Plans
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className="max-w-4xl">
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Plans</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your needs
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Tabs 
              defaultValue={selectedBillingPeriod} 
              onValueChange={(value) => setSelectedBillingPeriod(value as 'monthly' | 'annual')}
              className="w-full"
            >
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">
                    Annual
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                      Save up to 20%
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {['monthly', 'annual'].map((period) => (
                <TabsContent key={period} value={period} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans
                      .filter(plan => plan.billingPeriod === period)
                      .map((plan) => {
                        const isCurrentPlan = plan.id === currentPlanId;
                        
                        return (
                          <Card 
                            key={plan.id}
                            className={`relative ${plan.popular ? 'border-primary shadow-md' : ''}
                              ${isCurrentPlan ? 'bg-primary/5' : ''}`}
                          >
                            {plan.popular && (
                              <Badge className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 bg-primary">
                                Popular
                              </Badge>
                            )}
                            {isCurrentPlan && (
                              <Badge className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/2">
                                Current Plan
                              </Badge>
                            )}
                            
                            <CardHeader>
                              <CardTitle>{plan.name}</CardTitle>
                              <CardDescription>{plan.description}</CardDescription>
                              <div className="mt-4">
                                <span className="text-3xl font-bold">${plan.price}</span>
                                <span className="text-muted-foreground">/{plan.billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                                
                                {plan.billingPeriod === 'annual' && (
                                  <div className="text-sm text-green-500 mt-1">
                                    Save {getDiscountPercentage(
                                      plans.find(p => p.name === plan.name && p.billingPeriod === 'monthly')?.price || 0,
                                      plan.price
                                    )}%
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            
                            <CardContent>
                              <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    {feature.included ? (
                                      <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                    ) : (
                                      <XIcon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                                    )}
                                    <span className={!feature.included ? "text-muted-foreground" : ""}>
                                      {feature.name}
                                      {feature.limit ? ` (${feature.limit})` : ''}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              
                              <Button 
                                className="w-full mt-6"
                                disabled={isCurrentPlan}
                                variant={isCurrentPlan ? "secondary" : "default"}
                                onClick={() => {
                                  if (!isCurrentPlan) {
                                    onChangePlan(plan.id);
                                    toast.success(`Plan changed to ${plan.name}`);
                                    setIsDialogOpen(false);
                                  }
                                }}
                              >
                                {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-medium mb-4">Detailed Feature Comparison</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Feature</th>
                  {filteredPlans.map(plan => (
                    <th key={plan.id} className="py-2 px-4 text-center">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((featureName, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                    <td className="py-2">{featureName}</td>
                    {filteredPlans.map(plan => {
                      const feature = plan.features.find(f => f.name === featureName);
                      return (
                        <td key={plan.id} className="py-2 px-4 text-center">
                          {feature?.included ? (
                            feature.limit ? 
                              feature.limit : 
                              <CheckIcon className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <XIcon className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
