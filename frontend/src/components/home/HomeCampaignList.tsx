import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      let allCategories = [];
      if (Array.isArray(response.data.data)) {
        allCategories = response.data.data;
      } else if (
        response.data.data &&
        typeof response.data.data === "object"
      ) {
        allCategories = response.data.data.categories || [];
      } else if (Array.isArray(response.data)) {
        allCategories = response.data;
      }
      setCategories(allCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 9, // Grid 3x3
        status: "ACTIVE",
      };

      if (selectedCategoryId) {
        params.category_id = selectedCategoryId;
      }

      const response = await campaignService.getCampaigns(params);
      setCampaigns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <section className="py-2 px-1 max-w-7xl mx-auto w-full">
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-transform active:scale-95 ${selectedCategoryId === null
              ? "bg-primary text-white"
              : "bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-transform active:scale-95 ${selectedCategoryId === category.id
                ? "bg-primary text-white"
                : "bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="pb-12 px-1 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                to={selectedCategoryId ? `/campaigns?category=${selectedCategoryId}` : "/campaigns"}
                className="px-8 py-3 rounded-xl border border-primary text-primary dark:text-white dark:border-white font-semibold hover:bg-primary/5 dark:hover:bg-white/10 transition-colors"
              >
                Lihat Semua Campaign
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Tidak ada campaign yang tersedia saat ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
