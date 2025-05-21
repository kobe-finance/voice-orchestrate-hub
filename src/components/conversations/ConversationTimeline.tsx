
import React from "react";
import { format } from "date-fns";
import { Conversation } from "@/types/conversation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConversationTimelineProps {
  conversation: Conversation;
  onJumpToMessage: (messageId: string) => void;
}

export const ConversationTimeline = ({ 
  conversation,
  onJumpToMessage
}: ConversationTimelineProps) => {
  // Calculate the start timestamp for positioning
  const startTimestamp = new Date(conversation.startTime).getTime();
  const endTimestamp = new Date(conversation.endTime).getTime();
  const totalDuration = endTimestamp - startTimestamp;

  const calculatePosition = (timestamp: string) => {
    const messageTime = new Date(timestamp).getTime();
    const position = ((messageTime - startTimestamp) / totalDuration) * 100;
    return Math.max(0, Math.min(100, position)); // Clamp between 0 and 100
  };

  // Group messages by 10% segments of the timeline for better visualization
  const timeSegments = Array.from({ length: 10 }, (_, i) => {
    const segmentStart = startTimestamp + (totalDuration * i) / 10;
    const segmentEnd = startTimestamp + (totalDuration * (i + 1)) / 10;
    
    const messages = conversation.messages.filter(msg => {
      const msgTime = new Date(msg.timestamp).getTime();
      return msgTime >= segmentStart && msgTime < segmentEnd;
    });
    
    return {
      startPercent: i * 10,
      endPercent: (i + 1) * 10,
      startTime: new Date(segmentStart),
      messages
    };
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg">Conversation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Timeline visualization */}
        <div className="mb-4">
          <div className="relative h-6 bg-muted rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-full flex">
              {conversation.messages.map((message) => {
                const position = calculatePosition(message.timestamp);
                const isAgent = conversation.agents.some(a => a.id === message.speakerId);
                
                return (
                  <div
                    key={message.id}
                    className={`absolute h-full w-1 cursor-pointer ${
                      isAgent ? "bg-blue-500" : "bg-primary"
                    }`}
                    style={{ left: `${position}%` }}
                    title={`${isAgent ? "Agent" : "User"}: ${message.text}`}
                    onClick={() => onJumpToMessage(message.id)}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{format(new Date(conversation.startTime), "HH:mm:ss")}</span>
            <span>{format(new Date(conversation.endTime), "HH:mm:ss")}</span>
          </div>
        </div>

        {/* Timeline segments with messages */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {timeSegments.filter(segment => segment.messages.length > 0).map((segment, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium mb-1">
                {format(segment.startTime, "HH:mm:ss")} - 
                {segment.messages.length} messages
              </div>
              <ul className="space-y-1">
                {segment.messages.slice(0, 2).map((message) => {
                  const isAgent = conversation.agents.some(a => a.id === message.speakerId);
                  const speakerName = isAgent 
                    ? conversation.agents.find(a => a.id === message.speakerId)?.name
                    : conversation.users.find(u => u.id === message.speakerId)?.name;
                  
                  return (
                    <li 
                      key={message.id} 
                      className="cursor-pointer hover:bg-muted px-2 py-1 rounded truncate"
                      onClick={() => onJumpToMessage(message.id)}
                    >
                      <span className={isAgent ? "text-blue-500" : "text-primary"}>
                        {speakerName}:
                      </span>{" "}
                      {message.text}
                    </li>
                  );
                })}
                {segment.messages.length > 2 && (
                  <li className="text-muted-foreground italic text-xs px-2">
                    + {segment.messages.length - 2} more messages
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
