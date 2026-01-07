import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@admin/components/ui/button'
import { Input } from '@admin/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin/components/ui/select'
import { DataTable } from '@admin/components/data-table'
import { campaignsApi } from '../data/campaigns-api'
import { campaignsColumns } from './campaigns-columns'
import { useCampaigns } from './campaigns-provider'

export function CampaignsTable() {
  const { campaigns, setCampaigns, isLoading, setIsLoading } = useCampaigns()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchCampaigns()
  }, [statusFilter, categoryFilter])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        limit: 100,
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      if (categoryFilter !== 'all') {
        params.category_id = categoryFilter
      }

      const result = await campaignsApi.getAllCampaigns(params)
      setCampaigns(result.data || [])
    } catch (error) {
      console.error('Fetch campaigns error:', error)
      toast.error('Failed to fetch campaigns')
      setCampaigns([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return
    }

    const filtered = (campaigns || []).filter(
      (campaign) =>
        campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setCampaigns(filtered || [])
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    fetchCampaigns()
  }

  // Ensure data is always an array
  const tableData = Array.isArray(campaigns) ? campaigns : []

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-muted-foreground'>Loading campaigns...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4'>
        <div className='flex flex-1 items-center gap-2'>
          <Input
            placeholder='Search campaigns...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className='flex-1 sm:max-w-sm'
          />
          <Button
            onClick={handleSearch}
            size='icon'
            variant='outline'
            className='shrink-0'
          >
            <Search className='h-4 w-4' />
          </Button>
          {searchQuery && (
            <Button
              onClick={handleClearSearch}
              variant='ghost'
              size='sm'
              className='shrink-0'
            >
              Clear
            </Button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='DRAFT'>Draft</SelectItem>
            <SelectItem value='ACTIVE'>Active</SelectItem>
            <SelectItem value='COMPLETED'>Completed</SelectItem>
            <SelectItem value='SUSPENDED'>Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={tableData}
        columns={campaignsColumns}
        filterColumn='title'
        filterPlaceholder='Filter by title...'
      />
    </div>
  )
}
