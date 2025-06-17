
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-modern';
import { Button } from '@/components/ui/button-modern';
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const VoiceSelection = () => {
  const [selectedVoice, setSelectedVoice] = useState('voice_1');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const voices = [
    { id: 'voice_1', name: 'Sarah Professional', gender: 'female', language: 'en-US', provider: 'ElevenLabs' },
    { id: 'voice_2', name: 'David Friendly', gender: 'male', language: 'en-US', provider: 'Azure' },
    { id: 'voice_3', name: 'Emma Clear', gender: 'female', language: 'en-GB', provider: 'Google' },
  ];

  const handlePlay = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // Simulate audio playback
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Voice Selection</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-600 to-accent-orange bg-clip-text text-transparent">
          Voice Selection
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Choose and customize voice settings for your agents</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((voice) => (
            <Card key={voice.id} variant="elevated" className={selectedVoice === voice.id ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{voice.name}</CardTitle>
                  <Badge variant="outline">{voice.provider}</Badge>
                </div>
                <CardDescription>
                  {voice.gender} • {voice.language}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlay(voice.id)}
                    leftIcon={playingVoice === voice.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  >
                    {playingVoice === voice.id ? 'Pause' : 'Preview'}
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedVoice === voice.id ? 'gradient' : 'outline'}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    {selectedVoice === voice.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceSelection;
