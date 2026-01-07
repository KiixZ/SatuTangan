import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center mb-8 sm:mb-12 py-6 sm:py-8 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
        Bersama Membangun Harapan
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-text-primary mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
        Bergabunglah dengan ribuan donatur untuk mendukung campaign yang membuat
        perbedaan nyata dalam kehidupan banyak orang
      </p>

      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4">
          <Button
            onClick={() => navigate("/register")}
            size="lg"
            className="text-base w-full sm:w-auto"
          >
            Mulai Berdonasi
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            size="lg"
            className="text-base w-full sm:w-auto"
          >
            Login
          </Button>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4">
          <Button
            onClick={() => navigate("/profile")}
            size="lg"
            className="text-base w-full sm:w-auto"
          >
            Lihat Profile
          </Button>
          <Button
            onClick={() =>
              window.scrollTo({
                top: document.getElementById("campaigns")?.offsetTop || 0,
                behavior: "smooth",
              })
            }
            variant="outline"
            size="lg"
            className="text-base w-full sm:w-auto"
          >
            Jelajahi Campaign
          </Button>
        </div>
      )}
    </div>
  );
}
