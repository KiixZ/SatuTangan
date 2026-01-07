import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { CampaignList } from "@/components/campaign/CampaignList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";

const CampaignExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Update URL when search or sort changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  }, [searchQuery, sortBy, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be handled by CampaignList through URL params
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setSearchParams({});
  };

  const sortOptions = [
    { value: "newest", label: "Terbaru", icon: SortDesc },
    { value: "ending-soon", label: "Akan Berakhir", icon: SortAsc },
    { value: "most-funded", label: "Terdanai", icon: SortAsc },
    { value: "most-donors", label: "Populer", icon: SortAsc },
    { value: "urgent", label: "Darurat", icon: SortDesc },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Jelajahi Campaign
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Temukan campaign yang ingin Anda dukung dan bersama kita membuat
                perubahan
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Cari campaign berdasarkan nama atau deskripsi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button type="submit" className="px-6">
                        <Search className="h-4 w-4 mr-2" />
                        Cari
                      </Button>
                    </div>

                    {/* Advanced Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Sort Options */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Urutkan:
                        </span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Pilih urutan" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <option.icon className="h-4 w-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Tampilan:
                        </span>
                        <div className="flex border rounded-md">
                          <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-r-none"
                          >
                            <Grid3X3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="rounded-l-none"
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Clear Filters */}
                      {(searchQuery || sortBy !== "newest") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="ml-auto"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Campaign List Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            {/* Active Filters Display */}
            {(searchQuery || sortBy !== "newest") && (
              <div className="mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-900">
                        Filter aktif:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Search className="h-3 w-3" />
                            {searchQuery}
                          </span>
                        )}
                        {sortBy !== "newest" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {
                              sortOptions.find((opt) => opt.value === sortBy)
                                ?.label
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Campaign List */}
            <CampaignList
              limit={12}
              showFilter={true}
              searchQuery={searchQuery}
              sortBy={sortBy}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tidak menemukan campaign yang tepat?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Buat campaign Anda sendiri dan mulai mengumpulkan donasi untuk
              tujuan yang Anda pedulikan.
            </p>
            <Button size="lg" className="px-8">
              Mulai Campaign Baru
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignExplorePage;
