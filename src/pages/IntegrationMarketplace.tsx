
import React, { useState } from "react";
import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { IntegrationFilters } from "@/components/integrations/IntegrationFilters";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Grid2x2, List } from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';

const IntegrationMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Integration Marketplace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Integration Marketplace</h1>
          <p className="text-muted-foreground">
            Connect your VoiceOrchestrate™ system with your existing tools and platforms
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="w-full md:w-1/4">
            <IntegrationFilters onCategoryChange={handleCategoryChange} />
          </div>

          <div className="w-full md:w-3/4 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <SearchInput
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full sm:w-80"
                icon={<Search className="h-4 w-4" />}
              />
              
              <Tabs defaultValue="grid" className="w-auto" value={viewType} onValueChange={(value) => setViewType(value as "grid" | "list")}>
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid2x2 className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-2" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <IntegrationDirectory 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              viewType={viewType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationMarketplace;
