import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Semua field harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/contact/send", {
        name,
        email,
        subject,
        message,
      });

      toast.success(
        "Pesan berhasil dikirim! Kami akan segera menghubungi Anda.",
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Gagal mengirim pesan. Silakan coba lagi.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Hubungi Kami
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika
              ada pertanyaan atau bantuan yang diperlukan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Information Cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <a
                    href="mailto:support@satutangan.my.id"
                    className="text-primary hover:underline"
                  >
                    support@satutangan.my.id
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Telepon</h3>
                  <a
                    href="tel:+628123456789"
                    className="text-primary hover:underline"
                  >
                    +62 812-3456-7890
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Senin - Jumat, 09:00 - 17:00 WIB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Alamat</h3>
                  <p className="text-gray-600">Jakarta, Indonesia</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Isi formulir di bawah ini dan kami akan merespons secepat
                  mungkin.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">
                      Subjek <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Perihal pesan Anda"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">
                      Pesan <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda di sini..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Location & Map */}
            <div className="space-y-6">
              {/* Address Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Lokasi Kantor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Alamat Lengkap</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Jl. Sudirman No. 123,
                      <br />
                      Jakarta Pusat, DKI Jakarta 10110
                      <br />
                      Indonesia
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Jam Operasional
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Senin - Jumat</span>
                        <span className="font-medium">09:00 - 17:00 WIB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sabtu</span>
                        <span className="font-medium">09:00 - 14:00 WIB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minggu</span>
                        <span className="text-red-500 font-medium">Tutup</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href="https://www.google.com/maps/search/Jakarta+Pusat"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Buka di Google Maps
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Google Maps Embed */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full h-[300px] lg:h-[400px] rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.17153489975!2d106.74990825!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1699999999999!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Kantor SatuTangan"
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <Card className="mt-8">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">
                  Butuh Bantuan Segera?
                </h3>
                <p className="text-gray-600 mb-4">
                  Untuk pertanyaan mendesak atau bantuan teknis, silakan hubungi
                  kami melalui WhatsApp atau email. Tim support kami siap
                  membantu Anda pada jam kerja.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" asChild>
                    <a
                      href="https://wa.me/628123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@satutangan.my.id">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;
