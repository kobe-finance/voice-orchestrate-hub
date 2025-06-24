
import { BillingHistory, PaymentMethod, SubscriptionPlan, UsageMetric, UserSubscription } from '@/types/subscription';

// Enterprise-only subscription plans with full isolation
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'Full isolation with dedicated infrastructure',
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
      { name: 'Dedicated infrastructure', included: true },
      { name: 'Zero-trust architecture', included: true },
      { name: 'Custom subdomain', included: true },
      { name: 'White-label options', included: true },
    ],
    popular: true,
  },
  {
    id: 'enterprise-annual',
    name: 'Enterprise',
    description: 'Full isolation with dedicated infrastructure (Annual)',
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
      { name: 'Dedicated infrastructure', included: true },
      { name: 'Zero-trust architecture', included: true },
      { name: 'Custom subdomain', included: true },
      { name: 'White-label options', included: true },
      { name: '2 months free', included: true },
    ],
  },
];

// Current subscription for enterprise customer
export const currentSubscription: UserSubscription = {
  id: 'sub_enterprise_12345',
  userId: 'user_1',
  planId: 'enterprise-monthly',
  status: 'active',
  currentPeriodStart: '2025-05-01T00:00:00Z',
  currentPeriodEnd: '2025-06-01T00:00:00Z',
  cancelAtPeriodEnd: false,
};

// Enterprise usage metrics
export const usageMetrics: UsageMetric[] = [
  {
    id: 'minutes',
    name: 'Call Minutes',
    currentUsage: 8450,
    limit: 20000,
    unit: 'minutes',
  },
  {
    id: 'agents',
    name: 'Voice Agents',
    currentUsage: 12,
    limit: 999, // Representing unlimited as high number
    unit: 'agents',
  },
  {
    id: 'storage',
    name: 'Document Storage',
    currentUsage: 47.3,
    limit: 1000,
    unit: 'GB',
  },
  {
    id: 'api',
    name: 'API Calls',
    currentUsage: 156780,
    limit: 1000000, // High limit for enterprise
    unit: 'calls',
  },
];

// Enterprise billing history
export const billingHistory: BillingHistory[] = [
  {
    id: 'inv_ent_12345',
    date: '2025-05-01T00:00:00Z',
    amount: 299,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_enterprise_may2025.pdf',
  },
  {
    id: 'inv_ent_12344',
    date: '2025-04-01T00:00:00Z',
    amount: 299,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_enterprise_apr2025.pdf',
  },
  {
    id: 'inv_ent_12343',
    date: '2025-03-01T00:00:00Z',
    amount: 299,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_enterprise_mar2025.pdf',
  },
  {
    id: 'inv_ent_12342',
    date: '2025-02-01T00:00:00Z',
    amount: 299,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_enterprise_feb2025.pdf',
  },
  {
    id: 'inv_ent_12341',
    date: '2025-01-01T00:00:00Z',
    amount: 299,
    status: 'paid',
    invoiceUrl: 'https://example.com/invoice_enterprise_jan2025.pdf',
  },
];

// Enterprise payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_ent_12345',
    type: 'card',
    lastFour: '4242',
    expiryDate: '04/2028',
    cardBrand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm_ent_12344',
    type: 'bank',
    name: 'Corporate Account ****1234',
    isDefault: false,
  },
];
