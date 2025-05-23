
import React, { useState } from "react";
import { Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationFilters } from "@/types/conversation";
import { 
  availableTags, 
  availableIntents, 
  availableEntities, 
  sentimentOptions, 
  outcomeOptions 
} from "@/data/conversation-data";

interface ConversationSearchFiltersProps {
  filters: ConversationFilters;
  onFilterChange: (filters: ConversationFilters) => void;
}

export const ConversationSearchFilters = ({ 
  filters, 
  onFilterChange 
}: ConversationSearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange ? {
      from: filters.dateRange.start,
      to: filters.dateRange.end
    } : undefined
  );
  const [selectedSentiment, setSelectedSentiment] = useState<string | undefined>(
    filters.sentiment
  );
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(
    filters.outcome
  );
  const [selectedIntents, setSelectedIntents] = useState<string[]>(
    filters.intents || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    filters.tags || []
  );

  const handleSearchSubmit = () => {
    onFilterChange({
      ...filters,
      searchTerm,
      dateRange: dateRange ? {
        start: dateRange.from,
        end: dateRange.to
      } : undefined,
      sentiment: selectedSentiment as "positive" | "neutral" | "negative" | undefined,
      outcome: selectedOutcome as "completed" | "transferred" | "abandoned" | undefined,
      intents: selectedIntents.length > 0 ? selectedIntents : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setSelectedSentiment(undefined);
    setSelectedOutcome(undefined);
    setSelectedIntents([]);
    setSelectedTags([]);
    
    onFilterChange({});
  };

  const toggleIntent = (intent: string) => {
    setSelectedIntents(
      selectedIntents.includes(intent)
        ? selectedIntents.filter(i => i !== intent)
        : [...selectedIntents, intent]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <SearchInput
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={16} />}
          className="w-full"
        />
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="date">
          <AccordionTrigger>Date Range</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sentiment">
          <AccordionTrigger>Sentiment</AccordionTrigger>
          <AccordionContent>
            <Select
              value={selectedSentiment}
              onValueChange={setSelectedSentiment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any sentiment</SelectItem>
                {sentimentOptions.map((sentiment) => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="outcome">
          <AccordionTrigger>Conversation Outcome</AccordionTrigger>
          <AccordionContent>
            <Select
              value={selectedOutcome}
              onValueChange={setSelectedOutcome}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any outcome</SelectItem>
                {outcomeOptions.map((outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {outcome.charAt(0).toUpperCase() + outcome.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="intents">
          <AccordionTrigger>Intents</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {availableIntents.map((intent) => (
                <div key={intent} className="flex items-center space-x-2">
                  <Checkbox
                    id={`intent-${intent}`}
                    checked={selectedIntents.includes(intent)}
                    onCheckedChange={() => toggleIntent(intent)}
                  />
                  <label
                    htmlFor={`intent-${intent}`}
                    className="text-sm cursor-pointer"
                  >
                    {intent.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm cursor-pointer"
                  >
                    {tag.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1" onClick={handleSearchSubmit}>
          Apply Filters
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Card>
  );
};
