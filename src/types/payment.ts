export interface PaymentResponseDto {
  paymentId: number;
  invoiceId: number | null;
  bookingId: number | null;
  bookingStatus?: number | string | null;
  amount: number;
  paymentType: number;
  paymentMethod: string | null;
  transactionCode: string | null;
  status: number;
  createdByUserId: number | null;
  paymentDate: string | null;
  createAt?: string | null;
  refundSource?: string | null;
}
