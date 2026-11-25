import { fetchApi } from "./client";
import type { CancellationCreateDto, CancellationDto } from "@/types/cancellation";
export const getCancellations = () => fetchApi<CancellationDto[]>("/Cancellation");
export const createCancellation = (data: CancellationCreateDto) => fetchApi<CancellationDto>("/Cancellation", { method: "POST", body: JSON.stringify(data) });
export const createMyCancellation = (data: CancellationCreateDto) => fetchApi<CancellationDto>("/Cancellation/my", { method: "POST", body: JSON.stringify(data) });
export const updateCancellationReason = (id: number, reason: string) => fetchApi<void>(`/Cancellation/${id}`, { method: "PUT", body: JSON.stringify({ reason }) });
export const approveCancellation = (id: number) => fetchApi<void>(`/Cancellation/${id}/confirm`, { method: "PUT" });
export const rejectCancellation = (id: number) => fetchApi<void>(`/Cancellation/${id}/reject`, { method: "PUT" });
export const deleteCancellation = (id: number) => fetchApi<void>(`/Cancellation/${id}`, { method: "DELETE" });
