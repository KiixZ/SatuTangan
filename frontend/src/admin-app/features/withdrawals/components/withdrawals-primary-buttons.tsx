import { Button } from '@admin/components/ui/button';
import { Plus } from 'lucide-react';
import { useWithdrawals } from './withdrawals-provider';

export function WithdrawalsPrimaryButtons() {
  const { setIsFormOpen } = useWithdrawals();

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setIsFormOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        Create Withdrawal
      </Button>
    </div>
  );
}
