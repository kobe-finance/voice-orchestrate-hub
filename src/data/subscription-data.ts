
import { BillingHistory, PaymentMethod, SubscriptionPlan, UsageMetric, UserSubscription } from '@/types/subscription';

// Subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    description: 'For individuals and small teams',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      { name: 'Up to 3 voice agents', included: true },
      { name: '1,000 minutes per month', included: true },
      { name: 'Standard voice models', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Custom actions', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom voice models', included: false },
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Professional',
    description: 'For growing businesses',
    price: 99,
    billingPeriod: 'monthly',
    features: [
      { name: 'Up to 10 voice agents', included: true },
      { name: '5,000 minutes per month', included: true },
      { name: 'Premium voice models', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom actions', included: true },
      { name: 'API access', included: true },
      { name: 'Custom voice models', included: false },
    ],
    popular: true,
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 299,
    billingPeriod: 'monthly',
    features: [
      { name: 'Unlimited voice agents', included: true },
      { name: '20,000 minutes per month', included: true },
      { name: 'Premium voice models', included: true },
      { name: 'Enterprise analytics', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom actions', included: true },
      { name: 'API access', included: true },
      { name: 'Custom voice models', included: true },
    ],
  },
  {
    id: 'basic-annual',
    name: 'Basic',
    description: 'For individuals and small teams',
    price: 290,
    billingPeriod: 'annual',
    features: [
      { name: 'Up to 3 voice agents', included: true },
      { name: '1,000 minutes per month', included: true },
      { name: 'Standard voice models', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Custom actions', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom voice models', included: false },
    ],
  },
  {
    id: 'pro-annual',
    name: 'Professional',
    description: 'For growing businesses',
    price: 990,
    billingPeriod: 'annual',
    features: [
      { name: 'Up to 10 voice agents', included: true },
      { name: '5,000 minutes per month', included: true },
      { name: 'Premium voice models', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom actions', included: true },
      { name: 'API access', included: true },
      { name: 'Custom voice models', included: false },
    ],
    popular: true,
  },
  {
    id: 'enterprise-annual',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 2990,
    billingPeriod: 'annual',
    features: [
      { name: 'Unlimited voice agents', included: true },
      { name: '20,000 minutes per month', included: true },
      { name: 'Premium voice models', included: true },
      { name: 'Enterprise analytics', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom actions', included: true },
      { name: 'API access', included: true },
      { name: 'Custom voice models', included: true },
    ],
  },
];

// Current subscription for demo
export const currentSubscription: UserSubscription = {
  id: 'sub_12345',
  userId: 'user_1',
  planId: 'pro-monthly',
  status: 'active',
  currentPeriodStart: '2025-05-01T00:00:00Z',
  currentPeriodEnd: '2025-06-01T00:00:00Z',
  cancelAtPeriodEnd: false,
};

// Usage metrics
export const usageMetrics: UsageMetric[] = [
  {
    id: 'minutes',
    name: 'Call Minutes',
    currentUsage: 2458,
    limit: 5000,
    unit: 'minutes',
  },
  {
    id: 'agents',
    name: 'Voice Agents',
    currentUsage: 6,
    limit: 10,
    unit: 'agents',
  },
  {
    id: 'storage',
    name: 'Document Storage',
    currentUsage: 4.7,
    limit: 10,
    unit: 'GB',
  },
  {
    id: 'api',
    name: 'API Calls',
    currentUsage: 45670,
    limit: 100000,
    unit: 'calls',
  },
];

// Billing history
export const billingHistory: BillingHistory[] = [
  {
    id: 'inv_12345',
    date: '2025-05-01T00:00:00Z',
    amount: 99,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_may2025.pdf',
  },
  {
    id: 'inv_12344',
    date: '2025-04-01T00:00:00Z',
    amount: 99,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_apr2025.pdf',
  },
  {
    id: 'inv_12343',
    date: '2025-03-01T00:00:00Z',
    amount: 99,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_mar2025.pdf',
  },
  {
    id: 'inv_12342',
    date: '2025-02-01T00:00:00Z',
    amount: 29,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_feb2025.pdf',
  },
  {
    id: 'inv_12341',
    date: '2025-01-01T00:00:00Z',
    amount: 29,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_jan2025.pdf',
  },
];

// Payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_12345',
    type: 'card',
    lastFour: '4242',
    expiryDate: '04/2028',
    cardBrand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm_12344',
    type: 'card',
    lastFour: '1234',
    expiryDate: '09/2026',
    cardBrand: 'Mastercard',
    isDefault: false,
  },
  {
    id: 'pm_12343',
    type: 'paypal',
    name: 'personal@example.com',
    isDefault: false,
  },
];
