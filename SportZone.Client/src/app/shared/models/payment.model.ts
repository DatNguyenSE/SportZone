export interface Payment {
  id: number;
  paymentMethod: string;
  amount: number;
  paidAt: Date;
  paymentStatus: string;
}