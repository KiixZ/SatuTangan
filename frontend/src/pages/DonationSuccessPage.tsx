import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Donasi Berhasil!</CardTitle>
          <CardDescription>
            Terima kasih atas donasi Anda. Semoga menjadi berkah dan bermanfaat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Anda akan menerima email konfirmasi segera. Donasi Anda akan membantu mewujudkan
            campaign ini.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="w-full">Kembali ke Beranda</Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                Lihat Riwayat Donasi
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
