
import React, { useState } from 'react';
import { ActivityLog } from '@/types/user';
import { activityLogs, users } from '@/data/user-data';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, FileDown, Filter } from 'lucide-react';

export const ActivityLogViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [logs, setLogs] = useState<ActivityLog[]>(activityLogs);
  
  // Build list of unique action types
  const actionTypes = Array.from(new Set(logs.map(log => log.action)));
  
  // Filter logs based on search query and action filter
  const filteredLogs = logs.filter(log => {
    // Apply action filter
    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches = 
        log.details.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        getUserName(log.userId).toLowerCase().includes(query);
      
      if (!matches) {
        return false;
      }
    }
    
    return true;
  });
  
  // Helper to get user name from ID
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };
  
  const exportLogs = () => {
    // In a real app, this would generate a CSV or PDF export
    toast.success("Logs exported successfully");
  };
  
  return (
    <Card>
      <div className="p-4 border-b flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-grow">
          <SearchInput 
            placeholder="Search activity logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="w-full max-w-sm"
          />
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map(action => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button variant="outline" onClick={exportLogs}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{getUserName(log.userId)}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
