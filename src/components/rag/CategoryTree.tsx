
import React, { useState } from 'react';
import { 
  FolderTree, 
  Folder, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  Plus,
  MoveVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { CategoryType } from '@/types/document';

interface CategoryTreeProps {
  categories: CategoryType[];
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType | null) => void;
  onCreateCategory: (parentId: string | null) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateCategory: (categoryId: string, data: Partial<CategoryType>) => void;
  onPriorityChange: (categoryId: string, priority: string) => void;
}

export const CategoryTree = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  onPriorityChange
}: CategoryTreeProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleEditStart = (category: CategoryType) => {
    setEditingCategory(category.id);
    setNewCategoryName(category.name);
  };
  
  const handleEditSave = (categoryId: string) => {
    if (newCategoryName.trim()) {
      onUpdateCategory(categoryId, { name: newCategoryName.trim() });
    }
    setEditingCategory(null);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };
  
  const renderCategoryTree = (categoryList: CategoryType[], level = 0) => {
    return categoryList.map(category => (
      <div key={category.id} className="my-1">
        <div 
          className={`flex items-center rounded-md py-1 px-2 transition-colors ${
            selectedCategory?.id === category.id ? 'bg-secondary' : 'hover:bg-secondary/50'
          }`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {category.children.length > 0 && (
            <button 
              onClick={() => toggleExpand(category.id)}
              className="p-1 rounded-sm hover:bg-secondary mr-1"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          )}
          
          <div 
            className="flex-1 flex items-center cursor-pointer"
            onClick={() => onSelectCategory(category)}
          >
            <Folder className="h-4 w-4 mr-2" />
            
            {editingCategory === category.id ? (
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onBlur={() => handleEditSave(category.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditSave(category.id)}
                className="h-7 py-0 text-sm"
                autoFocus
              />
            ) : (
              <>
                <span className="text-sm">{category.name}</span>
                <span 
                  className={`text-xs ml-2 ${getPriorityColor(category.priority)}`}
                >
                  {category.priority}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoveVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  className="text-xs"
                  onClick={() => onPriorityChange(category.id, 'high')}
                >
                  <span className="text-red-500 mr-2">●</span> High Priority
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-xs"
                  onClick={() => onPriorityChange(category.id, 'medium')}
                >
                  <span className="text-amber-500 mr-2">●</span> Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-xs"
                  onClick={() => onPriorityChange(category.id, 'low')}
                >
                  <span className="text-blue-500 mr-2">●</span> Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => handleEditStart(category)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-destructive"
              onClick={() => onDeleteCategory(category.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onCreateCategory(category.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {expandedCategories.includes(category.id) && category.children.length > 0 && (
          <div className="ml-4">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="space-y-2">
      <div className="bg-secondary/50 rounded-md p-2">
        <div 
          className={`flex items-center rounded-md py-1 px-2 transition-colors ${
            selectedCategory === null ? 'bg-secondary' : 'hover:bg-secondary/80'
          } cursor-pointer`}
          onClick={() => onSelectCategory(null)}
        >
          <FolderTree className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">All Categories</span>
        </div>
      </div>
      
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
        {renderCategoryTree(categories)}
      </div>
    </div>
  );
};
