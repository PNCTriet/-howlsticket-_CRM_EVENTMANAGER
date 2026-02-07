"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardEventStats } from "@/hooks/useDashboardEventStats";
import { useCheckinRealtime } from "@/hooks/useCheckinRealtime";
import { useEventTickets } from "@/hooks/useEventTickets";
import { useDashboardEventTimeRange } from "@/hooks/useDashboardEventTimeRange";
import { useEventSelector } from "@/providers/event-selector-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { DollarSign, Ticket, QrCode } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format, subDays } from "date-fns";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

function parseRevenue(v: string | number | undefined): number | undefined {
  if (v == null) return undefined;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Màu rõ trên cả nền sáng và tối (không dùng đen/tối) – RULES: Emerald, Amber, Rose, Violet */
const CHART_COLORS = [
  "rgb(16 185 129)",
  "rgb(245 158 11)",
  "rgb(244 63 94)",
  "rgb(99 102 241)",
  "rgb(14 165 233)",
];

function TicketPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { totalQty?: number; percent?: number } }> }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const totalQty = p.payload?.totalQty ?? p.value;
  const percent = p.payload?.percent ?? 0;
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-md"
      style={{
        backgroundColor: isDark ? "rgb(24 24 27)" : "rgb(255 255 255)",
        borderColor: isDark ? "rgb(63 63 70)" : "rgb(228 228 231)",
        color: isDark ? "rgb(250 250 250)" : "rgb(24 24 27)",
      }}
    >
      <p className="text-xs font-medium">{p.name}</p>
      <p className="text-sm font-semibold tabular-nums">
        {p.value}/{totalQty} ({percent}%)
      </p>
    </div>
  );
}

export function StatsCards() {
  const { t } = useDashboardTranslations();
  const { selectedEventId } = useEventSelector();
  const { data: stats, isLoading: statsLoading } =
    useDashboardEventStats(selectedEventId);
  const { data: checkin, isLoading: checkinLoading } =
    useCheckinRealtime(selectedEventId);
  const { data: eventTickets, isLoading: ticketsLoading } =
    useEventTickets(selectedEventId);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const { data: timeRangeData } = useDashboardEventTimeRange(
    selectedEventId,
    yesterdayStr,
    todayStr
  );

  const { revenueToday: todayRevenue, revenueYesterday: yesterdayRevenue, percentChange } = useMemo(() => {
    const list = timeRangeData ?? [];
    const today = list.find((d) => d.time.startsWith(todayStr));
    const yesterday = list.find((d) => d.time.startsWith(yesterdayStr));
    const revToday = (today?.revenue ?? 0) as number;
    const revYesterday = (yesterday?.revenue ?? 0) as number;
    let change: number | null = null;
    if (revYesterday > 0) {
      change = Math.round(((revToday - revYesterday) / revYesterday) * 100);
    } else if (revToday > 0) change = 100;
    return {
      revenueToday: revToday,
      revenueYesterday: revYesterday,
      percentChange: change,
    };
  }, [timeRangeData, todayStr, yesterdayStr]);

  const revenue = useMemo(
    () =>
      parseRevenue(stats?.total_revenue) ??
      (stats?.totalRevenue ?? stats?.revenue) as number | undefined,
    [stats?.total_revenue, stats?.totalRevenue, stats?.revenue]
  );
  const ticketsSold = useMemo(
    () =>
      (stats?.total_tickets_sold ??
        stats?.ticketsSold ??
        stats?.totalTicketsSold ??
        stats?.tickets_sold) as number | undefined,
    [stats?.total_tickets_sold, stats?.ticketsSold, stats?.totalTicketsSold, stats?.tickets_sold]
  );
  const checkedIn =
    (stats?.total_checkins ??
      checkin?.totalCheckedIn ??
      checkin?.checkedIn ??
      checkin?.count) as number | undefined;

  const ticketPieData = useMemo(() => {
    const list = eventTickets ?? [];
    const totalSold = list.reduce((s, t) => s + (t.sold_qty ?? 0), 0);
    const totalQty = list.reduce((s, t) => s + (t.total_qty ?? 0), 0);
    if (totalSold === 0 && totalQty === 0) return { data: [], totalSold: 0, totalQty: 0 };
    return {
      data: list.map((t, i) => ({
        name: t.name || `Loại ${i + 1}`,
        value: t.sold_qty ?? 0,
        totalQty: t.total_qty ?? 0,
        percent: totalSold > 0 ? Math.round(((t.sold_qty ?? 0) / totalSold) * 100) : 0,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      })),
      totalSold,
      totalQty,
    };
  }, [eventTickets]);

  const ticketList = ticketPieData.data;
  const totalSoldDisplay = ticketsSold ?? ticketPieData.totalSold;
  const totalCapacityDisplay = ticketPieData.totalQty;

  const loading = statsLoading || (!!selectedEventId && checkinLoading);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <p className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <DollarSign className="size-4 stroke-[1.5]" />
            {t("revenue")}
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {revenue != null ? formatVnd(revenue) : "—"}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {t("revenueToday")}: {formatVnd(todayRevenue)}
                </span>
                {percentChange != null && (
                  <span
                    className={
                      percentChange >= 0
                        ? "font-medium text-emerald-600 dark:text-emerald-400"
                        : "font-medium text-rose-600 dark:text-rose-400"
                    }
                  >
                    {percentChange >= 0 ? "+" : ""}
                    {percentChange}% {t("vsYesterday")}
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <p className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <Ticket className="size-4 stroke-[1.5]" />
            {t("ticketsSold")}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading || ticketsLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {totalSoldDisplay != null && totalSoldDisplay > 0 ? totalSoldDisplay : "—"}
                </p>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  vé
                  {totalCapacityDisplay != null && totalCapacityDisplay > 0 && (
                    <span className="ml-1">
                      / {totalCapacityDisplay} {t("ticketsTotal")}
                    </span>
                  )}
                </span>
              </div>
              {ticketList.length > 0 && (
                <div className="flex flex-col items-center gap-3">
                  <div className="mx-auto h-[100px] w-[120px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketList}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={44}
                          paddingAngle={1}
                          stroke="transparent"
                        >
                          {ticketList.map((e, i) => (
                            <Cell key={i} fill={e.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<TicketPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="w-full space-y-1 text-xs">
                    {ticketList.map((e, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded px-1.5 py-0.5 text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: e.fill }}
                        />
                        <span className="truncate">{e.name}</span>
                        <span className="ml-auto shrink-0 tabular-nums">
                          {e.value}/{e.totalQty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <p className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <QrCode className="size-4 stroke-[1.5]" />
            {t("checkinRealtime")}
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {checkedIn != null ? checkedIn : "—"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
