import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <Layout>
      <div className="bg-gray-50 py-12 min-h-[60vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <h1 className="text-9xl font-bold text-primary">404</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-8">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah
                dipindahkan atau tidak tersedia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
                <Link to="/">
                  <Button className="gap-2 w-full sm:w-auto">
                    <Home className="h-4 w-4" />
                    Ke Halaman Utama
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
