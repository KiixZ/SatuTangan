import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { Textarea } from '@admin/components/ui/textarea'
import { Button } from '@admin/components/ui/button'
import { categoriesApi } from '../data/categories-api'
import { createCategorySchema, updateCategorySchema, Category } from '../data/schema'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const queryClient = useQueryClient()
  const isEditing = !!category

  const form = useForm({
    resolver: zodResolver(isEditing ? updateCategorySchema : createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon_url: '',
      sdgs_ref: '',
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        icon_url: category.icon_url || '',
        sdgs_ref: category.sdgs_ref || '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        icon_url: '',
        sdgs_ref: '',
      })
    }
  }, [category, form])

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create category')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update category')
    },
  })

  const onSubmit = (data: any) => {
    // Remove empty strings
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    )

    if (isEditing && category) {
      updateMutation.mutate({ id: category.id, data: cleanData })
    } else {
      createMutation.mutate(cleanData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the category information below.'
              : 'Add a new category to organize campaigns.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Category name' {...field} />
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
                      placeholder='Category description'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='icon_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input placeholder='https://example.com/icon.png' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sdgs_ref'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SDGs Reference</FormLabel>
                  <FormControl>
                    <Input placeholder='SDG 1, SDG 2, etc.' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEditing
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
