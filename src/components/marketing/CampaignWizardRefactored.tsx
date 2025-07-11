import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";

interface CampaignWizardRefactoredProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: any) => void;
}

export const CampaignWizardRefactored = ({ isOpen, onClose, onSave }: CampaignWizardRefactoredProps) => {
  const {
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
  } = useCampaignWizard();

  const handleSave = () => {
    onSave(campaignData);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                value={campaignData.name}
                onChange={(e) => updateCampaignData({ name: e.target.value })}
                placeholder="e.g., Product Launch Email"
              />
            </div>
            <div>
              <Label htmlFor="campaignType">Campaign Type *</Label>
              <Select
                value={campaignData.type}
                onValueChange={(value) => updateCampaignData({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Campaign</SelectItem>
                  <SelectItem value="sms">SMS Campaign</SelectItem>
                  <SelectItem value="voice">Voice Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={campaignData.description}
                onChange={(e) => updateCampaignData({ description: e.target.value })}
                placeholder="Brief description of this campaign"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {campaignData.type === "email" && (
              <div>
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={campaignData.subject}
                  onChange={(e) => updateCampaignData({ subject: e.target.value })}
                  placeholder="Email subject line"
                />
              </div>
            )}
            <div>
              <Label htmlFor="content">Message Content *</Label>
              <Textarea
                id="content"
                value={campaignData.content}
                onChange={(e) => updateCampaignData({ content: e.target.value })}
                placeholder={
                  campaignData.type === "email" 
                    ? "Write your email content here..."
                    : "Write your message content here..."
                }
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trackOpens"
                  checked={campaignData.settings.trackOpens}
                  onCheckedChange={(checked) => updateSettings({ trackOpens: checked })}
                />
                <Label htmlFor="trackOpens">Track Opens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="trackClicks"
                  checked={campaignData.settings.trackClicks}
                  onCheckedChange={(checked) => updateSettings({ trackClicks: checked })}
                />
                <Label htmlFor="trackClicks">Track Clicks</Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Contact Lists</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select existing lists or upload new contacts
              </p>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      Upload CSV File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with email, name, and phone columns
                    </p>
                  </div>
                </div>

                {uploadedContacts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Uploaded Contacts ({uploadedContacts.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{contact.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">{contact.email}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Delivery Schedule</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose when to send your campaign
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="immediate"
                    checked={campaignData.isImmediate}
                    onCheckedChange={(checked) => updateCampaignData({ isImmediate: checked })}
                  />
                  <Label htmlFor="immediate">Send Immediately</Label>
                </div>

                {!campaignData.isImmediate && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <Label>Scheduled Date & Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-2",
                              !campaignData.scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {campaignData.scheduledDate ? (
                              format(campaignData.scheduledDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={campaignData.scheduledDate}
                            onSelect={(date) => updateCampaignData({ scheduledDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Timezone</Label>
                      <Select
                        value={campaignData.timezone}
                        onValueChange={(value) => updateCampaignData({ timezone: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="CST">Central Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Campaign Review</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Review your campaign details before launching
              </p>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Campaign Name</Label>
                        <p className="text-sm">{campaignData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Badge>{campaignData.type}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Recipients</Label>
                        <p className="text-sm">{uploadedContacts.length} contacts</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Schedule</Label>
                        <p className="text-sm">
                          {campaignData.isImmediate ? "Immediate" : "Scheduled"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {campaignData.type === "email" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Email Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded p-4 bg-white">
                        <div className="border-b pb-2 mb-4">
                          <p className="font-medium">Subject: {campaignData.subject}</p>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">
                          {campaignData.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create Campaign</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center mt-4 space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {step.id}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 h-px bg-gray-300 w-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        <div className="p-6 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentStep === steps.length ? (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Launch Campaign
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};