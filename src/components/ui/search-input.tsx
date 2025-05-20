
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          className={cn(icon ? "pl-10" : "", "h-9")}
          type="search"
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
