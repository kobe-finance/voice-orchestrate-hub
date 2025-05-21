
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { calculateCost } from "@/lib/utils";

interface ProviderCostComparisonProps {
  providers: any[];
  characterCount: number;
}

const ProviderCostComparison: React.FC<ProviderCostComparisonProps> = ({
  providers,
  characterCount
}) => {
  // Sort by cost (lowest first)
  const sortedProviders = [...providers].sort((a, b) => a.costPer1000Chars - b.costPer1000Chars);
  
  // Calculate savings compared to the most expensive provider
  const mostExpensive = sortedProviders[sortedProviders.length - 1];
  const calculateSavings = (provider: any): string => {
    if (provider.id === mostExpensive.id) return "0%";
    const savings = ((mostExpensive.costPer1000Chars - provider.costPer1000Chars) / mostExpensive.costPer1000Chars) * 100;
    return `${savings.toFixed(0)}%`;
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Cost per 1K Chars</TableHead>
            <TableHead>Estimated Monthly Cost</TableHead>
            <TableHead>Potential Savings</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProviders.map((provider) => (
            <TableRow key={provider.id} className={provider.isPrimary ? "bg-primary/5" : ""}>
              <TableCell className="font-medium">
                {provider.name}
                {provider.isPrimary && (
                  <Badge variant="outline" className="ml-2">Primary</Badge>
                )}
              </TableCell>
              <TableCell>${provider.costPer1000Chars.toFixed(2)}</TableCell>
              <TableCell className="font-medium">{calculateCost(provider, characterCount)}</TableCell>
              <TableCell>
                {provider.id === mostExpensive.id ? (
                  "—"
                ) : (
                  <span className="text-green-600">Save {calculateSavings(provider)}</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={provider.credentials.isConfigured ? "default" : "outline"}
                  className={provider.credentials.isConfigured ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {provider.credentials.isConfigured ? "Configured" : "Not Set"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-2">Cost Optimization Tips</h4>
        <ul className="text-sm space-y-1">
          <li>• Use lower quality settings for internal/testing uses</li>
          <li>• Implement caching for common phrases</li>
          <li>• Set character limits for responses</li>
          <li>• Balance between cost and quality based on use case</li>
          <li>• Consider prepaid credits for volume discounts</li>
        </ul>
      </div>
    </div>
  );
};

export default ProviderCostComparison;
