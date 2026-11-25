export interface InvoiceResponseDto {
  invoiceId: number;
  bookingId: number;
  customerName: string | null;
  customerCCCD: string | null;
  customerNationality: string | null;
  expectedCheckIn: string | null;
  expectedCheckOut: string | null;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  lineItems: InvoiceLineItemDto[];
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  amountDue: number;
  paidAmount: number;
  remainingAmount: number;
  status: number;
  createdByUserId: number | null;
  createAt?: string | null;
}

export interface InvoiceLineItemDto {
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
