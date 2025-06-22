import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: "increase" | "decrease" | "neutral";
  description: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
}) => {
  return (
    <Card variant="interactive" className="group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          <div className="flex items-center">
            {trend === "increase" && (
              <ChevronUp className="h-4 w-4 text-green-600" />
            )}
            {trend === "decrease" && (
              <ChevronDown className="h-4 w-4 text-red-500" />
            )}
            {trend === "neutral" && (
              <Minus className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {value}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium",
              trend === "increase" && "text-green-600",
              trend === "decrease" && "text-red-500",
              trend === "neutral" && "text-gray-500"
            )}
          >
            {change}
          </span>
          <span className="text-xs text-gray-500">{description}</span>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              trend === "increase" && "bg-green-500 w-3/4",
              trend === "decrease" && "bg-red-500 w-1/2",
              trend === "neutral" && "bg-gray-400 w-2/3"
            )}
          />
        </div>
      </div>
    </Card>
  );
};
