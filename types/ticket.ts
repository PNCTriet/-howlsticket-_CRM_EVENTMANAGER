/** Response item từ GET /tickets/event/:eventId */
export interface EventTicket {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: string;
  total_qty: number;
  sold_qty: number;
  sale_start?: string;
  sale_end?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
