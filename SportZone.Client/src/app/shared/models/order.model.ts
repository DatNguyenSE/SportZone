import { Payment } from "./payment.model";

export interface Order {
  id: number;
  createdAt: Date;
  status: string;
  totalAmount: number;
  orderDate: Date;
  discountAmount: number;
  subTotal: number;
  couponCode?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
  payment: Payment;
}

