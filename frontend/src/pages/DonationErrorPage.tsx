import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function DonationErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Pembayaran Gagal</CardTitle>
          <CardDescription>
            Maaf, terjadi kesalahan saat memproses pembayaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Silakan coba lagi atau hubungi customer service jika masalah berlanjut.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="w-full">Kembali ke Beranda</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
