
/**
 * Subscription and billing related types
 */

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  features: {
    name: string;
    included: boolean;
    limit?: number;
  }[];
  popular?: boolean;
};

export type UsageMetric = {
  id: string;
  name: string;
  currentUsage: number;
  limit: number;
  unit: string;
};

export type BillingHistory = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  lastFour?: string;
  expiryDate?: string;
  cardBrand?: string;
  isDefault: boolean;
  name?: string;
};

export type TaxInformation = {
  businessName?: string;
  taxId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';

export type UserSubscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};
