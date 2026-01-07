import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admin/components/ui/dialog';
import { Button } from '@admin/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@admin/components/ui/form';
import { Input } from '@admin/components/ui/input';
import { Textarea } from '@admin/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin/components/ui/select';
import { createWithdrawalSchema, CreateWithdrawalInput } from '../data/schema';
import { withdrawalsApi } from '../data/withdrawals-api';
import { campaignsApi } from '@admin/features/campaigns/data/campaigns-api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface WithdrawalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WithdrawalFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: WithdrawalFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignDetails, setCampaignDetails] = useState<any>(null);

  const form = useForm<CreateWithdrawalInput>({
    resolver: zodResolver(createWithdrawalSchema),
    defaultValues: {
      campaign_id: '',
      amount: 0,
      note: '',
    },
  });

  // Load campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const result = await campaignsApi.getAllCampaigns({
          status: 'ACTIVE',
          limit: 100,
        });
        setCampaigns(result.data);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        toast.error('Failed to load campaigns');
      }
    };

    if (open) {
      loadCampaigns();
    }
  }, [open]);

  // Load campaign details when selected
  useEffect(() => {
    const loadCampaignDetails = async () => {
      if (!selectedCampaign) return;

      try {
        const details = await withdrawalsApi.getCampaignWithdrawals(
          selectedCampaign.id
        );
        setCampaignDetails(details);
      } catch (error) {
        console.error('Failed to load campaign details:', error);
      }
    };

    loadCampaignDetails();
  }, [selectedCampaign]);

  const onSubmit = async (data: CreateWithdrawalInput) => {
    setIsLoading(true);
    try {
      await withdrawalsApi.createWithdrawal(data);
      toast.success('Withdrawal created successfully');
      form.reset();
      setSelectedCampaign(null);
      setCampaignDetails(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Create withdrawal error:', error);
      toast.error(
        error.response?.data?.error?.message || 'Failed to create withdrawal'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignChange = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    setSelectedCampaign(campaign);
    form.setValue('campaign_id', campaignId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Withdrawal</DialogTitle>
          <DialogDescription>
            Create a new withdrawal for a campaign. The withdrawal will be
            recorded and a campaign update will be automatically created.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='campaign_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <Select
                    onValueChange={handleCampaignChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a campaign' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedCampaign && campaignDetails && (
              <div className='rounded-lg border p-4 space-y-2 bg-muted/50'>
                <h4 className='font-semibold'>Campaign Details</h4>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Creator:</span>{' '}
                    {selectedCampaign.creator_name}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Email:</span>{' '}
                    {selectedCampaign.creator_email}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Bank:</span>{' '}
                    {campaignDetails.withdrawals[0]?.bank_name || 'N/A'}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Account:</span>{' '}
                    {campaignDetails.withdrawals[0]?.account_number || 'N/A'}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>
                      Collected Amount:
                    </span>{' '}
                    Rp {selectedCampaign.collected_amount?.toLocaleString('id-ID')}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>
                      Total Withdrawn:
                    </span>{' '}
                    Rp {campaignDetails.total_withdrawn?.toLocaleString('id-ID')}
                  </div>
                  <div className='col-span-2'>
                    <span className='text-muted-foreground'>
                      Available Amount:
                    </span>{' '}
                    <span className='font-semibold text-green-600'>
                      Rp {campaignDetails.available_amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter withdrawal amount'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter any notes about this withdrawal'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Create Withdrawal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
