"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PRESET_KEYS = ["7d", "30d", "90d"] as const;
const PRESET_LABELS: Record<"vi" | "en", Record<(typeof PRESET_KEYS)[number], string>> = {
  vi: { "7d": "7 ngày qua", "30d": "30 ngày qua", "90d": "90 ngày qua" },
  en: { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" },
};
export const PRESETS = [
  { key: "7d" as const, getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { key: "30d" as const, getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { key: "90d" as const, getValue: () => ({ from: subDays(new Date(), 89), to: new Date() }) },
];

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

const PLACEHOLDER = { vi: "Chọn khoảng ngày", en: "Select date range" };

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const { locale, dateFnsLocale } = useLocale();

  const label =
    value?.from && value?.to
      ? `${format(value.from, "dd/MM/yyyy", { locale: dateFnsLocale })} – ${format(value.to, "dd/MM/yyyy", { locale: dateFnsLocale })}`
      : PLACEHOLDER[locale];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start border-zinc-200 text-left font-normal dark:border-zinc-700",
            !value?.from && "text-zinc-500 dark:text-zinc-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4 stroke-[1.5]" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-zinc-200 bg-white p-0 shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        align="start"
      >
        <div className="flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
          {PRESETS.map((preset) => (
            <Button
              key={preset.key}
              variant="ghost"
              size="sm"
              className="justify-start text-zinc-700 dark:text-zinc-300"
              onClick={() => {
                const range = preset.getValue();
                onChange({ from: range.from, to: range.to });
                setOpen(false);
              }}
            >
              {PRESET_LABELS[locale][preset.key]}
            </Button>
          ))}
        </div>
        <div className="bg-white p-2 dark:bg-zinc-900">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(range) => {
              onChange(range);
              if (range?.from && range?.to) setOpen(false);
            }}
            numberOfMonths={1}
            locale={dateFnsLocale}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
