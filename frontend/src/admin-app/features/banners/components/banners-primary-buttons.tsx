import { Plus } from 'lucide-react';
import { Button } from '@admin/components/ui/button';
import { useBanners } from './banners-provider';

export function BannersPrimaryButtons() {
  const { setSelectedBanner, setIsFormOpen } = useBanners();

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="mr-2 h-4 w-4" />
      Add Banner
    </Button>
  );
}
