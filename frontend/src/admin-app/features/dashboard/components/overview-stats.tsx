import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@admin/components/ui/card';
import { getAdminStats } from '../data/dashboard-api';
import type { AdminStats } from '../data/dashboard-api';
import { DollarSign, Users, Heart, UserCheck, AlertCircle, CheckCircle, Wallet } from 'lucide-react';

export function OverviewStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  if (loading) {
    return (
      <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className='animate-pulse'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='h-4 w-24 bg-gray-200 rounded'></div>
              <div className='h-4 w-4 bg-gray-200 rounded'></div>
            </CardHeader>
            <CardContent>
              <div className='h-8 w-32 bg-gray-200 rounded mb-2'></div>
              <div className='h-3 w-20 bg-gray-200 rounded'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='text-center py-8 text-gray-500'>
        Failed to load statistics
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Donasi',
      value: formatCurrency(stats.totalDonations),
      icon: DollarSign,
      description: 'Total donasi terkumpul',
      color: 'text-green-600',
    },
    {
      title: 'Total Donatur',
      value: formatNumber(stats.totalDonors),
      icon: Users,
      description: 'Donatur unik',
      color: 'text-blue-600',
    },
    {
      title: 'Campaign Aktif',
      value: formatNumber(stats.activeCampaigns),
      icon: Heart,
      description: `${formatNumber(stats.totalCampaigns)} total campaign`,
      color: 'text-red-600',
    },
    {
      title: 'Campaign Selesai',
      value: formatNumber(stats.completedCampaigns),
      icon: CheckCircle,
      description: 'Campaign yang telah selesai',
      color: 'text-purple-600',
    },
    {
      title: 'Total Pengguna',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      description: 'Pengguna terdaftar',
      color: 'text-indigo-600',
    },
    {
      title: 'Campaign Creator',
      value: formatNumber(stats.totalCreators),
      icon: UserCheck,
      description: 'Creator terverifikasi',
      color: 'text-teal-600',
    },
    {
      title: 'Verifikasi Pending',
      value: formatNumber(stats.pendingVerifications),
      icon: AlertCircle,
      description: 'Menunggu review',
      color: 'text-orange-600',
    },
    {
      title: 'Total Pencairan',
      value: formatCurrency(stats.totalWithdrawals),
      icon: Wallet,
      description: 'Dana yang telah dicairkan',
      color: 'text-cyan-600',
    },
  ];

  return (
    <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs sm:text-sm font-medium'>{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-2xl font-bold ${stat.color} break-words`}>{stat.value}</div>
              <p className='text-muted-foreground text-xs mt-1'>{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
