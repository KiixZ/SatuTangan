import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@admin/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu';
import { Banner } from '../data/schema';
import { useBanners } from './banners-provider';
import { bannersApi } from '../data/banners-api';
import { toast } from 'sonner';

interface DataTableRowActionsProps {
  row: Row<Banner>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const banner = row.original;
  const { setSelectedBanner, setIsFormOpen, setIsDeleteOpen, setBanners } = useBanners();

  const handleEdit = () => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = async () => {
    try {
      await bannersApi.toggleBannerStatus(banner.id);
      
      // Update local state
      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? { ...b, is_active: !b.is_active } : b
        )
      );

      toast.success(
        `Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`
      );
    } catch (error) {
      console.error('Toggle banner status error:', error);
      toast.error('Failed to toggle banner status');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus}>
          {banner.is_active ? (
            <>
              <ToggleLeft className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <ToggleRight className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
