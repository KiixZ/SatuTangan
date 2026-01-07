import { Plus } from 'lucide-react';
import { Button } from '@admin/components/ui/button';
import { useCampaigns } from './campaigns-provider';

export function CampaignsPrimaryButtons() {
  const { setSelectedCampaign, setIsFormOpen } = useCampaigns();

  const handleCreate = () => {
    setSelectedCampaign(null);
    setIsFormOpen(true);
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="mr-2 h-4 w-4" />
      Create Campaign
    </Button>
  );
}
