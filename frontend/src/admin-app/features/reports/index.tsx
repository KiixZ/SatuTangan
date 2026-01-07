import { ConfigDrawer } from "@admin/components/config-drawer";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { ReportsDialogs } from "./components/reports-dialogs";
import { ReportsProvider } from "./components/reports-provider";
import { ReportsTable } from "./components/reports-table";

export default function ReportsPage() {
  return (
    <ReportsProvider>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">
                Review and manage campaign reports
              </p>
            </div>
          </div>
          <ReportsTable />
          <ReportsDialogs />
        </div>
      </Main>
    </ReportsProvider>
  );
}
