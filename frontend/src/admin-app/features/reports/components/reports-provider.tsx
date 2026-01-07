import { createContext, useContext, useState, ReactNode } from 'react'
import { Report } from '../data/schema'

interface ReportsContextType {
  selectedReport: Report | null
  setSelectedReport: (report: Report | null) => void
  isReviewDialogOpen: boolean
  setIsReviewDialogOpen: (open: boolean) => void
  refreshTrigger: number
  triggerRefresh: () => void
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <ReportsContext.Provider
      value={{
        selectedReport,
        setSelectedReport,
        isReviewDialogOpen,
        setIsReviewDialogOpen,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return context
}
