import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getAnalyticsData, type WeeklyDataPoint } from "../data/dashboard-api";

export function AnalyticsChart() {
  const [data, setData] = useState<WeeklyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await getAnalyticsData();
        setData(analytics.weeklyData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        // Set empty data on error
        setData([
          { name: "Sun", donations: 0, transactions: 0 },
          { name: "Mon", donations: 0, transactions: 0 },
          { name: "Tue", donations: 0, transactions: 0 },
          { name: "Wed", donations: 0, transactions: 0 },
          { name: "Thu", donations: 0, transactions: 0 },
          { name: "Fri", donations: 0, transactions: 0 },
          { name: "Sat", donations: 0, transactions: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)}jt`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(0)}rb`;
    }
    return `Rp${value}`;
  };

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Memuat data...
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "donations") {
              return [formatCurrency(value), "Total Donasi"];
            }
            return [value, "Jumlah Transaksi"];
          }}
          labelFormatter={(label) => `Hari: ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Area
          type="monotone"
          dataKey="donations"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.15}
          name="donations"
        />
        <Area
          type="monotone"
          dataKey="transactions"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.1}
          name="transactions"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
