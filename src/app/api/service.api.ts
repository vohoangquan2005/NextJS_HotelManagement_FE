import { fetchApi } from "./client";
import type { ServiceResponseDto } from "@/types/service";

export function getServices(): Promise<ServiceResponseDto[]> {
  return fetchApi<ServiceResponseDto[]>("/Service");
}
export function getServiceById(id: number): Promise<ServiceResponseDto> {
  return fetchApi<ServiceResponseDto>(`/Service/${id}`);
}

export function getDeletedServices(): Promise<ServiceResponseDto[]> {
  return fetchApi<ServiceResponseDto[]>("/Service/deleted");
}

export function createService(data: ServiceWriteDto): Promise<ServiceResponseDto> {
  return fetchApi<ServiceResponseDto>("/Service", { method: "POST", body: JSON.stringify(data) });
}

export function updateService(id: number, data: ServiceWriteDto): Promise<void> {
  return fetchApi<void>(`/Service/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function softDeleteService(id: number): Promise<void> {
  return fetchApi<void>(`/Service/${id}/soft-delete`, { method: "PATCH" });
}

export function restoreService(id: number): Promise<void> {
  return fetchApi<void>(`/Service/${id}/restore`, { method: "PATCH" });
}

export function deleteService(id: number): Promise<void> {
  return fetchApi<void>(`/Service/${id}`, { method: "DELETE" });
}

export interface ServiceWriteDto {
  serviceName: string;
  unitPrice: number;
  unit: string;
  description: string | null;
}
