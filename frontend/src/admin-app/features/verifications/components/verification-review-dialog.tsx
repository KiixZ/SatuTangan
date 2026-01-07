import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@admin/components/ui/badge'
import { Button } from '@admin/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admin/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@admin/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@admin/components/ui/radio-group'
import { Textarea } from '@admin/components/ui/textarea'
import {
  reviewVerificationSchema,
  ReviewVerificationInput,
} from '../data/schema'
import { verificationsApi } from '../data/verifications-api'
import { useVerifications } from './verifications-provider'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function VerificationReviewDialog() {
  const {
    selectedVerification,
    isReviewDialogOpen,
    setIsReviewDialogOpen,
    refreshVerifications,
  } = useVerifications()
  const [loading, setLoading] = useState(false)

  const form = useForm<ReviewVerificationInput>({
    resolver: zodResolver(reviewVerificationSchema),
    defaultValues: {
      status: 'APPROVED',
      rejection_reason: '',
    },
  })

  const watchStatus = form.watch('status')

  const onSubmit = async (data: ReviewVerificationInput) => {
    console.log('onSubmit called with data:', data)
    if (!selectedVerification) {
      console.log('No selectedVerification')
      return
    }

    // Validate rejection reason if status is REJECTED
    if (data.status === 'REJECTED' && !data.rejection_reason) {
      console.log('Validation failed: rejection reason required')
      form.setError('rejection_reason', {
        message: 'Rejection reason is required when rejecting verification',
      })
      return
    }

    try {
      setLoading(true)
      console.log('Calling API with:', selectedVerification.id, data)
      await verificationsApi.review(selectedVerification.id, data)
      console.log('API call successful')
      toast.success(
        `Verification ${data.status === 'APPROVED' ? 'approved' : 'rejected'} successfully`
      )
      setIsReviewDialogOpen(false)
      refreshVerifications()
      form.reset()
    } catch (error: any) {
      console.error('Error reviewing verification:', error)
      console.error('Error response:', error.response?.data)
      toast.error(
        error.response?.data?.error?.message || 'Failed to review verification'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsReviewDialogOpen(false)
    form.reset()
  }

  if (!selectedVerification) return null

  return (
    <Dialog open={isReviewDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Review Creator Verification</DialogTitle>
          <DialogDescription>
            Review the submitted documents and approve or reject the
            verification request.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* User Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>User Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm'>User Name</p>
                <p className='font-medium'>
                  {selectedVerification.user_full_name ||
                    selectedVerification.full_name}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Email</p>
                <p className='font-medium'>{selectedVerification.email}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Full Name</p>
                <p className='font-medium'>{selectedVerification.full_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Status</p>
                <Badge
                  variant={
                    selectedVerification.status === 'APPROVED'
                      ? 'default'
                      : selectedVerification.status === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {selectedVerification.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* KTP Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>KTP Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm'>KTP Name</p>
                <p className='font-medium'>{selectedVerification.ktp_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>KTP Number</p>
                <p className='font-medium'>{selectedVerification.ktp_number}</p>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground mb-2 text-sm'>KTP Photo</p>
              <a
                href={`${API_URL}${selectedVerification.ktp_photo_url}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-blue-600 hover:underline'
              >
                View KTP Photo <ExternalLink className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Bank Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Bank Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm'>Bank Name</p>
                <p className='font-medium'>{selectedVerification.bank_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Account Number</p>
                <p className='font-medium'>
                  {selectedVerification.account_number}
                </p>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground mb-2 text-sm'>
                Bank Account Photo
              </p>
              <a
                href={`${API_URL}${selectedVerification.bank_account_photo_url}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-blue-600 hover:underline'
              >
                View Bank Account Photo <ExternalLink className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Terms Photo */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Terms Agreement</h3>
            <div>
              <p className='text-muted-foreground mb-2 text-sm'>
                Terms Agreement Photo
              </p>
              <a
                href={`${API_URL}${selectedVerification.terms_photo_url}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-blue-600 hover:underline'
              >
                View Terms Agreement Photo <ExternalLink className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Warning Count */}
          {selectedVerification.warning_count > 0 && (
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
              <p className='text-sm font-medium text-yellow-800'>
                Warning Count: {selectedVerification.warning_count}
              </p>
            </div>
          )}

          {/* Review Form - Only show if status is PENDING */}
          {selectedVerification.status === 'PENDING' && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Decision</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-y-0 space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='APPROVED' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Approve - User will become a creator
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-y-0 space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='REJECTED' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Reject - User can resubmit verification
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchStatus === 'REJECTED' && (
                  <FormField
                    control={form.control}
                    name='rejection_reason'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rejection Reason *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Provide a clear reason for rejection...'
                            className='resize-none'
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {/* Show rejection reason if already rejected */}
          {selectedVerification.status === 'REJECTED' &&
            selectedVerification.rejection_reason && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='mb-2 text-sm font-medium text-red-800'>
                  Rejection Reason:
                </p>
                <p className='text-sm text-red-700'>
                  {selectedVerification.rejection_reason}
                </p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
