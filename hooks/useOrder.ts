import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";

export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getById(orderId!),
    enabled: !!orderId,
  });
}
