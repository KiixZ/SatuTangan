import { useState } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Check, X, Eye } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@admin/components/ui/alert-dialog'
import { Badge } from '@admin/components/ui/badge'
import { Button } from '@admin/components/ui/button'
import { DataTableColumnHeader } from '@admin/components/data-table'
import { Withdrawal } from '../data/schema'
import { withdrawalsApi } from '../data/withdrawals-api'

const statusColors = {
  PROCESSING: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
}

export const withdrawalsColumns: ColumnDef<Withdrawal>[] = [
  {
    accessorKey: 'campaign_title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Campaign' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.campaign_title}</span>
          <span className='text-muted-foreground text-xs'>
            {row.original.creator_name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <span className='font-medium'>
          Rp {row.original.amount.toLocaleString('id-ID')}
        </span>
      )
    },
  },
  {
    accessorKey: 'bank_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bank Details' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col text-sm'>
          <span>{row.original.bank_name || 'N/A'}</span>
          <span className='text-muted-foreground text-xs'>
            {row.original.account_number || 'N/A'}
          </span>
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
      const status = row.original.status
      return (
        <Badge
          variant='outline'
          className={`${statusColors[status]} text-white`}
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
    accessorKey: 'processed_by_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Processed By' />
    ),
    cell: ({ row }) => {
      return <span>{row.original.processed_by_name || 'N/A'}</span>
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      return (
        <span className='text-sm'>
          {format(new Date(row.original.created_at), 'dd MMM yyyy HH:mm')}
        </span>
      )
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Note' />
    ),
    cell: ({ row }) => {
      const note = row.original.note
      return (
        <span className='text-muted-foreground text-sm'>
          {note
            ? note.length > 50
              ? `${note.substring(0, 50)}...`
              : note
            : '-'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const withdrawal = row.original
      const [showApproveDialog, setShowApproveDialog] = useState(false)
      const [showRejectDialog, setShowRejectDialog] = useState(false)
      const [isUpdating, setIsUpdating] = useState(false)

      const handleUpdateStatus = async (status: 'COMPLETED' | 'FAILED') => {
        setIsUpdating(true)
        try {
          await withdrawalsApi.updateWithdrawalStatus(withdrawal.id, status)
          toast.success(
            status === 'COMPLETED'
              ? 'Withdrawal approved successfully'
              : 'Withdrawal rejected successfully'
          )
          // Refresh the page to show updated data
          window.location.reload()
        } catch (error: any) {
          toast.error(
            error.response?.data?.error?.message ||
              'Failed to update withdrawal status'
          )
        } finally {
          setIsUpdating(false)
          setShowApproveDialog(false)
          setShowRejectDialog(false)
        }
      }

      if (withdrawal.status !== 'PROCESSING') {
        return (
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {withdrawal.status === 'COMPLETED' ? 'Completed' : 'Rejected'}
            </Badge>
          </div>
        )
      }

      return (
        <>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='default'
              className='bg-green-600 hover:bg-green-700'
              onClick={() => setShowApproveDialog(true)}
              disabled={isUpdating}
            >
              <Check className='mr-1 h-4 w-4' />
              Approve
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => setShowRejectDialog(true)}
              disabled={isUpdating}
            >
              <X className='mr-1 h-4 w-4' />
              Reject
            </Button>
          </div>

          {/* Approve Dialog */}
          <AlertDialog
            open={showApproveDialog}
            onOpenChange={setShowApproveDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this withdrawal request for{' '}
                  <strong>
                    Rp {withdrawal.amount.toLocaleString('id-ID')}
                  </strong>{' '}
                  from <strong>{withdrawal.campaign_title}</strong>?
                  <br />
                  <br />
                  The funds will be transferred to:
                  <br />
                  Bank: <strong>{withdrawal.bank_name}</strong>
                  <br />
                  Account: <strong>{withdrawal.account_number}</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdating}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpdateStatus('COMPLETED')}
                  disabled={isUpdating}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {isUpdating ? 'Processing...' : 'Approve'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reject Dialog */}
          <AlertDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Withdrawal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this withdrawal request for{' '}
                  <strong>
                    Rp {withdrawal.amount.toLocaleString('id-ID')}
                  </strong>{' '}
                  from <strong>{withdrawal.campaign_title}</strong>?
                  <br />
                  <br />
                  This action will mark the withdrawal as failed and the creator
                  will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdating}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpdateStatus('FAILED')}
                  disabled={isUpdating}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isUpdating ? 'Processing...' : 'Reject'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]
