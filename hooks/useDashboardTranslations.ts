"use client";

import { useCallback } from "react";
import { useLocale } from "@/providers/locale-provider";
import {
  getDashboardTranslation,
  interpolate,
  type DashboardTranslationKey,
} from "@/lib/translations";

export function useDashboardTranslations() {
  const { locale } = useLocale();

  const t = useCallback(
    (key: DashboardTranslationKey, params?: Record<string, string | number>) => {
      const str = getDashboardTranslation(key, locale);
      return params ? interpolate(str, params) : str;
    },
    [locale]
  );

  return { t };
}
