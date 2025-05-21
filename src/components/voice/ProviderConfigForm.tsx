
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

interface ProviderConfigFormProps {
  provider: any;
  onSave: (config: any) => void;
  onCancel: () => void;
}

const ProviderConfigForm: React.FC<ProviderConfigFormProps> = ({
  provider,
  onSave,
  onCancel
}) => {
  const [apiKey, setApiKey] = useState("");
  const [rateLimit, setRateLimit] = useState(provider.rateLimit);
  const [qualityRating, setQualityRating] = useState(provider.qualityRating);
  const [optimizeCost, setOptimizeCost] = useState(false);
  const [regionEndpoint, setRegionEndpoint] = useState("us-east-1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      rateLimit,
      qualityRating,
      // In a real app, the API key would be securely stored
      // and not directly in the provider object
      optimizeCost,
      regionEndpoint
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={provider.credentials.isConfigured ? "••••••••••••••••" : "Enter API Key"}
          required={!provider.credentials.isConfigured}
        />
      </div>

      {provider.id === "googlecloud" && (
        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            placeholder="your-project-id"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="region">Region/Endpoint</Label>
        <Select defaultValue={regionEndpoint} onValueChange={setRegionEndpoint}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="us-west-1">US West (N. California)</SelectItem>
            <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
            <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
            <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Rate Limit (requests per minute): {rateLimit}</Label>
        <Slider
          value={[rateLimit]}
          min={10}
          max={500}
          step={10}
          onValueChange={(value) => setRateLimit(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Quality Setting: {qualityRating}/5</Label>
        <Slider
          value={[qualityRating]}
          min={1}
          max={5}
          step={1}
          onValueChange={(value) => setQualityRating(value[0])}
        />
        <p className="text-xs text-muted-foreground">Higher quality may increase cost</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="cost-optimize"
          checked={optimizeCost}
          onCheckedChange={setOptimizeCost}
        />
        <Label htmlFor="cost-optimize">Enable cost optimization</Label>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Configuration</Button>
      </DialogFooter>
    </form>
  );
};

export default ProviderConfigForm;
