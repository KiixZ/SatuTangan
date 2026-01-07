import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { prayerService } from "@/services/prayerService";
import type { Prayer } from "@/services/prayerService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const PrayerSection = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      setIsLoading(true);
      const data = await prayerService.getRecentPrayers(20);
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

  const PrayerCard = ({ prayer }: { prayer: Prayer }) => (
    <div className="bg-white dark:bg-[#322c1f] p-6 rounded-2xl shadow-sm border border-transparent hover:border-secondary/30 transition-all h-full">
      <div className="flex items-center gap-3 mb-4">
        {prayer.user_photo && !prayer.is_anonymous ? (
          <img
            src={`${API_URL}${prayer.user_photo}`}
            alt={prayer.user_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary text-white text-sm font-bold">
            {getInitials(prayer.user_name || "HA")}
          </div>
        )}
        <div>
          <p className="font-semibold text-primary dark:text-white">
            {prayer.user_name || "Hamba Allah"}
          </p>
          {prayer.campaign_title && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              Donasi untuk {prayer.campaign_title}
            </p>
          )}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic mb-4 line-clamp-4">
        "{prayer.message}"
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
        <Heart className="w-[14px] h-[14px]" />
        <span>Aamiin</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-primary/5 dark:bg-surface-dark border-y border-primary/10 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Memuat doa-doa...</p>
        </div>
      </section>
    );
  }

  if (prayers.length === 0) {
    return null;
  }

  const showSlider = prayers.length > 3;

  return (
    <section className="bg-primary/5 dark:bg-surface-dark py-16 px-4 sm:px-6 lg:px-8 w-full border-y border-primary/10 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-3">
            Doa Orang Baik
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Setiap donasi adalah harapan. Berikut adalah doa-doa tulus dari para
            donatur yang telah berbagi kebaikan.
          </p>
        </div>

        {showSlider ? (
          <div className="px-4 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {prayers.map((prayer) => (
                  <CarouselItem
                    key={prayer.id}
                    className="md:basis-1/2 lg:basis-1/3 pl-6"
                  >
                    <Link
                      to={`/campaigns/${prayer.campaign_id}`}
                      className="block h-full"
                    >
                      <PrayerCard prayer={prayer} />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 lg:-left-8" />
              <CarouselNext className="-right-4 lg:-right-8" />
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prayers.map((prayer) => (
              <Link
                key={prayer.id}
                to={`/campaigns/${prayer.campaign_id}`}
                className="block"
              >
                <PrayerCard prayer={prayer} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

