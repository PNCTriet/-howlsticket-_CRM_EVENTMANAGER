import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";

export function useRecentOrders(eventId: string | null, limit = 50) {
  return useQuery({
    queryKey: ["orders", "recent", eventId, limit],
    queryFn: () => ordersService.list({ limit }),
    enabled: !!eventId,
  });
}
