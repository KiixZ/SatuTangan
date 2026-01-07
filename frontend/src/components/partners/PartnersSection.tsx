import { partnersData } from "@/data/partnersData";

export function PartnersSection() {
  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partnersData, ...partnersData];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Partner Kami
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Perusahaan dan lembaga berikut pernah menggunakan dan bekerjasama
            dengan SatuTangan
          </p>
        </div>

        {/* Marquee Slider */}
        <div className="relative">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none"></div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 via-gray-50/50 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-marquee hover:pause">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 w-48 h-24 flex items-center justify-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Dipercaya oleh lebih dari{" "}
            <span className="font-bold text-primary">100+ organisasi</span> di
            seluruh Indonesia
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }

        .animate-marquee:hover,
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
