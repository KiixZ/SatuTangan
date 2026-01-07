import React, { createContext, useContext, useState } from 'react'
import { Campaign } from '../data/schema'

interface CampaignsContextType {
  campaigns: Campaign[]
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedCampaign: Campaign | null
  setSelectedCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>
  isFormOpen: boolean
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDeleteOpen: boolean
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  isStatusOpen: boolean
  setIsStatusOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshCampaigns: () => Promise<void>
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(
  undefined
)

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const refreshCampaigns = async () => {
    // This will be called from the table component
  }

  return (
    <CampaignsContext.Provider
      value={{
        campaigns,
        setCampaigns,
        isLoading,
        setIsLoading,
        selectedCampaign,
        setSelectedCampaign,
        isFormOpen,
        setIsFormOpen,
        isDeleteOpen,
        setIsDeleteOpen,
        isStatusOpen,
        setIsStatusOpen,
        refreshCampaigns,
      }}
    >
      {children}
    </CampaignsContext.Provider>
  )
}

export function useCampaigns() {
  const context = useContext(CampaignsContext)
  if (!context) {
    console.error('useCampaigns called outside CampaignsProvider!')
    return {
      campaigns: [],
      setCampaigns: () => {},
      isLoading: false,
      setIsLoading: () => {},
      selectedCampaign: null,
      setSelectedCampaign: () => {},
      isFormOpen: false,
      setIsFormOpen: () => {},
      isDeleteOpen: false,
      setIsDeleteOpen: () => {},
      isStatusOpen: false,
      setIsStatusOpen: () => {},
      refreshCampaigns: async () => {},
    }
  }
  return context
}
