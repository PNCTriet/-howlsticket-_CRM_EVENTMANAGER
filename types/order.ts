export interface OrderUser {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  /** Facebook profile URL or username */
  fb?: string;
}

export interface OrderItem {
  id?: string;
  quantity?: number;
  price?: number;
  ticket?: { id?: string; name?: string; price?: number };
  [key: string]: unknown;
}

export interface Order {
  id: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user?: OrderUser;
  total?: number;
  order_items?: OrderItem[];
  [key: string]: unknown;
}

export interface OrdersResponse {
  data?: Order[];
  orders?: Order[];
  items?: Order[];
}
