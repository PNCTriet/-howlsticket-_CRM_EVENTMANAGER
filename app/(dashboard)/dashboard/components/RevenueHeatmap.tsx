"use client";

import { useMemo } from "react";
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
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import {
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  getDay,
  isToday,
} from "date-fns";
import { useLocale } from "@/providers/locale-provider";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

export function RevenueHeatmap() {
  const { t } = useDashboardTranslations();
  const { locale, dateFnsLocale } = useLocale();
  const { selectedEventId } = useEventSelector();

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const fromStr = format(monthStart, "yyyy-MM-dd");
  const toStr = format(monthEnd, "yyyy-MM-dd");

  const { data: timeData, isLoading } = useDashboardEventTimeRange(
    selectedEventId,
    fromStr,
    toStr
  );

  const { revenueByDay, avgRevenue } = useMemo(() => {
    const list = timeData ?? [];
    const map = new Map<string, number>();
    let total = 0;
    for (const d of list) {
      const key = d.time.slice(0, 10);
      const r = (d.revenue ?? 0) as number;
      map.set(key, r);
      total += r;
    }
    const count = map.size || 1;
    const avg = total / count;
    return { revenueByDay: map, avgRevenue: avg || 1 };
  }, [timeData]);

  const weeks = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekStart = getDay(monthStart);
    const padding = weekStart;
    const rows: (Date | null)[][] = [];
    let current: (Date | null)[] = [];
    for (let i = 0; i < padding; i++) current.push(null);
    for (const d of days) {
      current.push(d);
      if (current.length === 7) {
        rows.push(current);
        current = [];
      }
    }
    if (current.length) {
      while (current.length < 7) current.push(null);
      rows.push(current);
    }
    return rows;
  }, [monthStart, monthEnd]);

  const getIntensity = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const r = revenueByDay.get(key) ?? 0;
    if (avgRevenue <= 0) return 0;
    return Math.min(1, r / avgRevenue);
  };

  if (isLoading) {
    return (
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            {t("revenueHeatmap")}
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            {t("revenueHeatmapDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const weekDayLabels =
    locale === "vi"
      ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          {t("revenueHeatmap")}
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          {t("revenueHeatmapDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {format(monthStart, "MMMM yyyy", { locale: dateFnsLocale })}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr>
                {weekDayLabels.map((label) => (
                  <th
                    key={label}
                    className="border border-zinc-200 px-1 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((row, ri) => (
                <tr key={ri}>
                  {row.map((date, ci) => {
                    if (!date) {
                      return (
                        <td
                          key={ci}
                          className="border border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-800/30"
                        />
                      );
                    }
                    const key = format(date, "yyyy-MM-dd");
                    const revenue = revenueByDay.get(key) ?? 0;
                    const intensity = getIntensity(date);
                    const today = isToday(date);
                    const opacity = 0.15 + intensity * 0.85;
                    return (
                      <td
                        key={key}
                        className="border border-zinc-200 px-1 py-1 dark:border-zinc-700"
                        style={{
                          backgroundColor: `rgb(16 185 129 / ${opacity})`,
                        }}
                        title={formatVnd(revenue)}
                      >
                        <div
                          className={
                            today
                              ? "mx-auto flex size-6 items-center justify-center rounded-full ring-2 ring-emerald-500 font-semibold text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-900 dark:text-zinc-100"
                          }
                        >
                          {format(date, "d")}
                        </div>
                        <div className="mt-0.5 truncate text-[10px] text-zinc-600 dark:text-zinc-400">
                          {revenue > 0
                            ? formatVnd(revenue).replace(/\s*₫$/, "")
                            : "—"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
