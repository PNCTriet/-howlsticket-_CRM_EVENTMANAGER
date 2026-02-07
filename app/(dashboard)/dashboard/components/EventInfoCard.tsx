"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvent } from "@/hooks/useEvent";
import { useOrganization } from "@/hooks/useOrganization";
import { useDashboardEventStats } from "@/hooks/useDashboardEventStats";
import { useEventTickets } from "@/hooks/useEventTickets";
import { useEventSelector } from "@/providers/event-selector-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { useLocale } from "@/providers/locale-provider";
import { Calendar, Target } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

function parseRevenue(v: string | number | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function EventInfoCard() {
  const { t } = useDashboardTranslations();
  const { locale } = useLocale();
  const { selectedEventId } = useEventSelector();
  const { data: event, isLoading: eventLoading } = useEvent(selectedEventId);
  const { data: org } = useOrganization(event?.organization_id ?? null);
  const { data: stats } = useDashboardEventStats(selectedEventId);
  const { data: tickets = [] } = useEventTickets(selectedEventId);

  const avatarUrl =
    (org?.avatar_url ?? org?.image_url ?? org?.logo_url) ||
    (event as { image_url?: string; cover_image_url?: string })?.image_url ||
    (event as { image_url?: string; cover_image_url?: string })?.cover_image_url;

  const totalRevenue = useMemo(
    () =>
      parseRevenue(stats?.total_revenue) ??
      (stats?.totalRevenue ?? stats?.revenue) as number ?? 0,
    [stats?.total_revenue, stats?.totalRevenue, stats?.revenue]
  );

  const targetRevenue = useMemo(() => {
    return tickets.reduce((sum, t) => {
      const price = Number(t.price) || 0;
      const qty = t.total_qty ?? 0;
      return sum + price * qty;
    }, 0);
  }, [tickets]);

  const countdown = useMemo(() => {
    const start = event?.start_date ? new Date(event.start_date) : null;
    if (!start) return null;
    const now = new Date();
    if (start.getTime() <= now.getTime()) return "past";
    const localeFn = locale === "vi" ? vi : enUS;
    const d = Math.floor((start.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    const h = Math.floor(((start.getTime() - now.getTime()) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (d > 0) return t("daysLeft", { n: d });
    if (h > 0) return t("hoursLeft", { n: h });
    return formatDistanceToNow(start, { addSuffix: true, locale: localeFn });
  }, [event?.start_date, locale, t]);

  const dateLocale = locale === "vi" ? vi : enUS;

  if (!selectedEventId) {
    return (
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="flex items-center justify-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
          {t("noEventSelected")}
        </CardContent>
      </Card>
    );
  }

  if (eventLoading || !event) {
    return (
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="size-12 shrink-0 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
            <Calendar className="size-6 text-zinc-500 dark:text-zinc-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {event.title ?? event.id}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.start_date && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="size-4 shrink-0" />
            <span>{t("eventDate")}: {format(new Date(event.start_date), "dd/MM/yyyy HH:mm", { locale: dateLocale })}</span>
          </div>
        )}
        {countdown && (
          <div className="flex items-center gap-2 text-sm">
            <Target className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            <span className={countdown === "past" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>
              {countdown === "past" ? t("past") : countdown}
            </span>
          </div>
        )}
        {targetRevenue > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {t("revenueTarget")}
            </p>
            <p className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatVnd(totalRevenue)} / {formatVnd(targetRevenue)}
            </p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                style={{ width: `${Math.min(100, (totalRevenue / targetRevenue) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
