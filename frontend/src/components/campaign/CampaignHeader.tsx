import { useEffect, useState } from "react";
import { Calendar, Target, Users, Clock } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";

interface CampaignHeaderProps {
  campaign: Campaign;
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const progress = (campaign.collected_amount / campaign.target_amount) * 100;
  const progressCapped = Math.min(progress, 100);

  const calculateTimeLeft = () => {
    const endDate = new Date(campaign.end_date);
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      return "Campaign telah berakhir";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} hari lagi`;
    } else if (hours > 0) {
      return `${hours} jam ${minutes} menit lagi`;
    } else {
      return `${minutes} menit lagi`;
    }
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [campaign.end_date]);

  return (
    <div className="space-y-6">
      {/* Campaign Title and Emergency Badge */}
      <div>
        {campaign.is_emergency === true && (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full mb-3">
            🚨 Campaign Darurat
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {campaign.title}
        </h1>
        {campaign.category_name && campaign.category_name.length > 0 && (
          <p className="text-sm text-gray-600">
            Kategori:{" "}
            <span className="font-medium">{campaign.category_name}</span>
          </p>
        )}
      </div>

      {/* Progress Card */}
      <Card className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <p className="text-sm text-gray-600 mb-1">Terkumpul</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {formatCurrency(campaign.collected_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Target</p>
              <p className="text-lg md:text-xl font-semibold text-gray-700">
                {formatCurrency(campaign.target_amount)}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressCapped}%` }}
            />
          </div>

          <p className="text-sm text-gray-600 mt-2">
            {progressCapped.toFixed(1)}% tercapai
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(campaign.target_amount)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {/* <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Donatur</p>
              <p className="font-semibold text-gray-900">
                - orang
              </p>
            </div> */}
          </div>

          <div className="flex items-start gap-3 col-span-2 md:col-span-1">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sisa Waktu</p>
              <p className="font-semibold text-gray-900">{timeLeft}</p>
            </div>
          </div>
        </div>

        {/* Campaign Dates */}
        <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(campaign.start_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" - "}
            {new Date(campaign.end_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </Card>
    </div>
  );
}
