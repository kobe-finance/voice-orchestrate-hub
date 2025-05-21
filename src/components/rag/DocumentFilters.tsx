
import React from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FilterState {
  status: string;
  priority: string;
}

interface DocumentFiltersProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const DocumentFilters = ({ filter, onFilterChange }: DocumentFiltersProps) => {
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filter,
      status: value
    });
  };
  
  const handlePriorityChange = (value: string) => {
    onFilterChange({
      ...filter,
      priority: value
    });
  };
  
  const handleResetFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all'
    });
  };
  
  const isFiltersActive = filter.status !== 'all' || filter.priority !== 'all';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 ${isFiltersActive ? 'bg-secondary' : ''}`}
        >
          <Filter size={16} />
          <span>Filters</span>
          {isFiltersActive && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {(filter.status !== 'all' ? 1 : 0) + (filter.priority !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Filter Documents</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground mt-1">Status</DropdownMenuLabel>
          <div className="px-2 py-1">
            <Select 
              value={filter.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DropdownMenuLabel className="text-xs text-muted-foreground mt-1">Priority</DropdownMenuLabel>
          <div className="px-2 py-1">
            <Select 
              value={filter.priority} 
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="justify-center text-center cursor-pointer"
          onClick={handleResetFilters}
        >
          Reset Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
