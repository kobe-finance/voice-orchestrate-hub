
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TaxInformation } from '@/types/subscription';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface TaxInformationProps {
  taxInfo: TaxInformation | null;
  onUpdateTaxInfo: (info: TaxInformation) => void;
}

const taxFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export function TaxInformationManager({ taxInfo, onUpdateTaxInfo }: TaxInformationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof taxFormSchema>>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      businessName: taxInfo?.businessName || '',
      taxId: taxInfo?.taxId || '',
      street: taxInfo?.address?.street || '',
      city: taxInfo?.address?.city || '',
      state: taxInfo?.address?.state || '',
      postalCode: taxInfo?.address?.postalCode || '',
      country: taxInfo?.address?.country || '',
    }
  });
  
  const handleSubmit = (values: z.infer<typeof taxFormSchema>) => {
    onUpdateTaxInfo({
      businessName: values.businessName,
      taxId: values.taxId,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      }
    });
    
    toast.success("Tax information updated successfully");
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tax Information</CardTitle>
            <CardDescription>Manage your business tax details</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            {taxInfo ? 'Edit Details' : 'Add Details'}
          </Button>
        </CardHeader>
        <CardContent>
          {!taxInfo ? (
            <div className="text-center py-6 text-muted-foreground">
              No tax information added yet
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Business Name</h4>
                <p>{taxInfo.businessName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Tax ID</h4>
                <p>{taxInfo.taxId}</p>
              </div>
              
              {taxInfo.address && (
                <div>
                  <h4 className="text-sm font-medium">Billing Address</h4>
                  <p>{taxInfo.address.street}</p>
                  <p>
                    {taxInfo.address.city}, {taxInfo.address.state} {taxInfo.address.postalCode}
                  </p>
                  <p>{taxInfo.address.country}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{taxInfo ? 'Edit Tax Information' : 'Add Tax Information'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID / VAT Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-4">Billing Address</h3>
                
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
