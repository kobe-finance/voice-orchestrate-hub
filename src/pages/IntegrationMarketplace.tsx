
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { IntegrationFilters } from "@/components/integrations/IntegrationFilters";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Grid2x2, List } from "lucide-react";

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
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
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
    </Layout>
  );
};

export default IntegrationMarketplace;
