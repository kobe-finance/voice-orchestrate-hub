
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDirectory } from "@/components/users/UserDirectory";
import { RoleManagement } from "@/components/users/RoleManagement";
import { ActivityLogViewer } from "@/components/users/ActivityLogViewer";

const UserManagement = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">User & Role Management</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserDirectory />
          </TabsContent>
          
          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityLogViewer />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagement;
