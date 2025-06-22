
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
        <Input
          leftIcon={icon}
          className="h-9"
          type="search"
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
