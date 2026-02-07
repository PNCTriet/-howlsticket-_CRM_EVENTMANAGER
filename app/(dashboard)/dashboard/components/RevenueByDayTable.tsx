"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardEventTimeRange } from "@/hooks/useDashboardEventTimeRange";
import { useEventSelector } from "@/providers/event-selector-provider";
import { useLocale } from "@/providers/locale-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { format, parseISO, subDays } from "date-fns";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "react-day-picker";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

const defaultRange: DateRange = {
  from: subDays(new Date(), 29),
  to: new Date(),
};

export function RevenueByDayTable() {
  const { selectedEventId } = useEventSelector();
  const { dateFnsLocale } = useLocale();
  const { t } = useDashboardTranslations();
  const [range, setRange] = useState<DateRange | undefined>(defaultRange);

  const fromStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const toStr = range?.to ? format(range.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const { data: timeData, isLoading } = useDashboardEventTimeRange(
    selectedEventId,
    fromStr || toStr,
    toStr
  );

  const rows = useMemo(
    () =>
      (timeData ?? [])
        .map((d) => ({
          date: d.time,
          label: format(parseISO(d.time), "dd/MM/yyyy", { locale: dateFnsLocale }),
          revenue: d.revenue ?? 0,
          ticketsSold: (d as { tickets_sold?: number }).tickets_sold ?? 0,
        }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [timeData, dateFnsLocale]
  );

  const total = useMemo(() => rows.reduce((s, r) => s + r.revenue, 0), [rows]);

  return (
    <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            {t("revenueByDay")}
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            {t("revenueByDayDesc")}
          </CardDescription>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">{t("noDataInRange")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  <th className="pb-2 font-medium">{t("day")}</th>
                  <th className="pb-2 font-medium text-right tabular-nums">{t("revenueCol")}</th>
                  <th className="pb-2 font-medium text-right tabular-nums">{t("ticketsSoldCol")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.date}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="py-2 text-zinc-900 dark:text-zinc-100">{r.label}</td>
                    <td className="py-2 text-right tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatVnd(r.revenue)}
                    </td>
                    <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                      {r.ticketsSold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 border-t border-zinc-200 pt-2 text-right text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
              {t("total")}: {formatVnd(total)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
