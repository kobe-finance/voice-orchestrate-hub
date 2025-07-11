import { useState } from 'react';

export interface CampaignData {
  name: string;
  description: string;
  type: string;
  subject: string;
  content: string;
  contactLists: string[];
  scheduledDate: Date | null;
  isImmediate: boolean;
  timezone: string;
  settings: {
    trackOpens: boolean;
    trackClicks: boolean;
    allowUnsubscribe: boolean;
    enableAutoReply: boolean;
  };
}

interface UploadedContact {
  email: string;
  name: string;
  phone: string;
}

export const useCampaignWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    description: "",
    type: "email",
    subject: "",
    content: "",
    contactLists: [],
    scheduledDate: null,
    isImmediate: true,
    timezone: "UTC",
    settings: {
      trackOpens: true,
      trackClicks: true,
      allowUnsubscribe: true,
      enableAutoReply: false
    }
  });
  const [uploadedContacts, setUploadedContacts] = useState<UploadedContact[]>([]);

  const steps = [
    { id: 1, title: "Campaign Details", description: "Basic campaign information" },
    { id: 2, title: "Content", description: "Create your message content" },
    { id: 3, title: "Contact Lists", description: "Select or upload contacts" },
    { id: 4, title: "Schedule", description: "Set delivery timing" },
    { id: 5, title: "Review", description: "Review and launch" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (file: File) => {
    // Simulate CSV parsing
    const mockContacts: UploadedContact[] = [
      { email: "john@example.com", name: "John Doe", phone: "+1234567890" },
      { email: "jane@example.com", name: "Jane Smith", phone: "+1234567891" },
      { email: "bob@example.com", name: "Bob Johnson", phone: "+1234567892" }
    ];
    setUploadedContacts(mockContacts);
  };

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<CampaignData['settings']>) => {
    setCampaignData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name.trim() !== '' && campaignData.type !== '';
      case 2:
        return campaignData.content.trim() !== '' && 
               (campaignData.type !== 'email' || campaignData.subject.trim() !== '');
      case 3:
        return uploadedContacts.length > 0;
      case 4:
        return campaignData.isImmediate || campaignData.scheduledDate !== null;
      default:
        return true;
    }
  };

  return {
    currentStep,
    steps,
    campaignData,
    uploadedContacts,
    handleNext,
    handlePrevious,
    handleFileUpload,
    updateCampaignData,
    updateSettings,
    canProceedToNext
  };
};