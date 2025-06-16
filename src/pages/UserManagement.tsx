
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDirectory } from "@/components/users/UserDirectory";
import { RoleManagement } from "@/components/users/RoleManagement";
import { ActivityLogViewer } from "@/components/users/ActivityLogViewer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button-modern";
import { Card } from "@/components/ui/card-modern";
import { Users, UserPlus, Shield, Activity } from "lucide-react";

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
                User & Role Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage users, roles, and permissions across your organization.</p>
            </div>
          </div>
          <Button variant="gradient" leftIcon={<UserPlus className="h-4 w-4" />}>
            Add User
          </Button>
        </div>

        <Card variant="elevated" padding="none">
          <Tabs defaultValue="users" className="w-full">
            <div className="border-b border-border px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="users" className="p-6 pt-4">
              <UserDirectory />
            </TabsContent>
            
            <TabsContent value="roles" className="p-6 pt-4">
              <RoleManagement />
            </TabsContent>
            
            <TabsContent value="activity" className="p-6 pt-4">
              <ActivityLogViewer />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
