import { fetchApi } from "./client";
import type { InvoiceResponseDto } from "@/types/invoice";

export function getInvoices(): Promise<InvoiceResponseDto[]> {
  return fetchApi<InvoiceResponseDto[]>("/Invoice");
}
export function getMyInvoices(): Promise<InvoiceResponseDto[]> {
  return fetchApi<InvoiceResponseDto[]>("/Invoice/my-invoices");
}
export function getMyInvoice(id: number): Promise<InvoiceResponseDto> {
  return fetchApi<InvoiceResponseDto>(`/Invoice/my-invoices/${id}`);
}
export function deleteInvoice(id: number): Promise<void> {
  return fetchApi<void>(`/Invoice/${id}`, { method: "DELETE" });
}
