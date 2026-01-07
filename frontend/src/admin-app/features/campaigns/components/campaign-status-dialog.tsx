import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admin/components/ui/dialog';
import { Button } from '@admin/components/ui/button';
import { Label } from '@admin/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admin/components/ui/select';
import { Switch } from '@admin/components/ui/switch';
import { useCampaigns } from './campaigns-provider';
import { campaignsApi } from '../data/campaigns-api';

export function CampaignStatusDialog() {
  const { selectedCampaign, isStatusOpen, setIsStatusOpen, setCampaigns } = useCampaigns();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'>('DRAFT');
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    if (selectedCampaign) {
      setStatus(selectedCampaign.status);
      setIsEmergency(selectedCampaign.is_emergency);
    }
  }, [selectedCampaign]);

  const handleSubmit = async () => {
    if (!selectedCampaign) return;

    setIsSubmitting(true);
    try {
      // Update status if changed
      if (status !== selectedCampaign.status) {
        await campaignsApi.updateCampaignStatus(selectedCampaign.id, status);
      }

      // Update emergency flag if changed
      if (isEmergency !== selectedCampaign.is_emergency) {
        await campaignsApi.toggleEmergency(selectedCampaign.id, isEmergency);
      }

      // Fetch updated campaign
      const updated = await campaignsApi.getCampaignById(selectedCampaign.id);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      toast.success('Campaign status updated successfully');
      setIsStatusOpen(false);
    } catch (error: any) {
      console.error('Update status error:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Campaign Status</DialogTitle>
          <DialogDescription>
            Update the status and emergency flag for "{selectedCampaign?.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Campaign</Label>
              <p className="text-sm text-muted-foreground">
                Mark this campaign as emergency to prioritize it
              </p>
            </div>
            <Switch
              checked={isEmergency}
              onCheckedChange={setIsEmergency}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsStatusOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
