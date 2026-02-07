"use client";

import { useDashboardTranslations } from "@/hooks/useDashboardTranslations";

export function DashboardPageHeader() {
  const { t } = useDashboardTranslations();
  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {t("overview")}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("overviewDesc")}
      </p>
    </div>
  );
}
