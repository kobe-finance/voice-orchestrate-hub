import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart4, MessageSquare, Settings } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { OnboardingReminder } from "@/components/onboarding/OnboardingReminder";

const Dashboard = () => {
  const breadcrumbs = [
    { label: "Dashboard" }
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm">
        <BarChart4 className="h-4 w-4 mr-2" />
        View Analytics
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your voice AI system performance"
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <OnboardingReminder />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="bg-white dark:bg-gray-900 shadow-md">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Voice Agents
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and configure your voice AI agents.
            </p>
            <Button variant="secondary" className="w-full justify-start" onClick={() => window.location.href = '/voice-agents'}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Agents
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 shadow-md">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Call Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and analyze call activity.
            </p>
            <Button variant="secondary" className="w-full justify-start" onClick={() => window.location.href = '/call-management'}>
              <MessageSquare className="h-4 w-4 mr-2" />
              View Calls
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-900 shadow-md">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Knowledge Base
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage documents and data for voice agents.
            </p>
            <Button variant="secondary" className="w-full justify-start" onClick={() => window.location.href = '/knowledge-base'}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Knowledge
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
