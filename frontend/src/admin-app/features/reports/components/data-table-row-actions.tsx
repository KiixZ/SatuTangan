import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Eye } from 'lucide-react'

import { Button } from '@admin/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu'

import { Report } from '../data/schema'
import { useReports } from './reports-provider'

interface DataTableRowActionsProps {
  row: Row<Report>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const report = row.original
  const { setSelectedReport, setIsReviewDialogOpen } = useReports()

  const handleReview = () => {
    setSelectedReport(report)
    setIsReviewDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleReview}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        {report.status === 'PENDING' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReview}>
              Review Report
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
