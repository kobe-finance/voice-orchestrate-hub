
import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { Conversation, Message } from "@/types/conversation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConversationTranscriptProps {
  conversation: Conversation;
  highlightTerms?: string[];
}

export const ConversationTranscript = ({ 
  conversation,
  highlightTerms = []
}: ConversationTranscriptProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const getSpeakerName = (speakerId: string) => {
    const agent = conversation.agents.find(a => a.id === speakerId);
    if (agent) return agent.name;
    
    const user = conversation.users.find(u => u.id === speakerId);
    if (user) return user.name;
    
    return "Unknown";
  };

  const getSpeakerType = (speakerId: string) => {
    const agent = conversation.agents.find(a => a.id === speakerId);
    if (agent) return "agent";
    return "user";
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const highlightText = (text: string) => {
    if (!highlightTerms.length) return text;
    
    let highlightedText = text;
    highlightTerms.forEach(term => {
      if (!term) return;
      
      const regex = new RegExp(term, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        match => `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`
      );
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Conversation Transcript</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(new Date(conversation.startTime), "MMMM d, yyyy")}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pb-4">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              speakerName={getSpeakerName(message.speakerId)}
              speakerType={getSpeakerType(message.speakerId)}
              sentimentClass={getSentimentColor(message.sentiment)}
              highlightText={highlightText}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  );
};

interface MessageBubbleProps {
  message: Message;
  speakerName: string;
  speakerType: string;
  sentimentClass: string;
  highlightText: (text: string) => React.ReactNode;
}

const MessageBubble = ({ 
  message, 
  speakerName, 
  speakerType,
  sentimentClass,
  highlightText
}: MessageBubbleProps) => {
  const isAgent = speakerType === "agent";
  
  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isAgent ? "bg-background border" : "bg-primary text-primary-foreground"
      }`}>
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium text-sm">
            {speakerName}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={sentimentClass}>
              {message.sentiment || "neutral"}
            </Badge>
            <span className="text-xs opacity-70">
              {format(new Date(message.timestamp), "HH:mm:ss")}
            </span>
          </div>
        </div>
        <div className={`text-sm ${isAgent ? "" : "text-primary-foreground"}`}>
          {highlightText(message.text)}
        </div>
      </div>
    </div>
  );
};
