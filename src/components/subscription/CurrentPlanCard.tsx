
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard } from 'lucide-react';
import { UserSubscription } from '@/types/subscription';
import { subscriptionPlans } from '@/data/subscription-data';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface CurrentPlanCardProps {
  subscription: UserSubscription;
  onChangePlan: () => void;
  onCancelPlan: () => void;
}

export function CurrentPlanCard({ subscription, onChangePlan, onCancelPlan }: CurrentPlanCardProps) {
  const currentPlan = subscriptionPlans.find(plan => plan.id === subscription.planId);
  
  if (!currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No active subscription</CardTitle>
          <CardDescription>Choose a plan to get started</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onChangePlan}>View Plans</Button>
        </CardFooter>
      </Card>
    );
  }

  const handleCancelSubscription = () => {
    onCancelPlan();
    toast.success("Subscription cancellation scheduled");
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{currentPlan.name} Plan</CardTitle>
            <CardDescription className="mt-1 text-base">
              ${currentPlan.price}/{currentPlan.billingPeriod === 'monthly' ? 'month' : 'year'}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`${subscription.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
            {subscription.status === 'active' ? 'Active' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Current period: {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CreditCard className="mr-2 h-4 w-4" />
            {subscription.cancelAtPeriodEnd ? 'Cancels at period end' : 'Renews automatically'}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium">Plan features:</h4>
          <ul className="space-y-2">
            {currentPlan.features.filter(feature => feature.included).map((feature, i) => (
              <li key={i} className="text-sm flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {feature.name}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button onClick={onChangePlan} className="w-full sm:w-auto">Change Plan</Button>
        {!subscription.cancelAtPeriodEnd && (
          <Button 
            onClick={handleCancelSubscription} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            Cancel Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
