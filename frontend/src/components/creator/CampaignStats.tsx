import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Image, MessageSquare, TrendingUp, Wallet } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import UpdateForm from "./UpdateForm";
import PhotoUpload from "./PhotoUpload";
import WithdrawalRequest from "./WithdrawalRequest";

interface CampaignStatsProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onRefresh: () => void;
}

export default function CampaignStats({
  campaign,
  onEdit,
  onRefresh,
}: CampaignStatsProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showWithdrawalRequest, setShowWithdrawalRequest] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = () => {
    const progress =
      (Number(campaign.collected_amount) / Number(campaign.target_amount)) *
      100;
    return Math.min(progress, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysRemaining = () => {
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    campaign.status,
                  )}`}
                >
                  {campaign.status}
                </span>
                {campaign.is_emergency === true && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    EMERGENCY
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{campaign.category_name}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(campaign)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">
                  {formatCurrency(Number(campaign.collected_amount))}
                </span>
                <span className="text-gray-600">
                  of {formatCurrency(Number(campaign.target_amount))}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{calculateProgress().toFixed(1)}% funded</span>
                <span>{getDaysRemaining()} days remaining</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {campaign.donor_count || 0}
                </div>
                <div className="text-xs text-gray-600">Donors</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Number(campaign.collected_amount))}
                </div>
                <div className="text-xs text-gray-600">Collected</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {campaign.photo_count || 0}
                </div>
                <div className="text-xs text-gray-600">Photos</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {campaign.update_count || 0}
                </div>
                <div className="text-xs text-gray-600">Updates</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowWithdrawalRequest(true)}
                disabled={Number(campaign.collected_amount) <= 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Tarik Dana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPhotoUpload(true)}
              >
                <Image className="h-4 w-4 mr-2" />
                Manage Photos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpdateForm(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Post Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/campaigns/${campaign.id}`, "_blank")
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Form Dialog */}
      {showUpdateForm && (
        <UpdateForm
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={() => {
            setShowUpdateForm(false);
            onRefresh();
          }}
        />
      )}

      {/* Photo Upload Dialog */}
      {showPhotoUpload && (
        <PhotoUpload
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          onClose={() => setShowPhotoUpload(false)}
          onSuccess={() => {
            setShowPhotoUpload(false);
            onRefresh();
          }}
        />
      )}

      {/* Withdrawal Request Dialog */}
      {showWithdrawalRequest && (
        <WithdrawalRequest
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          collectedAmount={Number(campaign.collected_amount)}
          onClose={() => setShowWithdrawalRequest(false)}
          onSuccess={() => {
            setShowWithdrawalRequest(false);
            onRefresh();
            alert(
              "Permintaan penarikan dana berhasil diajukan! Admin akan memproses dalam 1-3 hari kerja.",
            );
          }}
        />
      )}
    </>
  );
}
