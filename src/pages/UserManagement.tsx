
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDirectory } from "@/components/users/UserDirectory";
import { RoleManagement } from "@/components/users/RoleManagement";
import { ActivityLogViewer } from "@/components/users/ActivityLogViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, UserPlus, Shield, Activity } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";

const UserManagement = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "User Management" }
  ];

  const actions = (
    <Button variant="gradient" leftIcon={<UserPlus className="h-4 w-4" />}>
      Add User
    </Button>
  );

  return (
    <PageLayout
      title="User & Role Management"
      description="Manage users, roles, and permissions across your organization."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
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
    </PageLayout>
  );
};

export default UserManagement;
