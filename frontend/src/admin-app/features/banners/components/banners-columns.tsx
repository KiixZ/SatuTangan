import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@admin/components/ui/badge'
import { DataTableColumnHeader } from '@admin/components/data-table'
import { Banner } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const bannersColumns: ColumnDef<Banner>[] = [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string
      return (
        <div className='h-16 w-24 overflow-hidden rounded-md'>
          <img
            src={`${API_URL}${imageUrl}`}
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
      return <div className='font-medium'>{row.getValue('title')}</div>
    },
  },
  {
    accessorKey: 'link_url',
    header: 'Link URL',
    cell: ({ row }) => {
      const linkUrl = row.getValue('link_url') as string | null
      return (
        <div className='max-w-[200px] truncate'>
          {linkUrl ? (
            <a
              href={linkUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              {linkUrl}
            </a>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
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
