
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mic, Volume2, Brain, MessageSquare } from 'lucide-react';

interface VoiceConfig {
  provider: string;
  voice: string;
  speed: number;
  pitch: number;
}

interface AgentConfig {
  name: string;
  description: string;
  persona: string;
  greeting: string;
  primaryPurpose: string;
  voice: VoiceConfig;
  features: {
    sentiment: boolean;
    interruption: boolean;
    transfer: boolean;
    recording: boolean;
  };
  integrations: string[];
}

interface AgentConfigFormProps {
  initialConfig?: Partial<AgentConfig>;
  onSave: (config: AgentConfig) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AgentConfigForm: React.FC<AgentConfigFormProps> = ({
  initialConfig,
  onSave,
  onCancel,
  isLoading
}) => {
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    persona: '',
    greeting: '',
    primaryPurpose: 'customer_service',
    voice: {
      provider: 'elevenlabs',
      voice: 'sarah',
      speed: 1.0,
      pitch: 1.0
    },
    features: {
      sentiment: true,
      interruption: true,
      transfer: false,
      recording: true
    },
    integrations: [],
    ...initialConfig
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  const updateVoice = (field: keyof VoiceConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      voice: { ...prev.voice, [field]: value }
    }));
  };

  const updateFeature = (feature: keyof typeof config.features, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My Sales Agent"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A helpful sales agent that qualifies leads and books appointments"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="primaryPurpose">Primary Purpose</Label>
            <Select
              value={config.primaryPurpose}
              onValueChange={(value) => setConfig(prev => ({ ...prev, primaryPurpose: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="appointment_booking">Appointment Booking</SelectItem>
                <SelectItem value="lead_qualification">Lead Qualification</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personality & Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="persona">Agent Persona</Label>
            <Textarea
              id="persona"
              value={config.persona}
              onChange={(e) => setConfig(prev => ({ ...prev, persona: e.target.value }))}
              placeholder="You are a friendly and professional sales representative who helps customers find the right products..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={config.greeting}
              onChange={(e) => setConfig(prev => ({ ...prev, greeting: e.target.value }))}
              placeholder="Hello! Thank you for calling. How can I help you today?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Voice Provider</Label>
              <Select
                value={config.voice.provider}
                onValueChange={(value) => updateVoice('provider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Voice</Label>
              <Select
                value={config.voice.voice}
                onValueChange={(value) => updateVoice('voice', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah (Female)</SelectItem>
                  <SelectItem value="john">John (Male)</SelectItem>
                  <SelectItem value="emma">Emma (Female)</SelectItem>
                  <SelectItem value="david">David (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Speed: {config.voice.speed}x</Label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.voice.speed}
                onChange={(e) => updateVoice('speed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <Label>Pitch: {config.voice.pitch}x</Label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.voice.pitch}
                onChange={(e) => updateVoice('pitch', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sentiment">Sentiment Analysis</Label>
              <Switch
                id="sentiment"
                checked={config.features.sentiment}
                onCheckedChange={(checked) => updateFeature('sentiment', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="interruption">Interruption Handling</Label>
              <Switch
                id="interruption"
                checked={config.features.interruption}
                onCheckedChange={(checked) => updateFeature('interruption', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="transfer">Call Transfer</Label>
              <Switch
                id="transfer"
                checked={config.features.transfer}
                onCheckedChange={(checked) => updateFeature('transfer', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="recording">Call Recording</Label>
              <Switch
                id="recording"
                checked={config.features.recording}
                onCheckedChange={(checked) => updateFeature('recording', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Agent'}
        </Button>
      </div>
    </form>
  );
};
