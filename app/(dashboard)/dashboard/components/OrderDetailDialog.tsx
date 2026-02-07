"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrder";
import { useLocale } from "@/providers/locale-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { format } from "date-fns";
import type { Order, OrderItem, OrderUser } from "@/types/order";

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

interface OrderDetailDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
  orderId,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  const { dateFnsLocale } = useLocale();
  const { t } = useDashboardTranslations();
  const { data: order, isLoading } = useOrder(open ? orderId : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-x-0 bottom-0 top-auto max-h-[85vh] overflow-y-auto rounded-t-xl border-0 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:max-w-lg sm:max-h-[85vh] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">
            {t("orderDetail")} {orderId?.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !order ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("orderLoadError")}
          </p>
        ) : (
          <Tabs defaultValue="order" className="w-full">
            <TabsList className="w-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
              <TabsTrigger value="order" className="flex-1">
                {t("orderInfo")}
              </TabsTrigger>
              <TabsTrigger value="user" className="flex-1">
                {t("customerInfo")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="order" className="mt-3 space-y-2">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("orderCode")}</p>
                <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {order.id}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("status")}</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {order.status ?? "—"}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("time")}</p>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {order.created_at
                    ? format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
                        locale: dateFnsLocale,
                      })
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("totalAmount")}</p>
                <p className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {order.total != null ? formatVnd(order.total) : "—"}
                </p>
              </div>
              {(order.order_items?.length ?? 0) > 0 && (
                <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {t("ticketDetails")}
                  </p>
                  <ul className="space-y-1 text-sm">
                    {(order.order_items as OrderItem[]).map((item, i) => (
                      <li
                        key={item.id ?? i}
                        className="flex justify-between text-zinc-900 dark:text-zinc-100"
                      >
                        <span>
                          {item.ticket?.name ?? t("ticket")} x {item.quantity ?? 0}
                        </span>
                        <span className="tabular-nums">
                          {item.price != null ? formatVnd(item.price * (item.quantity ?? 1)) : "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="user" className="mt-3 space-y-2">
              {order.user ? (
                <>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("email")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {(order.user as OrderUser).email ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("fullName")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {[(order.user as OrderUser).first_name, (order.user as OrderUser).last_name]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("phone")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {(order.user as OrderUser).phone ?? "—"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("noCustomerInfo")}
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
