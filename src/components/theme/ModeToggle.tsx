
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

export function ModeToggle() {
  console.log('ModeToggle rendering - themes temporarily disabled');
  
  return (
    <Button variant="outline" size="icon" disabled>
      <Sun className="h-4 w-4" />
      <span className="sr-only">Theme toggle disabled</span>
    </Button>
  );
}
