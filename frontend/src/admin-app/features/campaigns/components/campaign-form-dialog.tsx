import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { Input } from '@admin/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin/components/ui/select'
import { Textarea } from '@admin/components/ui/textarea'
import { categoriesApi } from '@admin/features/categories/data/categories-api'
import { campaignsApi } from '../data/campaigns-api'
import { campaignFormSchema, CampaignFormValues } from '../data/schema'
import { useCampaigns } from './campaigns-provider'

interface Category {
  id: string
  name: string
}

export function CampaignFormDialog() {
  const { selectedCampaign, isFormOpen, setIsFormOpen, setCampaigns } =
    useCampaigns()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      target_amount: 0,
      start_date: '',
      end_date: '',
      status: 'DRAFT',
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCampaign) {
      form.reset({
        title: selectedCampaign.title,
        description: selectedCampaign.description,
        category_id: selectedCampaign.category_id,
        target_amount: selectedCampaign.target_amount,
        start_date: selectedCampaign.start_date.split('T')[0],
        end_date: selectedCampaign.end_date.split('T')[0],
        status: selectedCampaign.status,
      })
    } else {
      form.reset({
        title: '',
        description: '',
        category_id: '',
        target_amount: 0,
        start_date: '',
        end_date: '',
        status: 'DRAFT',
      })
      setThumbnailFile(null)
    }
  }, [selectedCampaign, form])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Fetch categories error:', error)
      toast.error('Failed to fetch categories')
    }
  }

  const onSubmit = async (values: CampaignFormValues) => {
    setIsSubmitting(true)
    try {
      if (selectedCampaign) {
        // Update existing campaign
        const updated = await campaignsApi.updateCampaign(
          selectedCampaign.id,
          values,
          thumbnailFile || undefined
        )

        setCampaigns((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )

        toast.success('Campaign updated successfully')
      } else {
        // Create new campaign
        if (!thumbnailFile) {
          toast.error('Please select a thumbnail image')
          setIsSubmitting(false)
          return
        }

        const created = await campaignsApi.createCampaign(values, thumbnailFile)
        setCampaigns((prev) => [created, ...prev])
        toast.success('Campaign created successfully')
      }

      setIsFormOpen(false)
      form.reset()
      setThumbnailFile(null)
    } catch (error: any) {
      console.error('Submit campaign error:', error)
      console.error('Error response:', error.response?.data)

      // Handle validation errors with details
      if (error.response?.data?.error?.details) {
        const validationErrors = error.response.data.error.details
        const errorMessages = validationErrors
          .map((e: any) => `${e.path}: ${e.msg}`)
          .join(', ')
        toast.error(errorMessages)
      } else {
        const errorMessage =
          error.response?.data?.error?.message || 'Failed to save campaign'
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}
          </DialogTitle>
          <DialogDescription>
            {selectedCampaign
              ? 'Update the campaign details below.'
              : 'Fill in the details to create a new campaign.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Campaign title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Campaign description'
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='target_amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='1000000'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='DRAFT'>Draft</SelectItem>
                      <SelectItem value='ACTIVE'>Active</SelectItem>
                      <SelectItem value='COMPLETED'>Completed</SelectItem>
                      <SelectItem value='SUSPENDED'>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel>Thumbnail Image</FormLabel>
              <Input
                type='file'
                accept='image/jpeg,image/png,image/jpg'
                onChange={handleFileChange}
              />
              {selectedCampaign && !thumbnailFile && (
                <p className='text-muted-foreground text-sm'>
                  Leave empty to keep current thumbnail
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : selectedCampaign
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
