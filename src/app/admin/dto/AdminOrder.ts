export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';

export interface AdminOrder {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  customerName?: string;
}
