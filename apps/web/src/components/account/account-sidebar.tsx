"use client";

import Link from "next/link";
import {
  CreditCard,
  Download,
  LayoutDashboard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountSection = "overview" | "profile" | "billing";

const navItems: {
  id: AccountSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile & security", icon: User },
  { id: "billing", label: "Plan & billing", icon: CreditCard },
];

interface AccountSidebarProps {
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
}

export function AccountSidebar({ active, onNavigate }: AccountSidebarProps) {
  return (
    <aside className="lg:w-56 lg:shrink-0">
      <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-400/10 text-amber-200"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}

        <Link
          href="/downloads"
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
        >
          <Download className="h-4 w-4 shrink-0" />
          My downloads
        </Link>
      </nav>
    </aside>
  );
}
