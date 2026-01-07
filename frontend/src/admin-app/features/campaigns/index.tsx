import { ConfigDrawer } from "@admin/components/config-drawer";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { CampaignsDialogs } from "./components/campaigns-dialogs";
import { CampaignsPrimaryButtons } from "./components/campaigns-primary-buttons";
import { CampaignsProvider } from "./components/campaigns-provider";
import { CampaignsTable } from "./components/campaigns-table-new";

export default function CampaignsPage() {
  return (
    <CampaignsProvider>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage donation campaigns and their status
            </p>
          </div>
          <CampaignsPrimaryButtons />
        </div>

        <CampaignsTable />
        <CampaignsDialogs />
      </Main>
    </CampaignsProvider>
  );
}
