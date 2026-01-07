import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { Donation } from '../../services/donationService';

interface DonorListProps {
  donations: Donation[];
}

export default function DonorList({ donations }: DonorListProps) {

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donatur Terbaru</CardTitle>
        <CardDescription>
          {donations.length} donatur telah berkontribusi untuk campaign ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Belum ada donatur. Jadilah yang pertama!
          </p>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-start justify-between border-b pb-4 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {donation.donor_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{donation.donor_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.created_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{formatCurrency(donation.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
