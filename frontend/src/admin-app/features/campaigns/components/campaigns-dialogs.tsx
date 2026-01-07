import { CampaignFormDialog } from './campaign-form-dialog';
import { CampaignDeleteDialog } from './campaign-delete-dialog';
import { CampaignStatusDialog } from './campaign-status-dialog';

export function CampaignsDialogs() {
  return (
    <>
      <CampaignFormDialog />
      <CampaignDeleteDialog />
      <CampaignStatusDialog />
    </>
  );
}
