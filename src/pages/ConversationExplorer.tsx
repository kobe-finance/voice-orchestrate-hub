
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Filter } from 'lucide-react';
import { ConversationList } from '@/components/conversations/ConversationList';
import { ConversationTranscript } from '@/components/conversations/ConversationTranscript';
import { TagsPanel } from '@/components/conversations/TagsPanel';
import { mockConversations } from '@/data/conversation-data';
import type { Conversation } from '@/types/conversation';
import { PageLayout } from '@/components/layouts/PageLayout';

const ConversationExplorer = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic here
    console.log('Searching for:', term);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleAddTag = (conversationId: string, tag: string) => {
    // In a real app, this would update the backend
    console.log('Adding tag:', tag, 'to conversation:', conversationId);
  };

  const handleRemoveTag = (conversationId: string, tag: string) => {
    // In a real app, this would update the backend
    console.log('Removing tag:', tag, 'from conversation:', conversationId);
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Conversation Explorer" }
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
        Export
      </Button>
      <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
        Advanced Filters
      </Button>
    </>
  );

  return (
    <PageLayout
      title="Conversation Explorer"
      description="Search, filter, and analyze voice conversations"
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="flex flex-grow h-[calc(100vh-12rem)]">
        <div className="w-80 border-r p-4">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        <div className="flex-1 p-4">
          {selectedConversation ? (
            <ConversationTranscript conversation={selectedConversation} />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select a conversation to view the transcript.
            </div>
          )}
        </div>

        <div className="w-64 border-l p-4">
          {selectedConversation ? (
            <TagsPanel 
              conversationId={selectedConversation.id}
              currentTags={selectedConversation.tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select a conversation to manage tags.
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ConversationExplorer;
