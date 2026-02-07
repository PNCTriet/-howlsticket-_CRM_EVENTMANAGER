"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventSelector } from "@/providers/event-selector-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { Calendar } from "lucide-react";

export function EventSelector() {
  const { t } = useDashboardTranslations();
  const {
    selectedEventId,
    setSelectedEventId,
    eventIds,
    eventTitles,
    isLoading,
  } = useEventSelector();

  if (isLoading) {
    return (
      <div className="h-9 w-32 animate-pulse rounded-md bg-zinc-200" />
    );
  }

  if (eventIds.length === 0) {
    return (
      <span className="text-sm text-zinc-500">
        {t("noEvents")}
      </span>
    );
  }

  return (
    <Select
      value={selectedEventId ?? ""}
      onValueChange={(v) => setSelectedEventId(v || null)}
    >
      <SelectTrigger className="w-[220px] border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <Calendar className="mr-2 size-4 stroke-[1.5] text-zinc-500 dark:text-zinc-400" />
        <SelectValue placeholder={t("selectEvent")} />
      </SelectTrigger>
      <SelectContent>
        {eventIds.map((id) => (
          <SelectItem key={id} value={id}>
            {eventTitles[id] ?? id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
