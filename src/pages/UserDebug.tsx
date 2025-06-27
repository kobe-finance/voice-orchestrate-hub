
import React from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { UserDebug } from '@/components/ui/user-debug';

const UserDebugPage: React.FC = () => {
  return (
    <PageLayout
      title="User Debug"
      description="Debug user authentication and organization association"
    >
      <div className="flex justify-center p-6">
        <UserDebug />
      </div>
    </PageLayout>
  );
};

export default UserDebugPage;
