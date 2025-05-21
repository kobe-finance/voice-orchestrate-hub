
import React from "react";
import { format } from "date-fns";
import { Conversation } from "@/types/conversation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList = ({ 
  conversations, 
  selectedConversationId,
  onSelectConversation 
}: ConversationListProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "transferred":
        return "bg-blue-100 text-blue-800";
      case "abandoned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "bg-green-100 text-green-800";
    if (score < -0.3) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return "Positive";
    if (score < -0.3) return "Negative";
    return "Neutral";
  };

  return (
    <div className="space-y-3 h-full overflow-y-auto pr-2">
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No conversations found matching your filters.
        </div>
      ) : (
        conversations.map((conversation) => (
          <Card 
            key={conversation.id} 
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedConversationId === conversation.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {conversation.users[0]?.name || "Anonymous User"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(conversation.startTime), "MMM dd, yyyy • HH:mm")}
                </div>
              </div>
              
              <div className="mb-2 text-sm line-clamp-2 text-muted-foreground">
                {conversation.messages[0]?.text}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={getOutcomeColor(conversation.outcome)}>
                  {conversation.outcome.charAt(0).toUpperCase() + conversation.outcome.slice(1)}
                </Badge>
                
                <Badge variant="outline" className={getSentimentColor(conversation.sentimentScore)}>
                  {getSentimentLabel(conversation.sentimentScore)}
                </Badge>
                
                <Badge variant="outline">
                  {formatDuration(conversation.duration)}
                </Badge>
                
                {conversation.intentRecognized.length > 0 && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    {conversation.intentRecognized[0].replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
