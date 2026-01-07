import { createContext, useContext, useState, ReactNode } from 'react';

interface WithdrawalsContextType {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const WithdrawalsContext = createContext<WithdrawalsContextType | undefined>(
  undefined
);

export function WithdrawalsProvider({ children }: { children: ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <WithdrawalsContext.Provider
      value={{
        isFormOpen,
        setIsFormOpen,
      }}
    >
      {children}
    </WithdrawalsContext.Provider>
  );
}

export function useWithdrawals() {
  const context = useContext(WithdrawalsContext);
  if (context === undefined) {
    throw new Error('useWithdrawals must be used within a WithdrawalsProvider');
  }
  return context;
}
