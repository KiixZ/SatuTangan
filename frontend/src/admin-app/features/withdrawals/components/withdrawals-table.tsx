import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { DataTable } from '@admin/components/data-table'
import { Withdrawal } from '../data/schema'
import { withdrawalsApi } from '../data/withdrawals-api'
import { withdrawalsColumns } from './withdrawals-columns'

export function WithdrawalsTable() {
  const [data, setData] = useState<Withdrawal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadWithdrawals = async () => {
    setIsLoading(true)
    try {
      const result = await withdrawalsApi.getAllWithdrawals({
        limit: 100,
      })
      setData(result.data || [])
    } catch (error) {
      console.error('Failed to load withdrawals:', error)
      toast.error('Failed to load withdrawals')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWithdrawals()
  }, [])

  // Ensure data is always an array
  const tableData = Array.isArray(data) ? data : []

  const statusOptions = [
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Failed', value: 'FAILED' },
  ]

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-muted-foreground'>Loading withdrawals...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <DataTable
        data={tableData}
        columns={withdrawalsColumns}
        filterColumn='campaign_title'
        filterPlaceholder='Filter by campaign...'
        facetedFilters={[
          {
            columnId: 'status',
            title: 'Status',
            options: statusOptions,
          },
        ]}
      />
    </div>
  )
}
