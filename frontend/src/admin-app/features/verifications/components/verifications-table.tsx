import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '@admin/components/data-table'
import { verificationsApi } from '../data/verifications-api'
import { verificationsColumns } from './verifications-columns'
import { useVerifications } from './verifications-provider'

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

export function VerificationsTable() {
  const { verifications, setVerifications, refreshTrigger } = useVerifications()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVerifications()
  }, [refreshTrigger])

  const fetchVerifications = async () => {
    try {
      setLoading(true)
      const data = await verificationsApi.getAll()
      setVerifications(data)
    } catch (error: any) {
      console.error('Error fetching verifications:', error)
      toast.error('Failed to load verifications')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-muted-foreground'>Loading verifications...</p>
      </div>
    )
  }

  return (
    <DataTable
      columns={verificationsColumns}
      data={verifications}
      filterColumn='user_full_name'
      filterPlaceholder='Filter by user name...'
      facetedFilters={[
        {
          columnId: 'status',
          title: 'Status',
          options: statusOptions,
        },
      ]}
    />
  )
}
