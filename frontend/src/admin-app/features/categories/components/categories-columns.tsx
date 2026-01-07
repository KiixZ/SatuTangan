import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@admin/lib/utils'
import { Checkbox } from '@admin/components/ui/checkbox'
import { DataTableColumnHeader } from '@admin/components/data-table'
import { LongText } from '@admin/components/long-text'
import { type Category } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3 font-medium'>
        {row.getValue('name')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null
      return <LongText className='max-w-64'>{description || '-'}</LongText>
    },
    meta: { className: 'w-64' },
  },
  {
    accessorKey: 'sdgs_ref',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SDGs Reference' />
    ),
    cell: ({ row }) => {
      const sdgsRef = row.getValue('sdgs_ref') as string | null
      return <div className='w-fit ps-2'>{sdgsRef || '-'}</div>
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const dateString = row.getValue('created_at') as string
      const date = new Date(dateString)
      return <div>{date.toLocaleDateString()}</div>
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
