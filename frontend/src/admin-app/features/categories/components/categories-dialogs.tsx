import { useCategoriesContext } from './categories-provider'
import { CategoryFormDialog } from './category-form-dialog'
import { CategoryDeleteDialog } from './category-delete-dialog'

export function CategoriesDialogs() {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
  } = useCategoriesContext()

  return (
    <>
      <CategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <CategoryFormDialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        category={editingCategory}
      />
      <CategoryDeleteDialog
        category={deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      />
    </>
  )
}
