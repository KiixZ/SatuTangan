import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CampaignPhoto } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/utils/url";

interface CampaignGalleryProps {
  photos: CampaignPhoto[];
  thumbnailUrl: string;
}

export function CampaignGallery({
  photos,
  thumbnailUrl,
}: CampaignGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Combine thumbnail with photos
  const allImages = [
    {
      id: "thumbnail",
      photo_url: getAssetUrl(thumbnailUrl),
      campaign_id: "",
      created_at: "",
    },
    ...photos.map((photo) => ({
      ...photo,
      photo_url: getAssetUrl(photo.photo_url),
    })),
  ];

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < allImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  // Add keyboard event listener
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown as any);
  }

  if (allImages.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.photo_url}
              alt={`Campaign photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {selectedIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {selectedIndex < allImages.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          <div className="max-w-7xl max-h-[90vh] p-4">
            <img
              src={allImages[selectedIndex].photo_url}
              alt={`Campaign photo ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
