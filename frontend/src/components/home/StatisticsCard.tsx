import { useEffect, useState } from "react";
import statisticsService from "@/services/statisticsService";
import type { PublicStats } from "@/services/statisticsService";
import { Wallet, Activity, Users, Megaphone } from "lucide-react";

export function StatisticsCard() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsService.getPublicStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    // Format to millions/billions for shorter display
    if (amount >= 1000000000) {
      return `Rp${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col p-6 rounded-xl bg-card border border-border shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 h-10 w-10"></div>
                <div className="h-4 bg-muted w-24 rounded"></div>
              </div>
              <div className="h-8 bg-muted w-32 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const statisticsData = [
    {
      label: "Dana Terkumpul",
      value: formatCurrency(stats.totalSuccessfulDonations || 0),
      icon: Wallet,
      colorClass: "bg-primary/10 text-primary dark:text-white dark:bg-primary/40",
    },
    {
      label: "Kali Donasi",
      value: formatNumber(stats.totalTransactions || 0),
      icon: Activity,
      colorClass: "bg-secondary/10 text-secondary dark:text-white dark:bg-secondary/40",
    },
    {
      label: "Total Donatur",
      value: formatNumber(stats.totalDonors || 0),
      icon: Users,
      colorClass: "bg-accent/20 text-accent-foreground dark:text-white dark:bg-accent/40",
    },
    {
      label: "Campaign Dibuat",
      value: formatNumber(stats.totalCampaigns || 0),
      icon: Megaphone,
      colorClass: "bg-blue-100 text-blue-700 dark:text-white dark:bg-blue-900/40",
    },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticsData.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full ${stat.colorClass}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
            <p className="text-3xl font-bold text-primary dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
