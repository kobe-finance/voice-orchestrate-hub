
import React, { useState } from 'react';
import { User } from '@/types/user';
import { users, roles, getAllUsersWithRoles } from '@/data/user-data';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Filter, MoreHorizontal } from 'lucide-react';
import { UserDetailDialog } from './UserDetailDialog';
import { CreateUserDialog } from './CreateUserDialog';

export const UserDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [usersData, setUsersData] = useState(getAllUsersWithRoles());
  
  // Filter users based on search query
  const filteredUsers = usersData.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  });
  
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleCreateUser = () => {
    setShowCreateUser(true);
  };
  
  const handleUserUpdated = (updatedUser: User) => {
    // In a real app, this would be an API call
    setUsersData(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    setSelectedUser(null);
  };
  
  const getUserRoleNames = (user: any) => {
    return user.roles.map((role: any) => role.name).join(', ');
  };
  
  return (
    <Card>
      <div className="p-4 border-b flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-grow">
          <SearchInput 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow 
                  key={user.id} 
                  onClick={() => handleUserClick(user)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getUserRoleNames(user)}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedUser && (
        <UserDetailDialog 
          user={selectedUser} 
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onSave={handleUserUpdated}
        />
      )}
      
      {showCreateUser && (
        <CreateUserDialog 
          roles={roles}
          onClose={() => setShowCreateUser(false)}
          onSave={(newUser) => {
            // In a real app, this would be an API call
            const userWithId = {
              ...newUser,
              id: `${usersData.length + 1}`,
              createdAt: new Date().toISOString()
            };
            setUsersData([...usersData, { ...userWithId, roles: [] }]);
            setShowCreateUser(false);
          }}
        />
      )}
    </Card>
  );
};
