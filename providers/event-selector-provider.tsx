"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useEvents } from "@/hooks/useEvents";

type EventSelectorContextValue = {
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  eventIds: string[];
  eventTitles: Record<string, string>;
  isLoading: boolean;
};

const EventSelectorContext = createContext<EventSelectorContextValue | null>(
  null
);

const STORAGE_KEY = "ocx_selected_event_id";

export function EventSelectorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedEventId, setSelectedEventIdState] = useState<string | null>(
    () => {
      if (typeof window === "undefined") return null;
      return sessionStorage.getItem(STORAGE_KEY);
    }
  );

  const { data: events = [], isLoading } = useEvents();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aDate = a.start_date ? new Date(a.start_date).getTime() : 0;
      const bDate = b.start_date ? new Date(b.start_date).getTime() : 0;
      return bDate - aDate;
    });
  }, [events]);

  const eventIds = useMemo(
    () => sortedEvents.map((e) => e.id),
    [sortedEvents]
  );
  const eventTitles = useMemo(
    () => Object.fromEntries(sortedEvents.map((e) => [e.id, e.title ?? e.id])),
    [sortedEvents]
  );

  useEffect(() => {
    if (sortedEvents.length > 0 && !selectedEventId) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const valid = stored && eventIds.includes(stored);
      setSelectedEventIdState(valid ? stored : sortedEvents[0].id);
    }
  }, [sortedEvents, selectedEventId, eventIds]);

  const setSelectedEventId = useCallback((id: string | null) => {
    setSelectedEventIdState(id);
    if (typeof window !== "undefined") {
      if (id) sessionStorage.setItem(STORAGE_KEY, id);
      else sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedEventId,
      setSelectedEventId,
      eventIds,
      eventTitles,
      isLoading,
    }),
    [selectedEventId, setSelectedEventId, eventIds, eventTitles, isLoading]
  );

  return (
    <EventSelectorContext.Provider value={value}>
      {children}
    </EventSelectorContext.Provider>
  );
}

export function useEventSelector() {
  const ctx = useContext(EventSelectorContext);
  if (!ctx)
    throw new Error("useEventSelector must be used within EventSelectorProvider");
  return ctx;
}
