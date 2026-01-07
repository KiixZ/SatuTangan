import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { AnalyticsChart } from "./analytics-chart";
import {
  getAnalyticsData,
  type AnalyticsData,
  type TopCampaign,
  type CategoryDonation,
} from "../data/dashboard-api";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  UserPlus,
} from "lucide-react";

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const renderChangeIndicator = (change: number) => {
    const isPositive = change >= 0;
    return (
      <p
        className={`text-xs flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {isPositive ? "+" : ""}
        {change}% vs minggu lalu
      </p>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="h-[300px] animate-pulse rounded bg-gray-200"></div>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-24 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const summary = analytics?.summary;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tren Donasi Mingguan</CardTitle>
          <CardDescription>
            Total donasi dan jumlah transaksi per hari dalam 7 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <AnalyticsChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Donasi Minggu Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalDonations || 0)}
            </div>
            {summary && renderChangeIndicator(summary.donationsChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jumlah Transaksi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(summary?.totalTransactions || 0)}
            </div>
            {summary && renderChangeIndicator(summary.transactionsChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donatur Unik</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(summary?.uniqueDonors || 0)}
            </div>
            {summary && renderChangeIndicator(summary.donorsChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Baru</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(summary?.newUsers || 0)}
            </div>
            {summary && renderChangeIndicator(summary.usersChange)}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Campaign Teratas</CardTitle>
            <CardDescription>
              Campaign dengan donasi terbanyak minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.topCampaigns && analytics.topCampaigns.length > 0 ? (
              <SimpleBarList
                items={analytics.topCampaigns.map((c: TopCampaign) => ({
                  name: c.title,
                  value: c.total_received,
                }))}
                barClass="bg-primary"
                valueFormatter={(n) => formatCurrency(n)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada donasi minggu ini
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Donasi per Kategori</CardTitle>
            <CardDescription>
              Distribusi donasi berdasarkan kategori (30 hari terakhir)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.donationsByCategory &&
            analytics.donationsByCategory.length > 0 ? (
              <SimpleBarList
                items={analytics.donationsByCategory.map(
                  (c: CategoryDonation) => ({
                    name: c.category_name,
                    value: c.total_amount,
                  }),
                )}
                barClass="bg-muted-foreground"
                valueFormatter={(n) => formatCurrency(n)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada data donasi per kategori
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[];
  valueFormatter: (n: number) => string;
  barClass: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`;
        return (
          <li key={i.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 truncate text-xs text-muted-foreground">
                {i.name}
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted">
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">
              {valueFormatter(i.value)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
