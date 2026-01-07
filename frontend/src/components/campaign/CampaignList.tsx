import { useEffect, useState } from "react";
import type { Campaign } from "../../types/campaign";
import campaignService from "../../services/campaignService";
import { CampaignCard } from "./CampaignCard";
import { CampaignCardSkeleton } from "./CampaignCardSkeleton";
import { CategoryFilter } from "./CategoryFilter";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CampaignListProps {
  limit?: number;
  showFilter?: boolean;
  searchQuery?: string;
  sortBy?: string;
}

export const CampaignList = ({
  limit = 9,
  showFilter = true,
  searchQuery = "",
  sortBy = "newest",
}: CampaignListProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await campaignService.getCampaigns({
          page: currentPage,
          limit,
          category_id: selectedCategory || undefined,
          status: "ACTIVE",
          search: searchQuery || undefined,
          sort: sortBy,
        });

        setCampaigns(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Gagal memuat campaign. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentPage, limit, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="space-y-6">
        {showFilter && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Filter Kategori</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  // Separate emergency and regular campaigns
  const emergencyCampaigns = campaigns.filter((c) => c.is_emergency);
  const regularCampaigns = campaigns.filter((c) => !c.is_emergency);

  return (
    <div className="space-y-6">
      {showFilter && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Tidak ada campaign yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <>
          {/* Emergency Campaigns Section */}
          {emergencyCampaigns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-red-600">
                  Campaign Darurat
                </h2>
                <span className="text-sm text-gray-500">
                  ({emergencyCampaigns.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {emergencyCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Campaigns Section */}
          {regularCampaigns.length > 0 && (
            <div className="space-y-4">
              {emergencyCampaigns.length > 0 && (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Campaign Lainnya</h2>
                  <span className="text-sm text-gray-500">
                    ({regularCampaigns.length})
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {regularCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({total} campaign)
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
