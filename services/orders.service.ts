import { api } from "@/lib/axios";
import type { Order } from "@/types/order";

interface OrdersListParams {
  limit?: number;
  offset?: number;
  eventId?: string;
}

export const ordersService = {
  list: async (params?: OrdersListParams) => {
    const { data } = await api.get<Order[] | { data: Order[] }>("/orders", {
      params: { limit: params?.limit ?? 10, offset: params?.offset ?? 0 },
    });
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "data" in data)
      return (data as { data: Order[] }).data;
    return [];
  },

  getById: async (id: string) => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },
};
