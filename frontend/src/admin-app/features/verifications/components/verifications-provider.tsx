import { createContext, useContext, useState, ReactNode } from 'react'
import { Verification } from '../data/schema'

interface VerificationsContextType {
  verifications: Verification[]
  setVerifications: (verifications: Verification[]) => void
  selectedVerification: Verification | null
  setSelectedVerification: (verification: Verification | null) => void
  isReviewDialogOpen: boolean
  setIsReviewDialogOpen: (open: boolean) => void
  refreshVerifications: () => void
  refreshTrigger: number
}

const VerificationsContext = createContext<VerificationsContextType | undefined>(undefined)

export function VerificationsProvider({ children }: { children: ReactNode }) {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshVerifications = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <VerificationsContext.Provider
      value={{
        verifications,
        setVerifications,
        selectedVerification,
        setSelectedVerification,
        isReviewDialogOpen,
        setIsReviewDialogOpen,
        refreshVerifications,
        refreshTrigger,
      }}
    >
      {children}
    </VerificationsContext.Provider>
  )
}

export function useVerifications() {
  const context = useContext(VerificationsContext)
  if (context === undefined) {
    throw new Error('useVerifications must be used within a VerificationsProvider')
  }
  return context
}
