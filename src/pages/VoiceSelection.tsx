
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';

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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Voice Selection</h1>
        <p className="text-muted-foreground">Choose and customize voice settings for your agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {voices.map((voice) => (
          <Card key={voice.id} className={selectedVoice === voice.id ? 'border-primary' : ''}>
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
                >
                  {playingVoice === voice.id ? (
                    <Pause className="h-4 w-4 mr-1" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  {playingVoice === voice.id ? 'Pause' : 'Preview'}
                </Button>
                <Button
                  size="sm"
                  variant={selectedVoice === voice.id ? 'default' : 'outline'}
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
  );
};

export default VoiceSelection;
