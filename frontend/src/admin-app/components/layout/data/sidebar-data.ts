import {
  LayoutDashboard,
  Monitor,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  Command,
  FolderTree,
  Heart,
  Image,
  UserCheck,
  Wallet,
  Flag,
  FileText,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Donation Campaign",
      logo: Command,
      plan: "Admin Panel",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Campaigns",
          url: "/admin/campaigns",
          icon: Heart,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: FolderTree,
        },
        {
          title: "Banners",
          url: "/admin/banners",
          icon: Image,
        },
        {
          title: "Verifications",
          url: "/admin/verifications",
          icon: UserCheck,
        },
        {
          title: "Withdrawals",
          url: "/admin/withdrawals",
          icon: Wallet,
        },
        {
          title: "Reports",
          url: "/admin/reports",
          icon: Flag,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/admin/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/admin/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/admin/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/admin/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/admin/settings/display",
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
};
