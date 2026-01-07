import React, { createContext, useContext, useState } from 'react';
import { Banner } from '../data/schema';

interface BannersContextType {
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBanner: Banner | null;
  setSelectedBanner: React.Dispatch<React.SetStateAction<Banner | null>>;
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshBanners: () => Promise<void>;
}

const BannersContext = createContext<BannersContextType | undefined>(undefined);

export function BannersProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const refreshBanners = async () => {
    // This will be called from the table component
  };

  return (
    <BannersContext.Provider
      value={{
        banners,
        setBanners,
        isLoading,
        setIsLoading,
        selectedBanner,
        setSelectedBanner,
        isFormOpen,
        setIsFormOpen,
        isDeleteOpen,
        setIsDeleteOpen,
        refreshBanners,
      }}
    >
      {children}
    </BannersContext.Provider>
  );
}

export function useBanners() {
  const context = useContext(BannersContext);
  if (!context) {
    throw new Error('useBanners must be used within BannersProvider');
  }
  return context;
}
