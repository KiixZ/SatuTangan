import { WithdrawalFormDialog } from './withdrawal-form-dialog';
import { useWithdrawals } from './withdrawals-provider';

interface WithdrawalsDialogsProps {
  onSuccess: () => void;
}

export function WithdrawalsDialogs({ onSuccess }: WithdrawalsDialogsProps) {
  const { isFormOpen, setIsFormOpen } = useWithdrawals();

  return (
    <>
      <WithdrawalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
