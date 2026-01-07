import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@admin/components/ui/badge'
import { Verification } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableColumnHeader } from '@admin/components/data-table'

export const verificationsColumns: ColumnDef<Verification>[] = [
  {
    accessorKey: 'user_full_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='User Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.user_full_name || row.original.full_name}</span>
          <span className='text-xs text-muted-foreground'>{row.original.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'ktp_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='KTP Name' />,
  },
  {
    accessorKey: 'ktp_number',
    header: ({ column }) => <DataTableColumnHeader column={column} title='KTP Number' />,
  },
  {
    accessorKey: 'bank_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Bank' />,
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.bank_name}</span>
          <span className='text-xs text-muted-foreground'>{row.original.account_number}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === 'APPROVED'
              ? 'default'
              : status === 'REJECTED'
                ? 'destructive'
                : 'secondary'
          }
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'warning_count',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Warnings' />,
    cell: ({ row }) => {
      const count = row.original.warning_count
      return count > 0 ? (
        <Badge variant='destructive'>{count}</Badge>
      ) : (
        <span className='text-muted-foreground'>0</span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Submitted' />,
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
