import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@admin/components/ui/alert-dialog';
import { useCampaigns } from './campaigns-provider';
import { campaignsApi } from '../data/campaigns-api';

export function CampaignDeleteDialog() {
  const { selectedCampaign, isDeleteOpen, setIsDeleteOpen, setCampaigns } = useCampaigns();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    setIsDeleting(true);
    try {
      await campaignsApi.deleteCampaign(selectedCampaign.id);
      setCampaigns((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
      toast.success('Campaign deleted successfully');
      setIsDeleteOpen(false);
    } catch (error: any) {
      console.error('Delete campaign error:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to delete campaign';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the campaign "{selectedCampaign?.title}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
