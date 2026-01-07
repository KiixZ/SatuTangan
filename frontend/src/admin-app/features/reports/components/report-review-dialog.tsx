import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { format } from 'date-fns'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admin/components/ui/dialog'
import { Button } from '@admin/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@admin/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin/components/ui/select'
import { Textarea } from '@admin/components/ui/textarea'
import { Badge } from '@admin/components/ui/badge'
import { Separator } from '@admin/components/ui/separator'

import { useReports } from './reports-provider'
import { reviewReportSchema, ReviewReportData } from '../data/schema'
import { reportsApi } from '../data/reports-api'

export function ReportReviewDialog() {
  const { selectedReport, isReviewDialogOpen, setIsReviewDialogOpen, triggerRefresh } =
    useReports()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReviewReportData>({
    resolver: zodResolver(reviewReportSchema),
    defaultValues: {
      status: 'REVIEWED',
      action: 'WARNING',
      admin_note: '',
    },
  })

  const onSubmit = async (data: ReviewReportData) => {
    if (!selectedReport) return

    setIsSubmitting(true)
    try {
      await reportsApi.reviewReport(selectedReport.id, data)
      toast.success('Report reviewed successfully')
      setIsReviewDialogOpen(false)
      triggerRefresh()
      form.reset()
    } catch (error: any) {
      console.error('Failed to review report:', error)
      toast.error(
        error.response?.data?.error?.message ||
          'Failed to review report. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedReport) return null

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-gray-100 text-gray-800',
  }

  return (
    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Review and take action on this report
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Report Info */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Report Information</h3>
              <Badge className={statusColors[selectedReport.status]}>
                {selectedReport.status}
              </Badge>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Reported At</p>
                <p className='font-medium'>
                  {format(new Date(selectedReport.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Reporter</p>
                <p className='font-medium'>
                  {selectedReport.reporter_name || 'Anonymous'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {selectedReport.reporter_email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Campaign Info */}
          <div className='space-y-2'>
            <h3 className='font-semibold'>Campaign Information</h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Campaign Title</p>
                <p className='font-medium'>{selectedReport.campaign_title}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Creator</p>
                <p className='font-medium'>{selectedReport.creator_name}</p>
                <p className='text-xs text-muted-foreground'>
                  {selectedReport.creator_email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Details */}
          <div className='space-y-2'>
            <h3 className='font-semibold'>Report Details</h3>
            <div className='space-y-2'>
              <div>
                <p className='text-sm text-muted-foreground'>Reason</p>
                <p className='font-medium'>{selectedReport.reason}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Description</p>
                <p className='text-sm whitespace-pre-wrap'>
                  {selectedReport.description}
                </p>
              </div>
            </div>
          </div>

          {selectedReport.admin_note && (
            <>
              <Separator />
              <div className='space-y-2'>
                <h3 className='font-semibold'>Admin Note</h3>
                <p className='text-sm whitespace-pre-wrap'>
                  {selectedReport.admin_note}
                </p>
              </div>
            </>
          )}

          {selectedReport.status === 'PENDING' && (
            <>
              <Separator />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='REVIEWED'>Reviewed</SelectItem>
                            <SelectItem value='REJECTED'>Reject Report</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='action'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select action' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='WARNING'>
                              Issue Warning to Creator
                            </SelectItem>
                            <SelectItem value='SUSPEND'>
                              Suspend Campaign
                            </SelectItem>
                            <SelectItem value='REJECT'>
                              Reject Report (No Action)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='admin_note'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Provide details about your decision...'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsReviewDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
