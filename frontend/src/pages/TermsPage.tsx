import { Layout } from "@/components/layout";
import {
  Shield,
  FileText,
  Users,
  CreditCard,
  AlertCircle,
  Scale,
} from "lucide-react";

export function TermsPage() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Syarat dan Ketentuan</h1>
            <p className="text-primary-foreground/90 text-lg">
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
              Dengan mengakses dan menggunakan platform{" "}
              <strong>SatuTangan</strong>, Anda menyetujui untuk terikat dengan
              syarat dan ketentuan berikut. Mohon membaca dengan saksama sebelum
              menggunakan layanan kami.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    1. Penerimaan Syarat
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Dengan mengakses dan menggunakan platform SatuTangan, Anda
                    menyetujui untuk terikat dengan syarat dan ketentuan ini.
                    Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak
                    menggunakan layanan kami.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Definisi
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 divide-y">
                <div className="p-4">
                  <strong className="text-gray-900">Platform:</strong>
                  <span className="text-gray-700 ml-2">
                    Website dan aplikasi SatuTangan
                  </span>
                </div>
                <div className="p-4">
                  <strong className="text-gray-900">Pengguna:</strong>
                  <span className="text-gray-700 ml-2">
                    Setiap orang yang mengakses platform
                  </span>
                </div>
                <div className="p-4">
                  <strong className="text-gray-900">Donatur:</strong>
                  <span className="text-gray-700 ml-2">
                    Pengguna yang memberikan donasi
                  </span>
                </div>
                <div className="p-4">
                  <strong className="text-gray-900">Campaign Creator:</strong>
                  <span className="text-gray-700 ml-2">
                    Pengguna terverifikasi yang membuat campaign
                  </span>
                </div>
                <div className="p-4">
                  <strong className="text-gray-900">Campaign:</strong>
                  <span className="text-gray-700 ml-2">
                    Program penggalangan dana yang dibuat di platform
                  </span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. Pendaftaran dan Akun
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Untuk menggunakan fitur tertentu, Anda harus mendaftar dan
                    membuat akun. Anda bertanggung jawab untuk:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Memberikan informasi yang akurat dan lengkap
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Menjaga kerahasiaan password Anda
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Semua aktivitas yang terjadi di akun Anda
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Memberitahu kami segera jika terjadi penggunaan tidak
                        sah
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Campaign Creator
              </h2>
              <p className="text-gray-700 mb-4">
                Untuk menjadi Campaign Creator, Anda harus:
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Menyelesaikan proses verifikasi identitas
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Memberikan informasi rekening bank yang valid
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Menyetujui syarat dan ketentuan khusus untuk creator
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">
                      Bertanggung jawab atas keakuratan informasi campaign
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Donasi
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Dengan melakukan donasi, Anda menyetujui bahwa:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Donasi bersifat sukarela dan tidak dapat dikembalikan
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Anda memberikan informasi pembayaran yang valid
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Anda memahami bahwa dana akan disalurkan ke campaign
                        creator
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Platform dapat mengenakan biaya administrasi
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Konten Campaign
              </h2>
              <p className="text-gray-700 mb-4">
                Campaign Creator bertanggung jawab untuk memastikan bahwa:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700">
                    Semua informasi campaign adalah akurat dan tidak menyesatkan
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700">
                    Konten tidak melanggar hak kekayaan intelektual pihak lain
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700">
                    Campaign tidak digunakan untuk tujuan ilegal atau penipuan
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700">
                    Update campaign diberikan secara berkala kepada donatur
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Pencairan Dana
              </h2>
              <p className="text-gray-700 mb-4">
                Pencairan dana campaign akan dilakukan oleh admin dengan
                ketentuan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Campaign creator telah terverifikasi
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Informasi rekening bank valid
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Campaign memenuhi syarat
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold text-gray-900">
                      Tidak ada laporan pelanggaran
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    8. Pelaporan dan Moderasi
                  </h2>
                  <p className="text-gray-700 mb-4">Kami berhak untuk:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Meninjau dan menghapus campaign yang melanggar ketentuan
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Menangguhkan atau menutup akun yang melanggar
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Menahan pencairan dana jika ada indikasi pelanggaran
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="text-gray-700">
                        Mengambil tindakan hukum jika diperlukan
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Batasan Tanggung Jawab
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-900 font-semibold mb-3">
                  Platform SatuTangan:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold mt-1">⚠</span>
                    <span className="text-gray-700">
                      Tidak bertanggung jawab atas keakuratan informasi campaign
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold mt-1">⚠</span>
                    <span className="text-gray-700">
                      Tidak menjamin pencapaian target donasi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold mt-1">⚠</span>
                    <span className="text-gray-700">
                      Tidak bertanggung jawab atas penggunaan dana oleh campaign
                      creator
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold mt-1">⚠</span>
                    <span className="text-gray-700">
                      Tidak bertanggung jawab atas kerugian yang timbul dari
                      penggunaan platform
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Perubahan Syarat
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja.
                Perubahan akan diberitahukan melalui platform dan akan berlaku
                setelah dipublikasikan. Penggunaan platform setelah perubahan
                berarti Anda menyetujui syarat yang telah diperbarui.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    11. Hukum yang Berlaku
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Syarat dan ketentuan ini diatur oleh hukum Republik
                    Indonesia. Setiap sengketa akan diselesaikan melalui
                    pengadilan yang berwenang di Jakarta.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12 - Contact */}
            <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Kontak
              </h2>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini,
                silakan hubungi kami di:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-3 text-gray-900">
                  <span className="font-semibold">Email:</span>
                  <a
                    href="mailto:support@satutangan.my.id"
                    className="text-primary hover:underline"
                  >
                    support@satutangan.my.id
                  </a>
                </p>
                <p className="flex items-center gap-3 text-gray-900">
                  <span className="font-semibold">Telepon:</span>
                  <a
                    href="tel:+628123456789"
                    className="text-primary hover:underline"
                  >
                    +62 812-3456-7890
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Dengan menggunakan platform SatuTangan, Anda menyatakan telah
              membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di
              atas.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
