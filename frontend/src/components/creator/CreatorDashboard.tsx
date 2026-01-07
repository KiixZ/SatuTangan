import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { campaignService } from "@/services/campaignService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, DollarSign } from "lucide-react";
import CampaignStats from "./CampaignStats";
import CampaignForm from "./CampaignForm";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import type { Campaign } from "@/types/campaign";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [totalCollected, setTotalCollected] = useState(0);

  useEffect(() => {
    loadCreatorCampaigns();
  }, []);

  const loadCreatorCampaigns = async () => {
    try {
      setIsLoading(true);
      // Get all campaigns and filter by creator_id on frontend
      // In production, backend should have a dedicated endpoint for creator's campaigns
      const response = await campaignService.getCampaigns({ limit: 100 });
      const creatorCampaigns = response.data.filter(
        (campaign) => campaign.creator_id === user?.id,
      );
      setCampaigns(creatorCampaigns);

      // Calculate total collected
      const total = creatorCampaigns.reduce(
        (sum, campaign) => sum + Number(campaign.collected_amount),
        0,
      );
      setTotalCollected(total);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setShowCreateForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setSelectedCampaign(null);
    loadCreatorCampaigns();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.full_name}! Manage your campaigns here.
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-8">
        <ProfilePhotoUpload
          currentPhotoUrl={user?.profile_photo_url}
          userName={user?.full_name}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter((c) => c.status === "ACTIVE").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collected
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + (c.donor_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Supporting your campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Button */}
      <div className="mb-6">
        <Button onClick={handleCreateCampaign} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create New Campaign
        </Button>
      </div>

      {/* Campaign List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">
                You haven't created any campaigns yet.
              </p>
              <Button onClick={handleCreateCampaign}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
              <CampaignStats
                key={campaign.id}
                campaign={campaign}
                onEdit={handleEditCampaign}
                onRefresh={loadCreatorCampaigns}
              />
            ))}
          </div>
        )}
      </div>

      {/* Campaign Form Dialog */}
      {showCreateForm && (
        <CampaignForm
          campaign={selectedCampaign}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
}
