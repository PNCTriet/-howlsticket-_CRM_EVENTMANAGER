import { api } from "@/lib/axios";
import type { EventTicket } from "@/types/ticket";

export const ticketsService = {
  getByEventId: async (eventId: string): Promise<EventTicket[]> => {
    const { data } = await api.get<EventTicket[]>(`/tickets/event/${eventId}`);
    return Array.isArray(data) ? data : [];
  },
};
