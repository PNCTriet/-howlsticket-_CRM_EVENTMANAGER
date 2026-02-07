"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";
import { Share2 } from "lucide-react";

/** Dữ liệu giả lập – sẽ thay bằng API khi có */
const MOCK_CHANNELS = [
  { id: "direct", nameKey: "direct" as const, revenue: 125_000_000, percent: 42 },
  { id: "facebook", nameKey: null, name: "Facebook", revenue: 85_000_000, percent: 28 },
  { id: "zalo", nameKey: null, name: "Zalo", revenue: 52_000_000, percent: 17 },
  { id: "tiktok", nameKey: null, name: "TikTok", revenue: 30_000_000, percent: 10 },
  { id: "other", nameKey: "otherChannel" as const, revenue: 8_500_000, percent: 3 },
];

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " ₫";
}

export function RevenueByChannelTable() {
  const { t } = useDashboardTranslations();
  const total = MOCK_CHANNELS.reduce((s, c) => s + c.revenue, 0);

  return (
    <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          {t("revenueByChannel")}
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          {t("revenueByChannelDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="pb-2 font-medium">{t("channel")}</th>
                <th className="pb-2 font-medium text-right tabular-nums">{t("revenueCol")}</th>
                <th className="pb-2 font-medium text-right tabular-nums">{t("share")}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CHANNELS.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">
                    {c.nameKey ? t(c.nameKey) : (c as { name?: string }).name}
                  </td>
                  <td className="py-2 text-right tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatVnd(c.revenue)}
                  </td>
                  <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                    {c.percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 border-t border-zinc-200 pt-2 text-right text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
            {t("total")}: {formatVnd(total)}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <Share2 className="size-4 stroke-[1.5]" />
          <span>{t("mockDataNote")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
