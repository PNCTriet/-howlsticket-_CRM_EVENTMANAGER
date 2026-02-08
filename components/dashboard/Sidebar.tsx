"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Ticket,
  Megaphone,
  QrCode,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOCKED_MESSAGE =
  "Cuốn bận đi bán đồ in3D mưu sinh rồi...";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, locked: false },
  { href: "/orders", label: "Đơn hàng", icon: Ticket, locked: true },
  { href: "/marketing", label: "Marketing", icon: Megaphone, locked: true },
  { href: "/checkin", label: "Check-in", icon: QrCode, locked: true },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-zinc-200 bg-white transition-[width] duration-200 dark:border-zinc-800 dark:bg-zinc-900",
        collapsed ? "w-[4.5rem]" : "w-56"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
        {!collapsed && (
          <Link href="/dashboard" className="font-semibold text-zinc-900 dark:text-zinc-100">
            Howlsticket Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0 text-zinc-500 hover:text-zinc-900"
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="size-5 stroke-[1.5]" />
          ) : (
            <PanelLeftClose className="size-5 stroke-[1.5]" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map(({ href, label, icon: Icon, locked }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          const style = cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
            collapsed && "justify-center px-2"
          );
          if (locked) {
            return (
              <button
                key={href}
                type="button"
                onClick={() => toast.info(LOCKED_MESSAGE)}
                className={style}
              >
                <Icon className="size-5 shrink-0 stroke-[1.5]" />
                {!collapsed && <span>{label}</span>}
              </button>
            );
          }
          return (
            <Link key={href} href={href}>
              <span className={style}>
                <Icon className="size-5 shrink-0 stroke-[1.5]" />
                {!collapsed && <span>{label}</span>}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
