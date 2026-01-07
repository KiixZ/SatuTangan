import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { categoriesApi } from '../data/categories-api'
import { Category } from '../data/schema'

interface CategoryDeleteDialogProps {
  category: Category | null
  onOpenChange: (open: boolean) => void
}

export function CategoryDeleteDialog({
  category,
  onOpenChange,
}: CategoryDeleteDialogProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
      onOpenChange(false)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message
      if (errorMessage?.includes('being used by campaigns')) {
        toast.error('Cannot delete category that is being used by campaigns')
      } else {
        toast.error(errorMessage || 'Failed to delete category')
      }
    },
  })

  const handleDelete = () => {
    if (category) {
      deleteMutation.mutate(category.id)
    }
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the category "{category?.name}".
            {' '}This action cannot be undone.
            {' '}Note: You cannot delete a category that is being used by campaigns.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
