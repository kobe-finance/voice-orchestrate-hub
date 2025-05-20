
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center">
          {trend === "increase" && (
            <ChevronUp className="mr-1 h-4 w-4 text-success" />
          )}
          {trend === "decrease" && (
            <ChevronDown className="mr-1 h-4 w-4 text-error" />
          )}
          {trend === "neutral" && (
            <Minus className="mr-1 h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend === "increase" && "text-success",
              trend === "decrease" && "text-error",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
          <CardDescription className="ml-2">{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
