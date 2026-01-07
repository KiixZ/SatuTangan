import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { prayerService } from "@/services/prayerService";
import type { Prayer } from "@/services/prayerService";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      setIsLoading(true);
      const data = await prayerService.getRecentPrayers(100);
      setPrayers(data);
    } catch (error) {
      console.error("Failed to load prayers:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Doa-doa #OrangBaik</h1>
            <p className="text-muted-foreground text-lg">
              Dukungan dan doa dari para donatur untuk berbagai kampanye
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat doa-doa...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && prayers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Belum ada doa yang dikirimkan
              </p>
            </div>
          )}

          {/* Prayer Cards Grid */}
          {!isLoading && prayers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prayers.map((prayer) => (
                <Link
                  key={prayer.id}
                  to={`/campaigns/${prayer.campaign_id}`}
                  className="block"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-primary">
                    <CardContent className="p-6">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4">
                        {prayer.user_photo && !prayer.is_anonymous ? (
                          <img
                            src={`${API_URL}${prayer.user_photo}`}
                            alt={prayer.user_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-white">
                            <span className="text-sm font-semibold text-primary">
                              {getInitials(prayer.user_name || "HA")}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            {prayer.user_name || "Hamba Allah"}
                          </p>
                          <p className="text-xs text-white/80">
                            {formatRelativeTime(prayer.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Campaign Title */}
                      {prayer.campaign_title && (
                        <div className="mb-3">
                          <p className="text-xs text-white/70 mb-1">
                            Campaign:
                          </p>
                          <p className="text-sm font-semibold text-white line-clamp-2">
                            {prayer.campaign_title}
                          </p>
                        </div>
                      )}

                      {/* Prayer Message */}
                      <p className="text-sm text-white/90 line-clamp-4 mb-4">
                        {prayer.message}
                      </p>

                      {/* Heart Icon */}
                      <div className="flex items-center gap-2 text-white/80">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-xs">Aamiin</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrayersPage;
