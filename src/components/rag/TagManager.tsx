
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagManagerProps {
  tags: string[];
  onSave: (tags: string[]) => void;
}

const TagManager = ({ tags: initialTags, onSave }: TagManagerProps) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-16 border rounded-md p-3">
        {tags.length > 0 ? (
          tags.map(tag => (
            <div 
              key={tag} 
              className="flex items-center gap-1 bg-secondary text-sm px-3 py-1 rounded-full"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags added yet</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add new tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="secondary" onClick={handleAddTag}>Add</Button>
      </div>
      
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSave(initialTags)}>Cancel</Button>
        <Button onClick={() => onSave(tags)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default TagManager;
