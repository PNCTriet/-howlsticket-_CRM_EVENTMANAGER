"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrder } from "@/hooks/useOrder";
import { useLocale } from "@/providers/locale-provider";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { format } from "date-fns";
import type { Order, OrderItem, OrderUser } from "@/types/order";

/** Fallback avatar khi không load được avatar từ Gmail/API */
const FALLBACK_AVATAR = "/images/avatar/Howlstudio_user_ava_alt1.png";

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
  const [avatarError, setAvatarError] = useState(false);
  const user = order?.user as OrderUser | undefined;
  const avatarSrc = user?.avatar_url && !avatarError ? user.avatar_url : FALLBACK_AVATAR;

  useEffect(() => {
    setAvatarError(false);
  }, [orderId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
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
                  <div className="flex flex-col items-center gap-3 pb-2">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                      <Avatar className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2">
                        <AvatarImage
                          src={avatarSrc}
                          alt={user?.email ?? "Customer"}
                          className="object-cover object-center"
                          onError={() => setAvatarError(true)}
                        />
                        <AvatarFallback className="bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {[user?.first_name?.[0], user?.last_name?.[0]]
                            .filter(Boolean)
                            .join("")
                            .toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("email")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {user?.email ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("fullName")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("phone")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {user?.phone ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("facebook")}</p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {user?.fb ? (
                        <a
                          href={user.fb.startsWith("http") ? user.fb : `https://www.facebook.com/${user.fb}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          {user.fb}
                        </a>
                      ) : (
                        "—"
                      )}
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
