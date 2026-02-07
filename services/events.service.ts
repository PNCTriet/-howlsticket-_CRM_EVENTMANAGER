import { api } from "@/lib/axios";
import type { Event } from "@/types/event";

export const eventsService = {
  list: async (params?: { organization_id?: string }) => {
    const { data } = await api.get<Event[]>("/events", { params });
    return Array.isArray(data) ? data : [];
  },
  getById: async (id: string) => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },
};
