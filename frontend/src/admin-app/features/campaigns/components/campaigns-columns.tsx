import { ColumnDef } from '@tanstack/react-table'
import { formatCurrency } from '@admin/lib/utils'
import { Badge } from '@admin/components/ui/badge'
import { DataTableColumnHeader } from '@admin/components/data-table'
import { Campaign } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const campaignsColumns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'thumbnail_url',
    header: 'Thumbnail',
    cell: ({ row }) => {
      const thumbnailUrl = row.getValue('thumbnail_url') as string | null
      if (!thumbnailUrl) {
        return (
          <div className='flex h-16 w-24 items-center justify-center overflow-hidden rounded-md bg-gray-200'>
            <span className='text-xs text-gray-500'>No image</span>
          </div>
        )
      }
      return (
        <div className='h-16 w-24 overflow-hidden rounded-md'>
          <img
            src={`${API_URL}${thumbnailUrl}`}
            alt={row.getValue('title')}
            className='h-full w-full object-cover'
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      const isEmergency = row.getValue('is_emergency') as boolean
      return (
        <div className='flex items-center gap-2'>
          <div className='max-w-[200px] truncate font-medium'>
            {row.getValue('title')}
          </div>
          {isEmergency === true && (
            <Badge variant='destructive' className='text-xs'>
              Emergency
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'category_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const categoryName = row.getValue('category_name') as string | undefined
      return <div>{categoryName || '-'}</div>
    },
  },
  {
    accessorKey: 'creator_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creator' />
    ),
    cell: ({ row }) => {
      const creatorName = row.getValue('creator_name') as string | undefined
      return <div>{creatorName || '-'}</div>
    },
  },
  {
    accessorKey: 'target_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Target' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('target_amount') as number
      return <div>{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: 'collected_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Collected' />
    ),
    cell: ({ row }) => {
      const collected = row.getValue('collected_amount') as number
      const target = row.getValue('target_amount') as number
      const percentage = target > 0 ? Math.round((collected / target) * 100) : 0

      return (
        <div className='space-y-1'>
          <div>{formatCurrency(collected)}</div>
          <div className='text-muted-foreground text-xs'>{percentage}%</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variants: Record<
        string,
        'default' | 'secondary' | 'destructive' | 'outline'
      > = {
        DRAFT: 'secondary',
        ACTIVE: 'default',
        COMPLETED: 'outline',
        SUSPENDED: 'destructive',
      }

      return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
    },
  },
  {
    accessorKey: 'is_emergency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Emergency' />
    ),
    cell: ({ row }) => {
      const isEmergency = row.getValue('is_emergency') as boolean
      return (
        <Badge variant={isEmergency ? 'destructive' : 'outline'}>
          {isEmergency ? 'Yes' : 'No'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
