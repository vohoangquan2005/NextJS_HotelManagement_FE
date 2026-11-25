import { fetchApi } from "./client";
import type { PaymentResponseDto } from "@/types/payment";

export function getPayments(): Promise<PaymentResponseDto[]> {
  return fetchApi<PaymentResponseDto[]>("/Payment");
}
export function getMyPayments(): Promise<PaymentResponseDto[]> {
  return fetchApi<PaymentResponseDto[]>("/Payment/my-payments");
}
export function submitPayment(id: number, data: { paymentMethod: string; transactionCode?: string }): Promise<PaymentResponseDto> {
  return fetchApi<PaymentResponseDto>(`/Payment/${id}/submit`, { method: "PUT", body: JSON.stringify(data) });
}
export function requestInvoiceBalancePayment(invoiceId: number): Promise<PaymentResponseDto> {
  return fetchApi<PaymentResponseDto>(`/Payment/my-invoices/${invoiceId}/request`, { method: "POST" });
}
export function confirmPayment(id: number): Promise<void> {
  return fetchApi<void>(`/Payment/${id}/confirm`, { method: "PUT" });
}
export function rejectPayment(id: number): Promise<void> {
  return fetchApi<void>(`/Payment/${id}/reject`, { method: "PUT" });
}
export function deletePayment(id: number): Promise<void> {
  return fetchApi<void>(`/Payment/${id}`, { method: "DELETE" });
}
