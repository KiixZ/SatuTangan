import { useEffect, useState } from 'react';
import { getDonationTrends } from '../data/dashboard-api';
import type { DonationTrend } from '../data/dashboard-api';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function DonationChart() {
  const [trends, setTrends] = useState<DonationTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getDonationTrends(days);
        setTrends(data);
      } catch (error) {
        console.error('Failed to fetch donation trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [days]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className='h-[350px] flex items-center justify-center'>
        <div className='animate-pulse text-gray-400'>Loading chart...</div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className='h-[350px] flex items-center justify-center'>
        <div className='text-gray-400'>No donation data available</div>
      </div>
    );
  }

  const chartData = trends.map((trend) => ({
    date: formatDate(trend.date),
    amount: Number(trend.total_amount),
    count: Number(trend.donation_count),
  }));

  return (
    <div>
      <div className='mb-4 flex gap-2'>
        <button
          onClick={() => setDays(7)}
          className={`px-3 py-1 text-sm rounded ${
            days === 7 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          7 Hari
        </button>
        <button
          onClick={() => setDays(30)}
          className={`px-3 py-1 text-sm rounded ${
            days === 30 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          30 Hari
        </button>
        <button
          onClick={() => setDays(90)}
          className={`px-3 py-1 text-sm rounded ${
            days === 90 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          90 Hari
        </button>
      </div>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-muted-foreground'>
                          Total Donasi
                        </span>
                        <span className='font-bold text-muted-foreground'>
                          {formatCurrency(payload[0].value as number)}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-muted-foreground'>
                          Jumlah
                        </span>
                        <span className='font-bold text-muted-foreground'>
                          {payload[0].payload.count} donasi
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey='amount' fill='#adfa1d' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
