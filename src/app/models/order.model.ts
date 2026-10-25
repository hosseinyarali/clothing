// models/order.model.ts — نسخه تمیز
export type OrderStatus =
  | 'PENDING'       // در انتظار پرداخت
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED'
  | 'RETURNED';

export interface ShippingRequest {
  province: string;
  city: string;
  street: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
}

export interface OrderItemRequest {
  variantId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  shipping: ShippingRequest;
  items: OrderItemRequest[];
  note?: string | null;
}

export interface OrderItemResponse {
  id: number;
  variantId: number | null;
  productName: string;
  variantSize: string | null;
  variantColor: string | null;
  variantSku: string | null;
  variantImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingProvince: string | null;
  shippingCity: string | null;
  shippingStreet: string | null;
  shippingPostalCode: string | null;
  shippingReceiverName: string | null;
  shippingReceiverPhone: string | null;
  note: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}
