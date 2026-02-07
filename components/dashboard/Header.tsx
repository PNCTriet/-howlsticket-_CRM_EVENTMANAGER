"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavUser } from "./NavUser";
import { ThemeToggle } from "./ThemeToggle";

const SEARCH_PLACEHOLDER = "Tìm kiếm... (sắp có)";

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchContent = (
    <div className="flex h-9 min-w-[200px] items-center rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <Search className="mr-2 size-4 shrink-0 stroke-[1.5] text-zinc-400 dark:text-zinc-500" />
      <input
        type="search"
        placeholder={SEARCH_PLACEHOLDER}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-400"
        autoFocus
      />
    </div>
  );

  return (
    <header className="flex h-14 min-w-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 sm:px-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="hidden h-9 max-w-md flex-1 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 md:flex dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          <Search className="mr-2 size-4 shrink-0 stroke-[1.5] text-zinc-400 dark:text-zinc-500" />
          <span>{SEARCH_PLACEHOLDER}</span>
        </div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Mở tìm kiếm"
            >
              <Search className="size-5 stroke-[1.5]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[calc(100vw-2rem)] max-w-sm border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {searchContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NavUser />
      </div>
    </header>
  );
}
