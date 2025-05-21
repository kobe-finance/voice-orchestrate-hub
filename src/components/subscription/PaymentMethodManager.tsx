
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PaymentMethod } from '@/types/subscription';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => void;
  onSetDefaultMethod: (id: string) => void;
  onRemoveMethod: (id: string) => void;
}

const paymentFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export function PaymentMethodManager({ 
  paymentMethods, 
  onAddPaymentMethod, 
  onSetDefaultMethod, 
  onRemoveMethod
}: PaymentMethodManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    }
  });
  
  const handleSubmit = (values: z.infer<typeof paymentFormSchema>) => {
    const cardBrand = getCardBrand(values.cardNumber);
    const lastFour = values.cardNumber.slice(-4);
    
    onAddPaymentMethod({
      type: 'card',
      cardBrand,
      lastFour,
      expiryDate: values.expiryDate,
    });
    
    toast.success("Payment method added successfully");
    setIsDialogOpen(false);
    form.reset();
  };

  const getCardBrand = (cardNumber: string): string => {
    // Very simplified card brand detection
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    if (cardNumber.startsWith('6')) return 'Discover';
    return 'Unknown';
  };
  
  const getCardIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      case 'discover': return '💳';
      case 'paypal': return '🅿️';
      case 'bank': return '🏦';
      default: return '💳';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment options</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Add New</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No payment methods added yet
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${method.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-xl">
                      {getCardIcon(method.type === 'card' ? method.cardBrand! : method.type)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.type === 'card' 
                          ? `${method.cardBrand} •••• ${method.lastFour}` 
                          : method.type === 'paypal' 
                            ? `PayPal (${method.name})` 
                            : 'Bank Account'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.type === 'card' && `Expires ${method.expiryDate}`}
                        {method.isDefault && <span className="ml-2 text-primary">Default</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          onSetDefaultMethod(method.id);
                          toast.success("Default payment method updated");
                        }}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (method.isDefault) {
                          toast.error("Cannot remove default payment method");
                        } else {
                          onRemoveMethod(method.id);
                          toast.success("Payment method removed");
                        }
                      }}
                      disabled={method.isDefault}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="4242 4242 4242 4242" 
                        {...field} 
                        maxLength={16}
                        onChange={(e) => {
                          // Allow only digits
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          {...field}
                          maxLength={5}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, '');
                            if (value.length > 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          {...field}
                          maxLength={4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Payment Method</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
