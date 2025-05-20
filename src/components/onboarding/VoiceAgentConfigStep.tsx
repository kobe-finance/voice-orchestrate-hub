
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Form schema for voice agent configuration
const voiceAgentConfigSchema = z.object({
  agentName: z.string().min(2, { message: "Agent name must be at least 2 characters" }),
  voiceType: z.string().min(1, { message: "Please select a voice type" }),
  primaryPurpose: z.string().min(1, { message: "Please select a primary purpose" }),
  greeting: z.string().min(10, { message: "Greeting must be at least 10 characters" }),
  speakingRate: z.number().min(0.5).max(2),
  advancedSettings: z.object({
    interruptionHandling: z.string().min(1),
    transferProtocol: z.string().min(1),
    fallbackBehavior: z.string().min(1),
  }).optional(),
});

type VoiceAgentConfigProps = {
  onUpdate: (data: z.infer<typeof voiceAgentConfigSchema>) => void;
  initialData: any;
};

const VoiceAgentConfigStep = ({ onUpdate, initialData }: VoiceAgentConfigProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  
  // Initialize the form with initial data if available
  const form = useForm<z.infer<typeof voiceAgentConfigSchema>>({
    resolver: zodResolver(voiceAgentConfigSchema),
    defaultValues: initialData || {
      agentName: "",
      voiceType: "",
      primaryPurpose: "",
      greeting: "",
      speakingRate: 1,
      advancedSettings: {
        interruptionHandling: "pause",
        transferProtocol: "ask_first",
        fallbackBehavior: "human_transfer",
      },
    },
  });

  // Update parent component when form values change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onUpdate(value as z.infer<typeof voiceAgentConfigSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Configure Your Voice Agent</h2>
        <p className="text-muted-foreground">
          Design your AI voice agent's personality and behavior
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="agentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Alex, Supportify" {...field} />
                </FormControl>
                <FormDescription>
                  This name will be used when the agent introduces itself
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="female_professional">Female Professional</SelectItem>
                      <SelectItem value="male_professional">Male Professional</SelectItem>
                      <SelectItem value="female_friendly">Female Friendly</SelectItem>
                      <SelectItem value="male_friendly">Male Friendly</SelectItem>
                      <SelectItem value="neutral">Gender Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Function</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary function" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer_service">Customer Service</SelectItem>
                      <SelectItem value="lead_qualification">Lead Qualification</SelectItem>
                      <SelectItem value="appointment_booking">Appointment Booking</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="information">Information Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="greeting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Greeting</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Hello, this is [Agent Name] from [Your Business]. How may I assist you today?" 
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is what your agent will say when answering a call
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speakingRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speaking Rate</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      value={[field.value]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slower</span>
                      <span>{field.value}x</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Adjust how quickly your agent speaks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Collapsible 
            open={isAdvancedOpen} 
            onOpenChange={setIsAdvancedOpen}
            className="border rounded-md p-4"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex w-full justify-between"
              >
                <span>Advanced Settings</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-90' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="advancedSettings.interruptionHandling"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Interruption Handling</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pause" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Pause and listen when interrupted
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="finish" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Finish current sentence before responding
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="complete" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Complete full thought before pausing
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advancedSettings.transferProtocol"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Transfer Protocol</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ask_first" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Ask permission before transferring
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="announce_only" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Announce transfer then proceed
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="immediate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Transfer immediately when needed
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advancedSettings.fallbackBehavior"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Fallback Behavior</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="human_transfer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Transfer to human agent
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="callback" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Offer to schedule a callback
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="voicemail" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Take a message/voicemail
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
        </form>
      </Form>
    </div>
  );
};

export default VoiceAgentConfigStep;
