import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@admin/components/data-table'
import { categoriesApi } from '../data/categories-api'
import { categoriesColumns } from './categories-columns'

export function CategoriesTable() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const result = await categoriesApi.getAll()
        console.log('Categories API result:', result)
        return result
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        throw err
      }
    },
  })

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-destructive'>
          Failed to load categories. Please try again.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  const tableData = Array.isArray(categories) ? categories : []

  return (
    <DataTable
      data={tableData}
      columns={categoriesColumns}
      filterColumn='name'
      filterPlaceholder='Filter by name...'
    />
  )
}
