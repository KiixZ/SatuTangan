import { useEffect, useState } from "react";
import { getAssetUrl } from "@/utils/url";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout";
import { campaignService } from "@/services/campaignService";
import donationService from "@/services/donationService";
import { CampaignHeader } from "@/components/campaign/CampaignHeader";
import { CampaignDescription } from "@/components/campaign/CampaignDescription";
import { CampaignGallery } from "@/components/campaign/CampaignGallery";
import DonationForm from "@/components/campaign/DonationForm";
import DonorList from "@/components/campaign/DonorList";
import { PrayerList } from "@/components/campaign/PrayerList";
import { UpdateList } from "@/components/campaign/UpdateList";
import { ShareButton } from "@/components/campaign/ShareButton";
import { ReportButton } from "@/components/campaign/ReportButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";



export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [prayerRefreshTrigger] = useState(0);

  // Fetch campaign details
  const {
    data: campaignData,
    isLoading: campaignLoading,
    error: campaignError,
  } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignService.getCampaignById(id!),
    enabled: !!id,
  });

  // Fetch campaign photos
  const { data: photosData } = useQuery({
    queryKey: ["campaign-photos", id],
    queryFn: () => campaignService.getCampaignPhotos(id!),
    enabled: !!id,
  });

  // Fetch campaign updates
  const { data: updatesData } = useQuery({
    queryKey: ["campaign-updates", id],
    queryFn: () => campaignService.getCampaignUpdates(id!),
    enabled: !!id,
  });

  // Fetch campaign donations
  const { data: donationsData } = useQuery({
    queryKey: ["campaign-donations", id],
    queryFn: () => donationService.getCampaignDonations(id!),
    enabled: !!id,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (campaignLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (campaignError || !campaignData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Campaign Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Campaign yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
        </Card>
      </div>
    );
  }

  const campaign = campaignData.data;
  const photos = photosData?.data || [];
  const updates = updatesData?.data || [];
  const donations = donationsData || [];

  const currentUrl = window.location.href;
  const isExpired = campaign.end_date ? new Date(campaign.end_date) < new Date() : false;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Campaign Header */}
              <CampaignHeader campaign={campaign} />

              {/* Thumbnail Image */}
              <Card className="overflow-hidden">
                <img
                  src={getAssetUrl(campaign.thumbnail_url)}
                  alt={campaign.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = "/placeholder-campaign.jpg";
                  }}
                />
              </Card>

              {/* Campaign Description */}
              <CampaignDescription description={campaign.description} />

              {/* Campaign Gallery */}
              {photos.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Galeri Foto
                  </h2>
                  <CampaignGallery
                    photos={photos}
                    thumbnailUrl={campaign.thumbnail_url}
                  />
                </Card>
              )}

              {/* Campaign Updates */}
              <UpdateList updates={updates} />

              {/* Donor List */}
              <DonorList donations={donations} />

              {/* Prayer List - Doa dari Donatur */}
              <PrayerList
                campaignId={campaign.id}
                refreshTrigger={prayerRefreshTrigger}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Donation Card */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Bantu Campaign Ini
                  </h3>

                  {campaign.status === "ACTIVE" && !isExpired ? (
                    <>
                      {!showDonationForm ? (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => setShowDonationForm(true)}
                        >
                          Donasi Sekarang
                        </Button>
                      ) : (
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDonationForm(false)}
                            className="mb-4 -ml-2"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                          </Button>
                          <DonationForm
                            campaignId={campaign.id}
                            campaignTitle={campaign.title}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm sm:text-base text-gray-600">
                        Campaign ini sudah tidak aktif
                      </p>
                    </div>
                  )}
                </Card>

                {/* Share and Report */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                    Bagikan Campaign
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <ShareButton title={campaign.title} url={currentUrl} />
                    <ReportButton
                      campaignId={campaign.id}
                      campaignTitle={campaign.title}
                    />
                  </div>
                </Card>

                {/* Creator Info */}
                {campaign.creator_name && (
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Penggalang Dana
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700">
                      {campaign.creator_name}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
