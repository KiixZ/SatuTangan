import { Plus } from 'lucide-react'
import { Button } from '@admin/components/ui/button'
import { useCategoriesContext } from './categories-provider'

export function CategoriesPrimaryButtons() {
  const { setIsCreateDialogOpen } = useCategoriesContext()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        Add Category
      </Button>
    </div>
  )
}
