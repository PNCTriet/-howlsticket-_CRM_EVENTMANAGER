"use client";

import { Search } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavUser } from "./NavUser";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex h-9 max-w-md flex-1 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          <Search className="mr-2 size-4 shrink-0 stroke-[1.5] text-zinc-400 dark:text-zinc-500" />
          <span>Tìm kiếm... (sắp có)</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NavUser />
      </div>
    </header>
  );
}
