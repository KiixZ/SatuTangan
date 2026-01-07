import { ConfigDrawer } from "@admin/components/config-drawer";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { CategoriesDialogs } from "./components/categories-dialogs";
import { CategoriesPrimaryButtons } from "./components/categories-primary-buttons";
import { CategoriesProvider } from "./components/categories-provider";
import { CategoriesTable } from "./components/categories-table";

export function Categories() {
  return (
    <CategoriesProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Manage campaign categories and SDGs references.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesTable />
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  );
}
