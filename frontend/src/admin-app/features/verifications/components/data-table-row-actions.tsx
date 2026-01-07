import { Row } from '@tanstack/react-table'
import { Button } from '@admin/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Verification } from '../data/schema'
import { useVerifications } from './verifications-provider'

interface DataTableRowActionsProps {
  row: Row<Verification>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const verification = row.original
  const { setSelectedVerification, setIsReviewDialogOpen } = useVerifications()

  const handleReview = () => {
    setSelectedVerification(verification)
    setIsReviewDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleReview}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        {verification.status === 'PENDING' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReview}>
              <CheckCircle className='mr-2 h-4 w-4' />
              Review
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
