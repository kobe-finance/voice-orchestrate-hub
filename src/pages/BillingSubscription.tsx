
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { CurrentPlanCard } from '@/components/subscription/CurrentPlanCard';
import { UsageMetrics } from '@/components/subscription/UsageMetrics';
import { BillingHistoryTable } from '@/components/subscription/BillingHistory';
import { PaymentMethodManager } from '@/components/subscription/PaymentMethodManager';
import { PlanComparison } from '@/components/subscription/PlanComparison';
import { TaxInformationManager } from '@/components/subscription/TaxInformation';
import { PaymentMethod, TaxInformation } from '@/types/subscription';
import { toast } from 'sonner';
import { 
  billingHistory, 
  currentSubscription, 
  paymentMethods, 
  subscriptionPlans, 
  usageMetrics 
} from '@/data/subscription-data';

const BillingSubscription = () => {
  const [selectedPaymentMethods, setPaymentMethods] = useState(paymentMethods);
  const [currentTaxInfo, setTaxInfo] = useState<TaxInformation | null>(null);
  const [subscription, setSubscription] = useState(currentSubscription);

  const handleChangePlan = (planId: string) => {
    setSubscription({
      ...subscription,
      planId
    });
    toast.success("Subscription plan updated");
  };

  const handleCancelPlan = () => {
    setSubscription({
      ...subscription,
      cancelAtPeriodEnd: true
    });
    toast.success("Subscription will be canceled at the end of the billing period");
  };

  const handleAddPaymentMethod = (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      isDefault: selectedPaymentMethods.length === 0, // Make default if it's the first one
      ...method,
    };
    setPaymentMethods([...selectedPaymentMethods, newMethod]);
  };

  const handleSetDefaultMethod = (id: string) => {
    setPaymentMethods(
      selectedPaymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(
      selectedPaymentMethods.filter(method => method.id !== id)
    );
  };

  const handleUpdateTaxInfo = (info: TaxInformation) => {
    setTaxInfo(info);
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription, payment methods, and billing information
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <PlanComparison 
              plans={subscriptionPlans}
              currentSubscription={subscription}
              onChangePlan={handleChangePlan}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CurrentPlanCard 
              subscription={subscription}
              onChangePlan={() => document.getElementById('compare-plans-button')?.click()}
              onCancelPlan={handleCancelPlan}
            />
          </div>
          <div>
            <UsageMetrics metrics={usageMetrics} />
          </div>
        </div>

        <div className="mt-8">
          <BillingHistoryTable history={billingHistory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <PaymentMethodManager 
            paymentMethods={selectedPaymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onSetDefaultMethod={handleSetDefaultMethod}
            onRemoveMethod={handleRemoveMethod}
          />
          
          <TaxInformationManager 
            taxInfo={currentTaxInfo}
            onUpdateTaxInfo={handleUpdateTaxInfo}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BillingSubscription;
