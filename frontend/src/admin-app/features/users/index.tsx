import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConfigDrawer } from "@admin/components/config-drawer";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";
import { User } from "./data/schema";
import { usersApi } from "./data/users-api";

console.log("re-evaluating users/index.tsx");
export function Users() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = {
    page: searchParams.get("page") || "1",
    per_page: searchParams.get("per_page") || "10",
    sort: searchParams.get("sort") || "createdAt.desc",
  };
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await usersApi.getUsers();
        // Map database fields to UI fields for backward compatibility
        const mappedUsers = response.data.map((user) => ({
          ...user,
          firstName: user.full_name?.split(" ")[0] || "",
          lastName: user.full_name?.split(" ").slice(1).join(" ") || "",
          username: user.account_no,
          phoneNumber: user.phone_number || "",
          status: (user.is_verified ? "active" : "inactive") as any,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <p>Loading users...</p>
          </div>
        ) : (
          <UsersTable data={users} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
