
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Waveform, Volume2 } from "lucide-react";
import { toast } from "sonner";
import VoiceWaveform from "@/components/voice/VoiceWaveform";
import { useVoice } from "@/hooks/use-voice";
import { voiceProviders, defaultVoices } from "@/data/voice-data";

const VoiceSelection = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState("elevenlabs");
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [comparisonVoice, setComparisonVoice] = useState<string | null>(null);
  const [sampleText, setSampleText] = useState("Hello, this is a test of the voice system. How does it sound?");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const [voiceParams, setVoiceParams] = useState({
    speed: 1.0,
    pitch: 1.0,
    clarity: 0.75,
    emotion: "neutral"
  });

  // Get available voices based on the selected provider
  const { voices, isLoading, generateSample } = useVoice(selectedProvider);

  // Function to play voice sample
  const playVoiceSample = async (voiceId: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }

    try {
      const audio = await generateSample(voiceId, sampleText, voiceParams);
      setCurrentAudio(audio);
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
    } catch (error) {
      console.error("Error playing voice sample:", error);
      toast.error("Failed to play voice sample", {
        description: "There was an error generating the voice sample."
      });
    }
  };

  // Handle voice parameter change
  const handleParamChange = (param: string, value: number | string) => {
    setVoiceParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  // Save voice selection and return to flow builder
  const handleSaveSelection = () => {
    if (!selectedVoice) {
      toast.error("Please select a voice");
      return;
    }

    // In a real app, this would save to the agent configuration
    toast.success("Voice settings saved", {
      description: "Your voice selection has been applied to the flow"
    });

    navigate("/conversation-flow");
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/conversation-flow")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Voice Selection & Customization</h1>
          <p className="text-muted-foreground">Choose and customize the voice for your conversation flow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Voice Provider</CardTitle>
              <CardDescription>Select your voice provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedProvider} 
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {voiceProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Sample Text</h3>
                <Textarea 
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="Enter text to test voices"
                  className="h-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Voice Customization</CardTitle>
              <CardDescription>Adjust voice parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Speaking Speed</span>
                  <span className="text-muted-foreground">{voiceParams.speed}x</span>
                </div>
                <Slider
                  value={[voiceParams.speed]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => handleParamChange("speed", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pitch</span>
                  <span className="text-muted-foreground">{voiceParams.pitch}x</span>
                </div>
                <Slider
                  value={[voiceParams.pitch]}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  onValueChange={(value) => handleParamChange("pitch", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Clarity/Tone</span>
                  <span className="text-muted-foreground">{voiceParams.clarity}</span>
                </div>
                <Slider
                  value={[voiceParams.clarity]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => handleParamChange("clarity", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Natural</span>
                  <span>Clear</span>
                </div>
              </div>

              <div>
                <label className="block mb-2">Emotion/Tone</label>
                <Select 
                  value={voiceParams.emotion} 
                  onValueChange={(value) => handleParamChange("emotion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Accent</label>
                <Select defaultValue="american">
                  <SelectTrigger>
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="british">British</SelectItem>
                    <SelectItem value="australian">Australian</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="browse">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Voices</TabsTrigger>
              <TabsTrigger value="compare">A/B Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading ? (
                  <p className="col-span-full text-center py-8">Loading voices...</p>
                ) : voices.map(voice => (
                  <Card 
                    key={voice.id} 
                    className={`cursor-pointer transition-all ${selectedVoice === voice.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{voice.name}</CardTitle>
                      <CardDescription>{voice.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-16 bg-secondary/30 rounded-md flex items-center justify-center">
                        <VoiceWaveform voiceId={voice.id} isActive={isPlaying && selectedVoice === voice.id} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        {voice.gender} · {voice.age} · {voice.accent}
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying && selectedVoice === voice.id) {
                            if (currentAudio) {
                              currentAudio.pause();
                              setIsPlaying(false);
                            }
                          } else {
                            playVoiceSample(voice.id);
                            setSelectedVoice(voice.id);
                          }
                        }}
                      >
                        {isPlaying && selectedVoice === voice.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" /> Play
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="compare" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Voice A</h3>
                  <Select 
                    value={selectedVoice || ""} 
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedVoice && (
                    <div className="mt-4">
                      <div className="h-16 bg-secondary/30 rounded-md flex items-center justify-center my-4">
                        <VoiceWaveform voiceId={selectedVoice} isActive={isPlaying && currentAudio?.dataset?.voiceType === 'primary'} />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (selectedVoice) {
                            playVoiceSample(selectedVoice);
                            if (currentAudio) {
                              currentAudio.dataset.voiceType = 'primary';
                            }
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-1" /> Play Voice A
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Voice B</h3>
                  <Select 
                    value={comparisonVoice || ""} 
                    onValueChange={setComparisonVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {comparisonVoice && (
                    <div className="mt-4">
                      <div className="h-16 bg-secondary/30 rounded-md flex items-center justify-center my-4">
                        <VoiceWaveform voiceId={comparisonVoice} isActive={isPlaying && currentAudio?.dataset?.voiceType === 'comparison'} />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (comparisonVoice) {
                            playVoiceSample(comparisonVoice);
                            if (currentAudio) {
                              currentAudio.dataset.voiceType = 'comparison';
                            }
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-1" /> Play Voice B
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <h3 className="font-medium">Pronunciation Guide</h3>
                <p className="text-sm text-muted-foreground mb-2">Add custom pronunciations for domain-specific terms</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Word or phrase" className="flex-1" />
                    <Input placeholder="Pronunciation (e.g., ah-kro-nim)" className="flex-1" />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Example: "API" → "A-P-I", "SQLite" → "S-Q-L-ite"
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate("/conversation-flow")}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSelection}>
              Save Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelection;
