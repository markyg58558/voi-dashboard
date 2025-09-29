import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users2, UserCog, BadgeDollarSign, MessagesSquare, Mail, Settings
} from "lucide-react";
import type { RoleName } from "@/contexts/RoleContext";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: RoleName[]; // if omitted => visible to all
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, // all
  { href: "/leads",     label: "Leads",     icon: Users2,           roles: ["admin","reception"] },
  { href: "/clients",   label: "Clients",   icon: Users2,           roles: ["admin","reception","artist"] },
  { href: "/artists",   label: "Artists",   icon: UserCog,          roles: ["admin"] },
  { href: "/sales",     label: "Sales",     icon: BadgeDollarSign,  roles: ["admin"] }, // change if reception should see
  { href: "/messages",  label: "Messages",  icon: MessagesSquare,   roles: ["admin","reception"] },
  { href: "/emails",    label: "Emails",    icon: Mail,             roles: ["admin","reception"] },
  { href: "/settings",  label: "Settings",  icon: Settings,         roles: ["admin"] },
];
