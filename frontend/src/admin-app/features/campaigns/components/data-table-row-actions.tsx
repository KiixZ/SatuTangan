import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@admin/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu';
import { useCampaigns } from './campaigns-provider';
import { Campaign } from '../data/schema';

interface DataTableRowActionsProps {
  row: Row<Campaign>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const campaign = row.original;
  const { setSelectedCampaign, setIsFormOpen, setIsDeleteOpen, setIsStatusOpen } = useCampaigns();

  const handleEdit = () => {
    setSelectedCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  const handleChangeStatus = () => {
    setSelectedCampaign(campaign);
    setIsStatusOpen(true);
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
        <DropdownMenuItem onClick={handleChangeStatus}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Change Status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
