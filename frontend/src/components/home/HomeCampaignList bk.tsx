import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import campaignService from "@/services/campaignService";
import { CampaignCard } from "../campaign/CampaignCard";
import { CampaignCardSkeleton } from "../campaign/CampaignCardSkeleton";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Category {
  id: string;
  name: string;
  description: string;
}

export const HomeCampaignList = () => {
  const [emergencyCampaigns, setEmergencyCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [campaignsByCategory, setCampaignsByCategory] = useState<
    Record<string, Campaign[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch emergency campaigns (max 5)
      const emergencyResponse = await campaignService.getCampaigns({
        limit: 5,
        status: "ACTIVE",
        is_emergency: true,
      });
      setEmergencyCampaigns(
        Array.isArray(emergencyResponse.data) ? emergencyResponse.data : [],
      );

      // Fetch categories
      const categoriesResponse = await axios.get(`${API_URL}/categories`);
      // Handle both array and object response
      let allCategories = [];
      if (Array.isArray(categoriesResponse.data.data)) {
        allCategories = categoriesResponse.data.data;
      } else if (
        categoriesResponse.data.data &&
        typeof categoriesResponse.data.data === "object"
      ) {
        // If data is object with categories property
        allCategories = categoriesResponse.data.data.categories || [];
      } else if (Array.isArray(categoriesResponse.data)) {
        // If data itself is array
        allCategories = categoriesResponse.data;
      }
      setCategories(allCategories);

      // If no categories, skip fetching campaigns by category
      if (allCategories.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch campaigns for each category (get more to filter out emergency ones)
      const categoryPromises = allCategories.map(async (category: Category) => {
        const response = await campaignService.getCampaigns({
          limit: 10, // Get more to filter
          status: "ACTIVE",
          category_id: category.id,
        });

        // Filter out emergency campaigns and take only 4
        const nonEmergency = Array.isArray(response.data)
          ? response.data.filter((c: Campaign) => !c.is_emergency).slice(0, 4)
          : [];
        return { categoryId: category.id, campaigns: nonEmergency };
      });

      const categoryResults = await Promise.all(categoryPromises);
      const campaignsMap: Record<string, Campaign[]> = {};

      categoryResults.forEach(({ categoryId, campaigns }) => {
        if (campaigns.length > 0) {
          campaignsMap[categoryId] = campaigns;
        }
      });
      setCampaignsByCategory(campaignsMap);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        {/* Emergency Campaigns Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Categories Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <CampaignCardSkeleton key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Emergency Campaigns Section */}
      {emergencyCampaigns.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-red-600">
              🚨 Campaign Darurat
            </h2>
            {emergencyCampaigns.length >= 5 && (
              <Link
                to="/campaigns?emergency=true"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {emergencyCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

      {/* Campaigns by Category */}
      {categories.map((category) => {
        const categoryCampaigns = campaignsByCategory[category.id];

        if (!categoryCampaigns || categoryCampaigns.length === 0) {
          return null;
        }

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.name}
                </h2>
              </div>
              <Link
                to={`/campaigns?category=${category.id}`}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        );
      })}

      {/* No campaigns message */}
      {emergencyCampaigns.length === 0 &&
        Object.keys(campaignsByCategory).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Tidak ada campaign yang tersedia saat ini.
            </p>
          </div>
        )}
    </div>
  );
};
