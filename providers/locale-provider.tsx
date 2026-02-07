"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { enUS, vi } from "date-fns/locale";
import type { Locale } from "date-fns";

const STORAGE_KEY = "app-locale";

export type AppLocale = "vi" | "en";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (next: AppLocale) => void;
  /** Locale cho date-fns (format, formatDistance, ...) */
  dateFnsLocale: Locale;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getStoredLocale(): AppLocale {
  if (typeof window === "undefined") return "vi";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "vi") return v;
  } catch {
    // ignore
  }
  return "vi";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("vi");

  useEffect(() => {
    setLocaleState(getStoredLocale());
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale,
    dateFnsLocale: locale === "en" ? enUS : vi,
  }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "vi" as AppLocale,
      setLocale: (_: AppLocale) => {},
      dateFnsLocale: vi,
    };
  }
  return ctx;
}
