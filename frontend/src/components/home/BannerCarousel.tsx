import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, HeartHandshake } from "lucide-react";
import { bannerService } from "../../services/bannerService";
import type { Banner } from "../../services/bannerService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await bannerService.getActiveBanners();
      setBanners(data);

      if (data.length > 0) {
        preloadImages(data);
      } else {
        setImagesLoaded(true);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      setImagesLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const preloadImages = (bannersData: Banner[]) => {
    let loadedCount = 0;
    const totalImages = bannersData.length;

    bannersData.forEach((banner) => {
      const img = new Image();
      img.src = `${API_URL}${banner.image_url}`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
    );
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length, goToNext]);

  // Loading Skeleton
  if (isLoading || !imagesLoaded) {
    return (
      <section className="w-full pt-8 pb-4">
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">Loading banners...</div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="w-full pb-4">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg group">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${API_URL}${currentBanner.image_url}')` }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="max-w-2xl">
            {/* Optional Tag - could come from data later */}
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase bg-[#8A9A5B] text-white rounded-full">
              Campaign Resmi
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
              {currentBanner.title}
            </h1>
            {currentBanner.description && (
              <p className="text-lg text-gray-200 mb-8 line-clamp-2 md:line-clamp-none">
                {currentBanner.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-8">
              {currentBanner.link_url ? (
                <>
                  <a
                    href={currentBanner.link_url}
                    className="h-12 px-8 rounded-lg bg-white text-primary font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <HeartHandshake className="text-[20px] text-primary" />
                    Donasi Sekarang
                  </a>
                </>
              ) : (
                <button className="h-12 px-8 rounded-lg bg-white text-primary font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <HeartHandshake className="text-[20px] text-primary" />
                  Donasi Sekarang
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-2 transition-all duration-300"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white rounded-full p-2 transition-all duration-300"
              aria-label="Next banner"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
