import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function DonationPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Pembayaran Pending</CardTitle>
          <CardDescription>
            Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Kami sedang menunggu konfirmasi pembayaran dari bank. Anda akan menerima email
            setelah pembayaran dikonfirmasi.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="w-full">Kembali ke Beranda</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
