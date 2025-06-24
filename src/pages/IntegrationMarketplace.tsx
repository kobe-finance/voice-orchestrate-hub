
import React, { useState, useEffect } from "react";
import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { IntegrationFilters } from "@/components/integrations/IntegrationFilters";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Grid2x2, List } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { PageLoading } from "@/components/ui/page-loading";
import { PageError } from "@/components/ui/page-error";
import { usePageState } from "@/hooks/usePageState";

const IntegrationMarketplace = () => {
  const { isLoading, error, setLoading, setError } = usePageState({ initialLoading: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  useEffect(() => {
    // Simulate loading integrations data
    const loadIntegrations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // In a real app, you would fetch integrations here
        // const response = await fetchIntegrations();
        
        setLoading(false);
      } catch (err) {
        setError({
          message: 'Failed to load integrations marketplace. Please try again.',
          code: 'MARKETPLACE_LOAD_ERROR',
          retry: loadIntegrations
        });
      }
    };

    loadIntegrations();
  }, [setLoading, setError]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Integration Marketplace" }
  ];

  if (error) {
    return (
      <PageLayout
        title="Integration Marketplace"
        breadcrumbs={breadcrumbs}
      >
        <PageError error={error} />
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Integration Marketplace"
        description="Connect your VoiceOrchestrate™ system with your existing tools and platforms"
        breadcrumbs={breadcrumbs}
      >
        <PageLoading type="skeleton" />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Integration Marketplace"
      description="Connect your VoiceOrchestrate™ system with your existing tools and platforms"
      breadcrumbs={breadcrumbs}
    >
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
    </PageLayout>
  );
};

export default IntegrationMarketplace;
