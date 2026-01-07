import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { prayerService } from "@/services/prayerService";
import type { Prayer } from "@/services/prayerService";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { formatCurrency } from "@/utils/currency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface PrayerListProps {
  campaignId: string;
  refreshTrigger?: number;
}

export const PrayerList = ({
  campaignId,
  refreshTrigger = 0,
}: PrayerListProps) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const loadPrayers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await prayerService.getPrayers({
        campaign_id: campaignId,
        page,
        limit: 5,
      });

      setPrayers(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (error: any) {
      console.error("Load prayers error:", error);
      toast({
        title: "Failed to load prayers",
        description: "Could not load prayers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers(1);
  }, [campaignId, refreshTrigger]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadPrayers(newPage);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: localeId,
      });
    } catch {
      return "baru saja";
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Memuat doa-doa...</p>
        </CardContent>
      </Card>
    );
  }

  if (prayers.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Belum ada doa atau dukungan untuk campaign ini.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Berdonasi dan tinggalkan doa untuk campaign ini!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Doa-doa #OrangBaik ({total})</h3>
      </div>

      <div className="space-y-4">
        {prayers.map((prayer) => (
          <Card key={prayer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {prayer.user_photo && !prayer.is_anonymous ? (
                    <img
                      src={`${API_URL}${prayer.user_photo}`}
                      alt={prayer.user_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent-foreground">
                        {getInitials(prayer.user_name || "HA")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Prayer Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {prayer.user_name || "Hamba Allah"}
                    </span>
                    {prayer.is_anonymous && (
                      <span className="px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full">
                        Anonim
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      • {formatRelativeTime(prayer.created_at)}
                    </span>
                  </div>

                  {/* Donation Amount */}
                  <div className="mb-2">
                    <span className="text-sm font-medium text-primary">
                      Berdonasi {formatCurrency(prayer.amount)}
                    </span>
                  </div>

                  {/* Prayer Message */}
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {prayer.message}
                  </p>
                </div>
              </div>

              {/* Heart Icon */}
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4 fill-current text-red-500" />
                <span className="text-xs">Aamiin</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
