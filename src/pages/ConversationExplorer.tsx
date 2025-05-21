
import React, { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { ConversationSearchFilters } from "@/components/conversations/ConversationSearchFilters";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationTranscript } from "@/components/conversations/ConversationTranscript";
import { ConversationTimeline } from "@/components/conversations/ConversationTimeline";
import { AudioPlayer } from "@/components/conversations/AudioPlayer";
import { TagsPanel } from "@/components/conversations/TagsPanel";
import { toast } from "sonner";
import { mockConversations } from "@/data/conversation-data";
import { Conversation, ConversationFilters } from "@/types/conversation";

const ConversationExplorer = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filters, setFilters] = useState<ConversationFilters>({});
  const [highlightTerms, setHighlightTerms] = useState<string[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Initialize with the first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Apply filters
  useEffect(() => {
    let filtered = [...conversations];
    
    // Search term
    if (filters.searchTerm) {
      const searchTerms = filters.searchTerm.toLowerCase().split(" ").filter(Boolean);
      setHighlightTerms(searchTerms);
      
      filtered = filtered.filter((conversation) => {
        // Search in messages
        const messagesMatch = conversation.messages.some((message) =>
          searchTerms.some(term => message.text.toLowerCase().includes(term))
        );
        
        // Search in intents
        const intentsMatch = conversation.intentRecognized.some((intent) =>
          searchTerms.some(term => intent.toLowerCase().includes(term))
        );
        
        // Search in tags
        const tagsMatch = conversation.tags.some((tag) =>
          searchTerms.some(term => tag.toLowerCase().includes(term))
        );
        
        return messagesMatch || intentsMatch || tagsMatch;
      });
    } else {
      setHighlightTerms([]);
    }
    
    // Date range
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filtered = filtered.filter((conversation) => {
        const startTime = new Date(conversation.startTime);
        
        if (filters.dateRange?.start && filters.dateRange?.end) {
          return startTime >= filters.dateRange.start && startTime <= filters.dateRange.end;
        }
        
        if (filters.dateRange?.start) {
          return startTime >= filters.dateRange.start;
        }
        
        if (filters.dateRange?.end) {
          return startTime <= filters.dateRange.end;
        }
        
        return true;
      });
    }
    
    // Sentiment
    if (filters.sentiment) {
      filtered = filtered.filter((conversation) => {
        switch (filters.sentiment) {
          case "positive":
            return conversation.sentimentScore > 0.3;
          case "negative":
            return conversation.sentimentScore < -0.3;
          case "neutral":
            return conversation.sentimentScore >= -0.3 && conversation.sentimentScore <= 0.3;
          default:
            return true;
        }
      });
    }
    
    // Outcome
    if (filters.outcome) {
      filtered = filtered.filter((conversation) =>
        conversation.outcome === filters.outcome
      );
    }
    
    // Intents
    if (filters.intents && filters.intents.length > 0) {
      filtered = filtered.filter((conversation) =>
        filters.intents!.some(intent => conversation.intentRecognized.includes(intent))
      );
    }
    
    // Tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((conversation) =>
        filters.tags!.some(tag => conversation.tags.includes(tag))
      );
    }
    
    setFilteredConversations(filtered);
    
    // Update selected conversation if it's no longer in filtered results
    if (selectedConversation && !filtered.find(c => c.id === selectedConversation.id)) {
      setSelectedConversation(filtered.length > 0 ? filtered[0] : null);
    }
  }, [filters, conversations, selectedConversation]);

  const handleFilterChange = (newFilters: ConversationFilters) => {
    setFilters(newFilters);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleJumpToMessage = (messageId: string) => {
    if (!transcriptRef.current) return;
    
    // Find the message element in the transcript
    const messageElement = transcriptRef.current.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Add a temporary highlight effect
      messageElement.classList.add("bg-accent");
      setTimeout(() => {
        messageElement.classList.remove("bg-accent");
      }, 2000);
    }
  };

  const handleAddTag = (conversationId: string, tag: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          tags: [...conv.tags, tag]
        };
      }
      return conv;
    }));
    
    // Update selected conversation if it's the one being modified
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation({
        ...selectedConversation,
        tags: [...selectedConversation.tags, tag]
      });
    }
    
    toast.success(`Tag "${tag}" added`);
  };

  const handleRemoveTag = (conversationId: string, tag: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          tags: conv.tags.filter(t => t !== tag)
        };
      }
      return conv;
    }));
    
    // Update selected conversation if it's the one being modified
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation({
        ...selectedConversation,
        tags: selectedConversation.tags.filter(t => t !== tag)
      });
    }
    
    toast.success(`Tag "${tag}" removed`);
  };

  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <PageHeader 
          title="Conversation Explorer" 
          description="Search, analyze and discover insights from your voice agent conversations"
        />
        
        <div className="grid grid-cols-12 gap-6 mt-6 h-[calc(100vh-13rem)]">
          {/* Filters and Conversation List */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col h-full gap-4">
            <ConversationSearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
            
            <div className="flex-grow overflow-hidden">
              <ConversationList 
                conversations={filteredConversations}
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </div>
          
          {/* Conversation Transcript and Details */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {selectedConversation ? (
              <>
                {/* Transcript */}
                <div className="lg:col-span-2 h-full" ref={transcriptRef}>
                  <ConversationTranscript 
                    conversation={selectedConversation}
                    highlightTerms={highlightTerms}
                  />
                </div>
                
                {/* Timeline, Audio Player, and Tags */}
                <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                  <div className="flex-grow-0">
                    <ConversationTimeline 
                      conversation={selectedConversation}
                      onJumpToMessage={handleJumpToMessage}
                    />
                  </div>
                  
                  <div className="flex-grow-0">
                    <AudioPlayer src={selectedConversation.audioUrl || "/sample-voice.mp3"} />
                  </div>
                  
                  <div className="flex-grow">
                    <TagsPanel 
                      conversationId={selectedConversation.id}
                      currentTags={selectedConversation.tags}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-3 flex items-center justify-center h-full border rounded-lg">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium">No Conversations Found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search filters or select a conversation from the list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConversationExplorer;
