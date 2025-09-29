import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users2,
  UserCog,
  BadgeDollarSign,
  MessagesSquare,
  Mail,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users2 },
  { href: "/clients", label: "Clients", icon: Users2 },
  { href: "/artists", label: "Artists", icon: UserCog },
  { href: "/sales", label: "Sales", icon: BadgeDollarSign },
  { href: "/messages", label: "Messages", icon: MessagesSquare },
  { href: "/emails", label: "Emails", icon: Mail },
];
