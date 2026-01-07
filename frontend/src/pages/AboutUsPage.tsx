import { Layout } from "@/components/layout";
import {
  Heart,
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { statisticsService } from "@/services/statisticsService";
import type { PlatformStatistics } from "@/services/statisticsService";

export function AboutUsPage() {
  const [statistics, setStatistics] = useState<PlatformStatistics>({
    totalCampaigns: 0,
    totalDonors: 0,
    totalFunds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await statisticsService.getPlatformStatistics();
      setStatistics(data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}Rb`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return `${num}+`;
  };
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tentang SatuTangan
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto">
              Platform penggalangan dana terpercaya yang menghubungkan para
              donatur dengan berbagai campaign sosial yang membutuhkan bantuan
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="mb-16 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              <strong>SatuTangan</strong> hadir dengan misi untuk memudahkan
              setiap orang dalam berbagi kebaikan. Kami percaya bahwa setiap
              kontribusi, sekecil apapun, dapat membawa perubahan besar dalam
              kehidupan seseorang.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Visi Kami</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Menjadi platform penggalangan dana terdepan di Indonesia yang
                  memfasilitasi perubahan positif di masyarakat melalui
                  transparansi dan kepercayaan.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Misi Kami</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Menyediakan platform yang aman dan transparan untuk
                      penggalangan dana
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Membantu individu dan organisasi mencapai tujuan sosial
                      mereka
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Membangun kepercayaan antara donatur dan penerima bantuan
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Mendorong partisipasi masyarakat dalam kegiatan sosial
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Nilai-Nilai Kami
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nilai-nilai yang menjadi fondasi dalam setiap langkah kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transparansi */}
              <div className="bg-white rounded-lg border-2 border-blue-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Transparansi
                    </h3>
                    <p className="text-gray-700">
                      Kami berkomitmen untuk memberikan informasi yang jelas dan
                      akurat tentang setiap campaign. Setiap donasi dapat
                      dilacak dan dipertanggungjawabkan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kepercayaan */}
              <div className="bg-white rounded-lg border-2 border-green-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Kepercayaan
                    </h3>
                    <p className="text-gray-700">
                      Kami memverifikasi setiap campaign creator untuk
                      memastikan keamanan donasi. Kepercayaan donatur adalah
                      prioritas utama kami.
                    </p>
                  </div>
                </div>
              </div>

              {/* Integritas */}
              <div className="bg-white rounded-lg border-2 border-purple-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Integritas
                    </h3>
                    <p className="text-gray-700">
                      Kami menjalankan platform dengan standar etika tertinggi.
                      Setiap keputusan dibuat dengan mempertimbangkan
                      kepentingan semua pihak.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dampak */}
              <div className="bg-white rounded-lg border-2 border-orange-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Dampak
                    </h3>
                    <p className="text-gray-700">
                      Kami fokus pada hasil nyata yang membawa perubahan
                      positif. Setiap campaign dipantau untuk memastikan dampak
                      yang maksimal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Mengapa Memilih SatuTangan?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kami menyediakan platform terbaik untuk berbagi kebaikan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aman & Terpercaya
                </h3>
                <p className="text-gray-700">
                  Sistem keamanan berlapis dan verifikasi ketat untuk setiap
                  campaign
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mudah Digunakan
                </h3>
                <p className="text-gray-700">
                  Interface yang intuitif memudahkan siapa saja untuk berdonasi
                  atau membuat campaign
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Transparan
                </h3>
                <p className="text-gray-700">
                  Setiap donasi tercatat dan dapat dilacak secara real-time
                </p>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 md:p-12 border border-primary/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Komitmen Kami
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                Kami berkomitmen untuk terus berinovasi dan meningkatkan layanan
                kami agar setiap orang dapat dengan mudah berbagi kebaikan dan
                membuat perbedaan nyata dalam kehidupan orang lain.
              </p>
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-900">
                  Bersama Kita Bisa Lebih Baik
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">
                {isLoading ? "..." : formatNumber(statistics.totalCampaigns)}
              </div>
              <div className="text-gray-600">Campaign Terpercaya</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {isLoading ? "..." : formatNumber(statistics.totalDonors)}
              </div>
              <div className="text-gray-600">Donatur Aktif</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {isLoading ? "..." : formatCurrency(statistics.totalFunds)}
              </div>
              <div className="text-gray-600">Dana Tersalurkan</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
