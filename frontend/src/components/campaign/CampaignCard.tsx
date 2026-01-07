import type { Campaign } from "@/types/campaign";
import { formatCurrency } from "@/utils/currency";
import { Link } from "react-router-dom";
import { getAssetUrl } from "@/utils/url";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progress = (campaign.collected_amount / campaign.target_amount) * 100;
  const daysLeft = Math.ceil(
    (new Date(campaign.end_date).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24),
  );

  return (
    <div className="group flex flex-col rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url('${getAssetUrl(campaign.thumbnail_url)}')`,
          }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-primary">
          {campaign.category_name}
        </div>
        {campaign.is_emergency && (
          <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-white">
            DARURAT
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-primary dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {campaign.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mt-auto">
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Terkumpul
              </p>
              <p className="text-sm font-bold text-primary dark:text-white">
                {formatCurrency(campaign.collected_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sisa waktu
              </p>
              <p className="text-sm font-semibold text-primary dark:text-white">
                {daysLeft > 0 ? `${daysLeft} Hari` : "Selesai"}
              </p>
            </div>
          </div>
          <Link
            to={`/campaigns/${campaign.id}`}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Donasi Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};
