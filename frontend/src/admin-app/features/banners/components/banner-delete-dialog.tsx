import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { useBanners } from './banners-provider';
import { bannersApi } from '../data/banners-api';
import { toast } from 'sonner';

export function BannerDeleteDialog() {
  const { selectedBanner, isDeleteOpen, setIsDeleteOpen, setBanners } = useBanners();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedBanner) return;

    setIsDeleting(true);

    try {
      await bannersApi.deleteBanner(selectedBanner.id);
      setBanners((prev) => prev.filter((b) => b.id !== selectedBanner.id));
      toast.success('Banner deleted successfully');
      setIsDeleteOpen(false);
    } catch (error: any) {
      console.error('Delete banner error:', error);
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to delete banner';
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
            This will permanently delete the banner "{selectedBanner?.title}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
