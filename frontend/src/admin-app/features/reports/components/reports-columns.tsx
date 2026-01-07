import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@admin/components/ui/badge'
import { Report } from '../data/schema'
import { DataTableColumnHeader } from '@admin/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  REVIEWED: 'bg-green-100 text-green-800 hover:bg-green-100',
  REJECTED: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
}

const statusLabels = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  REJECTED: 'Rejected',
}

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'campaign_title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Campaign' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.campaign_title}</span>
          <span className='text-xs text-muted-foreground'>
            {row.original.campaign_id.substring(0, 8)}...
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'reporter_email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reporter' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {row.original.reporter_name || 'Anonymous'}
          </span>
          <span className='text-xs text-muted-foreground'>
            {row.original.reporter_email}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reason' />
    ),
    cell: ({ row }) => {
      return <span className='font-medium'>{row.getValue('reason')}</span>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof statusColors
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reported At' />
    ),
    cell: ({ row }) => {
      return (
        <span className='text-sm text-muted-foreground'>
          {format(new Date(row.getValue('created_at')), 'MMM dd, yyyy HH:mm')}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
