"use client";

import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/providers/locale-provider";
import type { AppLocale } from "@/providers/locale-provider";

const OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as AppLocale)}>
      <SelectTrigger
        className="h-9 w-[140px] border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Chọn ngôn ngữ"
      >
        <Languages className="mr-2 size-4 shrink-0 stroke-[1.5] text-zinc-500 dark:text-zinc-400" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
