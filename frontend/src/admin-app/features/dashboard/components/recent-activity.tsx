import { useEffect, useState } from 'react';
import { getRecentActivities } from '../data/dashboard-api';
import type { RecentActivity as Activity } from '../data/dashboard-api';
import { DollarSign, Heart, Wallet } from 'lucide-react';

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities(10);
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <DollarSign className='h-4 w-4 text-green-600' />;
      case 'campaign':
        return <Heart className='h-4 w-4 text-red-600' />;
      case 'withdrawal':
        return <Wallet className='h-4 w-4 text-blue-600' />;
      default:
        return <DollarSign className='h-4 w-4 text-gray-600' />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div className='h-9 w-9 rounded-full bg-gray-200'></div>
            <div className='flex-1 space-y-2'>
              <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
              <div className='h-3 w-1/2 bg-gray-200 rounded'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className='text-center py-8 text-gray-400'>
        Belum ada aktivitas
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {activities.map((activity) => (
        <div key={activity.id} className='flex items-start gap-4'>
          <div className='mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100'>
            {getIcon(activity.type)}
          </div>
          <div className='flex-1 space-y-1'>
            <p className='text-sm font-medium leading-none'>{activity.description}</p>
            <p className='text-sm text-muted-foreground'>
              {formatDate(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
