import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import donationService from '../../services/donationService';
import type { Donation } from '../../services/donationService';

export default function DonationHistory() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      setLoading(true);
      const data = await donationService.getUserDonationHistory();
      setDonations(data);
    } catch (err: any) {
      setError('Failed to load donation history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTotalDonations = () => {
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Donasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Donasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Donasi</CardTitle>
          <CardDescription>Total kontribusi Anda untuk berbagai campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Donasi</p>
              <p className="text-2xl font-bold text-blue-600">{donations.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Nominal</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalDonations())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Donasi</CardTitle>
          <CardDescription>
            Semua donasi Anda, termasuk yang dilakukan sebelum registrasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">Anda belum memiliki riwayat donasi</p>
              <Link to="/">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Mulai Berdonasi
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Link
                  key={donation.id}
                  to={`/campaigns/${donation.campaign_id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {donation.campaign_thumbnail && (
                        <img
                          src={donation.campaign_thumbnail}
                          alt={donation.campaign_title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {donation.campaign_title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(donation.created_at)}
                        </p>
                        {donation.prayer && (
                          <p className="text-sm text-gray-600 italic line-clamp-2">
                            "{donation.prayer}"
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-blue-600">
                          {formatCurrency(donation.amount)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded mt-1">
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
