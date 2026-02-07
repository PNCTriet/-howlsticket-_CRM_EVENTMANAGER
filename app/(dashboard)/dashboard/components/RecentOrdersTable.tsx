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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecentOrders } from "@/hooks/useRecentOrders";
import { useEventSelector } from "@/providers/event-selector-provider";
import { useLocale } from "@/providers/locale-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import Link from "next/link";
import { Ticket, ArrowRight, Search } from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@/types/order";
import { OrderDetailDialog } from "./OrderDetailDialog";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

const ROW_LIMIT_OPTIONS = [5, 10, 20] as const;

export function RecentOrdersTable() {
  const { selectedEventId } = useEventSelector();
  const { dateFnsLocale } = useLocale();
  const { t } = useDashboardTranslations();
  const { data: orders = [], isLoading } = useRecentOrders(selectedEventId, 50);
  const [search, setSearch] = useState("");
  const [rowLimit, setRowLimit] = useState<number>(5);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.trim().toLowerCase();
    return orders.filter(
      (o) =>
        o.id?.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        (o.user as { first_name?: string })?.first_name?.toLowerCase().includes(q) ||
        (o.user as { last_name?: string })?.last_name?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const displayed = useMemo(
    () => filtered.slice(0, rowLimit),
    [filtered, rowLimit]
  );

  const openDetail = (id: string) => {
    setDetailOrderId(id);
    setDetailOpen(true);
  };

  return (
    <>
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">
              {t("recentActivity")}
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              {t("searchAndViewOrders")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 stroke-[1.5] text-zinc-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[180px] border-zinc-200 pl-8 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
            <Select
              value={String(rowLimit)}
              onValueChange={(v) => setRowLimit(Number(v))}
            >
              <SelectTrigger className="h-9 w-[100px] border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROW_LIMIT_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {t("showRows", { n })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" asChild className="border-zinc-200 dark:border-zinc-700">
              <Link href="/orders">
                {t("viewAll")}
                <ArrowRight className="ml-1 size-4 stroke-[1.5]" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
              <Ticket className="mb-4 size-12 stroke-[1.5]" />
              <p className="mb-2 text-sm">
                {filtered.length === 0 && search
                  ? t("noOrdersMatch")
                  : t("noOrdersYet")}
              </p>
              {!search && (
                <Button variant="outline" size="sm" asChild className="border-zinc-200 dark:border-zinc-700">
                  <Link href="/orders">{t("goToOrdersPage")}</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    <th className="pb-2 font-medium">{t("codeOrTime")}</th>
                    <th className="pb-2 font-medium">{t("customer")}</th>
                    <th className="pb-2 font-medium text-right">{t("total")}</th>
                    <th className="pb-2 font-medium">{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((order) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50 last:border-0 dark:border-zinc-800 dark:hover:bg-zinc-800"
                      onClick={() => openDetail(order.id)}
                    >
                      <td className="py-2">
                        <span className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                          {order.id.slice(0, 8)}…
                        </span>
                        <br />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {order.created_at
                            ? format(
                                new Date(order.created_at),
                                "dd/MM/yyyy HH:mm",
                                { locale: dateFnsLocale }
                              )
                            : "—"}
                        </span>
                      </td>
                      <td className="py-2 text-zinc-700 dark:text-zinc-300">
                        {order.user?.email ?? (order.user as { first_name?: string })?.first_name ?? "—"}
                      </td>
                      <td className="py-2 text-right tabular-nums text-zinc-900 dark:text-zinc-100">
                        {order.total != null ? formatVnd(order.total) : "—"}
                      </td>
                      <td className="py-2">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {order.status ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <OrderDetailDialog
        orderId={detailOrderId}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailOrderId(null);
        }}
      />
    </>
  );
}
