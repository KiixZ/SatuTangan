import { useEffect } from 'react'
import { toast } from 'sonner'
import { DataTable } from '@admin/components/data-table'
import { bannersApi } from '../data/banners-api'
import { bannersColumns } from './banners-columns'
import { useBanners } from './banners-provider'

export function BannersTable() {
  const { banners, setBanners, isLoading, setIsLoading } = useBanners()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const data = await bannersApi.getAllBanners()
      setBanners(data || [])
    } catch (error) {
      console.error('Fetch banners error:', error)
      toast.error('Failed to fetch banners')
      setBanners([])
    } finally {
      setIsLoading(false)
    }
  }

  // Ensure data is always an array
  const tableData = Array.isArray(banners) ? banners : []

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-muted-foreground'>Loading banners...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <DataTable
        data={tableData}
        columns={bannersColumns}
        filterColumn='title'
        filterPlaceholder='Filter by title...'
      />
    </div>
  )
}
