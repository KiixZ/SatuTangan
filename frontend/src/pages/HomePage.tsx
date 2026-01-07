import { Navbar } from "@/components/layout/Navbar";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { StatisticsCard } from "@/components/home/StatisticsCard";
import { HomeCampaignList } from "@/components/home/HomeCampaignList";
import { WithdrawalReport } from "@/components/home/WithdrawalReport";
import { PrayerSection } from "@/components/home/PrayerSection";
import { Footer } from "@/components/layout/Footer";
import { PartnersSection } from "@/components/partners/PartnersSection";
import FaqPage from "./FaqPage";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner Carousel */}
        <div className="">
          <BannerCarousel />
        </div>

        {/* Statistics Cards */}
        <StatisticsCard />

        {/* Withdrawal Report - Full Width */}
        <div className="mb-12">
          <WithdrawalReport />
        </div>

        {/* Campaign List by Category */}
        <div className="mb-12" id="campaigns">
          <HomeCampaignList />
        </div>

      </main>
      <PrayerSection />
      <FaqPage />
      <PartnersSection />
      <Footer />
    </div>
  );
}
