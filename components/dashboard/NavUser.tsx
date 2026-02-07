"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export function NavUser() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200" />
    );
  }

  const initials =
    ([user.first_name, user.last_name]
      .filter(Boolean)
      .map((s) => (s as string)[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || user.email[0]?.toUpperCase()) ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full focus-visible:ring-0"
        >
          <Avatar className="h-9 w-9 border border-zinc-200">
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.email} />
            <AvatarFallback className="bg-zinc-100 text-zinc-700 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-zinc-200 bg-white"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-zinc-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-zinc-700"
          onSelect={(e) => e.preventDefault()}
          asChild
        >
          <span className="flex items-center gap-2">
            <User className="size-4 stroke-[1.5]" />
            Profile (sắp có)
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-rose-600 focus:text-rose-600"
          onSelect={() => logout()}
        >
          <LogOut className="mr-2 size-4 stroke-[1.5]" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
