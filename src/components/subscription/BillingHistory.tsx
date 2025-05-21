
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BillingHistory } from '@/types/subscription';
import { formatDate } from '@/lib/utils';
import { FileDown } from 'lucide-react';

interface BillingHistoryProps {
  history: BillingHistory[];
}

export function BillingHistoryTable({ history }: BillingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No billing history available
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${item.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                        item.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-red-500/10 text-red-500'}`
                    }>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.invoiceUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(item.invoiceUrl, '_blank')}
                        className="h-8"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
