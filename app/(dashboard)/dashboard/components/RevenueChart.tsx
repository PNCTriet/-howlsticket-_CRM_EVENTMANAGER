"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TooltipProps } from "recharts";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "react-day-picker";

function ChartTooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  if (!active || !payload?.length || label == null) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-md"
      style={{
        backgroundColor: isDark ? "rgb(24 24 27)" : "rgb(255 255 255)",
        borderColor: isDark ? "rgb(63 63 70)" : "rgb(228 228 231)",
        color: isDark ? "rgb(250 250 250)" : "rgb(24 24 27)",
      }}
    >
      <p className="text-xs font-medium opacity-90">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold tabular-nums">
          {formatVnd(Number(p.value ?? 0))}
        </p>
      ))}
    </div>
  );
}

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

export function RevenueChart() {
  const { selectedEventId } = useEventSelector();
  const [range, setRange] = useState<DateRange | undefined>(defaultRange);

  const fromStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const toStr = range?.to ? format(range.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const { data: timeData, isLoading } = useDashboardEventTimeRange(
    selectedEventId,
    fromStr || toStr,
    toStr
  );

  const { dateFnsLocale } = useLocale();
  const { t } = useDashboardTranslations();

  const chartData = useMemo(
    () =>
      (timeData ?? []).map((d) => ({
        date: d.time,
        label: format(parseISO(d.time), "d/M", { locale: dateFnsLocale }),
        revenue: d.revenue ?? 0,
      })),
    [timeData, dateFnsLocale]
  );

  return (
    <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            {t("revenueOverTime")}
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            {t("filterByTimeOrRange")}
          </CardDescription>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">{t("noDataInRange")}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`)}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.1)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
