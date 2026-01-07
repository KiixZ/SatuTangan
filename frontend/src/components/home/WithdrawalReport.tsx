import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/currency";
import axios from "axios";
import { Wallet, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Withdrawal {
  id: string;
  amount: number;
  created_at: string;
  campaign_id: string;
  campaign_title: string;
  campaign_description: string;
  creator_id: string;
  creator_name: string;
  creator_photo: string | null;
  verification_status: string;
  note?: string;
}

export function WithdrawalReport() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(`${API_URL}/withdrawals/recent`, {
          params: { limit: 10 },
        });
        setWithdrawals(response.data.data);
      } catch (error) {
        console.error("Failed to fetch withdrawals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="size-12 rounded-full bg-gray-200 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no withdrawals, we might want to show nothing or an empty state, 
  // currently just showing the container with empty message if consistent with previous behavior, 
  // but design didn't specify empty state. Assuming list is rendered if items exist.
  if (withdrawals.length === 0) {
    return null; // Or appropriate empty state
  }

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Transparansi Dana
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Laporan penyaluran dana secara real-time.
          </p>
        </div>
        <Link
          className="text-sm font-medium text-secondary hover:text-primary dark:text-secondary dark:hover:text-white flex items-center gap-1"
          to="/withdrawals" // Assuming a full list page exists or just #
        >
          Lihat Semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-primary dark:text-white line-clamp-1">
                  Pencairan Dana: {withdrawal.campaign_title}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(withdrawal.amount)}
                  </span>
                  <span className="size-1 bg-gray-300 rounded-full"></span>
                  <span>
                    {formatDistanceToNow(new Date(withdrawal.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                  <span className="size-1 bg-gray-300 rounded-full"></span>
                  <span className="line-clamp-1 max-w-[150px] sm:max-w-xs">
                    {withdrawal.note || withdrawal.campaign_title}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to={`/campaigns/${withdrawal.campaign_id}`}
              className="mt-4 sm:mt-0 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors self-start sm:self-center text-center"
            >
              Lihat Bukti
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
