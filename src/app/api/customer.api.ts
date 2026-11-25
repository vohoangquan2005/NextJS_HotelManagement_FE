import { fetchApi } from "./client";
import type { CustomerResponseDto } from "@/types/customer";

export function getCustomers(): Promise<CustomerResponseDto[]> {
  return fetchApi<CustomerResponseDto[]>("/Customer");
}

export function getCustomerById(customerId: number): Promise<CustomerResponseDto> {
  return fetchApi<CustomerResponseDto>(`/Customer/${customerId}`);
}
