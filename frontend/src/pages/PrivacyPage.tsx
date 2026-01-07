import { Layout } from "@/components/layout";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  UserCheck,
  Globe,
  Mail,
} from "lucide-react";

export function PrivacyPage() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Kebijakan Privasi</h1>
            <p className="text-blue-100 text-lg">
              Terakhir diperbarui:{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>SatuTangan</strong> berkomitmen untuk melindungi privasi
              Anda. Kebijakan Privasi ini menjelaskan bagaimana kami
              mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
              saat menggunakan platform kami.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    1. Pendahuluan
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    SatuTangan ("kami", "kita", atau "milik kami") berkomitmen
                    untuk melindungi privasi Anda. Kebijakan Privasi ini
                    menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                    melindungi informasi pribadi Anda saat menggunakan platform
                    kami.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. Informasi yang Kami Kumpulkan
                  </h2>
                </div>
              </div>

              <div className="space-y-6 ml-16">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    2.1 Informasi yang Anda Berikan
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y">
                    <div className="p-4">
                      <strong className="text-gray-900">Informasi Akun:</strong>
                      <span className="text-gray-700 ml-2">
                        Nama lengkap, email, nomor telepon, password
                      </span>
                    </div>
                    <div className="p-4">
                      <strong className="text-gray-900">
                        Informasi Verifikasi:
                      </strong>
                      <span className="text-gray-700 ml-2">
                        Nomor KTP, foto KTP, informasi rekening bank
                      </span>
                    </div>
                    <div className="p-4">
                      <strong className="text-gray-900">
                        Informasi Campaign:
                      </strong>
                      <span className="text-gray-700 ml-2">
                        Deskripsi, foto, dan detail campaign
                      </span>
                    </div>
                    <div className="p-4">
                      <strong className="text-gray-900">
                        Informasi Donasi:
                      </strong>
                      <span className="text-gray-700 ml-2">
                        Nama, email, nomor telepon, jumlah donasi, doa/ulasan
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    2.2 Informasi yang Dikumpulkan Otomatis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="font-semibold text-blue-900 mb-1">
                        Data Penggunaan
                      </div>
                      <p className="text-sm text-blue-700">
                        Halaman yang dikunjungi, waktu akses, durasi kunjungan
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <div className="font-semibold text-purple-900 mb-1">
                        Data Perangkat
                      </div>
                      <p className="text-sm text-purple-700">
                        Jenis perangkat, sistem operasi, browser
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="font-semibold text-green-900 mb-1">
                        Data Lokasi
                      </div>
                      <p className="text-sm text-green-700">
                        Alamat IP, lokasi geografis umum
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                      <div className="font-semibold text-orange-900 mb-1">
                        Cookies
                      </div>
                      <p className="text-sm text-orange-700">
                        Data yang disimpan di browser untuk meningkatkan
                        pengalaman
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Bagaimana Kami Menggunakan Informasi
              </h2>
              <p className="text-gray-700 mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Menyediakan dan mengelola layanan platform
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Memproses donasi dan transaksi
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Memverifikasi identitas campaign creator
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Mengirim notifikasi dan update penting
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Meningkatkan keamanan dan mencegah penipuan
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Menganalisis penggunaan platform untuk perbaikan
                  </span>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-gray-700">
                    Mematuhi kewajiban hukum
                  </span>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Berbagi Informasi
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Kami tidak menjual informasi pribadi Anda. Kami hanya
                    membagikan informasi dalam situasi berikut:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <div>
                        <strong className="text-gray-900">
                          Dengan Campaign Creator:
                        </strong>
                        <span className="text-gray-700 ml-1">
                          Informasi donatur (jika tidak anonim) dibagikan dengan
                          creator campaign
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <div>
                        <strong className="text-gray-900">
                          Dengan Penyedia Layanan:
                        </strong>
                        <span className="text-gray-700 ml-1">
                          Payment gateway (Midtrans), email service, hosting
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <div>
                        <strong className="text-gray-900">
                          Untuk Kepatuhan Hukum:
                        </strong>
                        <span className="text-gray-700 ml-1">
                          Jika diwajibkan oleh hukum atau proses hukum
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <div>
                        <strong className="text-gray-900">
                          Dengan Persetujuan Anda:
                        </strong>
                        <span className="text-gray-700 ml-1">
                          Dalam situasi lain dengan persetujuan eksplisit
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Keamanan Data
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Kami menerapkan langkah-langkah keamanan untuk melindungi
                    informasi Anda:
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">🔒</span>
                        <span className="text-gray-700">
                          Enkripsi data sensitif (password, informasi
                          pembayaran)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">🔒</span>
                        <span className="text-gray-700">
                          Akses terbatas ke data pribadi
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">🔒</span>
                        <span className="text-gray-700">
                          Monitoring keamanan secara berkala
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">🔒</span>
                        <span className="text-gray-700">
                          Backup data secara teratur
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">🔒</span>
                        <span className="text-gray-700">
                          Protokol keamanan untuk mencegah akses tidak sah
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Hak Anda
                  </h2>
                  <p className="text-gray-700 mb-4">Anda memiliki hak untuk:</p>
                  <div className="space-y-3">
                    <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Akses:</strong>
                      <span className="text-gray-700 ml-2">
                        Meminta salinan data pribadi Anda
                      </span>
                    </div>
                    <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Koreksi:</strong>
                      <span className="text-gray-700 ml-2">
                        Memperbarui atau memperbaiki data yang tidak akurat
                      </span>
                    </div>
                    <div className="bg-white border-l-4 border-purple-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Penghapusan:</strong>
                      <span className="text-gray-700 ml-2">
                        Meminta penghapusan data pribadi Anda
                      </span>
                    </div>
                    <div className="bg-white border-l-4 border-pink-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Pembatasan:</strong>
                      <span className="text-gray-700 ml-2">
                        Membatasi pemrosesan data Anda
                      </span>
                    </div>
                    <div className="bg-white border-l-4 border-red-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Portabilitas:</strong>
                      <span className="text-gray-700 ml-2">
                        Menerima data Anda dalam format yang dapat dibaca mesin
                      </span>
                    </div>
                    <div className="bg-white border-l-4 border-orange-500 p-4 rounded-r-lg">
                      <strong className="text-gray-900">Keberatan:</strong>
                      <span className="text-gray-700 ml-2">
                        Menolak pemrosesan data untuk tujuan tertentu
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    7. Cookies
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Kami menggunakan cookies untuk:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Menjaga sesi login Anda
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Mengingat preferensi Anda
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Menganalisis penggunaan platform
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Meningkatkan pengalaman pengguna
                      </span>
                    </li>
                  </ul>
                  <p className="text-gray-600 mt-4 text-sm italic">
                    Anda dapat mengatur browser untuk menolak cookies, namun
                    beberapa fitur platform mungkin tidak berfungsi dengan baik.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Penyimpanan Data
              </h2>
              <p className="text-gray-700 mb-4">
                Kami menyimpan data pribadi Anda selama:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Akun Anda aktif
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Diperlukan untuk menyediakan layanan
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Diwajibkan oleh hukum atau regulasi
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Diperlukan untuk menyelesaikan sengketa
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Privasi Anak-anak
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Platform kami tidak ditujukan untuk anak-anak di bawah 17
                  tahun. Kami tidak dengan sengaja mengumpulkan informasi
                  pribadi dari anak-anak. Jika Anda adalah orang tua dan
                  mengetahui bahwa anak Anda memberikan informasi pribadi kepada
                  kami, silakan hubungi kami.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Perubahan Kebijakan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                waktu. Perubahan akan diberitahukan melalui platform dan akan
                berlaku setelah dipublikasikan. Kami mendorong Anda untuk
                meninjau kebijakan ini secara berkala.
              </p>
            </section>

            {/* Section 11 - Contact */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    11. Kontak
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini
                    atau ingin menggunakan hak Anda, silakan hubungi kami di:
                  </p>
                  <div className="space-y-2">
                    <p className="flex items-center gap-3 text-gray-900">
                      <span className="font-semibold">Email:</span>
                      <a
                        href="mailto:support@satutangan.my.id"
                        className="text-blue-600 hover:underline"
                      >
                        support@satutangan.my.id
                      </a>
                    </p>
                    <p className="flex items-center gap-3 text-gray-900">
                      <span className="font-semibold">Telepon:</span>
                      <a
                        href="tel:+628123456789"
                        className="text-blue-600 hover:underline"
                      >
                        +62 812-3456-7890
                      </a>
                    </p>
                    <p className="flex items-center gap-3 text-gray-900">
                      <span className="font-semibold">Alamat:</span>
                      <span className="text-gray-700">Jakarta, Indonesia</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Persetujuan
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Dengan menggunakan platform SatuTangan, Anda menyetujui
                  pengumpulan dan penggunaan informasi sesuai dengan Kebijakan
                  Privasi ini.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Privasi Anda adalah prioritas kami. Kami berkomitmen untuk
              melindungi data pribadi Anda dan menggunakannya secara bertanggung
              jawab.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
