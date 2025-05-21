
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Tag } from "lucide-react";
import { availableTags } from "@/data/conversation-data";

interface TagsPanelProps {
  conversationId: string;
  currentTags: string[];
  onAddTag: (conversationId: string, tag: string) => void;
  onRemoveTag: (conversationId: string, tag: string) => void;
}

export const TagsPanel = ({
  conversationId,
  currentTags,
  onAddTag,
  onRemoveTag,
}: TagsPanelProps) => {
  const [newTag, setNewTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim().toLowerCase())) {
      onAddTag(conversationId, newTag.trim().toLowerCase());
      setNewTag("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  const suggestedTags = availableTags.filter(
    (tag) => 
      !currentTags.includes(tag) && 
      (newTag === "" || tag.includes(newTag.toLowerCase()))
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-4 w-4" /> Tags & Annotations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Tags */}
          <div>
            <h4 className="text-sm font-medium mb-2">Current Tags</h4>
            <div className="flex flex-wrap gap-2">
              {currentTags.length > 0 ? (
                currentTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag.replace(/_/g, " ")}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer"
                      onClick={() => onRemoveTag(conversationId, tag)}
                    />
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">
                  No tags added yet
                </div>
              )}
            </div>
          </div>

          {/* Add New Tag */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add Tag</h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a new tag..."
                />
                
                {showSuggestions && suggestedTags.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-32 overflow-y-auto">
                    {suggestedTags.slice(0, 5).map((tag) => (
                      <div
                        key={tag}
                        className="px-3 py-1.5 text-sm cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setNewTag(tag);
                          setShowSuggestions(false);
                        }}
                      >
                        {tag.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Annotations Feature Placeholder */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Annotations</h4>
            <div className="text-sm text-muted-foreground">
              <p>Add notes and annotations to this conversation for future reference.</p>
              <Button variant="outline" className="w-full mt-2">
                Add Annotation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
