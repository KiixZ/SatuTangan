import { useState } from "react";
import { ConfigDrawer } from "@admin/components/config-drawer";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { WithdrawalsDialogs } from "./components/withdrawals-dialogs";
import { WithdrawalsPrimaryButtons } from "./components/withdrawals-primary-buttons";
import { WithdrawalsProvider } from "./components/withdrawals-provider";
import { WithdrawalsTable } from "./components/withdrawals-table";

export default function WithdrawalsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <WithdrawalsProvider>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
              <p className="text-muted-foreground">
                Manage campaign fund withdrawals
              </p>
            </div>
            <WithdrawalsPrimaryButtons />
          </div>

          <WithdrawalsTable key={refreshKey} />
          <WithdrawalsDialogs onSuccess={handleSuccess} />
        </div>
      </Main>
    </WithdrawalsProvider>
  );
}
