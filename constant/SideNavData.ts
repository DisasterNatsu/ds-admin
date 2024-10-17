import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdOutlineLibraryBooks,
  MdAccountBalance,
  MdOutlineBugReport,
  MdSearch,
  MdOutlineSettings,
  MdOutlineTipsAndUpdates,
  MdRepeatOn,
  MdMessage,
} from "react-icons/md";

export const SideNavData = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    title: "Comics",
    link: "/comics",
    icon: MdOutlineLibraryBooks,
  },
  {
    title: "New Comic",
    link: "/new-comic",
    icon: MdAccountBalance,
    gap: true,
  },
  {
    title: "Message",
    link: "/message",
    icon: MdMessage,
  },
  {
    title: "Search",
    link: "/search",
    icon: MdSearch,
    gap: true,
  },
  {
    title: "Settings",
    link: "/settings",
    icon: MdOutlineSettings,
  },
];
