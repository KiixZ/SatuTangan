import React, { createContext, useContext, useState } from 'react'
import { Category } from '../data/schema'

interface CategoriesContextType {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  editingCategory: Category | null
  setEditingCategory: (category: Category | null) => void
  deletingCategory: Category | null
  setDeletingCategory: (category: Category | null) => void
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function useCategoriesContext() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategoriesContext must be used within CategoriesProvider')
  }
  return context
}

interface CategoriesProviderProps {
  children: React.ReactNode
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  return (
    <CategoriesContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        editingCategory,
        setEditingCategory,
        deletingCategory,
        setDeletingCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
